import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { ReportsRepository } from '../repositories/reports.repository';
import { uploadReportToMinio } from '../services/minio.service';

export async function consumeReportJob(message: any, channel: any) {
  const payload = JSON.parse(message.content.toString());

  try {
    const issuesResult = await IssueAnalyticsRepository.getIssues(
      payload.siteId,
      payload.filters?.severity || null,
      1000,
      0
    );

    const issues = issuesResult?.rows || issuesResult || [];

    const updatedPayload = { ...payload, issues };

    const minioKey = await uploadReportToMinio(updatedPayload);

    await ReportsRepository.update(payload.reportId, {
      status: 'completed',
      object_key: minioKey,
    });

    channel.ack(message);
  } catch (error) {
    console.error(error);

    await ReportsRepository.update(payload.reportId, {
      status: 'failed',
    });

    channel.nack(message, false, false);
  }
}
