"use strict";

const Joi = require("joi");

/* =========================================================
   Employee Dashboard Query Validation
   ========================================================= */

const employeeDashboardQuerySchema = Joi.object({
    recent_limit: Joi.number()
        .integer()
        .min(1)
        .max(20)
        .default(5),

    upcoming_limit: Joi.number()
        .integer()
        .min(1)
        .max(20)
        .default(5),

    overdue_limit: Joi.number()
        .integer()
        .min(1)
        .max(20)
        .default(5),
});

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    employeeDashboardQuerySchema,
};