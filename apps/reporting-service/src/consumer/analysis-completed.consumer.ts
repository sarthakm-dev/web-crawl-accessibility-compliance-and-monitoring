import { v4 as uuidv4 } from 'uuid';
import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { AggregationService } from '../services/aggregation.service';
import { logger } from '@packages/shared-config/logger';

export const consumeAnalysisIssues = async (message: any, channel: any) => {
  try {
    const payload = JSON.parse(message.content.toString());
    if (!payload.issues || payload.issues.length === 0) {
      channel.ack(message);
      return;
    }
    // consume analysis copleted event to start table aggregation
    const records = payload.issues.map((issue: any) => ({
      id: uuidv4(),

      site_id: payload.siteId,
      page_id: issue.pageId,
      page_url: issue.pageUrl,

      crawl_job_id: payload.crawlJobId,
      page_version_id: issue.pageVersionId,

      issue_instance_id: issue.issueInstanceId,
      issue_definition_id: issue.issueDefinitionId,

      rule_id: issue.ruleCode,
      rule_description: issue.ruleDescription,
      wcag_rule: issue.wcag,

      severity: issue.severity,

      selector: issue.selector,
      message: issue.message,

      status: issue.status,

      detected_at: new Date(issue.detectedAt),
    }));

    await IssueAnalyticsRepository.bulkInsert(records);
    // Start aggregation process
    await AggregationService.aggregate(payload.siteId, payload.crawlJobId);

    channel.ack(message);
  } catch (error) {
    logger.error({ error }, 'Reporting consumer failed:');

    channel.nack(message, false, false);
  }
};
