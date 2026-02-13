import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (requiredPermission: string) => {
  //Ex router.post("/sites",authenticate,authorize("site:create"),SiteController.create);
  return (req: any, res: any, next: any) => {
    const userPermissions = req.user?.permissions || [];

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};
