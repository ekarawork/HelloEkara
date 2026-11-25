import { z } from "zod";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ALLOWED_PDF_TYPES = [
  "application/pdf",
];


const clientServiceSchema = z.object({
  service_name: z.enum([
    "META_ADS",
    "GOOGLE_ADS",
    "WEBSITE_SALES",
    "ORGANIC_SOCIAL",
  ]),
  monthly_budget: z.coerce
    .number()
    .min(0, "Monthly budget cannot be negative."),
});


const profilePhotoSchema = z
  .instanceof(File)
  .refine(
    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
    { message: "Only JPG, PNG and WEBP images are allowed." }
  )
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE,
    { message: "Profile photo must not exceed 10 MB." }
  );


const agreementContractSchema = z
  .instanceof(File)
  .refine(
    (file) => ALLOWED_PDF_TYPES.includes(file.type),
    { message: "Only PDF files are allowed." }
  )
  .refine(
    (file) => file.size <= MAX_PDF_SIZE,
    { message: "Agreement contract must not exceed 10 MB." }
  );


const optionalUrlSchema = z
  .string()
  .trim()
  .url("Please enter a valid URL.")
  .max(500, "URL must not exceed 500 characters.")
  .or(z.literal(""));


export const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Client name must be at least 2 characters.")
    .max(150, "Client name must not exceed 150 characters."),

  email: z
    .string()
    .trim()
    .min(1, "Client email is required.")
    .email("Please enter a valid email address.")
    .max(255, "Email must not exceed 255 characters."),

  login_id: z
    .string()
    .trim()
    .min(3, "Login ID must be at least 3 characters.")
    .max(100, "Login ID must not exceed 100 characters."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(255, "Password must not exceed 255 characters."),

  monthly_service_fee: z.coerce
    .number()
    .min(0, "Monthly service fee cannot be negative."),

  website_url: optionalUrlSchema.optional(),
  instagram_url: optionalUrlSchema.optional(),
  facebook_url: optionalUrlSchema.optional(),
  linkedin_url: optionalUrlSchema.optional(),
  youtube_url: optionalUrlSchema.optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),

  services: z
    .array(clientServiceSchema)
    .min(1, "At least one service is required."),

  profile_photo: profilePhotoSchema.nullable().optional(),
  agreement_contract: agreementContractSchema.nullable().optional(),
});


export const updateClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Client name must be at least 2 characters.")
    .max(150, "Client name must not exceed 150 characters.")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email must not exceed 255 characters.")
    .optional(),

  login_id: z
    .string()
    .trim()
    .min(3, "Login ID must be at least 3 characters.")
    .max(100, "Login ID must not exceed 100 characters.")
    .optional(),

  password: z
    .string()
    .max(255, "Password must not exceed 255 characters.")
    .refine(
      (value) => value === "" || value.length >= 8,
      { message: "Password must be at least 8 characters." }
    )
    .optional(),

  monthly_service_fee: z.coerce
    .number()
    .min(0, "Monthly service fee cannot be negative.")
    .optional(),

  website_url: optionalUrlSchema.optional(),
  instagram_url: optionalUrlSchema.optional(),
  facebook_url: optionalUrlSchema.optional(),
  linkedin_url: optionalUrlSchema.optional(),
  youtube_url: optionalUrlSchema.optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),

  services: z.array(clientServiceSchema).optional(),

  profile_photo: profilePhotoSchema.nullable().optional(),
  agreement_contract: agreementContractSchema.nullable().optional(),
});


export const clientListQuerySchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});


export const updateClientStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});


export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
export type ClientListQueryData = z.infer<typeof clientListQuerySchema>;
export type UpdateClientStatusFormData = z.infer<typeof updateClientStatusSchema>;