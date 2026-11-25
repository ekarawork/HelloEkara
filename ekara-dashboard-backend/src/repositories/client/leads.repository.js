"use strict";

const {
    Op,
    fn,
    col,
} = require("sequelize");

const {
    client_performance_daily,
    client_service,
} = require("../../database/models");

/* =========================================================
   GET CLIENT LEADS DASHBOARD
========================================================= */

const getClientLeadsDashboard = async (
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
       LEAD SERVICES
    ===================================================== */

    const leadServices = {
        service_name: {
            [Op.in]: [
                "META_ADS",
                "GOOGLE_ADS",
            ],
        },
    };

    /* =====================================================
       DAILY LEADS
    ===================================================== */

    const dailyLeads =
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
            ],

            include: [
                {
                    model: client_service,
                    as: "clientService",
                    required: true,

                    where: leadServices,

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
       LEADS BY PLATFORM
       TOTAL META + GOOGLE
    ===================================================== */

    const leadsByPlatform =
        await client_performance_daily.findAll({
            where,

            attributes: [
                [
                    col(
                        "clientService.service_name"
                    ),
                    "platform",
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
                    "leads",
                ],
            ],

            include: [
                {
                    model: client_service,
                    as: "clientService",
                    required: true,

                    where: leadServices,

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
       DAILY LEADS BY PLATFORM
       META + GOOGLE
    ===================================================== */

    const platformDailyLeads =
        await client_performance_daily.findAll({
            where,

            attributes: [
                "performance_date",

                [
                    col(
                        "clientService.service_name"
                    ),
                    "platform",
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
                    "leads",
                ],
            ],

            include: [
                {
                    model: client_service,
                    as: "clientService",
                    required: true,

                    where: leadServices,

                    attributes: [],
                },
            ],

            group: [
                "performance_date",
                "clientService.service_name",
            ],

            order: [
                [
                    "performance_date",
                    "ASC",
                ],

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
       RETURN
    ===================================================== */

    return {
        dailyLeads,
        leadsByPlatform,
        platformDailyLeads,
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientLeadsDashboard,
};