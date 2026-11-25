import { z } from "zod";

/* ========================= Constants ========================= */

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/* ========================= Profile Image ========================= */

const profileImageSchema = z
  .instanceof(File)
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    {
      message: "Only JPG, PNG and WEBP images are allowed.",
    }
  )
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    {
      message: "Profile image must not exceed 10 MB.",
    }
  );

/* ========================= Create Employee ========================= */

export const createEmployeeSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(
      2,
      "First name must be at least 2 characters."
    )
    .max(
      100,
      "First name must not exceed 100 characters."
    ),

  last_name: z
    .string()
    .trim()
    .min(
      2,
      "Last name must be at least 2 characters."
    )
    .max(
      100,
      "Last name must not exceed 100 characters."
    ),

  email: z
    .string()
    .trim()
    .min(1, "Employee email is required.")
    .email("Please enter a valid email address.")
    .max(
      255,
      "Email must not exceed 255 characters."
    ),

  phone: z
    .string()
    .trim()
    .max(
      30,
      "Phone number must not exceed 30 characters."
    )
    .optional(),

  employee_code: z
    .string()
    .trim()
    .min(
      2,
      "Employee code must be at least 2 characters."
    )
    .max(
      50,
      "Employee code must not exceed 50 characters."
    ),

  department: z
    .string()
    .trim()
    .max(
      100,
      "Department must not exceed 100 characters."
    )
    .optional(),

  designation: z
    .string()
    .trim()
    .max(
      100,
      "Designation must not exceed 100 characters."
    )
    .optional(),

  joining_date: z
    .string()
    .optional(),

  employment_type: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "INTERN",
    "FREELANCER",
  ]),

  role: z
    .string()
    .trim()
    .min(
      2,
      "Role must be at least 2 characters."
    )
    .max(
      100,
      "Role must not exceed 100 characters."
    )
    .optional(),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters."
    )
    .max(
      255,
      "Password must not exceed 255 characters."
    ),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),

  profile_image:
    profileImageSchema
      .nullable()
      .optional(),
});

/* ========================= Update Employee ========================= */

export const updateEmployeeSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(
      2,
      "First name must be at least 2 characters."
    )
    .max(
      100,
      "First name must not exceed 100 characters."
    )
    .optional(),

  last_name: z
    .string()
    .trim()
    .min(
      2,
      "Last name must be at least 2 characters."
    )
    .max(
      100,
      "Last name must not exceed 100 characters."
    )
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(
      255,
      "Email must not exceed 255 characters."
    )
    .optional(),

  phone: z
    .string()
    .trim()
    .max(
      30,
      "Phone number must not exceed 30 characters."
    )
    .optional(),

  employee_code: z
    .string()
    .trim()
    .min(
      2,
      "Employee code must be at least 2 characters."
    )
    .max(
      50,
      "Employee code must not exceed 50 characters."
    )
    .optional(),

  department: z
    .string()
    .trim()
    .max(
      100,
      "Department must not exceed 100 characters."
    )
    .optional(),

  designation: z
    .string()
    .trim()
    .max(
      100,
      "Designation must not exceed 100 characters."
    )
    .optional(),

  joining_date: z
    .string()
    .optional(),

  employment_type: z
    .enum([
      "FULL_TIME",
      "PART_TIME",
      "INTERN",
      "FREELANCER",
    ])
    .optional(),

  role: z
    .string()
    .trim()
    .min(
      2,
      "Role must be at least 2 characters."
    )
    .max(
      100,
      "Role must not exceed 100 characters."
    )
    .optional(),

  password: z
    .string()
    .max(
      255,
      "Password must not exceed 255 characters."
    )
    .refine(
      (value) =>
        value === "" ||
        value.length >= 8,
      {
        message:
          "Password must be at least 8 characters.",
      }
    )
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),

  profile_image:
    profileImageSchema
      .nullable()
      .optional(),
});

/* ========================= Employee List Query ========================= */

export const employeeListQuerySchema = z.object({
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
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional(),

  department: z
    .string()
    .optional(),

  designation: z
    .string()
    .optional(),

  role: z
    .string()
    .optional(),

  employment_type: z
    .enum([
      "FULL_TIME",
      "PART_TIME",
      "INTERN",
      "FREELANCER",
    ])
    .optional(),

  sortBy: z
    .string()
    .optional(),

  sortOrder: z
    .enum(["ASC", "DESC"])
    .optional(),
});

/* ========================= Update Employee Status ========================= */

export const updateEmployeeStatusSchema = z.object({
  status: z.enum([
    "ACTIVE",
    "INACTIVE",
  ]),
});

/* ========================= Inferred Types ========================= */

export type CreateEmployeeFormData =
  z.infer<typeof createEmployeeSchema>;

export type UpdateEmployeeFormData =
  z.infer<typeof updateEmployeeSchema>;

export type EmployeeListQueryData =
  z.infer<typeof employeeListQuerySchema>;

export type UpdateEmployeeStatusFormData =
  z.infer<typeof updateEmployeeStatusSchema>;