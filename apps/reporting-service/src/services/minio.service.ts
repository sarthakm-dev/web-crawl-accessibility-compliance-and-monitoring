import { Client } from 'minio';
import { generatePdfStream } from './pdf.service';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export async function uploadReportToMinio(payload: any) {
  if (!payload.siteId || !payload.reportId) {
    throw new Error(
      `Missing metadata: siteId=${payload.siteId}, reportId=${payload.reportId}`
    );
  }

  const bucket = 'reports';
  const fileName = `report-${payload.reportId}.pdf`;
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

  return fileName;
}
