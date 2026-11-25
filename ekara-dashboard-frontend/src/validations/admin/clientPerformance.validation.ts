import { z } from "zod";

/* ========================= Client Performance ========================= */

const performanceNumberSchema = z.coerce
  .number()
  .int()
  .min(0, "Value cannot be negative.");

const dailySpendSchema = z.coerce
  .number()
  .min(0, "Daily spend cannot be negative.");

/* ========================= Performance Date ========================= */

const performanceDateSchema = z
  .string()
  .trim()
  .min(1, "Performance date is required.")
  .refine(
    (value) => /^\d{4}-\d{2}-\d{2}$/.test(value),
    {
      message: "Performance date must be in YYYY-MM-DD format.",
    }
  );

/* ========================= Create Performance ========================= */

export const createClientPerformanceSchema = z.object({
  client_id: z.coerce
    .number()
    .int()
    .positive("Client is required."),

  client_service_id: z.coerce
    .number()
    .int()
    .positive("Client service is required."),

  performance_date: performanceDateSchema,

  daily_spend: dailySpendSchema.optional(),

  impressions: performanceNumberSchema.optional(),

  clicks: performanceNumberSchema.optional(),

  leads: performanceNumberSchema.optional(),
});

/* ========================= Update Performance ========================= */

export const updateClientPerformanceSchema = z.object({
  client_id: z.coerce
    .number()
    .int()
    .positive("Client is required.")
    .optional(),

  client_service_id: z.coerce
    .number()
    .int()
    .positive("Client service is required.")
    .optional(),

  performance_date: performanceDateSchema.optional(),

  daily_spend: dailySpendSchema.optional(),

  impressions: performanceNumberSchema.optional(),

  clicks: performanceNumberSchema.optional(),

  leads: performanceNumberSchema.optional(),
});

/* ========================= Performance List Query ========================= */

export const clientPerformanceListQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .optional(),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional(),

  clientServiceUuid: z
    .string()
    .trim()
    .optional(),

  serviceName: z
    .string()
    .trim()
    .optional(),

  startDate: z
    .string()
    .trim()
    .optional(),

  endDate: z
    .string()
    .trim()
    .optional(),
});

/* ========================= Form Types ========================= */

export type CreateClientPerformanceFormData = z.infer<
  typeof createClientPerformanceSchema
>;

export type UpdateClientPerformanceFormData = z.infer<
  typeof updateClientPerformanceSchema
>;

export type ClientPerformanceListQueryData = z.infer<
  typeof clientPerformanceListQuerySchema
>;