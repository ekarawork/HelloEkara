import { z } from "zod";

/* =========================================================
   DASHBOARD QUERY VALIDATION
========================================================= */

export const dashboardQuerySchema = z.object({
  days: z.coerce
    .number()
    .int("Days must be a whole number.")
    .min(1, "Days must be at least 1.")
    .max(365, "Days must not exceed 365.")
    .optional(),
});

/* =========================================================
   TYPES
========================================================= */

export type DashboardQueryData = z.infer<
  typeof dashboardQuerySchema
>;