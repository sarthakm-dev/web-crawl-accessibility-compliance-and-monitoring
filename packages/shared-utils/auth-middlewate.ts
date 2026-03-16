import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@packages/shared-config/env';
import { AuthRequest } from '@packages/shared-types/auth.types';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  // unauthorized if access token not found
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    // verify jwt secret
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as {
      userId: string;
      teamId: string;
      roles: string[];
      permissions: string[];
    };
    req.userId = decoded.userId;
    req.teamId = decoded.teamId;
    req.roles = decoded.roles;
    req.permissions = decoded.permissions;

    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
