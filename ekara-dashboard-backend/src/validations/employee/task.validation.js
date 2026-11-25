"use strict";

const Joi = require("joi");

/* =========================================================
   Constants
   ========================================================= */

const TASK_STATUSES = [
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "COMPLETED",
];

const EMPLOYEE_ALLOWED_STATUSES = [
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
];

const TASK_PRIORITIES = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
];

/* =========================================================
   Common Fields
   ========================================================= */

const uuidField = Joi.string()
    .trim()
    .required()
    .messages({
        "string.base": "Task UUID must be a string.",
        "string.empty": "Task UUID is required.",
        "any.required": "Task UUID is required.",
    });

const positiveInteger = Joi.number()
    .integer()
    .positive();

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
    .default(10)
    .messages({
        "number.base": "Limit must be a number.",
        "number.integer": "Limit must be an integer.",
        "number.min": "Limit must be at least 1.",
        "number.max": "Limit cannot exceed 100.",
    });

/* =========================================================
   Employee Task List Validation
   ========================================================= */

/**
 * GET /employee/tasks/list
 *
 * Employee can filter only assigned tasks.
 * employee_id is intentionally not accepted from frontend.
 */
const employeeTaskListSchema = Joi.object({
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

    status: Joi.string()
        .valid(...TASK_STATUSES)
        .allow("", null)
        .optional()
        .messages({
            "any.only": "Invalid task status.",
        }),

    priority: Joi.string()
        .valid(...TASK_PRIORITIES)
        .allow("", null)
        .optional()
        .messages({
            "any.only": "Invalid task priority.",
        }),

    client_id: positiveInteger
        .allow(null)
        .optional()
        .messages({
            "number.base": "Client ID must be a number.",
            "number.integer": "Client ID must be an integer.",
            "number.positive": "Client ID must be positive.",
        }),

    start_date: Joi.date()
        .iso()
        .allow("", null)
        .optional()
        .messages({
            "date.format": "Start date must be a valid ISO date.",
        }),

    due_date: Joi.date()
        .iso()
        .allow("", null)
        .optional()
        .messages({
            "date.format": "Due date must be a valid ISO date.",
        }),
})
    .custom((value, helpers) => {
        if (
            value.start_date &&
            value.due_date &&
            new Date(value.start_date) >
                new Date(value.due_date)
        ) {
            return helpers.error(
                "any.invalid",
                {
                    message:
                        "Start date cannot be greater than due date.",
                }
            );
        }

        return value;
    })
    .messages({
        "any.invalid":
            "{{#message}}",
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
    uuid: uuidField,
});

/* =========================================================
   Employee Task Status Validation
   ========================================================= */

/**
 * Employee is not allowed to mark task COMPLETED.
 * Admin can mark task COMPLETED.
 */
const employeeTaskStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...EMPLOYEE_ALLOWED_STATUSES)
        .required()
        .messages({
            "string.base": "Status must be a string.",
            "string.empty": "Status is required.",
            "any.only":
                "Employee can set only TODO, IN_PROGRESS or IN_REVIEW status.",
            "any.required": "Status is required.",
        }),
});

/* =========================================================
   Employee Task Progress Validation
   ========================================================= */

/**
 * Employee can update progress from 0 to 100.
 */
const employeeTaskProgressSchema = Joi.object({
    progress: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
            "number.base": "Progress must be a number.",
            "number.integer": "Progress must be an integer.",
            "number.min": "Progress cannot be less than 0.",
            "number.max": "Progress cannot be greater than 100.",
            "any.required": "Progress is required.",
        }),
});

/* =========================================================
   Export
   ========================================================= */

module.exports = {
    TASK_STATUSES,
    TASK_PRIORITIES,
    EMPLOYEE_ALLOWED_STATUSES,

    employeeTaskListSchema,
    employeeTaskUuidSchema,
    employeeTaskStatusSchema,
    employeeTaskProgressSchema,
};