"use strict";

const Joi = require("joi");

/* ========================= Create Task Validation ========================= */

const createTaskSchema = Joi.object({
    /* ========================= Basic Information ========================= */

    title: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .required()
        .messages({
            "string.empty":
                "Task title is required.",
            "string.min":
                "Task title must be at least 2 characters.",
            "string.max":
                "Task title must not exceed 255 characters.",
            "any.required":
                "Task title is required.",
        }),

    description: Joi.string()
        .trim()
        .allow("")
        .allow(null)
        .messages({
            "string.base":
                "Task description must be a valid text.",
        }),

    /* ========================= Client ========================= */

    client_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base":
                "Client is required.",
            "number.integer":
                "Client ID must be a valid integer.",
            "number.positive":
                "Client ID must be a valid positive number.",
            "any.required":
                "Client is required.",
        }),

    /* ========================= Multiple Employee Assignment ========================= */

    employee_ids: Joi.array()
        .items(
            Joi.number()
                .integer()
                .positive()
        )
        .min(1)
        .unique()
        .required()
        .messages({
            "array.base":
                "Employees must be provided as a valid array.",
            "array.min":
                "At least one employee must be assigned.",
            "array.unique":
                "The same employee cannot be assigned more than once.",
            "any.required":
                "At least one employee must be assigned.",
            "number.base":
                "Employee ID must be a valid number.",
            "number.integer":
                "Employee ID must be a valid integer.",
            "number.positive":
                "Employee ID must be a valid positive number.",
        }),

    /* ========================= Priority ========================= */

    priority: Joi.string()
        .valid(
            "LOW",
            "MEDIUM",
            "HIGH",
            "URGENT"
        )
        .default("MEDIUM")
        .messages({
            "any.only":
                "Priority must be LOW, MEDIUM, HIGH, or URGENT.",
        }),

    /* ========================= Status ========================= */

    status: Joi.string()
        .valid(
            "TODO",
            "IN_PROGRESS",
            "IN_REVIEW",
            "COMPLETED"
        )
        .default("TODO")
        .messages({
            "any.only":
                "Status must be TODO, IN_PROGRESS, IN_REVIEW, or COMPLETED.",
        }),

    /* ========================= Schedule ========================= */

    start_date: Joi.date()
        .iso()
        .allow(null, "")
        .messages({
            "date.base":
                "Start date must be a valid date.",
            "date.format":
                "Start date must be in YYYY-MM-DD format.",
        }),

    due_date: Joi.date()
        .iso()
        .allow(null, "")
        .messages({
            "date.base":
                "Due date must be a valid date.",
            "date.format":
                "Due date must be in YYYY-MM-DD format.",
        }),

    /* ========================= Estimated Hours ========================= */

    estimated_hours: Joi.number()
        .precision(2)
        .min(0)
        .max(999999.99)
        .allow(null, "")
        .messages({
            "number.base":
                "Estimated hours must be a valid number.",
            "number.min":
                "Estimated hours cannot be negative.",
            "number.max":
                "Estimated hours must not exceed 999999.99.",
        }),

    /* ========================= Progress ========================= */

    progress: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .default(0)
        .messages({
            "number.base":
                "Progress must be a valid number.",
            "number.integer":
                "Progress must be a whole number.",
            "number.min":
                "Progress cannot be less than 0.",
            "number.max":
                "Progress cannot be greater than 100.",
        }),
})

    /* ========================= Date Validation ========================= */

    .custom((value, helpers) => {
        if (
            value.start_date &&
            value.due_date
        ) {
            const startDate =
                new Date(value.start_date);

            const dueDate =
                new Date(value.due_date);

            if (startDate > dueDate) {
                return helpers.error(
                    "any.invalid"
                );
            }
        }

        return value;
    })

    .messages({
        "any.invalid":
            "Due date must be greater than or equal to start date.",
    });

/* ========================= Update Task Validation ========================= */

