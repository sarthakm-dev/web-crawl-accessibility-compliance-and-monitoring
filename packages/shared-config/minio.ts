import { Client } from 'minio';
import dotenv from 'dotenv';
dotenv.config();
export const minioClient = new Client({
  endPoint: process.env.MINIO_HOST || 'minio',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const BUCKET = 'webcrawl';
