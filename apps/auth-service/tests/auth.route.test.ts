import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import router from '../src/routes/auth.routes';
import { AuthService } from '../src/services/auth.service';
import { AuthController } from '../src/controllers/auth.controller';
import cookieParser = require('cookie-parser');
vi.mock('../src/services/auth.service');
vi.mock('../src/middlewares/auth.middleware', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.userId = { userId: 1 };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/', router);
function mockResponse() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /signup should return user', async () => {
    (AuthService.signup as any).mockResolvedValue({
      id: '1',
      name: 'Sarthak Mishra',
      email: 'test@test.com',
    });

    const res = await request(app).post('/signup').send({
      name: 'Sarthak Mishra',
      email: 'test@test.com',
      password: 'password12345',
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('test@test.com');
  });

  it('POST /signup should give error with invalid email', async () => {
    (AuthService.signup as any).mockResolvedValue({
      id: '1',
      name: 'Sarthak Mishra',
      email: 'test.com',
    });

    const res = await request(app)
      .post('/signup')
      .send({ email: 'test.com', password: 'password12345' });

    expect(res.status).toBe(400);
  });

  it('POST /login should return tokens', async () => {
    (AuthService.login as any).mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh',
    });

    const res = await request(app)
      .post('/login')
      .send({ email: 'test@test.com', password: 'password1234' });

    expect(res.status).toBe(200);
  });

  it('POST /login should return error for malformed body', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'bad.com', password: 'password1234' });

    expect(res.status).toBe(400);
  });

  it('GET /me should return user when authenticated', async () => {
    (AuthService.me as any).mockResolvedValue({
      id: 1,
      email: 'test@test.com',
    });

    const res = await request(app).get('/me');

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('test@test.com');
  });

  it('GET /me should return error when not authenticated', async () => {
    (AuthService.me as any).mockRejectedValueOnce({
      id: 1,
      email: 'test.com',
    });

    const res = await request(app).get('/me');

    expect(res.status).toBe(500);
  });
  it('should return 401 if userId missing in /me', async () => {
    const req = {
      userId: undefined,
    } as any;

    const res = mockResponse();

    await AuthController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
    });
  });

  it('POST /refresh should return new access token', async () => {
    (AuthService.refresh as any).mockResolvedValue({
      accessToken: 'new-token',
    });

    const res = await request(app)
      .post('/refresh')
      .set('Cookie', ['refreshToken=valid']);

    expect(res.status).toBe(200);
  });

  it('POST /refresh should enter catch block for malformed body', async () => {
    (AuthService.refresh as any).mockRejectedValueOnce({
      accessToken: 'new-token',
    });

    const res = await request(app)
      .post('/refresh')
      .set('Cookie', 'refreshToken=valid');

    expect(res.status).toBe(500);
  });

  it('should return 400 if refreshToken missing', async () => {
    const res = await request(app).post('/refresh');

    expect(res.status).toBe(401);
  });

  it('POST /logout should call logout', async () => {
    const res = await request(app).post('/logout').send({ userId: 1 });

    expect(res.status).toBe(200);
  });

  it('should return 400 if userId missing in logout', async () => {
    const req = {
      userId: undefined,
    } as any;

    const res = mockResponse();

    await AuthController.logout(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User not authenticated',
    });
  });

  it('should return 401 if logout throws error', async () => {
    vi.spyOn(AuthService, 'logout').mockRejectedValue(
      new Error('Something went wrong')
    );
    const req = {
      userId: 'test-user-id',
    } as any;

    const res = mockResponse();

    await AuthController.logout(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Something went wrong',
    });
  });

  it('POST /forgot-password should return success message', async () => {
    (AuthService.forgotPassword as any).mockResolvedValue({
      message: 'OTP sent',
    });

    const res = await request(app)
      .post('/forgot-password')
      .send({ email: 'test@test.com' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'OTP sent' });
  });

  it('POST /forgot-password should return 400 if email missing', async () => {
    const res = await request(app).post('/forgot-password').send({});

    expect(res.status).toBe(400);
  });

  it('POST /forgot-password should return 400 if service throws', async () => {
    (AuthService.forgotPassword as any).mockRejectedValue(
      new Error('User not found')
    );

    const res = await request(app)
      .post('/forgot-password')
      .send({ email: 'test@test.com' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'User not found' });
  });

  it('POST /reset-password should reset password', async () => {
    (AuthService.resetPassword as any).mockResolvedValue({
      message: 'Password reset successful',
    });

    const res = await request(app).post('/reset-password').send({
      email: 'test@test.com',
      otp: '123456',
      newPassword: 'newpass123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Password reset successful',
    });
  });

  it('POST /reset-password should return 400 if fields missing', async () => {
    const res = await request(app).post('/reset-password').send({
      email: 'test@test.com',
    });

    expect(res.status).toBe(400);
  });

  it('POST /reset-password should return 400 if service throws', async () => {
    (AuthService.resetPassword as any).mockRejectedValue(
      new Error('Invalid OTP')
    );

    const res = await request(app).post('/reset-password').send({
      email: 'test@test.com',
      otp: 'wrong',
      newPassword: 'newpass123',
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Invalid OTP',
    });
  });
  it('POST /verify-otp should verify otp successfully', async () => {
    const mockResult = { message: 'Otp verification successful' };

    vi.spyOn(AuthService, 'verifyOtp').mockResolvedValue(mockResult);

    const req = {
      body: {
        email: 'test@test.com',
        otp: '123456',
      },
    } as any;

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as any;

    await AuthController.verifyOtp(req, res);

    expect(AuthService.verifyOtp).toHaveBeenCalledWith(
      'test@test.com',
      '123456'
    );

    expect(res.json).toHaveBeenCalledWith(mockResult);
  });
  it('POST /verify-otp should return 400 if fields missing', async () => {
    const req = {
      body: {},
    } as any;

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as any;

    await AuthController.verifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });
  it('POST /verify-otp should return 400 if service throws', async () => {
    vi.spyOn(AuthService, 'verifyOtp').mockRejectedValue(
      new Error('Invalid credentials')
    );

    const req = {
      body: {
        email: 'test@test.com',
        otp: '000000',
      },
    } as any;

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as any;

    await AuthController.verifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid credentials',
    });
  });
});
