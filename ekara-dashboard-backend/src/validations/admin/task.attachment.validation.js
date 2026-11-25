"use strict";

const Joi = require("joi");

/* =========================================================
   Constants
========================================================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_RESOURCE_TYPES = [
    "image",
    "raw",
    "video",
];

/* =========================================================
   Create Task Attachment
========================================================= */

const createTaskAttachmentSchema = Joi.object({
    /*
     * message_id is optional because an attachment can be:
     *
     * 1. Direct task attachment
     * 2. Attachment inside a task message
     */
    message_id: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .optional(),

    file_name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .optional(),

    file_type: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    file_size: Joi.number()
        .integer()
        .min(1)
        .max(MAX_FILE_SIZE)
        .optional(),

    resource_type: Joi.string()
        .trim()
        .valid(...ALLOWED_RESOURCE_TYPES)
        .optional(),
});

/* =========================================================
   Update Task Attachment
========================================================= */

const updateTaskAttachmentSchema = Joi.object({
    file_name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .optional(),

    file_type: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .optional(),
}).min(1);

/* =========================================================
   Attachment UUID
========================================================= */

const taskAttachmentUuidSchema = Joi.object({
    attachment_uuid: Joi.string()
        .trim()
        .uuid()
        .required(),
});

/* =========================================================
   Message ID
========================================================= */

const taskAttachmentMessageSchema = Joi.object({
    message_id: Joi.number()
        .integer()
        .positive()
        .required(),
});

/* =========================================================
   Attachment Pagination
========================================================= */

const taskAttachmentListSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(50),
});

/* =========================================================
   File Metadata Validation
========================================================= */

const taskAttachmentFileSchema = Joi.object({
    file_name: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .required(),

    file_type: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required(),

    file_size: Joi.number()
        .integer()
        .min(1)
        .max(MAX_FILE_SIZE)
        .required(),

    resource_type: Joi.string()
        .trim()
        .valid(...ALLOWED_RESOURCE_TYPES)
        .required(),
});

/* =========================================================
   Exports
========================================================= */

module.exports = {
    MAX_FILE_SIZE,
    ALLOWED_RESOURCE_TYPES,

    createTaskAttachmentSchema,
    updateTaskAttachmentSchema,

    taskAttachmentUuidSchema,
    taskAttachmentMessageSchema,

    taskAttachmentListSchema,

    taskAttachmentFileSchema,
};