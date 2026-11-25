"use strict";

const {
    Op,
    fn,
    col,
} = require("sequelize");

const {
    client_performance_daily,
    client_service,
    payment,
    social_calendar_post,
} = require("../../database/models");

/* =========================================================
   CLIENT DASHBOARD
========================================================= */

/* =========================================================
   GET DASHBOARD PERFORMANCE
========================================================= */

const getDashboardPerformance = async (
    clientId,
    {
        startDate,
        endDate,
    } = {}
) => {
    /* =====================================================
       BASE WHERE
    ===================================================== */

    const where = {
        client_id: clientId,
    };

    /* =====================================================
       DATE FILTER
    ===================================================== */

    if (startDate && endDate) {
        where.performance_date = {
            [Op.between]: [
                startDate,
                endDate,
            ],
        };
    } else if (startDate) {
        where.performance_date = {
            [Op.gte]: startDate,
        };
    } else if (endDate) {
        where.performance_date = {
            [Op.lte]: endDate,
        };
    }

    /* =====================================================
       META + GOOGLE ADS SERVICES
    ===================================================== */

    const performanceServiceWhere = {
        service_name: {
            [Op.in]: [
                "META_ADS",
                "GOOGLE_ADS",
            ],
        },
    };

    /* =====================================================
       SUMMARY STATS
    ===================================================== */

    const summary =
        await client_performance_daily.findOne({
            where,

            attributes: [
                [
                    fn(
                        "COALESCE",
                        fn(
                            "SUM",
                            col("daily_spend")
                        ),
                        0
                    ),
                    "totalSpend",
                ],

                [
                    fn(
                        "COALESCE",
                        fn(
                            "SUM",
                            col("impressions")
                        ),
                        0
                    ),
                    "totalImpressions",
                ],

                [
                    fn(
                        "COALESCE",
                        fn(
                            "SUM",
                            col("clicks")
                        ),
                        0
                    ),
                    "totalClicks",
                ],

                [
                    fn(
                        "COALESCE",
                        fn(
                            "SUM",
                            col("leads")
                        ),
                        0
                    ),
                    "totalLeads",
                ],
            ],

            include: [
                {
                    model: client_service,
                    as: "clientService",
                    required: true,

                    where:
                        performanceServiceWhere,

                    attributes: [],
                },
            ],

            raw: true,
        });

    /* =====================================================
       DAILY PERFORMANCE
       LEADS + SPEND
    ===================================================== */

    const dailyPerformance =
        await client_performance_daily.findAll({
            where,

            attributes: [
                "performance_date",

                [
                    fn(
                        "COALESCE",
                        fn(
                            "SUM",
                            col("leads")
                        ),
                        0
                    ),
                    "leads",
                ],

                [
                    fn(
                        "COALESCE",
                        fn(
                            "SUM",
                            col("daily_spend")
                        ),
                        0
                    ),
                    "spend",
                ],
            ],

            include: [
                {
                    model: client_service,
                    as: "clientService",
                    required: true,

                    where:
                        performanceServiceWhere,

                    attributes: [],
                },
            ],

            group: [
                "performance_date",
            ],

            order: [
                [
                    "performance_date",
                    "ASC",
                ],
            ],

            raw: true,
        });

    /* =====================================================
       RETURN
    ===================================================== */

    return {
        summary: {
            totalSpend: Number(
                summary?.totalSpend || 0
            ),

            totalImpressions: Number(
                summary?.totalImpressions || 0
            ),

            totalClicks: Number(
                summary?.totalClicks || 0
            ),

            totalLeads: Number(
                summary?.totalLeads || 0
            ),
        },

        dailyPerformance:
            dailyPerformance.map(
                (item) => ({
                    date:
                        item.performance_date,

                    leads: Number(
                        item.leads || 0
                    ),

                    spend: Number(
                        item.spend || 0
                    ),
                })
            ),
    };
};

/* =========================================================
   GET CLIENT PROGRESS
========================================================= */

const getClientProgress = async (
    clientId,
    {
        startDate,
        endDate,
    } = {}
) => {
    /* =====================================================
       CLIENT SERVICES
    ===================================================== */

    const services =
        await client_service.findAll({
            where: {
                client_id: clientId,

                service_name: {
                    [Op.in]: [
                        "META_ADS",
                        "GOOGLE_ADS",
                    ],
                },
            },

            attributes: [
                "service_name",
                "monthly_budget",
            ],

            order: [
                [
                    "service_name",
                    "ASC",
                ],
            ],

            raw: true,
        });

    /* =====================================================
       PERFORMANCE WHERE
    ===================================================== */

    const performanceWhere = {
        client_id: clientId,
    };

    if (startDate && endDate) {
        performanceWhere.performance_date = {
            [Op.between]: [
                startDate,
                endDate,
            ],
        };
    } else if (startDate) {
        performanceWhere.performance_date = {
            [Op.gte]: startDate,
        };
    } else if (endDate) {
        performanceWhere.performance_date = {
            [Op.lte]: endDate,
        };
    }

    /* =====================================================
       SPEND BY SERVICE
    ===================================================== */

    const spendByService =
        await client_performance_daily.findAll({
            where: performanceWhere,

            attributes: [
                [
                    col(
                        "clientService.service_name"
                    ),
                    "serviceName",
                ],

                [
                    fn(
                        "COALESCE",
                        fn(
                            "SUM",
                            col("daily_spend")
                        ),
                        0
                    ),
                    "spent",
                ],
            ],

            include: [
                {
                    model: client_service,
                    as: "clientService",
                    required: true,

                    where: {
                        service_name: {
                            [Op.in]: [
                                "META_ADS",
                                "GOOGLE_ADS",
                            ],
                        },
                    },

                    attributes: [],
                },
            ],

            group: [
                "clientService.service_name",
            ],

            order: [
                [
                    col(
                        "clientService.service_name"
                    ),
                    "ASC",
                ],
            ],

            raw: true,
        });

    /* =====================================================
       MAP SPEND
    ===================================================== */

    const spendMap = {};

    spendByService.forEach(
        (item) => {
            spendMap[
                item.serviceName
            ] = Number(
                item.spent || 0
            );
        }
    );

    /* =====================================================
       DEFAULT SERVICE DATA
    ===================================================== */

    const getServiceProgress = (
        serviceName
    ) => {
        const service =
            services.find(
                (item) =>
                    item.service_name ===
                    serviceName
            );

        const budget = Number(
            service?.monthly_budget || 0
        );

        const spent = Number(
            spendMap[serviceName] || 0
        );

        const percentage =
            budget > 0
                ? Number(
                      (
                          (spent /
                              budget) *
                          100
                      ).toFixed(2)
                  )
                : 0;

        return {
            serviceName,
            spent,
            budget,
            percentage,
        };
    };

    /* =====================================================
       RETURN
    ===================================================== */

    return {
        metaAds:
            getServiceProgress(
                "META_ADS"
            ),

        googleAds:
            getServiceProgress(
                "GOOGLE_ADS"
            ),
    };
};

