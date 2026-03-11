import { DashboardRepository } from '../repositories/dashboard.repository';

export const DashboardService = {
  async getSummary(siteId?: string) {
    // Get issue summary of crawled sites
    const activeSites = await DashboardRepository.getActiveSites();
    const activeCrawls = await DashboardRepository.getActiveCrawls();
    const openIssues = await DashboardRepository.getOpenIssues();
    // Fetch metrics for the specific site id or else fetch latest one
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
