import { IssueInstance } from '@packages/shared-models/issue-instance.model';
import { PageVersion } from '@packages/shared-models/page-version.model';
import { SiteDailyMetricsRepository } from '../repositories/site-daily-metrics.repository';

export const MetricsService = {
  async generate(siteId: string, jobId: string) {
    const pageCount = await PageVersion.count({
      where: { crawl_job_id: jobId },
    });
    // Get impacts for crawl jobs
    const issues = await IssueInstance.findAll({
      attributes: ['impact'],
      include: [
        {
          model: PageVersion,
          where: { crawl_job_id: jobId },
          attributes: [],
        },
      ],
    });

    let critical = 0;
    let serious = 0;
    let moderate = 0;
    let minor = 0;
    // Calculate impact counts
    issues.forEach(issue => {
      switch (issue.impact) {
        case 'critical':
          critical++;
          break;
        case 'serious':
          serious++;
          break;
        case 'moderate':
          moderate++;
          break;
        default:
          minor++;
      }
    });
    // Calculate accessibility score based on impact value
    const total = critical + serious + moderate + minor;

    const weightedIssues = critical * 10 + serious * 6 + moderate * 3 + minor;

    const norm = Math.max(pageCount, 10);

    const issueDensity = weightedIssues / norm;

    const score = Math.max(0, Math.round(100 - issueDensity * 3));

    await SiteDailyMetricsRepository.create({
      site_id: siteId,
      date: new Date(),
      pages_crawled: pageCount,
      total_issues: total,
      critical_issues: critical,
      serious_issues: serious,
      moderate_issues: moderate,
      minor_issues: minor,
      accessibility_score: score,
    });
  },
};
