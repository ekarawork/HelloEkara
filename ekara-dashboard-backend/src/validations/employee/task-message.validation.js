"use strict";

const Joi = require("joi");

/* =========================================================
   Constants
   ========================================================= */

const EMPLOYEE_MESSAGE_TYPES = [
    "TEXT",
    "TASK",
    "ATTACHMENT",
];

/* =========================================================
   Common Fields
   ========================================================= */

const taskUuidField = Joi.string()
    .trim()
    .required()
    .messages({
        "string.base": "Task UUID must be a string.",
        "string.empty": "Task UUID is required.",
        "any.required": "Task UUID is required.",
    });

const messageUuidField = Joi.string()
    .trim()
    .required()
    .messages({
        "string.base": "Message UUID must be a string.",
        "string.empty": "Message UUID is required.",
        "any.required": "Message UUID is required.",
    });

const pageField = Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
        "number.base": "Page must be a number.",
        "number.integer": "Page must be an integer.",
        "number.min": "Page must be at least 1.",
    });

const limitField = Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(50)
    .messages({
        "number.base": "Limit must be a number.",
        "number.integer": "Limit must be an integer.",
        "number.min": "Limit must be at least 1.",
        "number.max": "Limit cannot exceed 100.",
    });

/* =========================================================
   Create Message
   ========================================================= */

/**
 * POST /employee/tasks/:uuid/messages
 *
 * sender_id and sender_type are intentionally excluded.
 * They must be taken from authenticated employee session.
 */
const employeeCreateTaskMessageSchema = Joi.object({
    message: Joi.string()
        .trim()
        .max(10000)
        .allow("")
        .optional()
        .messages({
            "string.base": "Message must be a string.",
            "string.max": "Message cannot exceed 10000 characters.",
        }),

    message_type: Joi.string()
        .valid(...EMPLOYEE_MESSAGE_TYPES)
        .default("TEXT")
        .messages({
            "string.base": "Message type must be a string.",
            "any.only": "Invalid message type.",
        }),
})
    .custom((value, helpers) => {
        const message = value.message || "";
        const messageType = value.message_type || "TEXT";

        /*
         * For normal text/task messages, message is required.
         * Attachment-only message can be empty.
         */
        if (
            !message.trim() &&
            messageType !== "ATTACHMENT"
        ) {
            return helpers.error(
                "any.custom",
                {
                    message:
                        "Message is required for this message type.",
                }
            );
        }

        return value;
    })
    .messages({
        "any.custom":
            "{{#message}}",
    });

/* =========================================================
   Update Message
   ========================================================= */

/**
 * PATCH /employee/tasks/:uuid/messages/:message_uuid
 *
 * Employee can update only their own message.
 * Ownership will be checked in service layer.
 */
const employeeUpdateTaskMessageSchema = Joi.object({
    message: Joi.string()
        .trim()
        .min(1)
        .max(10000)
        .required()
        .messages({
            "string.base": "Message must be a string.",
            "string.empty": "Message is required.",
            "string.min": "Message is required.",
            "string.max": "Message cannot exceed 10000 characters.",
            "any.required": "Message is required.",
        }),
});

/* =========================================================
   Message UUID Validation
   ========================================================= */

/**
 * Params:
 * {
 *   uuid: string,
 *   message_uuid: string
 * }
 */
const employeeTaskMessageUuidSchema = Joi.object({
    uuid: taskUuidField,

    message_uuid: messageUuidField,
});

/* =========================================================
   Message List Validation
   ========================================================= */

/**
 * GET /employee/tasks/:uuid/messages
 */
const employeeTaskMessageListSchema = Joi.object({
    page: pageField,

    limit: limitField,

    search: Joi.string()
        .trim()
        .max(255)
        .allow("", null)
        .optional()
        .messages({
            "string.base": "Search must be a string.",
            "string.max": "Search cannot exceed 255 characters.",
        }),

    message_type: Joi.string()
        .valid(...EMPLOYEE_MESSAGE_TYPES)
        .allow("", null)
        .optional()
        .messages({
            "any.only": "Invalid message type.",
        }),
});

/* =========================================================
   Message Type Validation
   ========================================================= */

const employeeTaskMessageTypeSchema = Joi.object({
    message_type: Joi.string()
        .valid(...EMPLOYEE_MESSAGE_TYPES)
        .required()
        .messages({
            "string.base": "Message type must be a string.",
            "string.empty": "Message type is required.",
            "any.only": "Invalid message type.",
            "any.required": "Message type is required.",
        }),
});

/* =========================================================
   Task UUID Validation
   ========================================================= */

/**
 * Params:
 * {
 *   uuid: string
 * }
 */
const employeeTaskUuidSchema = Joi.object({
    uuid: taskUuidField,
});

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    EMPLOYEE_MESSAGE_TYPES,

    employeeCreateTaskMessageSchema,
    employeeUpdateTaskMessageSchema,
    employeeTaskMessageUuidSchema,
    employeeTaskMessageListSchema,
    employeeTaskMessageTypeSchema,
    employeeTaskUuidSchema
};