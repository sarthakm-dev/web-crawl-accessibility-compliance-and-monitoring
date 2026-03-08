import { Response } from 'express';
import { SiteService } from '../services/site.service';
import {
  bulkDeleteSitesSchema,
  createSiteSchema,
  getSitesQuerySchema,
  siteParamsSchema,
} from '@packages/shared-validation/site.schema';
import { AuthenticatedRequest } from '@packages/shared-types/express';
import { handleError } from '@packages/shared-utils/error-handler';

export const SiteController = {
  async createSite(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.teamId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const body = createSiteSchema.parse(req.body);

      const site = await SiteService.createSite(req.teamId, body);

      return res.status(201).json(site);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.teamId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const query = getSitesQuerySchema.parse(req.query);

      const result = await SiteService.getAllSites({
        teamId: req.teamId,
        ...query,
      });

      return res.status(200).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async getById(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      if (!req.teamId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = siteParamsSchema.parse(req.params);

      const site = await SiteService.getSiteById(req.teamId, id);

      return res.status(200).json(site);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async deleteSite(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    try {
      if (!req.teamId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = siteParamsSchema.parse(req.params);

      await SiteService.deleteSite(req.teamId, id);

      return res.status(200).json({
        message: 'Site deleted successfully',
      });
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },
  async bulkDeleteSites(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.teamId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { ids } = bulkDeleteSitesSchema.parse(req.body);

      await SiteService.bulkDeleteSites(req.teamId, ids);

      return res.status(200).json({
        message: 'Sites deleted successfully',
      });
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },
};
