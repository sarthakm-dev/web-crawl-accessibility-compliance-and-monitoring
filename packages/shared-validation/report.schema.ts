import { z } from "zod";

export const siteSummarySchema = z.object({
  siteId: z.uuid(),
  crawlJobId: z.uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const issuesBreakdownSchema = z.object({
  siteId: z.uuid(),
  crawlJobId: z.uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const topPagesSchema = z.object({
  siteId: z.uuid(),
  crawlJobId: z.uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const issuesTableSchema = z.object({
  siteId: z.uuid(),
  severity: z.string().optional(),
  crawlJobId: z.uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  page: z.coerce.number().min(1).default(1),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const exportReportSchema = z.object({
  siteId: z.uuid(),
  crawlJobId: z.uuid().optional(),
  reportType: z.enum(["pdf"]),
  filters: z
    .object({
      severity: z.string().optional(),
      startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
    })
    .optional(),
});