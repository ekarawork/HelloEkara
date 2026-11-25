"use strict";

const Joi = require("joi");

/* =========================================================
   CREATE NOTIFICATION
========================================================= */

const createNotificationSchema =
    Joi.object({
        user_id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                "number.base":
                    "User ID must be a number.",
                "number.integer":
                    "User ID must be an integer.",
                "number.positive":
                    "User ID must be a positive number.",
                "any.required":
                    "User ID is required.",
            }),

        title: Joi.string()
            .trim()
            .max(255)
            .required()
            .messages({
                "string.empty":
                    "Title is required.",
                "any.required":
                    "Title is required.",
            }),

        message: Joi.string()
            .trim()
            .required()
            .messages({
                "string.empty":
                    "Message is required.",
                "any.required":
                    "Message is required.",
            }),

        type: Joi.string()
            .valid(
                "PAYMENT_REMINDER",
                "PAYMENT",
                "CLIENT",
                "SOCIAL_CALENDAR",
                "SYSTEM"
            )
            .default("SYSTEM"),

        reference_type:
            Joi.string()
                .trim()
                .max(100)
                .allow(null, "")
                .optional(),

        reference_id:
            Joi.number()
                .integer()
                .positive()
                .allow(null)
                .optional(),

        is_read:
            Joi.boolean()
                .default(false),

        read_at:
            Joi.date()
                .allow(null)
                .optional(),
    });

/* =========================================================
   UPDATE NOTIFICATION
========================================================= */

const updateNotificationSchema =
    Joi.object({
        title: Joi.string()
            .trim()
            .max(255)
            .optional(),

        message: Joi.string()
            .trim()
            .optional(),

        type: Joi.string()
            .valid(
                "PAYMENT_REMINDER",
                "PAYMENT",
                "CLIENT",
                "SOCIAL_CALENDAR",
                "SYSTEM"
            )
            .optional(),

        reference_type:
            Joi.string()
                .trim()
                .max(100)
                .allow(null, "")
                .optional(),

        reference_id:
            Joi.number()
                .integer()
                .positive()
                .allow(null)
                .optional(),

        is_read:
            Joi.boolean()
                .optional(),

        read_at:
            Joi.date()
                .allow(null)
                .optional(),
    }).min(1);

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    createNotificationSchema,
    updateNotificationSchema,
};