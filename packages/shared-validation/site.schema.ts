import { z } from 'zod';

export const createSiteSchema = z.object({
  name: z.string().min(1),
  baseUrl: z.url(),
  scheduledCrawlTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
    .optional()
    .or(z.literal('')),
});

export const getSitesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
});

export const siteParamsSchema = z.object({
  id: z.uuid(),
});

export const bulkDeleteSitesSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});
