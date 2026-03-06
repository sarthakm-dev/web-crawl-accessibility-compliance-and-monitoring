import { Request, Response } from 'express';
import { CrawlService } from '../services/crawl.service';
import {
  triggerCrawlSchema,
  getCrawlsQuerySchema,
  crawlParamsSchema,
} from '@packages/shared-validation/crawl.schema';
import { AuthenticatedRequest } from '@packages/shared-types/express';
import { handleError } from '@packages/shared-utils/error-handler';

export const CrawlController = {
  async trigger(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = triggerCrawlSchema.parse(req.body);

      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await CrawlService.triggerCrawl(
        parsed.siteId,
        req.userId,
        parsed.triggerType
      );

      return res.status(201).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = crawlParamsSchema.parse(req.params);

      const result = await CrawlService.getCrawlById(id);

      return res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Crawl job not found') {
        return res.status(404).json({ error: error.message });
      }

      return handleError(res, error);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const parsedQuery = getCrawlsQuerySchema.parse(req.query);

      const result = await CrawlService.getAllCrawls(parsedQuery);

      return res.status(200).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },
};
