import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { signupSchema, loginSchema } from "../../../../packages/shared-validation/auth.schema";
import { AuthRequest } from '../middlewares/auth.middleware';

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const parsed = signupSchema.parse(req.body);
      if(!parsed){
        return res.send(400).json({error: "Email and password is required"});
      }
      const user = await AuthService.signup(parsed.email, parsed.password);

      res.status(201).json({ id: user.id, email: user.email });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.parse(req.body);
      if(!parsed){
        return res.send(400).json({error: "Email and password is required"});
      }
      const result = await AuthService.login(parsed.email, parsed.password);

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  async me(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(400).json({ error: 'userId is required' });
      }
      const user = await AuthService.me(userId);
      return res.json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: 'refreshToken cannot be empty' });
      }
 
      const result = await AuthService.refresh(refreshToken);

      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  },
  async logout(req: Request, res: Response) {
    try {
      console.log("Body",req.body);
      const { userId } = req.body;
      console.log("UserId",userId);
      if (!userId) {
        res.status(400).json({ error: 'userId is required' });
      }

      const response = await AuthService.logout(userId);
      console.log("Response",response);
      if(response!=1){
        res.status(500).json({error: 'Logout Failed'});
      }
      res.status(200).json({message: "User Logged Out Successfully"});
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  },
};
