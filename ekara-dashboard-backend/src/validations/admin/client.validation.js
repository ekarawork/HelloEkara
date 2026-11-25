const Joi = require("joi");

// Client Service Validation
const clientServiceSchema = Joi.object({
    service_name: Joi.string()
        .valid("META_ADS", "GOOGLE_ADS", "WEBSITE_SALES", "ORGANIC_SOCIAL")
        .required()
        .messages({
            "string.base": "Service name must be a string.",
            "any.only": "Service must be Meta Ads, Google Ads, Website Sales, or Organic Social.",
            "any.required": "Service name is required.",
        }),

    monthly_budget: Joi.number()
        .precision(2)
        .min(0)
        .required()
        .messages({
            "number.base": "Monthly budget must be a number.",
            "number.min": "Monthly budget cannot be negative.",
            "any.required": "Monthly budget is required.",
        }),
});

// Create Client Validation
const createClientSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required()
        .messages({
            "string.empty": "Client name is required.",
            "string.min": "Client name must be at least 2 characters.",
            "string.max": "Client name must not exceed 150 characters.",
            "any.required": "Client name is required.",
        }),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .required()
        .messages({
            "string.empty": "Client email is required.",
            "string.email": "Please enter a valid email address.",
            "string.max": "Email must not exceed 255 characters.",
            "any.required": "Client email is required.",
        }),

    login_id: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Login ID is required.",
            "string.min": "Login ID must be at least 3 characters.",
            "string.max": "Login ID must not exceed 100 characters.",
            "any.required": "Login ID is required.",
        }),

    password: Joi.string()
        .min(8)
        .max(255)
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
            "string.max": "Password must not exceed 255 characters.",
            "any.required": "Password is required.",
        }),

    monthly_service_fee: Joi.number()
        .precision(2)
        .min(0)
        .required()
        .messages({
            "number.base": "Monthly service fee must be a number.",
            "number.min": "Monthly service fee cannot be negative.",
            "any.required": "Monthly service fee is required.",
        }),

    website_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid website URL.",
            "string.max": "Website URL must not exceed 500 characters.",
        }),

    instagram_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid Instagram URL.",
            "string.max": "Instagram URL must not exceed 500 characters.",
        }),

    facebook_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid Facebook URL.",
            "string.max": "Facebook URL must not exceed 500 characters.",
        }),

    linkedin_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid LinkedIn URL.",
            "string.max": "LinkedIn URL must not exceed 500 characters.",
        }),

    youtube_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid YouTube URL.",
            "string.max": "YouTube URL must not exceed 500 characters.",
        }),

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .default("ACTIVE")
        .messages({
            "any.only": "Status must be ACTIVE or INACTIVE.",
        }),

    services: Joi.array()
        .items(clientServiceSchema)
        .min(1)
        .required()
        .messages({
            "array.base": "Services must be an array.",
            "array.min": "At least one service is required.",
            "any.required": "At least one service is required.",
        }),
});

// Update Client Validation
const updateClientSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .messages({
            "string.min": "Client name must be at least 2 characters.",
            "string.max": "Client name must not exceed 150 characters.",
        }),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .messages({
            "string.email": "Please enter a valid email address.",
            "string.max": "Email must not exceed 255 characters.",
        }),

    login_id: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .messages({
            "string.min": "Login ID must be at least 3 characters.",
            "string.max": "Login ID must not exceed 100 characters.",
        }),

    password: Joi.string()
        .min(8)
        .max(255)
        .allow("")
        .messages({
            "string.min": "Password must be at least 8 characters.",
            "string.max": "Password must not exceed 255 characters.",
        }),

    monthly_service_fee: Joi.number()
        .precision(2)
        .min(0)
        .messages({
            "number.base": "Monthly service fee must be a number.",
            "number.min": "Monthly service fee cannot be negative.",
        }),

    website_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid website URL.",
            "string.max": "Website URL must not exceed 500 characters.",
        }),

    instagram_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid Instagram URL.",
            "string.max": "Instagram URL must not exceed 500 characters.",
        }),

    facebook_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid Facebook URL.",
            "string.max": "Facebook URL must not exceed 500 characters.",
        }),

    linkedin_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid LinkedIn URL.",
            "string.max": "LinkedIn URL must not exceed 500 characters.",
        }),

    youtube_url: Joi.string()
        .trim()
        .uri()
        .max(500)
        .allow("")
        .messages({
            "string.uri": "Please enter a valid YouTube URL.",
            "string.max": "YouTube URL must not exceed 500 characters.",
        }),

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .messages({
            "any.only": "Status must be ACTIVE or INACTIVE.",
        }),

    services: Joi.array()
        .items(clientServiceSchema)
        .messages({
            "array.base": "Services must be an array.",
        }),
});

module.exports = {
    clientServiceSchema,
    createClientSchema,
    updateClientSchema,
};