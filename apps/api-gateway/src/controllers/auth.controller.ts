import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
  LoginDto,
  SignupDto,
} from "packages/shared-types/auth.types";

export const AuthController = {
  async signup(req: Request, res: Response) {
    try {
      const { email, password } = req.body as SignupDto;
      if(!email || !password){
        return res.send(400).json({error: "email and password is required"});
      }
      const dto: SignupDto = { email, password };

      const result = await AuthService.signup(dto);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({
        error: err.message || "Signup failed",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as LoginDto;
      if(!email || !password){
        return res.send(400).json({error: "email and password is required"});
      }
      const dto: LoginDto = { email, password };

      const result = await AuthService.login(dto);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({
        error: err.message || "Login failed",
      });
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if(!refreshToken){
        return res.send(400).json({error: "refreshToken is required"});
      }
      const result = await AuthService.refresh(refreshToken);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({
        error: err.message || "Refresh failed",
      });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if(!authHeader){
        return res.status(401).json({error: "Unauthorized"});
      }
      
      const result = await AuthService.me(authHeader);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 401).json({
        error: err.message || "Failed to fetch user",
      });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const result = await AuthService.logout(userId);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({
        error: err.message || "Logout failed",
      });
    }
  },
};