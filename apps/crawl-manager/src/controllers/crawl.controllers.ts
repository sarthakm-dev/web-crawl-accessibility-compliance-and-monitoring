import { Request, Response } from 'express';
import { CrawlService } from '../services/crawl.service';

export const CrawlController = {
  async trigger(req: Request, res: Response) {
    try {
      const { siteId, triggerType } = req.body;
      if (!siteId || !triggerType) {
        return res
          .status(400)
          .json({ message: 'siteId and triggerType is required' });
      }
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res
          .status(401)
          .json({ message: 'Unauthorized, user not found' });
      }
      const result = await CrawlService.triggerCrawl(
        siteId,
        userId,
        triggerType
      );

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
