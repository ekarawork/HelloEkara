"use strict";

const { Op, fn, col } = require("sequelize");

const {
    client,
    client_service,
    client_performance_daily,
    payment,
    employee,
} = require("../../database/models");

/* =========================================================
   DASHBOARD
========================================================= */

/**
 * Get complete admin dashboard data
 *
 * Returns:
 * - Dashboard stats
 * - Daily leads
 * - Daily ad spend
 * - Client overview
 * - Individual client performance
 */
const getDashboardData = async ({
    days = 7,
} = {}) => {
    /* =====================================================
       NORMALIZE DAYS
    ===================================================== */

    days = Math.min(
        Math.max(Number(days) || 7, 1),
        365
    );

    /* =====================================================
       DATE RANGE
    ===================================================== */

    const endDate = new Date();

    const startDate = new Date();

    startDate.setDate(
        startDate.getDate() - (days - 1)
    );

    const formatDate = (date) => {
        return date
            .toISOString()
            .split("T")[0];
    };

    const startDateString =
        formatDate(startDate);

    const endDateString =
        formatDate(endDate);

    /* =====================================================
       PERFORMANCE DATE WHERE
    ===================================================== */

    const performanceWhere = {
        performance_date: {
            [Op.between]: [
                startDateString,
                endDateString,
            ],
        },
    };

    /* =====================================================
       1. DASHBOARD STATS
    ===================================================== */

    const [
        activeClients,
        totalEmployees,
        performanceSummary,
        paidServiceFees,
        duePayment,
    ] = await Promise.all([
        /* -------------------------------------------------
           ACTIVE CLIENTS
        ------------------------------------------------- */

        client.count({
            where: {
                status: "ACTIVE",
            },
        }),

        /* -------------------------------------------------
           ACTIVE EMPLOYEES
        ------------------------------------------------- */

        employee.count({
            where: {
                status: "ACTIVE",
            },
        }),

        /* -------------------------------------------------
           PERFORMANCE SUMMARY
        ------------------------------------------------- */

        client_performance_daily.findOne({
            where: performanceWhere,

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
                    "totalAdSpend",
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

            raw: true,
        }),

        /* -------------------------------------------------
           TOTAL SERVICE FEES COLLECTED

           Dashboard wording:
           "Total fees collected"

           Therefore only PAID payments are included.
        ------------------------------------------------- */

        payment.sum("amount", {
            where: {
                status: "paid",
            },
        }),

        /* -------------------------------------------------
           TOTAL DUE PAYMENT

           Includes:
           - due
           - overdue
        ------------------------------------------------- */

        payment.sum("amount", {
            where: {
                status: {
                    [Op.in]: [
                        "due",
                        "overdue",
                    ],
                },
            },
        }),
    ]);

    /* =====================================================
       2. DAILY LEADS
    ===================================================== */

    const dailyLeads =
        await client_performance_daily.findAll({
            where: performanceWhere,

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
       3. DAILY AD SPEND
    ===================================================== */

    const dailyAdSpend =
        await client_performance_daily.findAll({
            where: performanceWhere,

            attributes: [
                "performance_date",

                [
                    fn(
                        "COALESCE",
                        fn(
                            "SUM",
                            col("daily_spend")
                        ),
                        0
                    ),
                    "adSpend",
                ],
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
       4. CLIENT OVERVIEW
    ===================================================== */

    const clients =
        await client.findAll({
            where: {
                status: "ACTIVE",
            },

            attributes: [
                "id",
                "uuid",
                "name",
                "email",
                "profile_photo",
                "monthly_service_fee",
            ],

            include: [
                {
                    model: client_service,
                    as: "clientServices",
                    required: false,

                    attributes: [
                        "id",
                        "uuid",
                        "service_name",
                        "monthly_budget",
                    ],
                },
            ],

            order: [
                ["createdAt", "DESC"],
                ["id", "DESC"],
            ],
        });

/* =====================================================
   5. INDIVIDUAL CLIENT PERFORMANCE
===================================================== */

const clientPerformance =
    await client_performance_daily.findAll({
        where: performanceWhere,

        attributes: [
            "client_id",

            [
                fn(
                    "COALESCE",
                    fn("SUM", col("daily_spend")),
                    0
                ),
                "totalAdSpend",
            ],

            [
                fn(
                    "COALESCE",
                    fn("SUM", col("leads")),
                    0
                ),
                "totalLeads",
            ],

            [
                fn(
                    "COALESCE",
                    fn("SUM", col("clicks")),
                    0
                ),
                "totalClicks",
            ],

            [
                fn(
                    "COALESCE",
                    fn("SUM", col("impressions")),
                    0
                ),
                "totalImpressions",
            ],
        ],

        group: ["client_id"],

        order: [
            ["client_id", "ASC"],
        ],

        raw: true,
    });


/* =====================================================
   6. CLIENT DUE PAYMENTS
===================================================== */

const clientDuePayments =
    await payment.findAll({
        where: {
            status: {
                [Op.in]: [
                    "due",
                    "overdue",
                ],
            },
        },

        attributes: [
            "client_id",

            [
                fn(
                    "COALESCE",
                    fn(
                        "SUM",
                        col("amount")
                    ),
                    0
                ),
                "totalDuePayment",
            ],
        ],

        include: [
            {
                model: client,
                as: "client",
                required: true,

                where: {
                    status: "ACTIVE",
                },

                attributes: [],
            },
        ],

        group: [
            "client_id",
        ],

        raw: true,
    });


/* =====================================================
   7. MAP DUE PAYMENTS BY CLIENT
===================================================== */

/* =====================================================
   7. MAP DUE PAYMENTS BY CLIENT
===================================================== */

const duePaymentMap = new Map();

clientDuePayments.forEach(
    (item) => {
        const clientId =
            Number(item.client_id);

        const totalDuePayment =
            Number(
                item.totalDuePayment || 0
            );

        if (clientId > 0) {
            duePaymentMap.set(
                clientId,
                totalDuePayment
            );
        }
    }
);


/* =====================================================
   CLIENT MAP
===================================================== */

const clientMap = new Map(
    clients.map((clientData) => [
        Number(clientData.id),
        clientData,
    ])
);


/* =====================================================
   8. FORMAT CLIENT PERFORMANCE
===================================================== */

const formattedClientPerformance =
    clientPerformance.map(
        (item) => {
            const clientId =
                Number(item.client_id);

            const clientData =
                clientMap.get(clientId);

            const totalAdSpend =
                Number(
                    item.totalAdSpend || 0
                );

            const totalLeads =
                Number(
                    item.totalLeads || 0
                );

            const totalClicks =
                Number(
                    item.totalClicks || 0
                );

            const totalImpressions =
                Number(
                    item.totalImpressions || 0
                );

            const conversionRate =
                totalClicks > 0
                    ? Number(
                          (
                              (totalLeads /
                                  totalClicks) *
                              100
                          ).toFixed(2)
                      )
                    : 0;

            return {
                clientId,

                client: clientData
                    ? {
                          id:
                              clientData.id,

                          uuid:
                              clientData.uuid,

                          name:
                              clientData.name,

                          email:
                              clientData.email,
                      }
                    : null,

                totalAdSpend,

                totalLeads,

                totalClicks,

                totalImpressions,

                conversionRate,

                totalDuePayment:
                    duePaymentMap.get(
                        clientId
                    ) || 0,
            };
        }
    );
    /* =====================================================
       9. ADD CLIENTS WITH NO PERFORMANCE
    ===================================================== */

    const performanceClientIds =
        new Set(
            formattedClientPerformance.map(
                (item) =>
                    Number(
                        item.clientId
                    )
            )
        );

    clients.forEach(
        (clientData) => {
            if (
                !performanceClientIds.has(
                    Number(clientData.id)
                )
            ) {
                formattedClientPerformance.push(
                    {
                        clientId:
                            clientData.id,

                        client: {
                            id:
                                clientData.id,

                            uuid:
                                clientData.uuid,

                            name:
                                clientData.name,

                            email:
                                clientData.email,
                        },

                        totalAdSpend: 0,

                        totalLeads: 0,

                        totalClicks: 0,

                        totalImpressions: 0,

                        conversionRate: 0,

                        totalDuePayment:
    duePaymentMap.get(
        Number(clientData.id)
    ) || 0,
                    }
                );
            }
        }
    );

    /* =====================================================
       10. NORMALIZE SUMMARY
    ===================================================== */

    const summary = {
        totalServiceFees:
            Number(
                paidServiceFees || 0
            ),

        activeClients:
            Number(
                activeClients || 0
            ),

        totalImpressions:
            Number(
                performanceSummary
                    ?.totalImpressions ||
                    0
            ),

        totalAdSpend:
            Number(
                performanceSummary
                    ?.totalAdSpend ||
                    0
            ),

        totalDuePayment:
            Number(
                duePayment || 0
            ),

        totalEmployees:
            Number(
                totalEmployees || 0
            ),

        totalLeads:
            Number(
                performanceSummary
                    ?.totalLeads ||
                    0
            ),

        totalClicks:
            Number(
                performanceSummary
                    ?.totalClicks ||
                    0
            ),
    };

    /* =====================================================
       RETURN
    ===================================================== */

    return {
        days,

        startDate:
            startDateString,

        endDate:
            endDateString,

        stats: summary,

        dailyPerformance: {
            dailyLeads,
            dailyAdSpend,
        },

        clients,

        clientPerformance:
            formattedClientPerformance,
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getDashboardData,
};