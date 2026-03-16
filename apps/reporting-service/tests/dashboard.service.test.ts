import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardService } from '../src/services/dashboard.service';
import { DashboardRepository } from '../src/repositories/dashboard.repository';

vi.mock('../src/repositories/dashboard.repository', () => ({
  DashboardRepository: {
    getActiveSites: vi.fn(),
    getActiveCrawls: vi.fn(),
    getOpenIssues: vi.fn(),
    getLatestAccessibilityScore: vi.fn(),
    getAccessibilityTrend: vi.fn(),
    getIssuesBreakdown: vi.fn(),
    getLatestCrawls: vi.fn(),
  },
}));

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return dashboard summary with compliance score', async () => {
    (DashboardRepository.getActiveSites as any).mockResolvedValue(5);
    (DashboardRepository.getActiveCrawls as any).mockResolvedValue(2);
    (DashboardRepository.getOpenIssues as any).mockResolvedValue(20);
    (DashboardRepository.getLatestAccessibilityScore as any).mockResolvedValue({
      accessibility_score: 85,
    });

    const result = await DashboardService.getSummary('site-1');

    expect(DashboardRepository.getActiveSites).toHaveBeenCalled();
    expect(DashboardRepository.getActiveCrawls).toHaveBeenCalled();
    expect(DashboardRepository.getOpenIssues).toHaveBeenCalled();

    expect(
      DashboardRepository.getLatestAccessibilityScore
    ).toHaveBeenCalledWith('site-1');

    expect(result).toEqual({
      activeSites: 5,
      activeCrawls: 2,
      openIssues: 20,
      complianceScore: 85,
    });
  });

  it('should return complianceScore 0 when metrics missing', async () => {
    (DashboardRepository.getActiveSites as any).mockResolvedValue(1);
    (DashboardRepository.getActiveCrawls as any).mockResolvedValue(0);
    (DashboardRepository.getOpenIssues as any).mockResolvedValue(3);
    (DashboardRepository.getLatestAccessibilityScore as any).mockResolvedValue(
      null
    );

    const result = await DashboardService.getSummary('site-1');

    expect(result.complianceScore).toBe(0);
  });

  it('should return accessibility trend', async () => {
    const trend = [{ date: '2026-03-01', accessibility_score: 80 }];

    (DashboardRepository.getAccessibilityTrend as any).mockResolvedValue(trend);

    const result = await DashboardService.getAccessibilityTrend('site-1');

    expect(DashboardRepository.getAccessibilityTrend).toHaveBeenCalledWith(
      'site-1'
    );

    expect(result).toEqual(trend);
  });

  it('should return issue breakdown', async () => {
    const data = {
      critical: 2,
      serious: 4,
      moderate: 6,
      minor: 1,
    };

    (DashboardRepository.getIssuesBreakdown as any).mockResolvedValue(data);

    const result = await DashboardService.getIssuesBreakdown();

    expect(DashboardRepository.getIssuesBreakdown).toHaveBeenCalled();
    expect(result).toEqual(data);
  });

  it('should return latest crawls', async () => {
    const crawls = [{ id: 'job-1', status: 'completed' }];

    (DashboardRepository.getLatestCrawls as any).mockResolvedValue(crawls);

    const result = await DashboardService.getLatestCrawls();

    expect(DashboardRepository.getLatestCrawls).toHaveBeenCalled();
    expect(result).toEqual(crawls);
  });
});
