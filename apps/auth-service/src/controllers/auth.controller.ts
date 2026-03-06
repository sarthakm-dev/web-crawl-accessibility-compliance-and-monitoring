import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} from '@packages/shared-validation/auth.schema';
import { AuthRequest } from '@packages/shared-types/auth.types';
import {
  accessCookieOptions,
  refreshCookieOptions,
} from '@packages/shared-config/cookie';
import { handleError } from '@packages/shared-utils/error-handler';

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const parsed = signupSchema.parse(req.body);

      const user = await AuthService.signup(
        parsed.name,
        parsed.email,
        parsed.password
      );

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.parse(req.body);

      const result = await AuthService.login(parsed.email, parsed.password);

      res.cookie('accessToken', result.accessToken, accessCookieOptions);
      res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);

      return res.status(200).json({ message: 'Login successful' });
    } catch (error: unknown) {
      return handleError(res, error, 401);
    }
  },

  async me(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await AuthService.me(req.userId);

      return res.status(200).json({
        ...user,
        teamId: req.teamId,
        roles: req.roles,
        permissions: req.permissions,
      });
    } catch (error: unknown) {
      return handleError(res, error, 401);
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token missing' });
      }

      const result = await AuthService.refresh(refreshToken);

      res.cookie('accessToken', result.accessToken, accessCookieOptions);

      return res.status(200).json({ message: 'Token refreshed' });
    } catch (error: unknown) {
      return handleError(res, error, 401);
    }
  },

  async logout(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await AuthService.logout(req.userId);

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error: unknown) {
      return handleError(res, error, 401);
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const parsed = forgotPasswordSchema.parse(req.body);

      const result = await AuthService.forgotPassword(parsed.email);

      return res.status(200).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const parsed = resetPasswordSchema.parse(req.body);

      const result = await AuthService.resetPassword(
        parsed.email,
        parsed.otp,
        parsed.newPassword
      );

      return res.status(200).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },

  async verifyOtp(req: Request, res: Response) {
    try {
      const parsed = verifyOTPSchema.parse(req.body);

      const result = await AuthService.verifyOtp(parsed.email, parsed.otp);

      return res.status(200).json(result);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  },
  async forgotPassword(req: Request, res: Response) {
    try {
      const parsed = forgotPasswordSchema.parse(req.body);

      const result = await AuthService.forgotPassword(parsed.email);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const parsed = resetPasswordSchema.parse(req.body);

      const result = await AuthService.resetPassword(
        parsed.email,
        parsed.otp,
        parsed.newPassword
      );
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },
  async verifyOtp(req: Request, res: Response) {
    try {
      const parsed = verifyOTPSchema.parse(req.body);
      const result = await AuthService.verifyOtp(parsed.email, parsed.otp);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },
};
