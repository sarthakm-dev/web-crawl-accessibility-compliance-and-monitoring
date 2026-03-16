import { Request, Response } from 'express';
import { IssuesService } from '../services/issues.service';
import { AuthenticatedRequest } from '@packages/shared-types/express';
import { handleError } from '@packages/shared-utils/error-handler';

import {
  issuesQuerySchema,
  issueParamsSchema,
  updateIssueStatusSchema,
  addNoteSchema,
} from '@packages/shared-validation/issue.schema';

export const IssuesController = {
  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      // handle unauthorized user
      if (!req.teamId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // add zod validation
      const query = issuesQuerySchema.parse(req.query);
      // add service to get issues
      const result = await IssuesService.list({
        teamId: req.teamId,
        ...query,
      });

      return res.status(200).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = issueParamsSchema.parse(req.params);

      const issue = await IssuesService.get(id);

      return res.status(200).json(issue);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async updateStatus(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = issueParamsSchema.parse(req.params);
      const body = updateIssueStatusSchema.parse(req.body);

      const result = await IssuesService.updateStatus(
        id,
        req.userId,
        body.status,
        body.note
      );

      return res.status(200).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async addNote(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = issueParamsSchema.parse(req.params);
      const body = addNoteSchema.parse(req.body);

      const result = await IssuesService.addNote(id, req.userId, body.note);

      return res.status(200).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },
};
