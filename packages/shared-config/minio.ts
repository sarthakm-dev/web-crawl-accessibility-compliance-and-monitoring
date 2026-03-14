import { Client } from 'minio';
import { env } from '@packages/shared-config/env';

export const minioClient = new Client({
  endPoint: env.MINIO_HOST || 'minio',
  port: Number(env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

export const BUCKET = 'webcrawl';