/* =========================================================
   GET CURRENT PAYMENT
========================================================= */

const getCurrentPayment = async (
    clientId,
    {
        startDate,
        endDate,
    } = {}
) => {
    /* =====================================================
       PAYMENT MONTH FILTER
    ===================================================== */

    const where = {
        client_id: clientId,
    };

    /*
     * Dashboard month is normally supplied through
     * startDate / endDate.
     *
     * Example:
     * startDate = 2026-08-01
     * endDate   = 2026-08-31
     */

    if (startDate && endDate) {
        where.payment_month = {
            [Op.between]: [
                startDate,
                endDate,
            ],
        };
    } else if (startDate) {
        where.payment_month = {
            [Op.gte]: startDate,
        };
    } else if (endDate) {
        where.payment_month = {
            [Op.lte]: endDate,
        };
    }

    /* =====================================================
       FETCH CURRENT / LATEST PAYMENT
    ===================================================== */

    const currentPayment =
        await payment.findOne({
            where,

            attributes: [
                "id",
                "uuid",
                "client_id",
                "payment_month",
                "amount",
                "due_date",
                "status",
                "paid_at",
                "enable_reminders",
                "createdAt",
                "updatedAt",
            ],

            order: [
                [
                    "payment_month",
                    "DESC",
                ],
                [
                    "id",
                    "DESC",
                ],
            ],

            raw: true,
        });

    if (!currentPayment) {
        return null;
    }

    return {
        uuid:
            currentPayment.uuid,

        paymentMonth:
            currentPayment.payment_month,

        amount: Number(
            currentPayment.amount || 0
        ),

        dueDate:
            currentPayment.due_date,

        status:
            currentPayment.status,

        paidAt:
            currentPayment.paid_at,

        remindersEnabled:
            Boolean(
                currentPayment.enable_reminders
            ),
    };
};

/* =========================================================
   GET UPCOMING CONTENT
========================================================= */

const getUpcomingContent = async (
    clientId
) => {
    /* =====================================================
       TODAY
    ===================================================== */

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    /* =====================================================
       NEXT SCHEDULED POST
    ===================================================== */

    const nextPost =
        await social_calendar_post.findOne({
            where: {
                client_id: clientId,

                status: "scheduled",

                post_date: {
                    [Op.gte]: today,
                },
            },

            attributes: [
                "id",
                "uuid",
                "client_id",
                "post_date",
                "platform",
                "status",
                "content_type",
                "note",
                "createdAt",
                "updatedAt",
            ],

            order: [
                [
                    "post_date",
                    "ASC",
                ],
                [
                    "id",
                    "ASC",
                ],
            ],

            raw: true,
        });

    if (!nextPost) {
        return null;
    }

    return {
        uuid:
            nextPost.uuid,

        postDate:
            nextPost.post_date,

        platform:
            nextPost.platform,

        status:
            nextPost.status,

        contentType:
            nextPost.content_type,

        note:
            nextPost.note,
    };
};

/* =========================================================
   GET COMPLETE CLIENT DASHBOARD
========================================================= */

const getClientDashboard = async (
    clientId,
    {
        startDate,
        endDate,
    } = {}
) => {
    /* =====================================================
       FETCH DASHBOARD DATA
    ===================================================== */

    const [
        performance,
        clientProgress,
        currentPayment,
        upcomingContent,
    ] = await Promise.all([
        getDashboardPerformance(
            clientId,
            {
                startDate,
                endDate,
            }
        ),

        getClientProgress(
            clientId,
            {
                startDate,
                endDate,
            }
        ),

        getCurrentPayment(
            clientId,
            {
                startDate,
                endDate,
            }
        ),

        getUpcomingContent(
            clientId
        ),
    ]);

    /* =====================================================
       RETURN
    ===================================================== */

    return {
        performance,
        clientProgress,
        currentPayment,
        upcomingContent,
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getDashboardPerformance,
    getClientProgress,
    getCurrentPayment,
    getUpcomingContent,
    getClientDashboard,
};