import { Request, Response } from 'express';
import axios from 'axios';

const CRAWL_MANAGER_URL = process.env.CRAWL_MANAGER_URL;
export const SiteController = {
  async createSite(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${CRAWL_MANAGER_URL}/sites`,
        req.body,
        {
          headers: {
            Cookie: req.headers.cookie || '',
          },
        }
      );
      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
      return res.status(200).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Site Creation Failed',
      });
    }
  },
};
