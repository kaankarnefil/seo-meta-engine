import { z } from 'zod';

export const SEORuleSchema = z.object({
    enabled: z.boolean().default(true),
    threshold: z.number().optional(),
    severity: z.enum(['warning', 'error', 'off']).default('warning'),
});

export const SEORulesConfigSchema = z.object({
    titleLength: SEORuleSchema.extend({
        min: z.number().default(30),
        max: z.number().default(60),
    }).default({}),
    descriptionLength: SEORuleSchema.extend({
        min: z.number().default(100),
        max: z.number().default(160),
    }).default({}),
    hasH1: SEORuleSchema.default({}),
    noDuplicateTitle: SEORuleSchema.extend({ severity: z.enum(['warning', 'error', 'off']).default('error') }).default({}),
    noDuplicateDescription: SEORuleSchema.extend({ severity: z.enum(['warning', 'error', 'off']).default('error') }).default({}),
    canonicalExists: SEORuleSchema.default({}),
    ogImageExists: SEORuleSchema.extend({ severity: z.enum(['warning', 'error', 'off']).default('warning') }).default({}),
});

export const SEOConfigSchema = z.object({
    siteName: z.string().min(1),
    baseUrl: z.string().url(),
    locale: z.string().default('en-US'),
    twitterHandle: z.string().optional(),

    defaultTitle: z.string().optional(),
    defaultDescription: z.string().optional(),
    defaultImage: z.string().url().optional(),

    rules: SEORulesConfigSchema.default({}),

    exclude: z.array(z.string()).default(['/api/**/*', '/_next/**/*']),
});

export type SEOConfig = z.infer<typeof SEOConfigSchema>;
export type SEORules = z.infer<typeof SEORulesConfigSchema>;
