import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { redis } from '@packages/shared-config/redis';
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { sendOTP } from '../utils/mailer';
import { Team } from '../models/team.model';

export const AuthService = {
  async signup(name: string, email: string, password: string) {
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new Error('User already exists');

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash: hash,
    });
    const team = await Team.create({
      name: `${name}'s Team`,
    });

    await user.addTeam(team);
    const viewerRole = await Role.findOne({ where: { name: 'viewer' } });
    if (viewerRole) {
      await user.addRole(viewerRole);
    }
    return user;
  },

  async login(email: string, password: string) {
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          include: [
            {
              model: Permission,
            },
          ],
        },
        {
          model: Team,
          through: { attributes: [] },
        },
      ],
    });

    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    if (!user.Teams || user.Teams.length === 0) {
      throw new Error('User is not assigned to any team');
    }
    const activeTeamId = user.Teams[0].id;

    const roles = user.Roles?.map((role: any) => role.name) ?? [];

    const permissions =
      user.Roles?.flatMap((role: any) =>
        role.Permissions?.map((perm: any) => perm.name)
      ) ?? [];

    const accessToken = jwt.sign(
      {
        userId: user.id,
        teamId: activeTeamId,
        roles,
        permissions,
      },
      process.env.JWT_SECRET!,
      { expiresIn: (process.env.ACCESS_EXPIRY || '15m') as any }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: (process.env.REFRESH_EXPIRY || '7d') as any,
      }
    );

    await redis.set(
      `refresh:${user.id}`,
      refreshToken,
      'EX',
      Number(process.env.REDIS_EXPIRY) || 7 * 24 * 60 * 60
    );

    return { accessToken, refreshToken };
  },

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as any;
      const stored = await redis.get(`refresh:${payload.userId}`);

      if (!stored || stored !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const user = await User.findByPk(payload.userId, {
        include: [
          {
            model: Role,
            include: [{ model: Permission }],
          },
          {
            model: Team,
            through: { attributes: [] },
          },
        ],
      });

      if (!user) throw new Error('User not found');
      if (!user.Teams || user.Teams.length === 0) {
        throw new Error('User is not assigned to any team');
      }
      const activeTeamId = user.Teams[0].id;
      const roles = user.Roles?.map((r: any) => r.name) ?? [];
      const permissions =
        user.Roles?.flatMap((r: any) =>
          r.Permissions?.map((p: any) => p.name)
        ) ?? [];

      const newAccessToken = jwt.sign(
        {
          userId: user.id,
          teamId: activeTeamId,
          roles,
          permissions,
        },
        process.env.JWT_SECRET!,
        { expiresIn: (process.env.ACCESS_EXPIRY || '15m') as any }
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new Error('Unauthorized');
    }
  },

  async logout(userId: string) {
    const response = await redis.del(`refresh:${userId}`);
    if (response == 0) {
      throw new Error('Cannot Logout User');
    }
    return true;
  },

  async me(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'isActive', 'created_at'],
      include: [
        {
          model: Team,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      throw new Error('Cannot find user');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      created_at: user.created_at,
      teams: user.Teams ?? [],
    };
  },

  async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(
      `reset:${email}`,
      otp,
      'EX',
      Number(process.env.OTP_EXPIRY) || 600
    );

    await sendOTP(email, otp);

    return { message: 'OTP sent to email' };
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    const storedOtp = await redis.get(`reset:${email}`);

    if (!storedOtp || storedOtp !== otp) {
      throw new Error('Invalid Credentials');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hashed;
    await user.save();

    await redis.del(`reset:${email}`);

    return { message: 'Password reset successful' };
  },
  async verifyOtp(email: string, otp: string) {
    const storedOtp = await redis.get(`reset:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      throw new Error('Invalid credentials');
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'Otp verification successful' };
  },
};
