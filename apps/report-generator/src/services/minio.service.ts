import { generatePdfStream } from './pdf.service';
import { minioClient } from '@packages/shared-config/minio';

export async function uploadReportToMinio(payload: any) {
  if (!payload.siteId || !payload.reportId) {
    throw new Error(
      `Missing metadata: siteId=${payload.siteId}, reportId=${payload.reportId}`
    );
  }

  const bucket = 'reports';
  const fileName = `report-${payload.reportId}.pdf`;

  const exists = await minioClient.bucketExists(bucket);
  if (!exists) {
    await minioClient.makeBucket(bucket, 'us-east-1');
  }
  // Generate PDF Stream
  const pdfStream = generatePdfStream(payload);
  const chunks: any[] = [];
  // Send buffer in chunks
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    pdfStream.on('data', chunk => chunks.push(chunk));
    pdfStream.on('end', () => resolve(Buffer.concat(chunks)));
    pdfStream.on('error', reject);
  });

  await minioClient.putObject(bucket, fileName, buffer, buffer.length, {
    'Content-Type': 'application/pdf',
  });

  return { fileName, buffer };
}
