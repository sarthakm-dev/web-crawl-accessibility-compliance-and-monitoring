import { Request, Response } from 'express';
import { CrawlService } from '../services/crawl.service';
import {
  triggerCrawlSchema,
  getCrawlsQuerySchema,
  crawlParamsSchema,
  bulkDeleteCrawlsSchema,
} from '@packages/shared-validation/crawl.schema';
import { AuthenticatedRequest } from '@packages/shared-types/express';
import { handleError } from '@packages/shared-utils/error-handler';

export const CrawlController = {
  async trigger(req: AuthenticatedRequest, res: Response) {
    try {
      // validate req using zod
      const parsed = triggerCrawlSchema.parse(req.body);
      // handle unauthorized user
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // add service to trigger crawl
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
      // validate req using zod
      const { id } = crawlParamsSchema.parse(req.params);
      // get crawl job by id
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
      // validate req using zod
      const parsedQuery = getCrawlsQuerySchema.parse(req.query);
      // add service to get details of all crawl jobs
      const result = await CrawlService.getAllCrawls(parsedQuery);

      return res.status(200).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },
  async bulkDelete(req: AuthenticatedRequest, res: Response) {
    try {
      // handle unauthorized user
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // add zod validation for req
      const { ids } = bulkDeleteCrawlsSchema.parse(req.body);
      // add service for bulk delete crawl jobs
      await CrawlService.bulkDeleteCrawls(ids);

      return res.status(200).json({
        message: 'Crawl jobs deleted successfully',
      });
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },
};
