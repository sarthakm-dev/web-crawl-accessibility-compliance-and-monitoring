import { sequelize } from '@packages/shared-config/database';
import { AxeAnalyzer } from '../analysers/axe.analyser';
import { PageVersionRepository } from '../repositories/page-version.repository';
import { IssueDefinitionRepository } from '../repositories/issue-definition.repository';
import { IssueInstanceRepository } from '../repositories/issue-instance.repository';
import { IssueStatusHistoryRepository } from '../repositories/issue-status-history.repository';
import { getHtmlFromStorage } from '../storage/get-html';

export const AnalysisService = {
  async process(payload: { pageVersionId: string }) {
    const { pageVersionId } = payload;

    const pageVersion = await PageVersionRepository.findById(pageVersionId);

    if (!pageVersion || !pageVersion.html_path) {
      throw new Error('Page version or HTML path not found');
    }

    if (pageVersion.analysis_status === 'completed') {
      console.log(`Analysis already completed for ${pageVersionId}. Skipping.`);
      return;
    }

    await PageVersionRepository.updateStatus(pageVersionId, 'pending');

    const html = await getHtmlFromStorage(pageVersion.html_path);

    const results = await AxeAnalyzer.analyze(html);

    const transaction = await sequelize.transaction();

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
        }
      }

      await PageVersionRepository.updateStatus(
        pageVersionId,
        'completed',
        new Date(),
        transaction
      );

      await transaction.commit();

      console.log(
        `Analysis complete for ${pageVersionId}. Violations: ${results.violations.length}`
      );
    } catch (error) {
      await transaction.rollback();
      await PageVersionRepository.updateStatus(pageVersionId, 'failed');
      throw error;
    }
  },
};
