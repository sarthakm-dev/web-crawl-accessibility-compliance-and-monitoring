import { Request, Response } from 'express';
import { proxyServiceRequest } from '../utils/service-proxy';

import {
  createSiteSchema,
  getSitesQuerySchema,
  siteParamsSchema,
} from '@packages/shared-validation/site.schema';
import { handleError } from '@packages/shared-utils/error-handler';

const CRAWL_MANAGER_URL = process.env.CRAWL_MANAGER_URL!;

export const SiteController = {
  async createSite(req: Request, res: Response) {
    try {
      const body = createSiteSchema.parse(req.body);

      const response = await proxyServiceRequest(
        req,
        'post',
        `${CRAWL_MANAGER_URL}/sites`,
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
      const query = getSitesQuerySchema.parse(req.query);

      const response = await proxyServiceRequest(
        req,
        'get',
        `${CRAWL_MANAGER_URL}/sites`,
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
      const { id } = siteParamsSchema.parse(req.params);

      const response = await proxyServiceRequest(
        req,
        'get',
        `${CRAWL_MANAGER_URL}/sites/${id}`,
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

  async deleteSite(req: Request, res: Response) {
    try {
      const { id } = siteParamsSchema.parse(req.params);

      const response = await proxyServiceRequest(
        req,
        'delete',
        `${CRAWL_MANAGER_URL}/sites/${id}`,
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
