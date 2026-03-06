import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../src/services/auth.service';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { redis } from '@packages/shared-config/redis';
import { sendOTP } from '../src/utils/mailer';

import { UserRepository } from '../src/repositories/user.repository';
import { TeamRepository } from '../src/repositories/team.repository';
import { RoleRepository } from '../src/repositories/role.repository';

vi.mock('bcryptjs');
vi.mock('jsonwebtoken');
vi.mock('@packages/shared-config/redis');
vi.mock('../src/utils/mailer');
vi.mock('../src/repositories/user.repository');
vi.mock('../src/repositories/team.repository');
vi.mock('../src/repositories/role.repository');

const mockUserRepo = vi.mocked(UserRepository);
const mockTeamRepo = vi.mocked(TeamRepository);
const mockRoleRepo = vi.mocked(RoleRepository);

const mockRedis = vi.mocked(redis);
const mockBcrypt = vi.mocked(bcrypt);
const mockJwt = vi.mocked(jwt);

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fail if user exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({} as any);

    await expect(AuthService.signup('a', 'b', 'c')).rejects.toThrow(
      'User already exists'
    );
  });

  it('should signup successfully with role', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    mockBcrypt.hash.mockResolvedValue('hash' as never);

    const user = { id: '1' } as any;

    mockUserRepo.create.mockResolvedValue(user);

    mockTeamRepo.findOrCreateDefault.mockResolvedValue([
      { id: 'team1' },
    ] as any);

    mockRoleRepo.findByName.mockResolvedValue({ id: 'viewer' } as any);

    await AuthService.signup('name', 'email', 'password');

    expect(mockUserRepo.addTeam).toHaveBeenCalled();
    expect(mockUserRepo.addRole).toHaveBeenCalled();
  });
  it('login should include roles and permissions in token', async () => {
    const mockUser = {
      id: '1',
      passwordHash: 'hashed',
      Roles: [],
      Teams: [
        {
          id: 'team-1',
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
      id: '1',
      passwordHash: 'hashed',
      Roles: [],
      Teams: [
        {
          id: 'team-1',
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

  it('should signup successfully without role', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    mockBcrypt.hash.mockResolvedValue('hash' as never);

    const user = { id: '1' } as any;

    mockUserRepo.create.mockResolvedValue(user);

    mockTeamRepo.findOrCreateDefault.mockResolvedValue([
      { id: 'team1' },
    ] as any);

    mockRoleRepo.findByName.mockResolvedValue(null);

    await AuthService.signup('name', 'email', 'password');

    expect(mockUserRepo.addRole).not.toHaveBeenCalled();
  });

  it('should fail if user not found', async () => {
    mockUserRepo.findByEmailWithRelations.mockResolvedValue(null);

    await expect(AuthService.login('email', 'password')).rejects.toThrow(
      'Invalid credentials'
    );
  });

  it('should fail if password incorrect', async () => {
    mockUserRepo.findByEmailWithRelations.mockResolvedValue({
      passwordHash: 'hash',
    } as any);

    mockBcrypt.compare.mockResolvedValue(false as never);

    await expect(AuthService.login('email', 'password')).rejects.toThrow(
      'Invalid credentials'
    );
  });

  it('should fail if user has no teams', async () => {
    mockUserRepo.findByEmailWithRelations.mockResolvedValue({
      passwordHash: 'hash',
      Teams: [],
    } as any);

    mockBcrypt.compare.mockResolvedValue(true as never);

    await expect(AuthService.login('email', 'password')).rejects.toThrow(
      'User is not assigned to any team'
    );
  });

  it('should login successfully', async () => {
    mockUserRepo.findByEmailWithRelations.mockResolvedValue({
      id: '1',
      passwordHash: 'hash',
      Teams: [{ id: 'team1' }],
      Roles: [
        {
          name: 'viewer',
          Permissions: [{ name: 'read' }],
        },
      ],
    } as any);

    mockBcrypt.compare.mockResolvedValue(true as never);

    mockJwt.sign.mockReturnValue('token' as never);

    mockRedis.set.mockResolvedValue('OK' as never);

    const result = await AuthService.login('email', 'password');

    expect(result.accessToken).toBe('token');
    expect(result.refreshToken).toBe('token');
  });

  it('should fail if token invalid', async () => {
    mockJwt.verify.mockImplementation(() => {
      throw new Error();
    });

    await expect(AuthService.refresh('token')).rejects.toThrow('Unauthorized');
  });

  it('should fail if redis mismatch', async () => {
    mockJwt.verify.mockReturnValue({ userId: '1' } as any);

    mockRedis.get.mockResolvedValue('wrong');

    await expect(AuthService.refresh('token')).rejects.toThrow('Unauthorized');
  });

  it('should refresh token successfully', async () => {
    mockJwt.verify.mockReturnValue({ userId: '1' } as any);

    mockRedis.get.mockResolvedValue('token');

    mockUserRepo.findByIdWithRelations.mockResolvedValue({
      id: '1',
      Teams: [{ id: 'team1' }],
      Roles: [],
    } as any);

    mockJwt.sign.mockReturnValue('newAccess' as never);

    const result = await AuthService.refresh('token');

    expect(result.accessToken).toBe('newAccess');
  });

  it('should fail logout if redis delete fails', async () => {
    mockRedis.del.mockResolvedValue(0);

    await expect(AuthService.logout('1')).rejects.toThrow('Cannot Logout User');
  });

  it('should logout successfully', async () => {
    mockRedis.del.mockResolvedValue(1);

    const result = await AuthService.logout('1');

    expect(result).toBe(true);
  });

  it('should fail forgot password if user missing', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(AuthService.forgotPassword('email')).rejects.toThrow(
      'User not found'
    );
  });

  it('should send OTP successfully', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({} as any);

    mockRedis.set.mockResolvedValue('OK' as never);

    await AuthService.forgotPassword('email');

    expect(sendOTP).toHaveBeenCalled();
  });

  it('should fail reset if otp invalid', async () => {
    mockRedis.get.mockResolvedValue(null);

    await expect(
      AuthService.resetPassword('email', '123', 'pass')
    ).rejects.toThrow('Invalid credentials');
  });

  it('should reset password successfully', async () => {
    mockRedis.get.mockResolvedValue('123');

    mockUserRepo.findByEmail.mockResolvedValue({} as any);

    mockBcrypt.hash.mockResolvedValue('hash' as never);

    await AuthService.resetPassword('email', '123', 'pass');

    expect(mockRedis.del).toHaveBeenCalled();
  });

  it('should fail verify OTP', async () => {
    mockRedis.get.mockResolvedValue(null);

    await expect(AuthService.verifyOtp('email', '123')).rejects.toThrow(
      'Invalid credentials'
    );
  });

  it('should verify OTP successfully', async () => {
    mockRedis.get.mockResolvedValue('123');

    mockUserRepo.findByEmail.mockResolvedValue({} as any);

    const result = await AuthService.verifyOtp('email', '123');

    expect(result.message).toBe('Otp verification successful');
  });

  it('should delete refresh token on logout', async () => {
    (redis.del as any).mockResolvedValue(1);

    const result = await AuthService.logout('1');

    expect(redis.del).toHaveBeenCalledWith('refresh:1');
    expect(result).toBe(true);
  });

  it('should return user profile', async () => {
    const createdAt = new Date();
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      name: 'Sarthak',
      isActive: true,
      teams: [],
      getDataValue: vi.fn().mockReturnValue(createdAt),
      createdAt: createdAt,
    };

    (User.findByPk as any).mockResolvedValue(mockUser);
    console.log('Mocker User', User.findByPk);
    const result = await AuthService.me('1');

    expect(result).toEqual({
      id: '1',
      email: 'test@test.com',
      name: 'Sarthak',
      isActive: true,
      createdAt,
      teams: [],
    });
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
    ).rejects.toThrow('Invalid Credentials');
  });
  it('resetPassword should throw if otp expired', async () => {
    (redis.get as any).mockResolvedValue(null);

    await expect(
      AuthService.resetPassword('test@test.com', '123456', 'newpass')
    ).rejects.toThrow('Invalid Credentials');
  });
  it('resetPassword should throw if user not found', async () => {
    (redis.get as any).mockResolvedValue('123456');
    (User.findOne as any).mockResolvedValue(null);

    await expect(
      AuthService.resetPassword('test@test.com', '123456', 'newpass')
    ).rejects.toThrow('User not found');
  });
  it('should verify OTP successfully', async () => {
    (redis.get as any).mockResolvedValue('123456');
    (User.findOne as any).mockResolvedValue({ id: 1, email: 'test@test.com' });

    const result = await AuthService.verifyOtp('test@test.com', '123456');

    expect(redis.get).toHaveBeenCalledWith('reset:test@test.com');
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });

    expect(result).toEqual({
      message: 'Otp verification successful',
    });
  });
  it('should throw if OTP not found in redis', async () => {
    (redis.get as any).mockResolvedValue(null);

    await expect(
      AuthService.verifyOtp('test@test.com', '123456')
    ).rejects.toThrow('Invalid credentials');
  });
  it('should throw if OTP does not match', async () => {
    (redis.get as any).mockResolvedValue('999999');

    await expect(
      AuthService.verifyOtp('test@test.com', '123456')
    ).rejects.toThrow('Invalid credentials');
  });
  it('should throw if user not found', async () => {
    (redis.get as any).mockResolvedValue('123456');
    (User.findOne as any).mockResolvedValue(null);

    await expect(
      AuthService.verifyOtp('test@test.com', '123456')
    ).rejects.toThrow('User not found');
  });
});
