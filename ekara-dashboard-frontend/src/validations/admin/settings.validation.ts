"use client";

import { z } from "zod";

/* =========================================================
   UPDATE ADMIN PROFILE VALIDATION
========================================================= */

export const updateAdminProfileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(100, "First name must not exceed 100 characters."),

  last_name: z
    .string()
    .trim()
    .max(100, "Last name must not exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .max(150, "Email must not exceed 150 characters."),
});


/* =========================================================
   UPDATE ADMIN PROFILE TYPE
========================================================= */

export type UpdateAdminProfileFormData = z.infer<
  typeof updateAdminProfileSchema
>;



