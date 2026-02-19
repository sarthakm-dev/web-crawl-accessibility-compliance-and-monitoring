import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../src/services/auth.service';
import { User } from '../src/models/user.model';
import { Role } from '../src/models/role.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redis } from '@packages/shared-config/redis';
import { sendOTP } from '../src/utils/mailer';
vi.mock('../src/models/user.model', () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
  },
}));

vi.mock('../src/models/role.model', () => ({
  Role: {
    findOne: vi.fn(),
  },
}));

vi.mock('../src/models/permission.model', () => ({
  Permission: {},
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

vi.mock('@packages/shared-config/redis', () => ({
  redis: {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  },
}));
vi.mock('../src/utils/mailer');
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Auth service', () => {
  it('should create user and attach viewer role', async () => {
    (User.findOne as any).mockResolvedValue(null);
    (bcrypt.hash as any).mockResolvedValue('hashed');

    const mockUser = {
      id: '1',
      name: 'Sarthak',
      email: 'test@test.com',
      addRole: vi.fn(),
    };

    (User.create as any).mockResolvedValue(mockUser);
    (Role.findOne as any).mockResolvedValue({ id: 'role1' });

    const result = await AuthService.signup('Sarthak', 'test@test.com', 'pass');

    expect(mockUser.addRole).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should throw error if user already exists', async () => {
    (User.findOne as any).mockResolvedValue({ id: '1' });

    await expect(
      AuthService.signup('Sarthak', 'test@test.com', 'pass')
    ).rejects.toThrow('User already exists');
  });

  it('should return tokens if credentials valid', async () => {
    const mockUser = {
      id: '1',
      passwordHash: 'hashed',
      Roles: [],
    };

    (User.findOne as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(true);
    (jwt.sign as any).mockReturnValue('token');

    const result = await AuthService.login('test@test.com', 'pass');

    expect(result).toEqual({
      accessToken: 'token',
      refreshToken: 'token',
    });
  });
  it('login should include roles and permissions in token', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      passwordHash: 'hashed',
      Roles: [
        {
          name: 'admin',
          Permissions: [{ name: 'create_user' }, { name: 'delete_user' }],
        },
      ],
    };

    (User.findOne as any).mockResolvedValue(mockUser);
    (bcrypt.compare as any).mockResolvedValue(true);
    (jwt.sign as any).mockReturnValue('token');
    (redis.set as any).mockResolvedValue('OK');

    const result = await AuthService.login('test@test.com', 'password');

    expect(result.accessToken).toBe('token');
    expect(result.refreshToken).toBe('token');
  });

  it('refresh should return new access token with roles and permissions', async () => {
    const payload = { userId: 1 };

    (jwt.verify as any).mockReturnValue(payload);
    (redis.get as any).mockResolvedValue('valid-refresh');

    const mockUser = {
      id: 1,
      Roles: [
        {
          name: 'editor',
          Permissions: [{ name: 'update_post' }],
        },
      ],
    };

    (User.findByPk as any).mockResolvedValue(mockUser);
    (jwt.sign as any).mockReturnValue('new-access-token');

    const result = await AuthService.refresh('valid-refresh');

    expect(result.accessToken).toBe('new-access-token');
  });
  it('should throw error if user not found on login', async () => {
    (User.findOne as any).mockResolvedValue(null);

    await expect(AuthService.login('test@test.com', 'pass')).rejects.toThrow(
      'Invalid credentials'
    );
  });

  it('should throw error if password invalid', async () => {
    (User.findOne as any).mockResolvedValue({
      passwordHash: 'hashed',
    });

    (bcrypt.compare as any).mockResolvedValue(false);

    await expect(AuthService.login('test@test.com', 'wrong')).rejects.toThrow(
      'Invalid credentials'
    );
  });

  it('should throw Unauthorized if refresh token invalid', async () => {
    (jwt.verify as any).mockReturnValue({ userId: '1' });

    (redis.get as any).mockResolvedValue('different-token');

    await expect(AuthService.refresh('valid-refresh-token')).rejects.toThrow(
      'Unauthorized'
    );
  });

  it('should throw Unauthorized if user not found in refresh', async () => {
    (jwt.verify as any).mockReturnValue({ userId: '1' });
    (redis.get as any).mockResolvedValue('valid-refresh-token');
    (User.findByPk as any).mockResolvedValue(null);

    await expect(AuthService.refresh('valid-refresh-token')).rejects.toThrow(
      'Unauthorized'
    );
  });

  it('should return new access token', async () => {
    (jwt.verify as any).mockReturnValue({ userId: '1' });

    (redis.get as any).mockResolvedValue('valid-refresh-token');

    const mockUser = {
      id: '1',
      Roles: [],
    };

    (User.findByPk as any).mockResolvedValue(mockUser);

    (jwt.sign as any).mockReturnValue('new-access-token');

    const result = await AuthService.refresh('valid-refresh-token');

    expect(result).toEqual({
      accessToken: 'new-access-token',
    });
  });

  it('should delete refresh token on logout', async () => {
    (redis.del as any).mockResolvedValue(1);

    const result = await AuthService.logout('1');

    expect(redis.del).toHaveBeenCalledWith('refresh:1');
    expect(result).toBe(true);
  });

  it('should return user profile', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      name: 'Sarthak',
      isActive: true,
      created_at: new Date(),
      Roles: [{ id: 'r1', name: 'viewer' }],
    };

    (User.findByPk as any).mockResolvedValue(mockUser);

    const result = await AuthService.me('1');

    expect(result).toEqual(mockUser);
  });
  it('should throw error if user not found in me()', async () => {
    (User.findByPk as any).mockResolvedValue(null);

    await expect(AuthService.me('1')).rejects.toThrow('Cannot find user');
  });
  it('forgotPassword should generate OTP and send email', async () => {
    (User.findOne as any).mockResolvedValue({ id: 1, email: 'test@test.com' });
    (redis.set as any).mockResolvedValue('OK');
    (sendOTP as any).mockResolvedValue(undefined);

    const result = await AuthService.forgotPassword('test@test.com');

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });

    expect(redis.set).toHaveBeenCalled();
    expect(sendOTP).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      message: 'OTP sent to email',
    });
  });
  it('forgotPassword should throw if user not found', async () => {
    (User.findOne as any).mockResolvedValue(null);

    await expect(AuthService.forgotPassword('wrong@test.com')).rejects.toThrow(
      'User not found'
    );
  });
  it('resetPassword should update password and delete otp', async () => {
    const mockUser = {
      passwordHash: '',
      save: vi.fn().mockResolvedValue(true),
    };

    (redis.get as any).mockResolvedValue('123456');
    (User.findOne as any).mockResolvedValue(mockUser);
    (bcrypt.hash as any).mockResolvedValue('hashedPassword');
    (redis.del as any).mockResolvedValue(1);

    const result = await AuthService.resetPassword(
      'test@test.com',
      '123456',
      'newpass'
    );

    expect(redis.get).toHaveBeenCalledWith('reset:test@test.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
    expect(mockUser.save).toHaveBeenCalled();
    expect(redis.del).toHaveBeenCalledWith('reset:test@test.com');

    expect(result).toEqual({
      message: 'Password reset successful',
    });
  });
  it('resetPassword should throw if otp invalid', async () => {
    (redis.get as any).mockResolvedValue('654321');

    await expect(
      AuthService.resetPassword('test@test.com', 'wrong', 'newpass')
    ).rejects.toThrow('Invalid or expired OTP');
  });
  it('resetPassword should throw if otp expired', async () => {
    (redis.get as any).mockResolvedValue(null);

    await expect(
      AuthService.resetPassword('test@test.com', '123456', 'newpass')
    ).rejects.toThrow('Invalid or expired OTP');
  });
  it('resetPassword should throw if user not found', async () => {
    (redis.get as any).mockResolvedValue('123456');
    (User.findOne as any).mockResolvedValue(null);

    await expect(
      AuthService.resetPassword('test@test.com', '123456', 'newpass')
    ).rejects.toThrow('User not found');
  });
});
