import { z } from 'zod';

export const triggerCrawlSchema = z.object({
  siteId: z.uuid(),
  triggerType: z.enum(['manual', 'scheduled']),
});

export const getCrawlsQuerySchema = z.object({
  siteId: z.uuid().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const crawlParamsSchema = z.object({
  id: z.uuid(),
});

export const bulkDeleteCrawlsSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
});
