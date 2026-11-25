"use strict";

const Joi = require("joi");

/* =========================================================
   REMINDER ITEM
========================================================= */

const reminderSchema = Joi.object({
    reminder_type: Joi.string()
        .valid("before", "due_day", "after")
        .required()
        .messages({
            "any.only":
                "Reminder type must be before, due_day, or after.",
            "any.required":
                "Reminder type is required.",
        }),

    enabled: Joi.boolean()
        .default(true)
        .messages({
            "boolean.base":
                "Reminder enabled must be true or false.",
        }),

    days_offset: Joi.when("reminder_type", {
        switch: [
            {
                is: "before",
                then: Joi.number()
                    .integer()
                    .min(1)
                    .required()
                    .messages({
                        "number.base":
                            "Before reminder days must be a number.",
                        "number.integer":
                            "Before reminder days must be an integer.",
                        "number.min":
                            "Before reminder must be at least 1 day before.",
                        "any.required":
                            "Before reminder days are required.",
                    }),
            },
            {
                is: "due_day",
                then: Joi.number()
                    .integer()
                    .valid(0)
                    .default(0)
                    .messages({
                        "any.only":
                            "Due day reminder offset must be 0.",
                    }),
            },
            {
                is: "after",
                then: Joi.number()
                    .integer()
                    .min(1)
                    .required()
                    .messages({
                        "number.base":
                            "After reminder days must be a number.",
                        "number.integer":
                            "After reminder days must be an integer.",
                        "number.min":
                            "After reminder must be at least 1 day after.",
                        "any.required":
                            "After reminder days are required.",
                    }),
            },
        ],
        otherwise: Joi.forbidden(),
    }),

    message: Joi.string()
        .trim()
        .min(1)
        .max(5000)
        .required()
        .messages({
            "string.base":
                "Reminder message must be a string.",
            "string.empty":
                "Reminder message cannot be empty.",
            "string.max":
                "Reminder message cannot exceed 5000 characters.",
            "any.required":
                "Reminder message is required.",
        }),
});

/* =========================================================
   CREATE PAYMENT
========================================================= */

const createPaymentSchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base":
                "Client ID must be a number.",
            "number.integer":
                "Client ID must be an integer.",
            "number.positive":
                "Client ID must be a positive number.",
            "any.required":
                "Client ID is required.",
        }),

    payment_month: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base":
                "Payment month must be a valid date.",
            "date.format":
                "Payment month must be in YYYY-MM-DD format.",
            "any.required":
                "Payment month is required.",
        }),

    amount: Joi.number()
        .precision(2)
        .min(0)
        .required()
        .messages({
            "number.base":
                "Payment amount must be a number.",
            "number.min":
                "Payment amount cannot be negative.",
            "any.required":
                "Payment amount is required.",
        }),

    due_date: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base":
                "Due date must be a valid date.",
            "date.format":
                "Due date must be in YYYY-MM-DD format.",
            "any.required":
                "Due date is required.",
        }),

    status: Joi.string()
        .valid("due", "paid", "overdue")
        .default("due")
        .messages({
            "any.only":
                "Status must be due, paid, or overdue.",
        }),

    /*
     * paid_at is intentionally NOT accepted during
     * payment creation.
     *
     * Service will automatically set it when
     * status === "paid".
     */

    enable_reminders: Joi.boolean()
        .default(false)
        .messages({
            "boolean.base":
                "Enable reminders must be true or false.",
        }),

    reminders: Joi.when("enable_reminders", {
        is: true,
        then: Joi.array()
            .items(reminderSchema)
            .min(1)
            .max(3)
            .unique("reminder_type")
            .required()
            .messages({
                "array.base":
                    "Reminders must be an array.",
                "array.min":
                    "At least one reminder is required when reminders are enabled.",
                "array.max":
                    "A maximum of 3 reminders can be configured.",
                "array.unique":
                    "Each reminder type can only be configured once.",
                "any.required":
                    "Reminders are required when reminders are enabled.",
            }),

        otherwise: Joi.forbidden(),
    }),
})
    .min(1)
    .messages({
        "object.min":
            "At least one field is required.",
    });

/* =========================================================
   UPDATE PAYMENT
========================================================= */

const updatePaymentSchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base":
                "Client ID must be a number.",
            "number.integer":
                "Client ID must be an integer.",
            "number.positive":
                "Client ID must be a positive number.",
        }),

    payment_month: Joi.date()
        .iso()
        .messages({
            "date.base":
                "Payment month must be a valid date.",
            "date.format":
                "Payment month must be in YYYY-MM-DD format.",
        }),

    amount: Joi.number()
        .precision(2)
        .min(0)
        .messages({
            "number.base":
                "Payment amount must be a number.",
            "number.min":
                "Payment amount cannot be negative.",
        }),

    due_date: Joi.date()
        .iso()
        .messages({
            "date.base":
                "Due date must be a valid date.",
            "date.format":
                "Due date must be in YYYY-MM-DD format.",
        }),

    status: Joi.string()
        .valid("due", "paid", "overdue")
        .messages({
            "any.only":
                "Status must be due, paid, or overdue.",
        }),

    /*
     * paid_at is intentionally NOT accepted directly.
     *
     * It is controlled by the service according to status.
     */

    enable_reminders: Joi.boolean()
        .messages({
            "boolean.base":
                "Enable reminders must be true or false.",
        }),

    reminders: Joi.when("enable_reminders", {
        is: true,
        then: Joi.array()
            .items(reminderSchema)
            .min(1)
            .max(3)
            .unique("reminder_type")
            .required()
            .messages({
                "array.base":
                    "Reminders must be an array.",
                "array.min":
                    "At least one reminder is required when reminders are enabled.",
                "array.max":
                    "A maximum of 3 reminders can be configured.",
                "array.unique":
                    "Each reminder type can only be configured once.",
                "any.required":
                    "Reminders are required when reminders are enabled.",
            }),

        otherwise: Joi.when("enable_reminders", {
            is: false,
            then: Joi.forbidden(),
            otherwise: Joi.optional(),
        }),
    }),
})
    .min(1)
    .messages({
        "object.min":
            "At least one field is required.",
    });

    

const updatePaymentRemindersSchema = Joi.object({
    enabled: Joi.boolean(),

    reminders: Joi.array()
        .items(reminderSchema)
        .max(3),
})
    .or("enabled", "reminders")
    .required();
/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    reminderSchema,
    createPaymentSchema,
    updatePaymentSchema,
    updatePaymentRemindersSchema 
};