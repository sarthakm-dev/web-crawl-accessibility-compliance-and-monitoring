import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { signupSchema, loginSchema } from "../../../../packages/shared-validation/auth.schema";
import { AuthRequest } from '../../../../packages/shared-types/auth.types';

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const parsed = signupSchema.parse(req.body);
      if(!parsed){
        return res.send(400).json({error: "Valid email and password is required"});
      }
      const user = await AuthService.signup(parsed.email, parsed.password);

      return res.status(201).json({ id: user.id, email: user.email });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.parse(req.body);
      if(!parsed){
        return res.send(400).json({error: "Valid email and password is required"});
      }
      const result = await AuthService.login(parsed.email, parsed.password);

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async me(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Cannot find user' });
      }
      const user = await AuthService.me(userId);
      return res.json(user);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: 'refreshToken cannot be empty' });
      }
 
      const result = await AuthService.refresh(refreshToken);

      return res.json(result);
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
      
      return res.status(200).json({message: "User Logged Out Successfully"});
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  },
};