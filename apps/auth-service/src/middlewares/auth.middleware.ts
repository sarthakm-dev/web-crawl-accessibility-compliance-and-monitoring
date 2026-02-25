import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '@packages/shared-types/auth.types';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
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
