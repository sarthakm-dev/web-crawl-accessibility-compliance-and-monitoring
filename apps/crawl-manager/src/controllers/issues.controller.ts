import { Request, Response } from 'express';
import { IssuesService } from '../services/issues.service';

export const IssuesController = {
  async getAll(req: Request, res: Response) {
    try {
      const teamId = (req as any).teamId;

      const result = await IssuesService.list({
        teamId,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        status: req.query.status,
        severity: req.query.severity,
        search: req.query.search,
      });

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const issue = await IssuesService.get(req.params.id);
      res.json(issue);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  },

  async updateStatus(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = (req as any).userId;

      const result = await IssuesService.updateStatus(
        req.params.id,
        userId,
        req.body.status,
        req.body.note
      );

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async addNote(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = (req as any).userId;

      const result = await IssuesService.addNote(
        req.params.id,
        userId,
        req.body.note
      );

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
