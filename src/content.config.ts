import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /**
     * Where this post was syndicated after publishing here. These are
     * outbound pointers only — this site stays canonical, which is the
     * whole point of publishing here first.
     */
    substackUrl: z.url().optional(),
    xUrl: z.url().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.string(),
    tags: z.array(z.string()).default([]),
    repo: z.url().optional(),
    url: z.url().optional(),
    /** Featured projects get full cards on the homepage, in this order. */
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Optional published essay that grew from this note. */
    essay: z.string().regex(/^\/blog\/[a-z0-9-]+$/).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects, notes };
