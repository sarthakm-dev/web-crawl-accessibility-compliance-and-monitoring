import { sequelize } from '@packages/shared-config/database';
import { AxeAnalyzer } from '../analysers/axe.analyser';
import { PageVersionRepository } from '../repositories/page-version.repository';
import { IssueDefinitionRepository } from '../repositories/issue-definition.repository';
import { IssueInstanceRepository } from '../repositories/issue-instance.repository';
import { IssueStatusHistoryRepository } from '../repositories/issue-status-history.repository';
import { getHtmlFromStorage } from '../storage/get-html';
import { publishAnalysisCompleted } from '../publishers/analysis-event.publisher';
import { publishAnalysisIssues } from '../publishers/analysis-issues.publisher';
import { PageRepository } from '../repositories/page.repository';
import { logger } from '@packages/shared-config/logger';
export const AnalysisService = {
  async process(payload: { pageVersionId: string }) {
    const { pageVersionId } = payload;
    // Get HTML path
    const pageVersion = await PageVersionRepository.findById(pageVersionId);

    if (!pageVersion || !pageVersion.html_path) {
      throw new Error('Page version or HTML path not found');
    }

    if (pageVersion.analysis_status === 'completed') {
      logger.info(`Analysis already completed for ${pageVersionId}. Skipping.`);
      return;
    }

    await PageVersionRepository.updateStatus(pageVersionId, 'pending');
    // Fetch HTML from S3 Bucket
    const html = await getHtmlFromStorage(pageVersion.html_path);
    // Run axe-core on crawled page
    const results = await AxeAnalyzer.analyze(html);

    const page = await PageRepository.findById(pageVersion.page_id);
    if (!page) {
      throw new Error('Page not found for pageVersion');
    }

    const issues: any[] = [];

    const transaction = await sequelize.transaction();

    //Update Issue Definition and Issue Instance
    try {
      for (const violation of results.violations) {
        const [definition] = await IssueDefinitionRepository.findOrCreateByRule(
          violation,
          transaction
        );

        for (const node of violation.nodes) {
          const instance = await IssueInstanceRepository.create(
            {
              page_version_id: pageVersionId,
              issue_definition_id: definition.id,
              element_selector: node.target.join(','),
              message: node.failureSummary,
              impact: violation.impact || 'minor',
              first_detected_at: new Date(),
              current_status: 'open',
            },
            transaction
          );

          await IssueStatusHistoryRepository.create(
            {
              issue_instance_id: instance.id,
              previous_status: null,
              new_status: 'open',
              changed_by: null,
              changed_at: new Date(),
              note: 'Auto-detected by axe-core',
            },
            transaction
          );

          // Collect issue for reporting event
          issues.push({
            pageId: pageVersion.page_id,
            pageUrl: page.url,
            pageVersionId: pageVersionId,

            issueInstanceId: instance.id,
            issueDefinitionId: definition.id,

            ruleCode: violation.id,
            ruleDescription: violation.description,
            wcag: violation.helpUrl,

            severity: violation.impact || 'minor',

            selector: node.target.join(','),
            message: node.failureSummary,

            status: 'open',
            detectedAt: new Date(),
          });
        }
      }

      await PageVersionRepository.updateStatus(
        pageVersionId,
        'completed',
        new Date(),
        transaction
      );

      await transaction.commit();

      logger.info(
        `Analysis complete for ${pageVersionId}. Violations: ${issues.length}`
      );

      // Event for crawl-manager
      await publishAnalysisCompleted({
        siteId: page.site_id,
        jobId: pageVersion.crawl_job_id,
      });

      // Event for reporting-service
      await publishAnalysisIssues({
        siteId: page.site_id,
        crawlJobId: pageVersion.crawl_job_id,
        issues,
      });
    } catch (error) {
      await transaction.rollback();
      await PageVersionRepository.updateStatus(pageVersionId, 'failed');
      throw error;
    }
  },
};
