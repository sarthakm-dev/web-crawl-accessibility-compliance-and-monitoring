import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { handleError } from '@packages/shared-utils/error-handler';
import { siteQuerySchema } from '@packages/shared-validation/dashboard.schema';

export const DashboardController = {
  async getSummary(req: Request, res: Response) {
    try {
      const { siteId } = siteQuerySchema.parse(req.query);

      const data = await DashboardService.getSummary(siteId);

      return res.json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getTrend(req: Request, res: Response) {
    try {
      const { siteId } = siteQuerySchema.parse(req.query);

      const data = await DashboardService.getAccessibilityTrend(siteId);

      return res.json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getIssuesBreakdown(_req: Request, res: Response) {
    try {
      const data = await DashboardService.getIssuesBreakdown();
      return res.json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getLatestCrawls(_req: Request, res: Response) {
    try {
      const data = await DashboardService.getLatestCrawls();
      return res.json(data);
    } catch (error) {
      handleError(res, error);
    }
  },
};