const updateTaskSchema = Joi.object({
    /* ========================= Basic Information ========================= */

    title: Joi.string()
        .trim()
        .min(2)
        .max(255)
        .messages({
            "string.min":
                "Task title must be at least 2 characters.",
            "string.max":
                "Task title must not exceed 255 characters.",
        }),

    description: Joi.string()
        .trim()
        .allow("")
        .allow(null)
        .messages({
            "string.base":
                "Task description must be a valid text.",
        }),

    /* ========================= Client ========================= */

    client_id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base":
                "Client ID must be a valid number.",
            "number.integer":
                "Client ID must be a valid integer.",
            "number.positive":
                "Client ID must be a valid positive number.",
        }),

    /* ========================= Multiple Employee Assignment ========================= */

    employee_ids: Joi.array()
        .items(
            Joi.number()
                .integer()
                .positive()
        )
        .min(1)
        .unique()
        .optional()
        .messages({
            "array.base":
                "Employees must be provided as a valid array.",
            "array.min":
                "At least one employee must be assigned.",
            "array.unique":
                "The same employee cannot be assigned more than once.",
            "number.base":
                "Employee ID must be a valid number.",
            "number.integer":
                "Employee ID must be a valid integer.",
            "number.positive":
                "Employee ID must be a valid positive number.",
        }),

    /* ========================= Priority ========================= */

    priority: Joi.string()
        .valid(
            "LOW",
            "MEDIUM",
            "HIGH",
            "URGENT"
        )
        .messages({
            "any.only":
                "Priority must be LOW, MEDIUM, HIGH, or URGENT.",
        }),

    /* ========================= Status ========================= */

    status: Joi.string()
        .valid(
            "TODO",
            "IN_PROGRESS",
            "IN_REVIEW",
            "COMPLETED"
        )
        .messages({
            "any.only":
                "Status must be TODO, IN_PROGRESS, IN_REVIEW, or COMPLETED.",
        }),

    /* ========================= Schedule ========================= */

    start_date: Joi.date()
        .iso()
        .allow(null, "")
        .messages({
            "date.base":
                "Start date must be a valid date.",
            "date.format":
                "Start date must be in YYYY-MM-DD format.",
        }),

    due_date: Joi.date()
        .iso()
        .allow(null, "")
        .messages({
            "date.base":
                "Due date must be a valid date.",
            "date.format":
                "Due date must be in YYYY-MM-DD format.",
        }),

    /* ========================= Estimated Hours ========================= */

    estimated_hours: Joi.number()
        .precision(2)
        .min(0)
        .max(999999.99)
        .allow(null, "")
        .messages({
            "number.base":
                "Estimated hours must be a valid number.",
            "number.min":
                "Estimated hours cannot be negative.",
            "number.max":
                "Estimated hours must not exceed 999999.99.",
        }),

    /* ========================= Progress ========================= */

    progress: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .messages({
            "number.base":
                "Progress must be a valid number.",
            "number.integer":
                "Progress must be a whole number.",
            "number.min":
                "Progress cannot be less than 0.",
            "number.max":
                "Progress cannot be greater than 100.",
        }),
})

    /* ========================= Date Validation ========================= */

    .custom((value, helpers) => {
        if (
            value.start_date &&
            value.due_date
        ) {
            const startDate =
                new Date(value.start_date);

            const dueDate =
                new Date(value.due_date);

            if (startDate > dueDate) {
                return helpers.error(
                    "any.invalid"
                );
            }
        }

        return value;
    })

    .messages({
        "any.invalid":
            "Due date must be greater than or equal to start date.",
    });

/* ========================= Task Priority Validation ========================= */

const taskPrioritySchema = Joi.object({
    priority: Joi.string()
        .valid(
            "LOW",
            "MEDIUM",
            "HIGH",
            "URGENT"
        )
        .required()
        .messages({
            "any.only":
                "Priority must be LOW, MEDIUM, HIGH, or URGENT.",
            "any.required":
                "Task priority is required.",
        }),
});

/* ========================= Task Status Validation ========================= */

const taskStatusSchema = Joi.object({
    status: Joi.string()
        .valid(
            "TODO",
            "IN_PROGRESS",
            "IN_REVIEW",
            "COMPLETED"
        )
        .required()
        .messages({
            "any.only":
                "Task status must be TODO, IN_PROGRESS, IN_REVIEW, or COMPLETED.",
            "any.required":
                "Task status is required.",
        }),
});

/* ========================= Task Assignment Validation ========================= */

/*
 * This schema is intentionally kept single employee.
 *
 * It is used by:
 * POST /admin/task/:uuid/assign
 *
 * The create/update task APIs use employee_ids[] instead.
 */

const taskAssignmentSchema = Joi.object({
    employee_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base":
                "Employee ID must be a valid number.",
            "number.integer":
                "Employee ID must be a valid integer.",
            "number.positive":
                "Employee ID must be a valid positive number.",
            "any.required":
                "Employee is required.",
        }),
});

/* ========================= Exports ========================= */

module.exports = {
    createTaskSchema,
    updateTaskSchema,
    taskPrioritySchema,
    taskStatusSchema,
    taskAssignmentSchema,
};
