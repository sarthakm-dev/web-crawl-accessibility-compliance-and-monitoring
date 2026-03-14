import dotenv from 'dotenv';
import { z } from 'zod';

// Load root .env
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const envSchema = z.object({
  GATEWAY_PORT: z.coerce.number(),
  AUTH_PORT: z.coerce.number(),
  REPORTING_PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'production', 'test']),

  DATABASE_URL: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_EXPIRY: z.coerce.number(),

  RABBITMQ_URL: z.string(),
  API_GATEWAY_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_EXPIRY: z.string(),
  REFRESH_EXPIRY: z.string(),

  OTP_EXPIRY: z.coerce.number(),

  RATE_LIMIT_WINDOW: z.coerce.number(),
  MAX_REQUESTS: z.coerce.number(),

  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),

  MINIO_HOST: z.string(),
  MINIO_PORT: z.coerce.number(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),

  FRONTEND_URL: z.string(),

  AUTH_SERVICE_URL: z.string(),
  CRAWL_MANAGER_URL: z.string(),
  REPORTING_SERVICE_URL: z.string(),

  MAX_PAGES: z.coerce.number(),
});

let parsedEnv;

if (process.env.NODE_ENV === 'test') {
  parsedEnv = process.env;
} else {
  parsedEnv = envSchema.parse(process.env);
}

export const env = parsedEnv;
