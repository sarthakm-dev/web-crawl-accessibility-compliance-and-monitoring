import { AuthClient } from "../clients/auth.client";
import { LoginDto, LogoutDto, RefreshDto, SignupDto } from "packages/shared-types/auth.types";

export const AuthService = {
  async signup(dto: SignupDto) {
    const response = await AuthClient.signup(dto);
    return response.data;
  },

  async login(dto: LoginDto) {
    const response = await AuthClient.login(dto);
    return response.data;
  },

  async refresh(dto: RefreshDto) {
    const response = await AuthClient.refresh(dto);
    return response.data;
  },

  async me(authHeader: string) {
    const response = await AuthClient.me(authHeader.replace("Bearer ",""));
    return response.data;
  },

  async logout(userId: LogoutDto) {
    const response = await AuthClient.logout(userId);
    return response.data;
  },
};