import { z } from 'zod';

export const siteSummarySchema = z.object({
  siteId: z.string().uuid(),
  crawlJobId: z.uuid().optional(),
});

export const issuesBreakdownSchema = z.object({
  siteId: z.uuid(),
  crawlJobId: z.uuid().optional(),
});

export const topPagesSchema = z.object({
  siteId: z.uuid(),
  crawlJobId: z.string().uuid().optional(),
});

export const issuesTableSchema = z.object({
  siteId: z.uuid(),
  severity: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  page: z.coerce.number().min(1).default(1),
});

export const exportReportSchema = z.object({
  siteId: z.uuid(),
  crawlJobId: z.uuid(),
  reportType: z.enum(['pdf']),
  filters: z
    .object({
      severity: z.string().optional(),
    })
    .optional(),
});
