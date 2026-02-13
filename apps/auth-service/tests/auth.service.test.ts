import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../src/services/auth.service';
import { User } from '../src/models/user.model';
import { Role } from '../src/models/role.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redis } from '../../../packages/shared-config/redis';

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

vi.mock('../../../packages/shared-config/redis', () => ({
  redis: {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Auth service', () => {
  it('should create user and attach viewer role', async () => {
    (User.findOne as any).mockResolvedValue(null);
    (bcrypt.hash as any).mockResolvedValue('hashed');

    const mockUser = {
      id: '1',
      email: 'test@test.com',
      addRole: vi.fn(),
    };

    (User.create as any).mockResolvedValue(mockUser);
    (Role.findOne as any).mockResolvedValue({ id: 'role1' });

    const result = await AuthService.signup('test@test.com', 'pass');

    expect(mockUser.addRole).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should throw error if user already exists', async () => {
    (User.findOne as any).mockResolvedValue({ id: '1' });

    await expect(AuthService.signup('test@test.com', 'pass')).rejects.toThrow(
      'User already exists',
    );
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

  it('should throw error if password invalid', async () => {
    (User.findOne as any).mockResolvedValue({
      passwordHash: 'hashed',
    });

    (bcrypt.compare as any).mockResolvedValue(false);

    await expect(AuthService.login('test@test.com', 'wrong')).rejects.toThrow(
      'Invalid credentials',
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
});
