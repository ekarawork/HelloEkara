"use strict";

const Joi = require("joi");

/* =========================================================
   UPDATE EMPLOYEE PROFILE
========================================================= */

const updateEmployeeProfileSchema = Joi.object({

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
   CHANGE EMPLOYEE PASSWORD
========================================================= */

const changeEmployeePasswordSchema = Joi.object({

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

    confirm_password: Joi.any()
        .valid(Joi.ref("new_password"))
        .required()
        .messages({
            "any.only":
                "Confirm password must match the new password.",

            "any.required":
                "Confirm password is required.",
        }),

})
    .unknown(false);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    updateEmployeeProfileSchema,
    changeEmployeePasswordSchema,
};