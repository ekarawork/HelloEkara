"use strict";

const Joi = require("joi");

/* ========================= Message Types ========================= */

const MESSAGE_TYPES = [
    "TEXT",
    "TASK",
    "SYSTEM",
    "ATTACHMENT",
];

/* ========================= Create Task Message ========================= */

const createTaskMessageSchema = Joi.object({
    message: Joi.string()
        .trim()
        .max(10000)
        .allow("")
        .optional()
        .messages({
            "string.empty":
                "Message is required.",

            "string.min":
                "Message must contain at least 1 character.",

            "string.max":
                "Message cannot exceed 10000 characters.",

            "any.required":
                "Message is required.",
        }),

    message_type: Joi.string()
        .valid(...MESSAGE_TYPES)
        .default("TEXT")
        .messages({
            "any.only":
                "Message type must be one of TEXT, TASK, SYSTEM or ATTACHMENT.",
        }),

    /*
     * sender_type intentionally NOT accepted
     * from frontend.
     *
     * It will be decided by backend based
     * on authenticated user / portal.
     */
});

/* ========================= Update Task Message ========================= */

const updateTaskMessageSchema = Joi.object({
    message: Joi.string()
        .trim()
        .min(1)
        .max(10000)
        .required()
        .messages({
            "string.empty":
                "Message is required.",

            "string.min":
                "Message must contain at least 1 character.",

            "string.max":
                "Message cannot exceed 10000 characters.",

            "any.required":
                "Message is required.",
        }),
});

/* ========================= Task Message List ========================= */

const taskMessageListSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base":
                "Page must be a number.",

            "number.integer":
                "Page must be an integer.",

            "number.min":
                "Page must be at least 1.",
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(50)
        .messages({
            "number.base":
                "Limit must be a number.",

            "number.integer":
                "Limit must be an integer.",

            "number.min":
                "Limit must be at least 1.",

            "number.max":
                "Limit cannot exceed 100.",
        }),

    search: Joi.string()
        .trim()
        .max(255)
        .allow("")
        .default("")
        .messages({
            "string.max":
                "Search cannot exceed 255 characters.",
        }),
});

/* ========================= Message Type ========================= */

const taskMessageTypeSchema = Joi.object({
    message_type: Joi.string()
        .valid(...MESSAGE_TYPES)
        .required()
        .messages({
            "any.only":
                "Message type must be one of TEXT, TASK, SYSTEM or ATTACHMENT.",

            "any.required":
                "Message type is required.",
        }),
});

/* ========================= Export ========================= */

module.exports = {
    MESSAGE_TYPES,

    createTaskMessageSchema,
    updateTaskMessageSchema,
    taskMessageListSchema,
    taskMessageTypeSchema,
};