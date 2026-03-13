import { type Request } from 'express';
import { type UserType } from './user.types';
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

export interface AuthState {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  clearUser: () => void;
  hasPermission: (permission: string) => boolean;
}

export type Mode = 'login' | 'signup' | 'reset' | 'forgot' | 'otp';
