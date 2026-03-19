import { v4 as uuidv4 } from 'uuid';
import { IssueAnalyticsRepository } from '../repositories/issue-analytics.repository';
import { AggregationService } from '../services/aggregation.service';
import { logger } from '@packages/shared-config/logger';

export const consumeAnalysisIssues = async (message: any, channel: any) => {
  try {
    const payload = JSON.parse(message.content.toString());

    // Validation
    if (!payload?.issues || !Array.isArray(payload.issues)) {
      logger.warn('Invalid payload format');
      channel.ack(message);
      return;
    }

    if (payload.issues.length === 0) {
      channel.ack(message);
      return;
    }

    // Transform payload safely
    const records = payload.issues
      .filter((issue: any) => issue?.issueInstanceId)
      .map((issue: any) => ({
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

    if (records.length === 0) {
      logger.warn('No valid issues after filtering');
      channel.ack(message);
      return;
    }

    // Insert
    await IssueAnalyticsRepository.bulkInsert(records);

    // Aggregation (non-blocking)
    try {
      await AggregationService.aggregate(payload.siteId, payload.crawlJobId);
    } catch (aggError) {
      logger.error({ aggError }, 'Aggregation failed (non-blocking)');
    }

    channel.ack(message);
  } catch (error) {
    logger.error({ error }, 'Reporting consumer failed');

    // DLQ safe nack

    channel.nack(message, false, false);
  }
};
