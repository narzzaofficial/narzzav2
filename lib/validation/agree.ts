import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .optional();

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus lowercase kebab-case");

const optionalSlugSchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .optional()
  .refine((value) => value === undefined || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
    message: "Slug harus lowercase kebab-case",
  });

const qaLineSchema = z.object({
  role: z.enum(["q", "a"]),
  text: z.string().trim().min(1),
});

const analysisSchema = z.object({
  summary: z.array(z.string().trim()).default([]),
  agreedWithoutRealizing: z.array(z.string().trim()).default([]),
  surprisingPoints: z.array(z.string().trim()).default([]),
  dataCollected: z.array(z.string().trim()).default([]),
  platformRights: z.array(z.string().trim()).default([]),
  risks: z.array(z.string().trim()).default([]),
  tips: z.array(z.string().trim()).default([]),
});

export const createAgreeTopicSchema = z.object({
  name: z.string().trim().min(1),
  slug: optionalSlugSchema,
  description: z.string().trim().default(""),
  eyebrow: z.string().trim().default("Setelah Klik Agree"),
  icon: z.string().trim().default("cpu"),
  isActive: z.boolean().default(true),
});

export const updateAgreeTopicSchema = createAgreeTopicSchema.partial();

export const createAgreeCompanySchema = z.object({
  name: z.string().trim().min(1),
  slug: optionalSlugSchema,
  topicId: z.string().trim().min(1),
  logo: z.string().trim().default(""),
  description: z.string().trim().default(""),
  isActive: z.boolean().default(true),
});

export const updateAgreeCompanySchema = createAgreeCompanySchema.partial();

export const createAgreeAppSchema = z.object({
  name: z.string().trim().min(1),
  slug: optionalSlugSchema,
  companyId: z.string().trim().min(1),
  description: z.string().trim().default(""),
  icon: z.string().trim().default(""),
  isPopular: z.boolean().default(false),
  popularScore: z.coerce.number().int().min(0).max(9999).default(0),
  isActive: z.boolean().default(true),
});

export const updateAgreeAppSchema = createAgreeAppSchema.partial();

export const createAgreeDocumentSchema = z.object({
  title: z.string().trim().min(1),
  slug: optionalSlugSchema,
  appId: z.string().trim().min(1),
  type: z.enum(["terms-of-service", "privacy-policy", "community-guidelines"]),
  dek: z.string().trim().default(""),
  tosOriginal: z.string().default(""),
  tosTranslation: optionalTrimmedString,
  analysis: analysisSchema.default({
    summary: [],
    agreedWithoutRealizing: [],
    surprisingPoints: [],
    dataCollected: [],
    platformRights: [],
    risks: [],
    tips: [],
  }),
  content: z.array(qaLineSchema).default([]),
  isActive: z.boolean().default(true),
});

export const updateAgreeDocumentSchema = createAgreeDocumentSchema.partial();
