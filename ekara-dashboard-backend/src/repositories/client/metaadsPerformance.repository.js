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
   GET CLIENT META ADS DASHBOARD
========================================================= */

const getClientMetaAdsDashboard = async (
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
       META ADS SERVICE
    ===================================================== */

    const metaAdsServiceWhere = {
        service_name: "META_ADS",
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
                        metaAdsServiceWhere,

                    attributes: [],
                },
            ],

            raw: true,
        });

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
                        "SUM",
                        col("leads")
                    ),
                    "leads",
                ],
            ],

            include: [
                {
                    model: client_service,
                    as: "clientService",
                    required: true,

                    where:
                        metaAdsServiceWhere,

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
       DAILY SPEND
    ===================================================== */

    const dailySpend =
        await client_performance_daily.findAll({
            where,

            attributes: [
                "performance_date",

                [
                    fn(
                        "SUM",
                        col("daily_spend")
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
                        metaAdsServiceWhere,

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
        summary,
        dailyLeads,
        dailySpend,
    };
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getClientMetaAdsDashboard,
};