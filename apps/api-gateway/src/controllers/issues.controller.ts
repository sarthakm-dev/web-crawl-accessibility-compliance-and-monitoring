import { Request, Response } from 'express';
import { proxyServiceRequest } from '../utils/service-proxy';

import {
  issuesQuerySchema,
  issueParamsSchema,
  updateIssueStatusSchema,
  addNoteSchema,
} from '@packages/shared-validation/issue.schema';
import { handleError } from '@packages/shared-utils/error-handler';

const CRAWL_MANAGER_URL = process.env.CRAWL_MANAGER_URL!;

export const IssuesController = {
  async getAll(req: Request, res: Response) {
    try {
      const query = issuesQuerySchema.parse(req.query);

      const response = await proxyServiceRequest(
        req,
        'get',
        `${CRAWL_MANAGER_URL}/issues`,
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
      const { id } = issueParamsSchema.parse(req.params);

      const response = await proxyServiceRequest(
        req,
        'get',
        `${CRAWL_MANAGER_URL}/issues/${id}`,
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

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = issueParamsSchema.parse(req.params);
      const body = updateIssueStatusSchema.parse(req.body);

      const response = await proxyServiceRequest(
        req,
        'patch',
        `${CRAWL_MANAGER_URL}/issues/${id}/status`,
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

  async addNote(req: Request, res: Response) {
    try {
      const { id } = issueParamsSchema.parse(req.params);
      const body = addNoteSchema.parse(req.body);

      const response = await proxyServiceRequest(
        req,
        'post',
        `${CRAWL_MANAGER_URL}/issues/${id}/notes`,
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
};
