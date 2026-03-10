import { PageIssueSummary } from '@packages/shared-models/page-issue-summary.model';
import { literal } from 'sequelize';

export const PageIssueSummaryRepository = {
  async upsert(data: any) {
    return await PageIssueSummary.upsert(data);
  },

  async bulkUpsert(records: any[]) {
    return await PageIssueSummary.bulkCreate(records, {
      updateOnDuplicate: [
        'total_issues',
        'critical_count',
        'serious_count',
        'moderate_count',
        'minor_count',
      ],
    });
  },

  async getTopPages(siteId: string) {
    return await PageIssueSummary.findAll({
      attributes: ['page_url', 'total_issues', 'critical_count'],
      where: { site_id: siteId },
      order: [[literal('total_issues'), 'DESC']],
      limit: 10,
    });
  },
};
