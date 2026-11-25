import { z } from "zod";

/* ========================= Social Calendar ========================= */

// Client ID
const clientIdSchema = z.coerce
  .number()
  .int()
  .positive("Client is required.");

// Post Date
const postDateSchema = z
  .string()
  .trim()
  .min(1, "Post date is required.")
  .refine(
    (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
    {
      message: "Post date must be in YYYY-MM-DD format.",
    }
  );

// Platform
const platformSchema = z.enum(
  ["instagram", "facebook", "linkedin", "youtube"],
  {
    message: "Invalid platform.",
  }
);

// Status
const statusSchema = z.enum(
  ["draft", "approved", "scheduled", "published"],
  {
    message: "Invalid status.",
  }
);

// Content Type
const contentTypeSchema = z.enum(
  ["post", "reel", "carousel", "story"],
  {
    message: "Invalid content type.",
  }
);

// Note
const noteSchema = z
  .string()
  .trim()
  .max(5000, "Note cannot exceed 5000 characters.")
  .optional()
  .nullable();

/* ========================= Create Social Calendar Post ========================= */

export const createSocialCalendarSchema = z.object({
  client_id: clientIdSchema,

  post_date: postDateSchema,

  platform: platformSchema,

  status: statusSchema.optional(),

  content_type: contentTypeSchema,

  note: noteSchema,
});

/* ========================= Update Social Calendar Post ========================= */

export const updateSocialCalendarSchema = z.object({
  client_id: clientIdSchema.optional(),

  post_date: postDateSchema.optional(),

  platform: platformSchema.optional(),

  status: statusSchema.optional(),

  content_type: contentTypeSchema.optional(),

  note: noteSchema,
});

/* ========================= Social Calendar List Query ========================= */

export const socialCalendarListQuerySchema = z.object({
  client_id: z.coerce
    .number()
    .int()
    .positive()
    .optional(),

  start_date: z
    .string()
    .trim()
    .optional(),

  end_date: z
    .string()
    .trim()
    .optional(),

  platform: platformSchema.optional(),

  status: statusSchema.optional(),

  content_type: contentTypeSchema.optional(),
});

/* ========================= Form Types ========================= */

export type CreateSocialCalendarFormData = z.infer<
  typeof createSocialCalendarSchema
>;

export type UpdateSocialCalendarFormData = z.infer<
  typeof updateSocialCalendarSchema
>;

export type SocialCalendarListQueryData = z.infer<
  typeof socialCalendarListQuerySchema
>;