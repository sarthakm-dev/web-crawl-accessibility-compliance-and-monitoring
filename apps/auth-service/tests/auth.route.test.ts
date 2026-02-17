import request from 'supertest';
import express from 'express';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import router from '../src/routes/auth.routes';
import { AuthService } from '../src/services/auth.service';
import { AuthController } from '../src/controllers/auth.controller';

vi.mock('../src/services/auth.service');
vi.mock('../src/middlewares/auth.middleware', () => ({
  authenticate: (req: any, _res: any, next: any) => {
    req.userId = { userId: 1 };
    next();
  },
}));

const app = express();
app.use(express.json());
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
    expect(res.body.accessToken).toBe('token');
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

    expect(res.status).toBe(401);
  });
  it('should return 401 if userId missing in /me', async () => {
    const req = {
      userId: undefined,
    } as any;

    const res = mockResponse();

    await AuthController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Cannot find user',
    });
  });

  it('POST /refresh should return new access token', async () => {
    (AuthService.refresh as any).mockResolvedValue({
      accessToken: 'new-token',
    });

    const res = await request(app)
      .post('/refresh')
      .send({ refreshToken: 'valid' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBe('new-token');
  });

  it('POST /refresh should enter catch block for malformed body', async () => {
    (AuthService.refresh as any).mockRejectedValueOnce({
      accessToken: 'new-token',
    });

    const res = await request(app)
      .post('/refresh')
      .send({ refreshToken: 'valid' });

    expect(res.status).toBe(401);
  });

  it('should return 400 if refreshToken missing', async () => {
    const req = {
      body: {},
    } as any;

    const res = mockResponse();

    await AuthController.refresh(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
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

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User not found',
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
  
});
