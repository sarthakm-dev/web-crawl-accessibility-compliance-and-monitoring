import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

type GlobalWithSequelize = typeof globalThis & {
  sequelizeInstance?: Sequelize;
};

const globalWithSequelize = globalThis as GlobalWithSequelize;

export const sequelize =
  globalWithSequelize.sequelizeInstance ??
  new Sequelize(
    process.env.DB_NAME || 'webcrawl',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD as string,
    {
      host: process.env.DB_HOST || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );

if (!globalWithSequelize.sequelizeInstance) {
  globalWithSequelize.sequelizeInstance = sequelize;
}
