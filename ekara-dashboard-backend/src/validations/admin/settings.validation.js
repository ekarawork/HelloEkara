"use strict";

const Joi = require("joi");

/* =========================================================
   UPDATE ADMIN PROFILE
========================================================= */

const updateAdminProfileSchema = Joi.object({

    first_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty":
                "First name is required.",

            "string.min":
                "First name must be at least 2 characters.",

            "string.max":
                "First name must not exceed 100 characters.",

            "any.required":
                "First name is required.",
        }),

    last_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .allow("")
        .allow(null)
        .optional()
        .messages({
            "string.min":
                "Last name must be at least 2 characters.",

            "string.max":
                "Last name must not exceed 100 characters.",
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(150)
        .required()
        .messages({
            "string.empty":
                "Email is required.",

            "string.email":
                "Please enter a valid email.",

            "string.max":
                "Email must not exceed 150 characters.",

            "any.required":
                "Email is required.",
        }),

})
    .unknown(false);

    /* =========================================================
   CHANGE ADMIN PASSWORD
========================================================= */

const changeAdminPasswordSchema = Joi.object({

    current_password: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            "string.empty":
                "Current password is required.",

            "string.max":
                "Current password must not exceed 255 characters.",

            "any.required":
                "Current password is required.",
        }),

    new_password: Joi.string()
        .min(8)
        .max(255)
        .pattern(/[A-Z]/)
        .pattern(/[a-z]/)
        .pattern(/[0-9]/)
        .required()
        .messages({
            "string.empty":
                "New password is required.",

            "string.min":
                "New password must be at least 8 characters.",

            "string.max":
                "New password must not exceed 255 characters.",

            "string.pattern.base":
                "New password must contain at least one uppercase letter, one lowercase letter, and one number.",

            "any.required":
                "New password is required.",
        }),

}).unknown(false);

/* =========================================================
   PAYMENT REMINDER SETTINGS
   Global defaults for new payments
========================================================= */

const paymentReminderSettingsSchema = Joi.object({

    before_due_enabled: Joi.boolean()
        .required()
        .messages({
            "boolean.base":
                "Before due reminder enabled must be a boolean.",

            "any.required":
                "Before due reminder enabled is required.",
        }),

    before_due_days: Joi.number()
        .integer()
        .min(1)
        .max(365)
        .required()
        .messages({
            "number.base":
                "Before due reminder days must be a number.",

            "number.integer":
                "Before due reminder days must be a whole number.",

            "number.min":
                "Before due reminder days must be at least 1.",

            "number.max":
                "Before due reminder days must not exceed 365.",

            "any.required":
                "Before due reminder days is required.",
        }),

    due_day_enabled: Joi.boolean()
        .required()
        .messages({
            "boolean.base":
                "Due day reminder enabled must be a boolean.",

            "any.required":
                "Due day reminder enabled is required.",
        }),

    after_due_enabled: Joi.boolean()
        .required()
        .messages({
            "boolean.base":
                "After due reminder enabled must be a boolean.",

            "any.required":
                "After due reminder enabled is required.",
        }),

    after_due_days: Joi.number()
        .integer()
        .min(1)
        .max(365)
        .required()
        .messages({
            "number.base":
                "After due reminder days must be a number.",

            "number.integer":
                "After due reminder days must be a whole number.",

            "number.min":
                "After due reminder days must be at least 1.",

            "number.max":
                "After due reminder days must not exceed 365.",

            "any.required":
                "After due reminder days is required.",
        }),

})
    .unknown(false);


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    updateAdminProfileSchema,
    changeAdminPasswordSchema,
    paymentReminderSettingsSchema,
};