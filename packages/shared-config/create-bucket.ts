import { minioClient } from './minio';

const bucket = 'webcrawl';

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(bucket);

  if (!exists) {
    await minioClient.makeBucket(bucket);
    console.log('MinIO bucket created:', bucket);
  }
}
