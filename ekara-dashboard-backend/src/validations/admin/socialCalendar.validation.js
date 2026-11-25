"use strict";

const Joi = require("joi");

// =========================
// Common Enums
// =========================

const PLATFORM_VALUES = [
  "instagram",
  "facebook",
  "linkedin",
  "youtube",
];

const STATUS_VALUES = [
  "draft",
  "approved",
  "scheduled",
  "published",
];

const CONTENT_TYPE_VALUES = [
  "post",
  "reel",
  "carousel",
  "story",
];

// =========================
// Common Fields
// =========================

const clientId = Joi.number()
  .integer()
  .positive()
  .required()
  .messages({
    "number.base": "Client ID must be a number.",
    "number.integer": "Client ID must be an integer.",
    "number.positive": "Client ID must be greater than 0.",
    "any.required": "Client ID is required.",
  });

const postDate = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .required()
  .messages({
    "string.pattern.base":
      "Post date must be in YYYY-MM-DD format.",
    "any.required": "Post date is required.",
  });

const platform = Joi.string()
  .valid(...PLATFORM_VALUES)
  .required()
  .messages({
    "any.only":
      "Platform must be one of instagram, facebook, linkedin, or youtube.",
    "any.required": "Platform is required.",
  });

const status = Joi.string()
  .valid(...STATUS_VALUES)
  .required()
  .messages({
    "any.only":
      "Status must be one of draft, approved, scheduled, or published.",
    "any.required": "Status is required.",
  });

const contentType = Joi.string()
  .valid(...CONTENT_TYPE_VALUES)
  .required()
  .messages({
    "any.only":
      "Content type must be one of post, reel, carousel, or story.",
    "any.required": "Content type is required.",
  });

const note = Joi.string()
  .allow("", null)
  .optional()
  .messages({
    "string.base": "Note must be a string.",
  });

// =========================
// Create Social Calendar Post
// =========================

const createSocialCalendarSchema = Joi.object({
  client_id: clientId,

  post_date: postDate,

  platform,

  status: status.default("draft"),

  content_type: contentType,

  note,
});

// =========================
// Update Social Calendar Post
// =========================

const updateSocialCalendarSchema = Joi.object({
  client_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "Client ID must be a number.",
      "number.integer": "Client ID must be an integer.",
      "number.positive": "Client ID must be greater than 0.",
    }),

  post_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Post date must be in YYYY-MM-DD format.",
    }),

  platform: Joi.string()
    .valid(...PLATFORM_VALUES)
    .optional()
    .messages({
      "any.only":
        "Platform must be one of instagram, facebook, linkedin, or youtube.",
    }),

  status: Joi.string()
    .valid(...STATUS_VALUES)
    .optional()
    .messages({
      "any.only":
        "Status must be one of draft, approved, scheduled, or published.",
    }),

  content_type: Joi.string()
    .valid(...CONTENT_TYPE_VALUES)
    .optional()
    .messages({
      "any.only":
        "Content type must be one of post, reel, carousel, or story.",
    }),

  note,
})
  .min(1)
  .messages({
    "object.min":
      "At least one field is required to update the social calendar post.",
  });

// =========================
// Get Social Calendar Post By ID
// =========================

const getSocialCalendarByIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Post ID must be a number.",
      "number.integer": "Post ID must be an integer.",
      "number.positive": "Post ID must be greater than 0.",
      "any.required": "Post ID is required.",
    }),
});

// =========================
// Delete Social Calendar Post
// =========================

const deleteSocialCalendarSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Post ID must be a number.",
      "number.integer": "Post ID must be an integer.",
      "number.positive": "Post ID must be greater than 0.",
      "any.required": "Post ID is required.",
    }),
});

// =========================
// Get/List Social Calendar Posts
// =========================

const getSocialCalendarListSchema = Joi.object({
  client_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "Client ID must be a number.",
      "number.integer": "Client ID must be an integer.",
      "number.positive": "Client ID must be greater than 0.",
    }),

  start_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Start date must be in YYYY-MM-DD format.",
    }),

  end_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "End date must be in YYYY-MM-DD format.",
    }),

  platform: Joi.string()
    .valid(...PLATFORM_VALUES)
    .optional()
    .messages({
      "any.only":
        "Platform must be one of instagram, facebook, linkedin, or youtube.",
    }),

  status: Joi.string()
    .valid(...STATUS_VALUES)
    .optional()
    .messages({
      "any.only":
        "Status must be one of draft, approved, scheduled, or published.",
    }),

  content_type: Joi.string()
    .valid(...CONTENT_TYPE_VALUES)
    .optional()
    .messages({
      "any.only":
        "Content type must be one of post, reel, carousel, or story.",
    }),
});

// =========================
// Export
// =========================

module.exports = {
  createSocialCalendarSchema,
  updateSocialCalendarSchema,
  getSocialCalendarByIdSchema,
  deleteSocialCalendarSchema,
  getSocialCalendarListSchema,
};