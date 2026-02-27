import { Request, Response } from 'express';
import { CrawlService } from '../services/crawl.service';
import {
  triggerCrawlSchema,
  getCrawlsQuerySchema,
} from '@packages/shared-validation/crawl.schema';

export const CrawlController = {
  async trigger(req: Request, res: Response) {
    try {
      const parsed = triggerCrawlSchema.parse(req.body);

      const userId = (req as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await CrawlService.triggerCrawl(
        parsed.siteId,
        userId,
        parsed.triggerType
      );

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Id is required' });
      }
      const result = await CrawlService.getCrawlById(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res
        .status(error.message === 'Crawl job not found' ? 404 : 400)
        .json({ message: error.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const parsed = getCrawlsQuerySchema.parse(req.query);

      const result = await CrawlService.getAllCrawls(parsed);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
};
