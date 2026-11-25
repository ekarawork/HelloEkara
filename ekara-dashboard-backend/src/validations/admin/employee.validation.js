"use strict";

const Joi = require("joi");

/* ========================= Create Employee Validation ========================= */

const createEmployeeSchema = Joi.object({
    /* ========================= Basic Information ========================= */

    first_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "First name is required.",
            "string.min":
                "First name must be at least 2 characters.",
            "string.max":
                "First name must not exceed 100 characters.",
            "any.required": "First name is required.",
        }),

    last_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Last name is required.",
            "string.min":
                "Last name must be at least 2 characters.",
            "string.max":
                "Last name must not exceed 100 characters.",
            "any.required": "Last name is required.",
        }),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .required()
        .messages({
            "string.empty": "Employee email is required.",
            "string.email":
                "Please enter a valid email address.",
            "string.max":
                "Email must not exceed 255 characters.",
            "any.required":
                "Employee email is required.",
        }),

    phone: Joi.string()
        .trim()
        .max(30)
        .allow("")
        .messages({
            "string.max":
                "Phone number must not exceed 30 characters.",
        }),

    /* ========================= Employment Information ========================= */

    employee_code: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty":
                "Employee code is required.",
            "string.min":
                "Employee code must be at least 2 characters.",
            "string.max":
                "Employee code must not exceed 50 characters.",
            "any.required":
                "Employee code is required.",
        }),

    department: Joi.string()
        .trim()
        .max(100)
        .allow("")
        .messages({
            "string.max":
                "Department must not exceed 100 characters.",
        }),

    designation: Joi.string()
        .trim()
        .max(100)
        .allow("")
        .messages({
            "string.max":
                "Designation must not exceed 100 characters.",
        }),

    joining_date: Joi.date()
        .iso()
        .allow(null, "")
        .messages({
            "date.base":
                "Joining date must be a valid date.",
            "date.format":
                "Joining date must be in YYYY-MM-DD format.",
        }),

    employment_type: Joi.string()
        .valid(
            "FULL_TIME",
            "PART_TIME",
            "INTERN",
            "FREELANCER"
        )
        .default("FULL_TIME")
        .messages({
            "any.only":
                "Employment type must be Full Time, Part Time, Intern, or Freelancer.",
        }),

    /* ========================= Role & Access ========================= */

    role: Joi.string()
        .trim()
        .max(100)
        .default("EMPLOYEE")
        .messages({
            "string.empty":
                "Role cannot be empty.",
            "string.max":
                "Role must not exceed 100 characters.",
        }),

    /* ========================= Login ========================= */

    password: Joi.string()
        .min(8)
        .max(255)
        .required()
        .messages({
            "string.empty":
                "Password is required.",
            "string.min":
                "Password must be at least 8 characters.",
            "string.max":
                "Password must not exceed 255 characters.",
            "any.required":
                "Password is required.",
        }),

    /* ========================= Status ========================= */

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .default("ACTIVE")
        .messages({
            "any.only":
                "Status must be ACTIVE or INACTIVE.",
        }),
});

/* ========================= Update Employee Validation ========================= */

const updateEmployeeSchema = Joi.object({
    /* ========================= Basic Information ========================= */

    first_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .messages({
            "string.min":
                "First name must be at least 2 characters.",
            "string.max":
                "First name must not exceed 100 characters.",
        }),

    last_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .messages({
            "string.min":
                "Last name must be at least 2 characters.",
            "string.max":
                "Last name must not exceed 100 characters.",
        }),

    email: Joi.string()
        .trim()
        .email()
        .max(255)
        .messages({
            "string.email":
                "Please enter a valid email address.",
            "string.max":
                "Email must not exceed 255 characters.",
        }),

    phone: Joi.string()
        .trim()
        .max(30)
        .allow("")
        .messages({
            "string.max":
                "Phone number must not exceed 30 characters.",
        }),

    /* ========================= Employment Information ========================= */

    employee_code: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .messages({
            "string.min":
                "Employee code must be at least 2 characters.",
            "string.max":
                "Employee code must not exceed 50 characters.",
        }),

    department: Joi.string()
        .trim()
        .max(100)
        .allow("")
        .messages({
            "string.max":
                "Department must not exceed 100 characters.",
        }),

    designation: Joi.string()
        .trim()
        .max(100)
        .allow("")
        .messages({
            "string.max":
                "Designation must not exceed 100 characters.",
        }),

    joining_date: Joi.date()
        .iso()
        .allow(null, "")
        .messages({
            "date.base":
                "Joining date must be a valid date.",
            "date.format":
                "Joining date must be in YYYY-MM-DD format.",
        }),

    employment_type: Joi.string()
        .valid(
            "FULL_TIME",
            "PART_TIME",
            "INTERN",
            "FREELANCER"
        )
        .messages({
            "any.only":
                "Employment type must be Full Time, Part Time, Intern, or Freelancer.",
        }),

    /* ========================= Role & Access ========================= */

    role: Joi.string()
        .trim()
        .max(100)
        .messages({
            "string.max":
                "Role must not exceed 100 characters.",
        }),

    /* ========================= Login ========================= */

    password: Joi.string()
        .min(8)
        .max(255)
        .allow("")
        .messages({
            "string.min":
                "Password must be at least 8 characters.",
            "string.max":
                "Password must not exceed 255 characters.",
        }),

    /* ========================= Status ========================= */

    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .messages({
            "any.only":
                "Status must be ACTIVE or INACTIVE.",
        }),
});

/* ========================= Employee Status Validation ========================= */

const employeeStatusSchema = Joi.object({
    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .required()
        .messages({
            "any.only":
                "Status must be ACTIVE or INACTIVE.",
            "any.required":
                "Employee status is required.",
        }),
});

/* ========================= Exports ========================= */

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema,
    employeeStatusSchema,
};