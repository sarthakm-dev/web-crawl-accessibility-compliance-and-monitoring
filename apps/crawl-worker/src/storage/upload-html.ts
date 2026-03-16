import { minioClient, BUCKET } from '@packages/shared-config/minio';

export async function uploadHtml(
  siteId: string,
  pageId: string,
  versionHash: string,
  html: string
) {
  const objectName = `sites/${siteId}/pages/${pageId}/${versionHash}.html`;
  // put html content in s3 bucket
  await minioClient.putObject(
    BUCKET,
    objectName,
    Buffer.from(html),
    html.length,
    { 'Content-Type': 'text/html' }
  );

  return objectName;
}
