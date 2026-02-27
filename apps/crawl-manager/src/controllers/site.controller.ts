<<<<<<< HEAD
import { Request, Response } from "express";
import { Site } from "../models/site.model";
=======
import { Request, Response } from 'express';
import { SiteService } from '../services/site.service';
import {
  createSiteSchema,
  getSitesQuerySchema,
} from '@packages/shared-validation/site.schema';
>>>>>>> feature/crawl-worker

export const SiteController = {
  async createSite(req: Request, res: Response) {
    try {
<<<<<<< HEAD
      const { teamId, name, baseUrl } = req.body;

      if (!teamId || !name || !baseUrl) {
        return res.status(400).json({
          error: "teamId, name and baseUrl are required",
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
        error: err.message || "Failed to create site",
      });
    }
  },
};
=======
      const parsed = createSiteSchema.parse(req.body);

      const teamId = (req as any).teamId;
      if (!teamId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const site = await SiteService.createSite(teamId, parsed);

      return res.status(201).json(site);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message,
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const parsed = getSitesQuerySchema.parse(req.query) as {
        page: number;
        limit: number;
        search?: string;
        status?: string;
      };
      const teamId = (req as any).teamId;

      const result = await SiteService.getAllSites({
        teamId,
        page: parsed.page,
        limit: parsed.limit,
        search: parsed.search,
        status: parsed.status,
      });

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message,
      });
    }
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const teamId = (req as any).teamId;
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Id is required' });
      }
      const site = await SiteService.getSiteById(teamId, id);

      return res.status(200).json(site);
    } catch (err: any) {
      return res.status(err.message === 'Site not found' ? 404 : 400).json({
        error: err.message,
      });
    }
  },
  async deleteSite(req: Request<{ id: string }>, res: Response) {
    try {
      const teamId = (req as any).teamId;
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Id is required' });
      }
      await SiteService.deleteSite(teamId, id);

      return res.json({ message: 'Site deleted successfully' });
    } catch (err: any) {
      return res.status(err.message === 'Site not found' ? 404 : 400).json({
        error: err.message,
      });
    }
  },
};
>>>>>>> feature/crawl-worker
