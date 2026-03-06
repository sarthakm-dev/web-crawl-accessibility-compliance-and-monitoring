import { Request, Response } from 'express';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOTPSchema,
  resetPasswordSchema,
} from '@packages/shared-validation/auth.schema';
import { handleError } from '@packages/shared-utils/error-handler';
import { proxyServiceRequest } from '../utils/service-proxy';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL!;
export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const body = signupSchema.parse(req.body);
      const response = await proxyServiceRequest(
        req,
        'post',
        `${AUTH_SERVICE_URL}/signup`,
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

  async login(req: Request, res: Response) {
    try {
      const body = loginSchema.parse(req.body);
      const response = await proxyServiceRequest(
        req,
        'post',
        `${AUTH_SERVICE_URL}/login`,
        body
      );
      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
      return res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error, 401);
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const response = await proxyServiceRequest(
        req,
        'post',
        `${AUTH_SERVICE_URL}/refresh`,
        {}
      );
      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
      return res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error, 401);
    }
  },

  async me(req: Request, res: Response) {
    try {
      const response = await proxyServiceRequest(
        req,
        'get',
        `${AUTH_SERVICE_URL}/me`
      );
      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
      return res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error, 401);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const response = await proxyServiceRequest(
        req,
        'post',
        `${AUTH_SERVICE_URL}/logout`
      );
      if (response.headers['set-cookie']) {
        res.setHeader('set-cookie', response.headers['set-cookie']);
      }
      return res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error, 401);
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const body = forgotPasswordSchema.parse(req.body);
      const response = await proxyServiceRequest(
        req,
        'post',
        `${AUTH_SERVICE_URL}/forgot-password`,
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

  async verifyOtp(req: Request, res: Response) {
    try {
      const body = verifyOTPSchema.parse(req.body);
      const response = await proxyServiceRequest(
        req,
        'post',
        `${AUTH_SERVICE_URL}/verify-otp`,
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

  async resetPassword(req: Request, res: Response) {
    try {
      const body = resetPasswordSchema.parse(req.body);
      const response = await proxyServiceRequest(
        req,
        'post',
        `${AUTH_SERVICE_URL}/reset-password`,
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
