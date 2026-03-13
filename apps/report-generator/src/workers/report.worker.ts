import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { ReportsRepository } from '../repositories/reports.repository';
import { UserRepository } from '../repositories/user.repository';
import { SiteRepository } from '../repositories/site.repository';
import { SiteIssueSummaryRepository } from '../repositories/site-issue-summary.repository';

import { sendReportEmail } from '../services/email.service';
import { uploadReportToMinio } from '../services/minio.service';

export async function consumeReportJob(message: any, channel: any) {

  const payload = JSON.parse(message.content.toString());

  try {

    const issuesResult = await IssueAnalyticsRepository.getIssues(
      payload.siteId,
      payload.filters?.severity || undefined,
      1000,
      0
    );

    const issues = issuesResult?.rows || [];

    // Get site info
    const site = await SiteRepository.findById(payload.siteId);

    // Get summary
    const summary =
      await SiteIssueSummaryRepository.getSiteSummary(
        payload.siteId,
        payload.crawlJobId
      );

    const updatedPayload = {
      ...payload,
      issues,
      site,
      summary
    };

    const { fileName, buffer } =
      await uploadReportToMinio(updatedPayload);

    const report = await ReportsRepository.getById(payload.reportId);

    if (!report?.requested_by) {
      throw new Error("Report requester not found");
    }

    const user = await UserRepository.findById(report.requested_by);

    if (user?.email) {
      await sendReportEmail(user.email, buffer, payload.reportId);
    }

    await ReportsRepository.update(payload.reportId, {
      status: "completed",
      object_key: fileName,
      bucket: "reports",
      generated_at: new Date()
    });

    channel.ack(message);

  } catch (error) {

    console.error(error);

    await ReportsRepository.update(payload.reportId, {
      status: "failed"
    });

    channel.nack(message, false, false);
  }
}