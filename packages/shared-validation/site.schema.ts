import { z } from 'zod';

export const createSiteSchema = z.object({
  name: z.string().min(1),
  baseUrl: z.string().url(),
});

export const getSitesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
