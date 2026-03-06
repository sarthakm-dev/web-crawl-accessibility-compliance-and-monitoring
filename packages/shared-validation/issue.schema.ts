import { z } from 'zod';

export const issuesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.string().optional(),
  severity: z.string().optional(),
  search: z.string().optional(),
});

export const issueParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateIssueStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  note: z.string().optional(),
});

export const addNoteSchema = z.object({
  note: z.string().min(1),
});
