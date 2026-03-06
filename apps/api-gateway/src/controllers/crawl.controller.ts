import { Request, Response } from 'express';
import { proxyServiceRequest } from '../utils/service-proxy';

import {
  triggerCrawlSchema,
  getCrawlsQuerySchema,
  crawlParamsSchema,
} from '@packages/shared-validation/crawl.schema';
import { handleError } from '@packages/shared-utils/error-handler';

const CRAWL_MANAGER_URL = process.env.CRAWL_MANAGER_URL!;

export const CrawlController = {
  async startCrawl(req: Request, res: Response) {
    try {
      const body = triggerCrawlSchema.parse(req.body);

      const response = await proxyServiceRequest(
        req,
        'post',
        `${CRAWL_MANAGER_URL}/crawl`,
        body
      );
      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
      return res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const query = getCrawlsQuerySchema.parse(req.query);

      const response = await proxyServiceRequest(
        req,
        'get',
        `${CRAWL_MANAGER_URL}/crawl`,
        undefined,
        query
      );
      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
      return res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = crawlParamsSchema.parse(req.params);

      const response = await proxyServiceRequest(
        req,
        'get',
        `${CRAWL_MANAGER_URL}/crawl/${id}`,
        undefined
      );
      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
      return res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  },
};
