import { Request, Response } from 'express';
import axios from 'axios';

const CRAWL_MANAGER_URL = process.env.CRAWL_MANAGER_URL;

export const IssuesController = {
  async getAll(req: Request, res: Response) {
    try {
      const response = await axios.get(`${CRAWL_MANAGER_URL}/issues`, {
        params: req.query,
        headers: {
          Cookie: req.headers.cookie || '',
        },
      });

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Failed to fetch issues',
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${CRAWL_MANAGER_URL}/issues/${req.params.id}`,
        {
          headers: {
            Cookie: req.headers.cookie || '',
          },
        }
      );

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Failed to fetch issue',
      });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const response = await axios.patch(
        `${CRAWL_MANAGER_URL}/issues/${req.params.id}/status`,
        req.body,
        {
          headers: {
            Cookie: req.headers.cookie || '',
          },
        }
      );

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Failed to update status',
      });
    }
  },

  async addNote(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${CRAWL_MANAGER_URL}/issues/${req.params.id}/notes`,
        req.body,
        {
          headers: {
            Cookie: req.headers.cookie || '',
          },
        }
      );

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || 'Failed to add note',
      });
    }
  },
};
