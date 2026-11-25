const Joi = require("joi");

/* ========================= Create Performance Validation ========================= */

const createClientPerformanceSchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Client ID must be a number.",
            "number.integer": "Client ID must be an integer.",
            "number.positive": "Client ID must be a positive number.",
            "any.required": "Client ID is required.",
        }),

    client_service_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Client service ID must be a number.",
            "number.integer": "Client service ID must be an integer.",
            "number.positive": "Client service ID must be a positive number.",
            "any.required": "Client service ID is required.",
        }),

    performance_date: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "Performance date must be a valid date.",
            "date.format": "Performance date must be in YYYY-MM-DD format.",
            "any.required": "Performance date is required.",
        }),

    daily_spend: Joi.number()
        .precision(2)
        .min(0)
        .default(0)
        .messages({
            "number.base": "Daily spend must be a number.",
            "number.min": "Daily spend cannot be negative.",
        }),

    impressions: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            "number.base": "Impressions must be a number.",
            "number.integer": "Impressions must be an integer.",
            "number.min": "Impressions cannot be negative.",
        }),

    clicks: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            "number.base": "Clicks must be a number.",
            "number.integer": "Clicks must be an integer.",
            "number.min": "Clicks cannot be negative.",
        }),

    leads: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            "number.base": "Leads must be a number.",
            "number.integer": "Leads must be an integer.",
            "number.min": "Leads cannot be negative.",
        }),
});

/* ========================= Update Performance Validation ========================= */

const updateClientPerformanceSchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "Client ID must be a number.",
            "number.integer": "Client ID must be an integer.",
            "number.positive": "Client ID must be a positive number.",
        }),

    client_service_id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "Client service ID must be a number.",
            "number.integer": "Client service ID must be an integer.",
            "number.positive": "Client service ID must be a positive number.",
        }),

    performance_date: Joi.date()
        .iso()
        .messages({
            "date.base": "Performance date must be a valid date.",
            "date.format": "Performance date must be in YYYY-MM-DD format.",
        }),

    daily_spend: Joi.number()
        .precision(2)
        .min(0)
        .messages({
            "number.base": "Daily spend must be a number.",
            "number.min": "Daily spend cannot be negative.",
        }),

    impressions: Joi.number()
        .integer()
        .min(0)
        .messages({
            "number.base": "Impressions must be a number.",
            "number.integer": "Impressions must be an integer.",
            "number.min": "Impressions cannot be negative.",
        }),

    clicks: Joi.number()
        .integer()
        .min(0)
        .messages({
            "number.base": "Clicks must be a number.",
            "number.integer": "Clicks must be an integer.",
            "number.min": "Clicks cannot be negative.",
        }),

    leads: Joi.number()
        .integer()
        .min(0)
        .messages({
            "number.base": "Leads must be a number.",
            "number.integer": "Leads must be an integer.",
            "number.min": "Leads cannot be negative.",
        }),
})
    .min(1)
    .messages({
        "object.min": "At least one field is required to update performance.",
    });

/* ========================= Performance Query Validation ========================= */

const clientPerformanceQuerySchema = Joi.object({
    client_id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "Client ID must be a number.",
            "number.integer": "Client ID must be an integer.",
            "number.positive": "Client ID must be a positive number.",
        }),

    client_service_id: Joi.number()
        .integer()
        .positive()
        .messages({
            "number.base": "Client service ID must be a number.",
            "number.integer": "Client service ID must be an integer.",
            "number.positive": "Client service ID must be a positive number.",
        }),

    start_date: Joi.date()
        .iso()
        .messages({
            "date.base": "Start date must be a valid date.",
            "date.format": "Start date must be in YYYY-MM-DD format.",
        }),

    end_date: Joi.date()
        .iso()
        .min(Joi.ref("start_date"))
        .messages({
            "date.base": "End date must be a valid date.",
            "date.format": "End date must be in YYYY-MM-DD format.",
            "date.min": "End date cannot be before start date.",
        }),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number.",
            "number.integer": "Page must be an integer.",
            "number.min": "Page must be at least 1.",
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number.",
            "number.integer": "Limit must be an integer.",
            "number.min": "Limit must be at least 1.",
            "number.max": "Limit cannot exceed 100.",
        }),
});

/* ========================= Dashboard Performance Validation ========================= */

const clientPerformanceDashboardSchema = Joi.object({
    start_date: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "Start date must be a valid date.",
            "date.format": "Start date must be in YYYY-MM-DD format.",
            "any.required": "Start date is required.",
        }),

    end_date: Joi.date()
        .iso()
        .min(Joi.ref("start_date"))
        .required()
        .messages({
            "date.base": "End date must be a valid date.",
            "date.format": "End date must be in YYYY-MM-DD format.",
            "date.min": "End date cannot be before start date.",
            "any.required": "End date is required.",
        }),
});

/* ========================= UUID Validation ========================= */

const clientPerformanceUuidSchema = Joi.object({
    uuid: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.guid": "Performance UUID must be a valid UUID.",
            "any.required": "Performance UUID is required.",
        }),
});

/* ========================= Exports ========================= */

module.exports = {
    createClientPerformanceSchema,
    updateClientPerformanceSchema,
    clientPerformanceQuerySchema,
    clientPerformanceDashboardSchema,
    clientPerformanceUuidSchema,
};