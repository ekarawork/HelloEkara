import { z } from "zod";

export const paymentStatusSchema = z.enum([
  "due",
  "paid",
  "overdue",
]);

export const paymentReminderTypeSchema = z.enum([
  "before",
  "due_day",
  "after",
]);

export const paymentReminderSchema = z
  .object({
    reminder_type: paymentReminderTypeSchema,
    enabled: z.boolean().default(true),
    days_offset: z.number().int().nullable().optional(),
    message: z
      .string()
      .trim()
      .min(1, "Reminder message cannot be empty.")
      .max(
        5000,
        "Reminder message cannot exceed 5000 characters."
      ),
  })
  .superRefine((data, ctx) => {
    if (data.reminder_type === "before") {
      if (
        data.days_offset === undefined ||
        data.days_offset === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["days_offset"],
          message:
            "Before reminder days are required.",
        });
        return;
      }
      if (data.days_offset < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["days_offset"],
          message:
            "Before reminder must be at least 1 day before.",
        });
      }
    }
    if (data.reminder_type === "due_day") {
      if (
        data.days_offset !== undefined &&
        data.days_offset !== null &&
        data.days_offset !== 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["days_offset"],
          message:
            "Due day reminder offset must be 0.",
        });
      }
    }
    if (data.reminder_type === "after") {
      if (
        data.days_offset === undefined ||
        data.days_offset === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["days_offset"],
          message:
            "After reminder days are required.",
        });
        return;
      }
      if (data.days_offset < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["days_offset"],
          message:
            "After reminder must be at least 1 day after.",
        });
      }
    }
  });

// CREATE PAYMENT
export const createPaymentSchema = z
  .object({
    client_id: z
      .number({
        error:
          "Client ID must be a number.",
      })
      .int("Client ID must be an integer.")
      .positive(
        "Client ID must be a positive number."
      ),

    payment_month: z
      .string()
      .min(1, "Payment month is required."),

    amount: z
      .number({
        error:
          "Payment amount must be a number.",
      })
      .min(
        0,
        "Payment amount cannot be negative."
      ),

    due_date: z
      .string()
      .min(1, "Due date is required."),

    status: paymentStatusSchema.default("due"),

    enable_reminders: z
      .boolean()
      .default(false),

    reminders: z
      .array(paymentReminderSchema)
      .min(
        1,
        "At least one reminder is required when reminders are enabled."
      )
      .max(
        3,
        "A maximum of 3 reminders can be configured."
      )
      .superRefine((reminders, ctx) => {
        const types = reminders.map(
          (reminder) =>
            reminder.reminder_type
        );

        const uniqueTypes = new Set(types);

        if (
          uniqueTypes.size !== types.length
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Each reminder type can only be configured once.",
          });
        }
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.enable_reminders === true) {
      if (
        !data.reminders ||
        data.reminders.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reminders"],
          message:
            "Reminders are required when reminders are enabled.",
        });
      }
    }
    if (
      data.enable_reminders === false &&
      data.reminders !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reminders"],
        message:
          "Reminders cannot be provided when reminders are disabled.",
      });
    }
  });

// UPDATE PAYMENT
export const updatePaymentSchema = z
  .object({
    client_id: z
      .number({
        error:
          "Client ID must be a number.",
      })
      .int("Client ID must be an integer.")
      .positive(
        "Client ID must be a positive number."
      )
      .optional(),

    payment_month: z
      .string()
      .min(
        1,
        "Payment month cannot be empty."
      )
      .optional(),

    amount: z
      .number({
        error:
          "Payment amount must be a number.",
      })
      .min(
        0,
        "Payment amount cannot be negative."
      )
      .optional(),

    due_date: z
      .string()
      .min(
        1,
        "Due date cannot be empty."
      )
      .optional(),

    status: paymentStatusSchema.optional(),

    enable_reminders:
      z.boolean().optional(),

    reminders: z
      .array(paymentReminderSchema)
      .min(
        1,
        "At least one reminder is required when reminders are enabled."
      )
      .max(
        3,
        "A maximum of 3 reminders can be configured."
      )
      .superRefine((reminders, ctx) => {
        const types = reminders.map(
          (reminder) =>
            reminder.reminder_type
        );

        const uniqueTypes = new Set(types);

        if (
          uniqueTypes.size !== types.length
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Each reminder type can only be configured once.",
          });
        }
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.enable_reminders === true) {
      if (
        !data.reminders ||
        data.reminders.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["reminders"],
          message:
            "Reminders are required when reminders are enabled.",
        });
      }
    }
    if (
      data.enable_reminders === false &&
      data.reminders !== undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reminders"],
        message:
          "Reminders cannot be provided when reminders are disabled.",
      });
    }
  });

// UPDATE PAYMENT STATUS
export const updatePaymentStatusSchema =
  z.object({
    status: paymentStatusSchema,
  });

// PAYMENT LIST FILTERS
export const paymentListQuerySchema = z.object({
  page: z
    .number()
    .int()
    .positive()
    .optional(),

  limit: z
    .number()
    .int()
    .positive()
    .optional(),

  search: z
    .string()
    .optional(),

  client_id: z
    .number()
    .int()
    .positive()
    .optional(),

  status: paymentStatusSchema.optional(),

  payment_month: z
    .string()
    .optional(),

  due_date: z
    .string()
    .optional(),
});

// CLIENT PAYMENTS QUERY
export const clientPaymentsQuerySchema =
  z.object({
    page: z
      .number()
      .int()
      .positive()
      .optional(),

    limit: z
      .number()
      .int()
      .positive()
      .optional(),
  });

export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentReminderType = z.infer<typeof paymentReminderTypeSchema>;
export type PaymentReminderFormValues = z.infer<typeof paymentReminderSchema>;
export type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentFormValues = z.infer<typeof updatePaymentSchema>;
export type UpdatePaymentStatusFormValues = z.infer<typeof updatePaymentStatusSchema>;
export type PaymentListQueryValues = z.infer<typeof paymentListQuerySchema>;
export type ClientPaymentsQueryValues = z.infer<typeof clientPaymentsQuerySchema>;