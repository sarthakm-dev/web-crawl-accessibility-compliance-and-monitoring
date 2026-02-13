import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { redis } from "../../../../packages/shared-config/redis";
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';

const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';

export const AuthService = {
  async signup(email: string, password: string) {
    const existing = await User.findOne({ where: { email } });
    if (existing) throw new Error('User already exists');

    const hash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      passwordHash: hash,
    });
    const viewerRole = await Role.findOne({where: {name: 'viewer'}});
    if(viewerRole){
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
      ],
    });

    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const roles = user.Roles?.map((role: any) => role.name) ?? [];

    const permissions =
      user.Roles?.flatMap((role: any) => role.Permissions?.map((perm: any) => perm.name)) ?? [];

    const accessToken = jwt.sign(
      {
        userId: user.id,
        roles,
        permissions,
      },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_EXPIRY },
    );

    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: REFRESH_EXPIRY,
    });

    await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);

    return { accessToken, refreshToken };
  },

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
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
        ],
      });

      if (!user) throw new Error('User not found');

      const roles = user.Roles?.map((r: any) => r.name) ?? [];
      const permissions =
        user.Roles?.flatMap((r: any) => r.Permissions?.map((p: any) => p.name)) ?? [];

      const newAccessToken = jwt.sign(
        {
          userId: user.id,
          roles,
          permissions,
        },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_EXPIRY },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new Error('Unauthorized');
    }
  },

  async logout(userId: string) {
    console.log("UserID",userId);
    const keys = await redis.keys(`refresh:${userId}`);
    console.log(await redis.keys(`*`))
    console.log("Before",await redis.mget(keys))
    const res = await redis.del(`refresh:${userId}`);
    console.log(res);
    const key = await redis.keys('*');
    console.log("After",await redis.mget(key));
    return res;
  },
  async me(userId: any) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'isActive'],
    });
    if (!user) {
      throw new Error('Cannot find user');
    }
    return user;
  },
};
