import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from '../src/controllers/auth.controller';
import { proxyServiceRequest } from '../src/utils/service-proxy';
import { handleError } from '@packages/shared-utils/error-handler';

vi.mock('../src/utils/service-proxy');
vi.mock('@packages/shared-utils/error-handler');
vi.mock('@packages/shared-validation/auth.schema', () => ({
  signupSchema: { parse: vi.fn() },
  loginSchema: { parse: vi.fn() },
  forgotPasswordSchema: { parse: vi.fn() },
  verifyOTPSchema: { parse: vi.fn() },
  resetPasswordSchema: { parse: vi.fn() },
}));

const mockProxy = proxyServiceRequest as unknown as ReturnType<typeof vi.fn>;
const mockHandleError = handleError as unknown as ReturnType<typeof vi.fn>;

const mockReq = (body = {}, headers = {}) =>
  ({
    body,
    headers,
  }) as any;

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn();
  return res;
};

describe('AuthController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSuccessResponse = {
    status: 200,
    data: { message: 'success' },
    headers: { 'set-cookie': ['cookie'] },
  };

  it('signup success', async () => {
    const { signupSchema } =
      await import('@packages/shared-validation/auth.schema');

    signupSchema.parse = vi.fn().mockReturnValue({ email: 'test@test.com' });

    mockProxy.mockResolvedValue(mockSuccessResponse);

    const req = mockReq({ email: 'test@test.com' });
    const res = mockRes();

    await AuthController.signup(req, res);

    expect(mockProxy).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', ['cookie']);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'success' });
  });

  it('signup error', async () => {
    const { signupSchema } =
      await import('@packages/shared-validation/auth.schema');

    signupSchema.parse = vi.fn().mockImplementation(() => {
      throw new Error('validation error');
    });

    const req = mockReq({});
    const res = mockRes();

    await AuthController.signup(req, res);

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('login success', async () => {
    const { loginSchema } =
      await import('@packages/shared-validation/auth.schema');

    loginSchema.parse = vi.fn().mockReturnValue({});

    mockProxy.mockResolvedValue(mockSuccessResponse);

    const req = mockReq();
    const res = mockRes();

    await AuthController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('login error', async () => {
    const { loginSchema } =
      await import('@packages/shared-validation/auth.schema');

    loginSchema.parse = vi.fn().mockImplementation(() => {
      throw new Error();
    });

    const req = mockReq();
    const res = mockRes();

    await AuthController.login(req, res);

    expect(mockHandleError).toHaveBeenCalledWith(res, expect.any(Error), 401);
  });

  it('refresh success', async () => {
    mockProxy.mockResolvedValue(mockSuccessResponse);

    const req = mockReq();
    const res = mockRes();

    await AuthController.refresh(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('refresh error', async () => {
    mockProxy.mockRejectedValue(new Error());

    const req = mockReq();
    const res = mockRes();

    await AuthController.refresh(req, res);

    expect(mockHandleError).toHaveBeenCalledWith(res, expect.any(Error), 401);
  });

  it('me success', async () => {
    mockProxy.mockResolvedValue(mockSuccessResponse);

    const req = mockReq();
    const res = mockRes();

    await AuthController.me(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('logout success', async () => {
    mockProxy.mockResolvedValue(mockSuccessResponse);

    const req = mockReq();
    const res = mockRes();

    await AuthController.logout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('forgotPassword success', async () => {
    const { forgotPasswordSchema } =
      await import('@packages/shared-validation/auth.schema');

    forgotPasswordSchema.parse = vi.fn().mockReturnValue({});

    mockProxy.mockResolvedValue(mockSuccessResponse);

    const req = mockReq();
    const res = mockRes();

    await AuthController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('verifyOtp success', async () => {
    const { verifyOTPSchema } =
      await import('@packages/shared-validation/auth.schema');

    verifyOTPSchema.parse = vi.fn().mockReturnValue({});

    mockProxy.mockResolvedValue(mockSuccessResponse);

    const req = mockReq();
    const res = mockRes();

    await AuthController.verifyOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('resetPassword success', async () => {
    const { resetPasswordSchema } =
      await import('@packages/shared-validation/auth.schema');

    resetPasswordSchema.parse = vi.fn().mockReturnValue({});

    mockProxy.mockResolvedValue(mockSuccessResponse);

    const req = mockReq();
    const res = mockRes();

    await AuthController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
