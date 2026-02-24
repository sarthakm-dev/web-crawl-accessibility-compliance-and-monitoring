import { Request, Response } from 'express';
import axios from 'axios';

const CRAWL_MANAGER_URL = process.env.CRAWL_MANAGER_URL;

export const CrawlController = {
  async startCrawl(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${CRAWL_MANAGER_URL}/crawl`,
        req.body,
        {
          headers: {
            Cookie: req.headers.cookie || '',
          },
          withCredentials: true,
        }
      );

      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Crawl Creation Failed',
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const response = await axios.get(`${CRAWL_MANAGER_URL}/crawl`, {
        headers: {
          Cookie: req.headers.cookie || '',
        },
        params: req.query,
        withCredentials: true,
      });

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Failed to fetch crawls',
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${CRAWL_MANAGER_URL}/crawl/${req.params.id}`,
        {
          headers: {
            Cookie: req.headers.cookie || '',
          },
          withCredentials: true,
        }
      );

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Failed to fetch crawl',
      });
    }
  },
};
