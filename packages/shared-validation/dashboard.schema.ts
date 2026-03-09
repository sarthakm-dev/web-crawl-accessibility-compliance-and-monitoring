import { z } from 'zod';

export const siteQuerySchema = z.object({
  siteId: z.uuid().optional(),
});
