import { describe, it, expect, vi } from 'vitest';
import { AuthController } from '../src/controllers/auth.controller';
import axios from 'axios';
import { afterEach } from 'node:test';

vi.mock('axios');

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
};

const mockRequest = (body: any = {}) => ({
  body,
});
function mockResponse() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn().mockReturnValue(res);
  return res;
}
afterEach(() => {
  vi.clearAllMocks();
});
describe('Auth Routes', () => {
  it('signup should proxy request to auth-service', async () => {
    const req: any = { body: { email: 'test@test.com', password: '123' } };
    const res = mockResponse();

    mockedAxios.post.mockResolvedValue({
      status: 201,
      data: { id: 1 },
    });

    await AuthController.signup(req, res);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/signup'),
      req.body
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });
  it('login should forward set-cookie header', async () => {
    const req: any = { body: { email: 'a', password: 'b' } };
    const res = mockResponse();

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: { accessToken: 'abc' },
      headers: {
        'set-cookie': ['accessToken=abc; HttpOnly'],
      },
    });

    await AuthController.login(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', [
      'accessToken=abc; HttpOnly',
    ]);

    expect(res.status).toHaveBeenCalledWith(200);
  });
  it('refresh should forward cookies to auth-service', async () => {
    const req: any = {
      headers: { cookie: 'refreshToken=valid' },
    };
    const res = mockResponse();

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: { accessToken: 'new' },
      headers: {},
    });

    await AuthController.refresh(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
  it('me should forward cookies', async () => {
    const req: any = {
      headers: { cookie: 'accessToken=abc' },
    };
    const res = mockResponse();

    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: { id: 1 },
    });

    await AuthController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
  it('should return error if auth-service fails', async () => {
    const req: any = { body: {} };
    const res = mockResponse();

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Unauthorized' },
      },
    });

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });
  it('forgotPassword should forward request', async () => {
    const req: any = { body: { email: 'a@test.com' } };
    const res = mockResponse();

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: { message: 'OTP sent' },
    });

    await AuthController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
  it('logout should forward cookies and set-cookie header', async () => {
    const req: any = {
      headers: { cookie: 'refreshToken=abc' },
    };
    const res = mockResponse();

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: { message: 'Logged out' },
      headers: {
        'set-cookie': ['refreshToken=; Max-Age=0'],
      },
    });

    await AuthController.logout(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', [
      'refreshToken=; Max-Age=0',
    ]);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Logged out' });
  });
  it('logout should handle downstream error', async () => {
    const req: any = { headers: {} };
    const res = mockResponse();

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Unauthorized' },
      },
    });

    await AuthController.logout(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });
  it('resetPassword should proxy request', async () => {
    const req: any = {
      body: {
        email: 'test@test.com',
        otp: '123456',
        newPassword: 'newpass',
      },
    };
    const res = mockResponse();

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: { message: 'Password reset successful' },
    });

    await AuthController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Password reset successful',
    });
  });
  it('resetPassword should handle downstream error', async () => {
    const req: any = { body: {} };
    const res = mockResponse();

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 400,
        data: { error: 'Invalid OTP' },
      },
    });

    await AuthController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid OTP',
    });
  });
  it('forgotPassword should handle error', async () => {
    const req: any = { body: { email: 'a@test.com' } };
    const res = mockResponse();

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 404,
        data: { error: 'User not found' },
      },
    });

    await AuthController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
  });
  it('should return 500 if axios throws without response', async () => {
    const req: any = { body: {} };
    const res = mockResponse();

    mockedAxios.post.mockRejectedValue(new Error('Network error'));

    await AuthController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Signup failed',
    });
  });
  it('refresh should forward cookies and return response', async () => {
    const req: any = {
      headers: {
        cookie: 'refreshToken=abc123',
      },
    };
    const res = mockResponse();

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: { message: 'Token Refreshed' },
      headers: {
        'set-cookie': ['accessToken=newtoken; HttpOnly'],
      },
    });

    await AuthController.refresh(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', [
      'accessToken=newtoken; HttpOnly',
    ]);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token Refreshed',
    });
  });
  it('refresh should handle downstream error', async () => {
    const req: any = { headers: {} };
    const res = mockResponse();

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Unauthorized' },
      },
    });

    await AuthController.refresh(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });

  it('me should handle downstream 401 error', async () => {
    const req: any = { headers: {} };
    const res = mockResponse();

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 401,
        data: { error: 'Unauthorized' },
      },
    });

    await AuthController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });
  it('me should return 500 if axios throws without response', async () => {
    const req: any = { headers: {} };
    const res = mockResponse();

    mockedAxios.get.mockRejectedValue(new Error('Network failure'));

    await AuthController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to fetch user',
    });
  });

  it('forgotPassword should return 500 on network failure', async () => {
    const req: any = {
      body: { email: 'test@test.com' },
    };
    const res = mockResponse();

    mockedAxios.post.mockRejectedValue(new Error('Network failure'));

    await AuthController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Could not send OTP',
    });
  });
  it('forgotPassword should handle downstream error', async () => {
    const req: any = {
      body: { email: 'test@test.com' },
    };
    const res = mockResponse();

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 400,
        data: { error: 'User not found' },
      },
    });

    await AuthController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
  });
  it('verifyOtp should proxy request to auth-service and return response', async () => {
    const req = mockRequest({
      email: 'test@test.com',
      otp: '123456',
    });

    const res = mockResponse();

    mockedAxios.post.mockResolvedValue({
      data: { message: 'Otp verification successful' },
    });

    await AuthController.verifyOtp(req as any, res as any);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/verify-otp'),
      req.body
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Otp verification successful',
    });
  });
  it('verifyOtp should return error from auth-service', async () => {
    const req = mockRequest({
      email: 'test@test.com',
      otp: 'wrongotp',
    });

    const res = mockResponse();

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 400,
        data: { error: 'Invalid credentials' },
      },
    });

    await AuthController.verifyOtp(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid credentials',
    });
  });
  it('verifyOtp should return 500 on unexpected error', async () => {
    const req = mockRequest({
      email: 'test@test.com',
      otp: '123456',
    });

    const res = mockResponse();

    mockedAxios.post.mockRejectedValue(new Error('Network Error'));

    await AuthController.verifyOtp(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'OTP Verification Failed',
    });
  });
});
