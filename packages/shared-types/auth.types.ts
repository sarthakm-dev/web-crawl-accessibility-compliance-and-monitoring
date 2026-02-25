import { type Request } from 'express';
export interface SignupDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface LogoutDto {
  userId: string;
}

export interface AuthRequest extends Request {
  userId?: string;
  teamId?: string;
  roles?: string[];
  permissions?: string[];
}

export type Mode = 'login' | 'signup' | 'reset' | 'forgot' | 'otp';
