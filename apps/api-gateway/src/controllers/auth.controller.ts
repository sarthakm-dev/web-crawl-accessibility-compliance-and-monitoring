import { Request, Response } from "express";
import axios from "axios";

const AUTH_SERVICE_URL = "http://localhost:5000/auth";

export const AuthController = {

  async signup(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AUTH_SERVICE_URL}/signup`,
        req.body
      );

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || "Signup failed",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AUTH_SERVICE_URL}/login`,
        req.body
      );

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AUTH_SERVICE_URL}/refresh`,
        req.body
      );

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || "Refresh failed",
      });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const response = await axios.get(
        `${AUTH_SERVICE_URL}/me`,
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || "Failed to fetch user",
      });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const response = await axios.post(
        `${AUTH_SERVICE_URL}/logout`,
        req.body,
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );

      return res.status(response.status).json(response.data);
    } catch (err: any) {
      return res.status(err.response?.status || 500).json({
        error: err.response?.data?.error || "Logout failed",
      });
    }
  },
};