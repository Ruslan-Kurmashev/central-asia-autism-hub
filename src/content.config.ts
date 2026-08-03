import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  organisation: z.string().min(1).optional(),
  publicationYear: z.number().int().min(1900).optional(),
  note: z.string().min(1).optional(),
  accessedAt: z.coerce.date().optional(),
});

const commonFields = {
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  country: z.literal('kz'),
  language: z.enum(['ru', 'kk', 'en']),
  section: z.enum([
    'parents',
    'research',
    'help-kazakhstan',
    'learning',
    'professionals',
    'about',
  ]),
  slug: z
    .string()
    .min(1)
    .regex(
      /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u,
      'Use letters, numbers, and single hyphens only.',
    ),
  translationKey: z.string().min(1),
  translationStatus: z.enum(['source', 'checked', 'pending']),
  author: z.string().min(1),
  editor: z.string().min(1),
  externalReviewer: z.string().min(1).optional(),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  reviewDueAt: z.coerce.date().optional(),
  riskLevel: z.enum(['lower', 'moderate', 'high']),
  disclaimerType: z.enum(['informational', 'medical']),
  conflictOfInterest: z.string().min(1),
  versionNote: z.string().min(1).optional(),
  draft: z.boolean().default(true),
  sources: z.array(sourceSchema).default([]),
};

interface PublicationFields {
  draft: boolean;
  publishedAt?: Date;
  updatedAt?: Date;
  translationStatus: 'source' | 'checked' | 'pending';
}

function validatePublication(data: PublicationFields, context: z.RefinementCtx) {
  if (data.draft) return;

  if (!data.publishedAt) {
    context.addIssue({
      code: 'custom',
      path: ['publishedAt'],
      message: 'A published material requires a publication date.',
    });
  }

  if (!data.updatedAt) {
    context.addIssue({
      code: 'custom',
      path: ['updatedAt'],
      message: 'A published material requires an update date.',
    });
  }

  if (data.translationStatus === 'pending') {
    context.addIssue({
      code: 'custom',
      path: ['translationStatus'],
      message: 'A translation pending review must remain a draft.',
    });
  }
}

function validatePagePublication(
  data: PublicationFields & { sources: Array<unknown> },
  context: z.RefinementCtx,
) {
  validatePublication(data, context);

  if (!data.draft && data.sources.length === 0) {
    context.addIssue({
      code: 'custom',
      path: ['sources'],
      message: 'A published information material requires at least one source.',
    });
  }
}

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z
    .object({
      ...commonFields,
      topic: z.string().min(1),
      audience: z
        .array(z.enum(['parents', 'families', 'professionals', 'general']))
        .min(1),
      keyPoints: z.array(z.string().min(1)).default([]),
      evidenceLimitations: z.string().min(1).optional(),
    })
    .superRefine(validatePagePublication),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z
    .object({
      ...commonFields,
      originalTitle: z.string().min(1),
      originalAuthors: z.array(z.string().min(1)).min(1),
      journalOrOrganisation: z.string().min(1),
      publicationYear: z.number().int().min(1900),
      doi: z.string().min(1).optional(),
      sourceUrl: z.url(),
      studyType: z.string().min(1),
      sampleSize: z.number().int().positive().optional(),
      population: z.string().min(1).optional(),
      sourceStatusCheckedAt: z.coerce.date(),
    })
    .superRefine(validatePublication),
});

const learning = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/learning' }),
  schema: z
    .object({
      ...commonFields,
      provider: z.string().min(1),
      audience: z.array(z.enum(['parents', 'professionals'])).min(1),
      format: z.string().min(1),
      languages: z.array(z.enum(['ru', 'kk', 'en'])).min(1),
      costLabel: z.string().min(1),
      externalUrl: z.url().optional(),
      lastVerifiedAt: z.coerce.date().optional(),
      projectOwned: z.boolean(),
      registrationStatus: z.string().min(1).optional(),
      resourceDisclaimerType: z.enum(['project', 'external']),
    })
    .superRefine(validatePublication),
});

export const collections = { pages, research, learning };
