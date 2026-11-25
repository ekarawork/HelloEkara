"use strict";

const Joi = require("joi");

/* =========================================================
   GET DASHBOARD
========================================================= */

const getDashboardSchema = Joi.object({
    days: Joi.number()
        .integer()
        .min(1)
        .max(365)
        .default(7),
});

module.exports = {
    getDashboardSchema,
};