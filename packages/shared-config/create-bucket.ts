import { minioClient } from './minio';
import { logger } from '@packages/shared-config/logger';
const bucket = 'webcrawl';

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(bucket);

  if (!exists) {
    await minioClient.makeBucket(bucket);
    logger.info('MinIO bucket created:');
  }
}
