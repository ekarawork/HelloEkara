"use strict";

const Joi = require("joi");

/* =========================================================
   Constants
   ========================================================= */

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

const EMPLOYEE_ALLOWED_ATTACHMENT_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

const ATTACHMENT_RESOURCE_TYPES = [
    "image",
    "raw",
    "video",
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

const attachmentUuidField = Joi.string()
    .trim()
    .required()
    .messages({
        "string.base": "Attachment UUID must be a string.",
        "string.empty": "Attachment UUID is required.",
        "any.required": "Attachment UUID is required.",
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
   Task Attachment Params
   ========================================================= */

/**
 * Params:
 * {
 *   uuid: string
 * }
 */
const employeeTaskAttachmentTaskUuidSchema = Joi.object({
    uuid: taskUuidField,
});

/**
 * Params:
 * {
 *   uuid: string,
 *   attachment_uuid: string
 * }
 */
const employeeTaskAttachmentUuidSchema = Joi.object({
    uuid: taskUuidField,

    attachment_uuid: attachmentUuidField,
});

/**
 * Params:
 * {
 *   uuid: string,
 *   message_uuid: string
 * }
 */
const employeeTaskMessageAttachmentParamsSchema = Joi.object({
    uuid: taskUuidField,

    message_uuid: messageUuidField,
});

/* =========================================================
   Attachment Metadata
   ========================================================= */

/**
 * Metadata for attachment creation.
 *
 * File itself is validated by multer/service.
 * Employee cannot submit task_id or uploaded_by.
 *
 * message_uuid is optional because an attachment
 * can be uploaded directly to the task without
 * being linked to a specific message.
 */
const employeeCreateTaskAttachmentSchema = Joi.object({
    message_uuid: Joi.string()
        .trim()
        .allow("", null)
        .optional()
        .messages({
            "string.base": "Message UUID must be a string.",
        }),
});

/**
 * Metadata update.
 *
 * This can be used only if later you allow employees
 * to update attachment metadata.
 */
const employeeUpdateTaskAttachmentSchema = Joi.object({
    file_name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .optional()
        .messages({
            "string.base": "File name must be a string.",
            "string.empty": "File name cannot be empty.",
            "string.min": "File name cannot be empty.",
            "string.max": "File name cannot exceed 255 characters.",
        }),
})
    .min(1)
    .messages({
        "object.min":
            "At least one attachment field is required.",
    });

/* =========================================================
   Attachment List Validation
   ========================================================= */

/**
 * GET /employee/tasks/:uuid/attachments
 */
const employeeTaskAttachmentListSchema = Joi.object({
    page: pageField,

    limit: limitField,

    resource_type: Joi.string()
        .valid(...ATTACHMENT_RESOURCE_TYPES)
        .allow("", null)
        .optional()
        .messages({
            "any.only": "Invalid attachment resource type.",
        }),
});

/* =========================================================
   Attachment File Validation Helper
   ========================================================= */

/**
 * This helper is used in service/controller after multer.
 */
const validateEmployeeAttachmentFile = (file) => {
    if (!file) {
        return {
            valid: false,
            message: "Attachment file is required.",
        };
    }

    if (!file.buffer) {
        return {
            valid: false,
            message: "Invalid attachment file.",
        };
    }

    if (!file.originalname) {
        return {
            valid: false,
            message: "Original file name is required.",
        };
    }

    if (!file.mimetype) {
        return {
            valid: false,
            message: "File type is required.",
        };
    }

    if (
        !EMPLOYEE_ALLOWED_ATTACHMENT_MIME_TYPES.includes(
            file.mimetype
        )
    ) {
        return {
            valid: false,
            message: "This file type is not allowed.",
        };
    }

    const fileSize =
        Number(file.size) || file.buffer.length;

    if (fileSize > MAX_ATTACHMENT_SIZE) {
        return {
            valid: false,
            message: "File size cannot exceed 10 MB.",
        };
    }

    return {
        valid: true,
        message: null,
    };
};

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    MAX_ATTACHMENT_SIZE,
    EMPLOYEE_ALLOWED_ATTACHMENT_MIME_TYPES,
    ATTACHMENT_RESOURCE_TYPES,

    employeeTaskAttachmentTaskUuidSchema,
    employeeTaskAttachmentUuidSchema,
    employeeTaskMessageAttachmentParamsSchema,

    employeeCreateTaskAttachmentSchema,
    employeeUpdateTaskAttachmentSchema,
    employeeTaskAttachmentListSchema,

    validateEmployeeAttachmentFile,
};