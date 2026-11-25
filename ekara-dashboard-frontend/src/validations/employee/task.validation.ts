import { z } from "zod";

/* ========================= Constants ========================= */

const TASK_PROGRESS_MIN = 0;
const TASK_PROGRESS_MAX = 100;

const TASK_MESSAGE_MAX_LENGTH = 10000;

const TASK_ATTACHMENT_MAX_SIZE =
  10 * 1024 * 1024; // 10 MB

const TASK_ATTACHMENT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

/* =========================================================
   Task API Validation
========================================================= */

/* ========================= Task List Query ========================= */

export const taskListQuerySchema = z.object({
  page: z
    .number()
    .int()
    .min(1)
    .optional(),

  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional(),

  search: z
    .string()
    .trim()
    .optional(),

  status: z
    .enum([
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEW",
      "COMPLETED",
    ])
    .optional(),

  priority: z
    .enum([
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT",
    ])
    .optional(),

  client_id: z
    .number()
    .int()
    .positive()
    .optional(),

  employee_id: z
    .number()
    .int()
    .positive()
    .optional(),

  start_date: z
    .string()
    .optional()
    .nullable(),

  due_date: z
    .string()
    .optional()
    .nullable(),
});

/* ========================= Update Task Status ========================= */

export const updateTaskStatusSchema = z.object({
  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "COMPLETED",
  ]),
});

/* ========================= Update Task Progress ========================= */

export const updateTaskProgressSchema = z.object({
  progress: z
    .number()
    .int(
      "Progress must be a whole number."
    )
    .min(
      TASK_PROGRESS_MIN,
      `Progress must be between ${TASK_PROGRESS_MIN} and ${TASK_PROGRESS_MAX}.`
    )
    .max(
      TASK_PROGRESS_MAX,
      `Progress must be between ${TASK_PROGRESS_MIN} and ${TASK_PROGRESS_MAX}.`
    ),
});

/* =========================================================
   Task Message Validation
========================================================= */

/* ========================= Task Message Create ========================= */

export const createTaskMessageSchema = z
  .object({
    message: z
      .string()
      .trim()
      .max(
        TASK_MESSAGE_MAX_LENGTH,
        `Message must not exceed ${TASK_MESSAGE_MAX_LENGTH} characters.`
      )
      .optional()
      .nullable(),

    message_type: z
      .enum([
        "TEXT",
        "TASK",
        "ATTACHMENT",
      ])
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.message_type === "ATTACHMENT"
      ) {
        return true;
      }

      return Boolean(
        data.message &&
          data.message.trim().length > 0
      );
    },
    {
      message: "Message is required.",
      path: ["message"],
    }
  );

/* ========================= Task Message Update ========================= */

export const updateTaskMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(
      1,
      "Message is required."
    )
    .max(
      TASK_MESSAGE_MAX_LENGTH,
      `Message must not exceed ${TASK_MESSAGE_MAX_LENGTH} characters.`
    ),
});

/* ========================= Task Message List Query ========================= */

export const taskMessageListQuerySchema =
  z.object({
    page: z
      .number()
      .int()
      .min(1)
      .optional(),

    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional(),

    search: z
      .string()
      .trim()
      .optional(),
  });

/* ========================= Task Message Type ========================= */

export const taskMessageTypeSchema = z.object({
  message_type: z.enum([
    "TEXT",
    "TASK",
    "SYSTEM",
    "ATTACHMENT",
  ]),
});

/* =========================================================
   Task Attachment Validation
========================================================= */

/* ========================= Create Task Attachment ========================= */

export const createTaskAttachmentSchema =
  z.object({
    message_id: z
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),

    file_name: z
      .string()
      .trim()
      .min(
        1,
        "File name is required."
      )
      .max(
        255,
        "File name must not exceed 255 characters."
      )
      .optional(),

    file_type: z
      .string()
      .trim()
      .min(
        1,
        "File type is required."
      )
      .max(
        100,
        "File type must not exceed 100 characters."
      )
      .optional(),

    file_size: z
      .number()
      .int()
      .min(
        1,
        "File size must be greater than 0."
      )
      .max(
        TASK_ATTACHMENT_MAX_SIZE,
        "File size must not exceed 10 MB."
      )
      .optional(),

    resource_type: z
      .enum([
        "image",
        "raw",
        "video",
      ])
      .optional(),
  });

/* ========================= Update Task Attachment ========================= */

