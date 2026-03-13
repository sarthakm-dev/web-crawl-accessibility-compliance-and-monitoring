import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AggregationService } from '../src/services/aggregation.service';

import { IssueAnalyticsRepository } from '../src/repositories/issue-analytics.repository';
import { PageIssueSummaryRepository } from '../src/repositories/page-issue-summary.repository';
import { SiteIssueSummaryRepository } from '../src/repositories/site-issue-summary.repository';

vi.mock('../src/repositories/issue-analytics.repository', () => ({
  IssueAnalyticsRepository: {
    getSeverityBreakdown: vi.fn(),
    countPages: vi.fn(),
    getPageBreakdown: vi.fn(),
  },
}));

vi.mock('../src/repositories/page-issue-summary.repository', () => ({
  PageIssueSummaryRepository: {
    bulkUpsert: vi.fn(),
  },
}));

vi.mock('../src/repositories/site-issue-summary.repository', () => ({
  SiteIssueSummaryRepository: {
    upsert: vi.fn(),
  },
}));

vi.mock('../src/publishers/dashboard.publisher', () => ({
  publishDashboardUpdate: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: () => 'mock-uuid',
}));

const SITE_ID = 'site-1';
const JOB_ID = 'job-1';

describe('AggregationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('aggregate should call both update functions', async () => {
    vi.mocked(IssueAnalyticsRepository.getSeverityBreakdown).mockResolvedValue(
      []
    );

    vi.mocked(IssueAnalyticsRepository.countPages).mockResolvedValue(1);

    vi.mocked(IssueAnalyticsRepository.getPageBreakdown).mockResolvedValue([]);

    await AggregationService.aggregate(SITE_ID, JOB_ID);

    expect(IssueAnalyticsRepository.getSeverityBreakdown).toHaveBeenCalled();
    expect(IssueAnalyticsRepository.getPageBreakdown).toHaveBeenCalled();
  });

  it('updateSiteSummary should calculate and upsert summary', async () => {
    vi.mocked(IssueAnalyticsRepository.getSeverityBreakdown).mockResolvedValue([
      { severity: 'critical', count: 2 },
      { severity: 'serious', count: 1 },
      { severity: 'moderate', count: 1 },
      { severity: 'minor', count: 1 },
    ] as any);

    vi.mocked(IssueAnalyticsRepository.countPages).mockResolvedValue(5);

    await AggregationService.updateSiteSummary(SITE_ID, JOB_ID);

    expect(SiteIssueSummaryRepository.upsert).toHaveBeenCalled();
  });

  it('updatePageSummary should bulkUpsert records', async () => {
    vi.mocked(IssueAnalyticsRepository.getPageBreakdown).mockResolvedValue([
      {
        page_id: 'p1',
        page_url: 'https://example.com',
        total_issues: 3,
        critical_count: 1,
        serious_count: 1,
        moderate_count: 1,
        minor_count: 0,
      },
    ] as any);

    await AggregationService.updatePageSummary(SITE_ID, JOB_ID);

    expect(PageIssueSummaryRepository.bulkUpsert).toHaveBeenCalled();
  });

  it('updatePageSummary should return when no records', async () => {
    vi.mocked(IssueAnalyticsRepository.getPageBreakdown).mockResolvedValue([]);

    await AggregationService.updatePageSummary(SITE_ID, JOB_ID);

    expect(PageIssueSummaryRepository.bulkUpsert).not.toHaveBeenCalled();
  });
});
