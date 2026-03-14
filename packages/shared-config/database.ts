import { Sequelize } from 'sequelize';
import { env } from '@packages/shared-config/env';

type GlobalWithSequelize = typeof globalThis & {
  sequelizeInstance?: Sequelize;
};

const globalWithSequelize = globalThis as GlobalWithSequelize;

export const sequelize =
  globalWithSequelize.sequelizeInstance ??
  new Sequelize(
    env.DB_NAME || 'webcrawl',
    env.DB_USER || 'postgres',
    env.DB_PASSWORD as string,
    {
      host: env.DB_HOST || 'postgres',
      port: Number(env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );

if (!globalWithSequelize.sequelizeInstance) {
  globalWithSequelize.sequelizeInstance = sequelize;
}