export const updateTaskAttachmentSchema =
  z
    .object({
      file_name: z
        .string()
        .trim()
        .min(
          1,
          "File name is required."
        )
        .max(
          255,
          "File name must not exceed 255 characters."
        )
        .optional(),

      file_type: z
        .string()
        .trim()
        .min(
          1,
          "File type is required."
        )
        .max(
          100,
          "File type must not exceed 100 characters."
        )
        .optional(),
    })
    .refine(
      (data) =>
        data.file_name !== undefined ||
        data.file_type !== undefined,
      {
        message:
          "At least one attachment field is required.",
      }
    );

/* ========================= Task Attachment UUID ========================= */

export const taskAttachmentUuidSchema =
  z.object({
    attachment_uuid: z
      .string()
      .uuid(
        "Please provide a valid attachment UUID."
      ),
  });

/* ========================= Task Attachment Message ========================= */

export const taskAttachmentMessageSchema =
  z.object({
    message_id: z
      .number()
      .int()
      .positive(
        "Please provide a valid message ID."
      ),
  });

/* ========================= Task Attachment List Query ========================= */

export const taskAttachmentListQuerySchema =
  z.object({
    page: z
      .number()
      .int()
      .min(1)
      .optional(),

    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional(),
  });

/* ========================= Task Attachment File ========================= */

export const taskAttachmentFileSchema =
  z.object({
    file_name: z
      .string()
      .trim()
      .min(
        1,
        "File name is required."
      )
      .max(
        255,
        "File name must not exceed 255 characters."
      ),

    file_type: z
      .string()
      .trim()
      .min(
        1,
        "File type is required."
      )
      .max(
        100,
        "File type must not exceed 100 characters."
      ),

    file_size: z
      .number()
      .int()
      .min(
        1,
        "File size must be greater than 0."
      )
      .max(
        TASK_ATTACHMENT_MAX_SIZE,
        "File size must not exceed 10 MB."
      ),

    resource_type: z.enum([
      "image",
      "raw",
      "video",
    ]),
  });

/* ========================= Task Attachment File Validation ========================= */

export const validateTaskAttachmentFile =
  (file: File): string | null => {
    if (
      !(file instanceof File)
    ) {
      return "Invalid attachment file.";
    }

    if (
      file.size <= 0
    ) {
      return "Selected attachment is empty.";
    }

    if (
      file.size >
      TASK_ATTACHMENT_MAX_SIZE
    ) {
      return "File size must not exceed 10 MB.";
    }

    if (
      !TASK_ATTACHMENT_ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return "Unsupported file type.";
    }

    return null;
  };

/* ========================= Constants Export ========================= */

export {
  TASK_PROGRESS_MIN,
  TASK_PROGRESS_MAX,
  TASK_MESSAGE_MAX_LENGTH,
  TASK_ATTACHMENT_MAX_SIZE,
  TASK_ATTACHMENT_ALLOWED_TYPES,
};

/* =========================================================
   Inferred Types
========================================================= */

/* ========================= Task Types ========================= */

export type TaskListQueryData =
  z.infer<
    typeof taskListQuerySchema
  >;

export type UpdateTaskStatusFormData =
  z.infer<
    typeof updateTaskStatusSchema
  >;

export type UpdateTaskProgressFormData =
  z.infer<
    typeof updateTaskProgressSchema
  >;

/* ========================= Task Message Types ========================= */

export type CreateTaskMessageFormData =
  z.infer<
    typeof createTaskMessageSchema
  >;

export type UpdateTaskMessageFormData =
  z.infer<
    typeof updateTaskMessageSchema
  >;

export type TaskMessageListQueryData =
  z.infer<
    typeof taskMessageListQuerySchema
  >;

export type TaskMessageTypeFormData =
  z.infer<
    typeof taskMessageTypeSchema
  >;

/* ========================= Task Attachment Types ========================= */

export type CreateTaskAttachmentFormData =
  z.infer<
    typeof createTaskAttachmentSchema
  >;

export type UpdateTaskAttachmentFormData =
  z.infer<
    typeof updateTaskAttachmentSchema
  >;

export type TaskAttachmentUuidData =
  z.infer<
    typeof taskAttachmentUuidSchema
  >;

export type TaskAttachmentMessageData =
  z.infer<
    typeof taskAttachmentMessageSchema
  >;

export type TaskAttachmentListQueryData =
  z.infer<
    typeof taskAttachmentListQuerySchema
  >;

export type TaskAttachmentFileData =
  z.infer<
    typeof taskAttachmentFileSchema
  >;