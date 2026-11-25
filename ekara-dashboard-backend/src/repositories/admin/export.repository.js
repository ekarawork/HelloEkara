"use strict";

const {
    client,
    client_service,
    client_performance_daily,
    payment,
    social_calendar_post,
} = require("../../database/models");


/* =========================================================
   PERFORMANCE EXPORT
========================================================= */

const getPerformanceExportData = async () => {
    return await client_performance_daily.findAll({
        include: [
            {
                model: client,
                as: "client",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "name",
                ],
            },

            {
                model: client_service,
                as: "clientService",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "client_id",
                    "service_name",
                    "monthly_budget",
                ],
            },
        ],

        order: [
            ["performance_date", "DESC"],
            ["id", "DESC"],
        ],
    });
};


/* =========================================================
   PAYMENT EXPORT
========================================================= */

const getPaymentExportData = async () => {
    return await payment.findAll({
        include: [
            {
                model: client,
                as: "client",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "name",
                ],
            },
        ],

        order: [
            ["payment_month", "DESC"],
            ["id", "DESC"],
        ],
    });
};


/* =========================================================
   SOCIAL CALENDAR EXPORT
========================================================= */

const getSocialCalendarExportData = async () => {
    return await social_calendar_post.findAll({
        include: [
            {
                model: client,
                as: "client",
                required: false,
                attributes: [
                    "id",
                    "uuid",
                    "name",
                ],
            },
        ],

        order: [
            ["post_date", "ASC"],
            ["id", "ASC"],
        ],
    });
};


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
    getPerformanceExportData,
    getPaymentExportData,
    getSocialCalendarExportData,
};