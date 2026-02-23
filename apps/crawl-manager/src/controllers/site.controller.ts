import { Request, Response } from 'express';
import { Site } from '../models/site.model';

export const SiteController = {
  async createSite(req: Request, res: Response) {
    try {
      const { teamId, name, baseUrl } = req.body;

      if (!teamId || !name || !baseUrl) {
        return res.status(400).json({
          error: 'teamId, name and baseUrl are required',
        });
      }

      const site = await Site.create({
        team_id: teamId,
        name,
        base_url: baseUrl,
        is_active: true,
      });

      return res.status(201).json(site);
    } catch (err: any) {
      return res.status(500).json({
        error: err.message || 'Failed to create site',
      });
    }
  },
};
