import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
  signupSchema,
  loginSchema,
} from '@packages/shared-validation/auth.schema';
import { AuthRequest } from '@packages/shared-types/auth.types';

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const parsed = signupSchema.parse(req.body);

      const user = await AuthService.signup(
        parsed.name,
        parsed.email,
        parsed.password
      );

      return res
        .status(201)
        .json({ id: user.id, name: user.name, email: user.email });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.parse(req.body);
      const result = await AuthService.login(parsed.email, parsed.password);
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ message: 'Login successful' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async me(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Cannot find user' });
      }
      const user = await AuthService.me(userId);
      return res.json(user);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({ error: 'refreshToken cannot be empty' });
      }

      const result = await AuthService.refresh(refreshToken);
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
      return res.json({ message: 'Token Refreshed' });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  },

  async logout(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(400).json({ error: 'User not found' });
      }

      await AuthService.logout(userId);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res.status(200).json({ message: 'User Logged Out Successfully' });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  },
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      const result = await AuthService.forgotPassword(email);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'All fields required' });
      }

      const result = await AuthService.resetPassword(email, otp, newPassword);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },
  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: 'All fields required' });
      }

      const result = await AuthService.verifyOtp(email, otp);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },
};
