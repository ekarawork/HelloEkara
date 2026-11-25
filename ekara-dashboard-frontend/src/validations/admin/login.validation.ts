import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .email("Please enter a valid email."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password must not exceed 50 characters."),

  remember_me: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;