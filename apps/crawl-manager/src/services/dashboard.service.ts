import { DashboardRepository } from '../repositories/dashboard.repository';

export const DashboardService = {
  async getSummary(siteId?: string) {
    const activeSites = await DashboardRepository.getActiveSites();
    const activeCrawls = await DashboardRepository.getActiveCrawls();
    const openIssues = await DashboardRepository.getOpenIssues();

    const latestMetrics =
      await DashboardRepository.getLatestAccessibilityScore(siteId);

    return {
      activeSites,
      activeCrawls,
      openIssues,
      complianceScore: latestMetrics?.accessibility_score ?? 0,
    };
  },

  async getAccessibilityTrend(siteId?: string) {
    return DashboardRepository.getAccessibilityTrend(siteId);
  },

  async getIssuesBreakdown() {
    return DashboardRepository.getIssuesBreakdown();
  },

  async getLatestCrawls() {
    return DashboardRepository.getLatestCrawls();
  },
};
