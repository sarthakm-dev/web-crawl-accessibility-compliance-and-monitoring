import { IssueAnalytics } from '@packages/shared-models/issue-analytics.model';

export const IssueAnalyticsRepository = {
  
  async getIssues(siteId: string, severity?: string, limit = 50, offset = 0) {
    return IssueAnalytics.findAndCountAll({
      where: {
        site_id: siteId,
        ...(severity && { severity }),
      },
      limit,
      offset,
      order: [['detected_at', 'DESC']],
    });
  },
};
