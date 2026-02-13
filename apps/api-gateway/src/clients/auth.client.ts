import axios from "axios";
import { LoginDto, LogoutDto, RefreshDto, SignupDto } from "../../../../packages/shared-types/auth.types";

const authApi = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL || "http://localhost:5000",
});

export const AuthClient = {
  signup: (data: SignupDto) =>
    authApi.post("/auth/signup", data),

  login: (data: LoginDto) =>
    authApi.post("/auth/login", data),

  refresh: (refreshToken: RefreshDto) =>
    authApi.post("/auth/refresh", {refreshToken}),

  me: (accessToken: string) =>
    authApi.get("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  logout: (userId: LogoutDto) =>
    authApi.post("/auth/logout", {userId}),
};