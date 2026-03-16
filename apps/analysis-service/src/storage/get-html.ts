import { minioClient, BUCKET } from '@packages/shared-config/minio';

export async function getHtmlFromStorage(path: string): Promise<string> {
  // get html page from minio s3 bucket
  const stream = await minioClient.getObject(BUCKET, path);

  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });
}
