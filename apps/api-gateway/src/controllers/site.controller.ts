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
          withCredentials: true,
        }
      );

      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Site Creation Failed',
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const response = await axios.get(`${CRAWL_MANAGER_URL}/sites`, {
        headers: {
          Cookie: req.headers.cookie || '',
        },
        params: req.query,
        withCredentials: true,
      });

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Failed to fetch sites',
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${CRAWL_MANAGER_URL}/sites/${req.params.id}`,
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
        error: err.response?.data?.error || 'Failed to fetch site',
      });
    }
  },
  async deleteSite(req: Request, res: Response) {
    try {
      const response = await axios.delete(
        `${CRAWL_MANAGER_URL}/sites/${req.params.id}`,
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
        error: err.response?.data?.error || err.message,
      });
    }
  },
};
