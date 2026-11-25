const Joi = require("joi");

const loginSchema = Joi.object({

    email: Joi.string()
        .email()
        .trim()
        .lowercase()
        .required()
        .messages({
            "string.empty": "Email is required.",
            "string.email": "Please enter a valid email.",
            "any.required": "Email is required.",
        }),

    password: Joi.string()
        .min(8)
        .max(50)
        .required()
        .messages({
            "string.empty": "Password is required.",
            "string.min": "Password must be at least 8 characters.",
            "string.max": "Password must not exceed 50 characters.",
            "any.required": "Password is required.",
        }),
        
    remember_me: Joi.boolean().default(false)

});

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            "any.required": "Refresh token is required."
        })
});

module.exports = {
    loginSchema,
    refreshTokenSchema,
};