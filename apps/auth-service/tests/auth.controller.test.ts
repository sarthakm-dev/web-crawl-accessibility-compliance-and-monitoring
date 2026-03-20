import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from '../src/controllers/auth.controller';
import { AuthService } from '../src/services/auth.service';
import { handleError } from '@packages/shared-utils/error-handler';

vi.mock('../../src/services/auth.service');
vi.mock('@packages/shared-utils/error-handler');

const mockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signup success', async () => {
    const req: any = {
      body: { name: 'Test', email: 'test@test.com', password: '123456' },
    };

    const res = mockResponse();

    vi.spyOn(AuthService, 'signup').mockResolvedValue({
      id: 1,
      name: 'Test',
      email: 'test@test.com',
    } as any);

    await AuthController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('signup error', async () => {
    const req: any = { body: {} };
    const res = mockResponse();

    (handleError as any).mockImplementation(() => res.status(400));

    await AuthController.signup(req, res);

    expect(handleError).toHaveBeenCalled();
  });

  it('login success', async () => {
    const req: any = {
      body: { email: 'test@test.com', password: '123456' },
    };

    const res = mockResponse();

    vi.spyOn(AuthService, 'login').mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
    } as any);

    await AuthController.login(req, res);

    expect(res.cookie).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('login error', async () => {
    const req: any = { body: {} };
    const res = mockResponse();

    (handleError as any).mockImplementation(() => res.status(401));

    await AuthController.login(req, res);

    expect(handleError).toHaveBeenCalled();
  });

  it('me success', async () => {
    const req: any = {
      userId: 1,
      teamId: 2,
      roles: ['admin'],
      permissions: ['read'],
    };

    const res = mockResponse();

    vi.spyOn(AuthService, 'me').mockResolvedValue({
      id: 1,
      email: 'test@test.com',
    } as any);

    await AuthController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('me unauthorized', async () => {
    const req: any = {};
    const res = mockResponse();

    await AuthController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('refresh success', async () => {
    const req: any = { cookies: { refreshToken: 'token' } };
    const res = mockResponse();

    vi.spyOn(AuthService, 'refresh').mockResolvedValue({
      accessToken: 'newToken',
    } as any);

    await AuthController.refresh(req, res);

    expect(res.cookie).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('refresh missing token', async () => {
    const req: any = { cookies: {} };
    const res = mockResponse();

    await AuthController.refresh(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('logout success', async () => {
    const req: any = { userId: 1 };
    const res = mockResponse();

    vi.spyOn(AuthService, 'logout').mockResolvedValue(true as any);

    await AuthController.logout(req, res);

    expect(res.clearCookie).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('logout unauthorized', async () => {
    const req: any = {};
    const res = mockResponse();

    await AuthController.logout(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('forgotPassword success', async () => {
    const req: any = { body: { email: 'test@test.com' } };
    const res = mockResponse();

    vi.spyOn(AuthService, 'forgotPassword').mockResolvedValue({
      message: 'OTP sent',
    } as any);

    await AuthController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('resetPassword success', async () => {
    const req: any = {
      body: {
        email: 'test@test.com',
        otp: '1234',
        newPassword: 'newpass',
      },
    };

    const res = mockResponse();

    vi.spyOn(AuthService, 'resetPassword').mockResolvedValue({
      message: 'Password reset',
    } as any);

    await AuthController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('verifyOtp success', async () => {
    const req: any = { body: { email: 'test@test.com', otp: '1234' } };
    const res = mockResponse();

    vi.spyOn(AuthService, 'verifyOtp').mockResolvedValue({
      verified: true,
    } as any);

    await AuthController.verifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
