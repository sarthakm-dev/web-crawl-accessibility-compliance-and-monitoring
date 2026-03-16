import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardController } from '../src/controllers/dashboard.controller';
import { DashboardService } from '../src/services/dashboard.service';
import { handleError } from '@packages/shared-utils/error-handler';

vi.mock('../src/services/dashboard.service');
vi.mock('@packages/shared-utils/error-handler');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('DashboardController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      query: { siteId: TEST_UUID },
    };

    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };

    vi.clearAllMocks();
  });

  describe('getSummary', () => {
    it('should return summary data', async () => {
      const mockData = {
        activeSites: 5,
        activeCrawls: 3,
        openIssues: 10,
        complianceScore: 92,
      };

      vi.spyOn(DashboardService, 'getSummary').mockResolvedValue(mockData);

      await DashboardController.getSummary(req, res);

      expect(DashboardService.getSummary).toHaveBeenCalledWith(TEST_UUID);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle errors', async () => {
      const error = new Error('fail');

      vi.spyOn(DashboardService, 'getSummary').mockRejectedValue(error);

      await DashboardController.getSummary(req, res);

      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('getTrend', () => {
    it('should return trend data', async () => {
      const mockData = [
        {
          id: '1',
          site_id: TEST_UUID,
          date: '2024-01-01',
          pages_crawled: 10,
          total_issues: 5,
          score: 92,
        },
      ];

      vi.spyOn(DashboardService, 'getAccessibilityTrend').mockResolvedValue(
        mockData as any
      );

      await DashboardController.getTrend(req, res);

      expect(DashboardService.getAccessibilityTrend).toHaveBeenCalledWith(
        TEST_UUID
      );

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle errors', async () => {
      const error = new Error('fail');

      vi.spyOn(DashboardService, 'getAccessibilityTrend').mockRejectedValue(
        error
      );

      await DashboardController.getTrend(req, res);

      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('getIssuesBreakdown', () => {
    it('should return issues breakdown', async () => {
      const mockData = {
        critical: 5,
        serious: 10,
        moderate: 10,
        minor: 10,
      };

      vi.spyOn(DashboardService, 'getIssuesBreakdown').mockResolvedValue(
        mockData
      );

      await DashboardController.getIssuesBreakdown(req, res);

      expect(DashboardService.getIssuesBreakdown).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle errors', async () => {
      const error = new Error('fail');

      vi.spyOn(DashboardService, 'getIssuesBreakdown').mockRejectedValue(error);

      await DashboardController.getIssuesBreakdown(req, res);

      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('getLatestCrawls', () => {
    it('should return latest crawls', async () => {
      const mockData = [{ id: 'crawl1' }];

      vi.spyOn(DashboardService, 'getLatestCrawls').mockResolvedValue(
        mockData as any
      );

      await DashboardController.getLatestCrawls(req, res);

      expect(DashboardService.getLatestCrawls).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle errors', async () => {
      const error = new Error('fail');

      vi.spyOn(DashboardService, 'getLatestCrawls').mockRejectedValue(error);

      await DashboardController.getLatestCrawls(req, res);

      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });
});
