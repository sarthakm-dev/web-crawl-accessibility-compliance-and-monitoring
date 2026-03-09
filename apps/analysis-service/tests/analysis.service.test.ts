import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalysisService } from '../src/services/analysis.service';
import { PageVersionRepository } from '../src/repositories/page-version.repository';
import { AxeAnalyzer } from '../src/analysers/axe.analyser';
import { getHtmlFromStorage } from '../src/storage/get-html';
import { sequelize } from '@packages/shared-config/database';
import { IssueDefinitionRepository } from '../src/repositories/issue-definition.repository';
import { IssueInstanceRepository } from '../src/repositories/issue-instance.repository';
import { PageRepository } from '../src/repositories/page.repository';
import { publishAnalysisCompleted } from '../src/publishers/analysis-event.publisher';

// Mock dependencies
vi.mock('../src/repositories/page-version.repository');
vi.mock('../src/repositories/page.repository');
vi.mock('../src/repositories/issue-definition.repository');
vi.mock('../src/repositories/issue-instance.repository');
vi.mock('../src/repositories/issue-status-history.repository');
vi.mock('../src/analysers/axe.analyser');
vi.mock('../src/storage/get-html');
vi.mock('../src/publishers/analysis-event.publisher');

describe('AnalysisService', () => {
  const mockPayload = { pageVersionId: 'pv-123' };

  let mockTransaction: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTransaction = {
      commit: vi.fn(),
      rollback: vi.fn(),
    };

    vi.spyOn(sequelize, 'transaction').mockResolvedValue(mockTransaction);
  });

  it('should process a page version and save violations successfully', async () => {
    const mockPageVersion = {
      id: 'pv-123',
      html_path: 'path/to.html',
      page_id: 'p-456',
      crawl_job_id: 'job-1',
      analysis_status: 'none',
    };

    const mockPage = {
      id: 'p-456',
      site_id: 's-789',
    };

    const mockAxeResults = {
      violations: [
        {
          id: 'color-contrast',
          impact: 'serious',
          nodes: [
            {
              target: ['button'],
              failureSummary: 'Fix contrast',
            },
          ],
        },
      ],
    };

    vi.mocked(PageVersionRepository.findById).mockResolvedValue(
      mockPageVersion as any
    );
    vi.mocked(getHtmlFromStorage).mockResolvedValue('<html></html>');
    vi.mocked(AxeAnalyzer.analyze).mockResolvedValue(mockAxeResults as any);
    vi.mocked(IssueDefinitionRepository.findOrCreateByRule).mockResolvedValue([
      { id: 'def-1' },
    ] as any);
    vi.mocked(IssueInstanceRepository.create).mockResolvedValue({
      id: 'inst-1',
    } as any);
    vi.mocked(PageRepository.findById).mockResolvedValue(mockPage as any);

    await AnalysisService.process(mockPayload);

    expect(PageVersionRepository.updateStatus).toHaveBeenCalledWith(
      'pv-123',
      'pending'
    );

    expect(IssueInstanceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        issue_definition_id: 'def-1',
        impact: 'serious',
        element_selector: 'button',
      }),
      mockTransaction
    );

    expect(mockTransaction.commit).toHaveBeenCalled();

    expect(publishAnalysisCompleted).toHaveBeenCalledWith({
      siteId: 's-789',
      jobId: 'job-1',
    });
  });

  it('should throw error if page version is missing or has no HTML path', async () => {
    vi.mocked(PageVersionRepository.findById).mockResolvedValue(null);

    await expect(AnalysisService.process(mockPayload)).rejects.toThrow(
      'Page version or HTML path not found'
    );
  });

  it('should rollback transaction and set status to failed on error', async () => {
    vi.mocked(PageVersionRepository.findById).mockResolvedValue({
      id: 'pv-123',
      html_path: 'path/to.html',
      page_id: 'p-456',
      crawl_job_id: 'job-1',
      analysis_status: 'none',
    } as any);

    vi.mocked(getHtmlFromStorage).mockResolvedValue('<html></html>');

    vi.mocked(AxeAnalyzer.analyze).mockResolvedValue({
      violations: [
        {
          impact: 'serious',
          nodes: [],
        },
      ],
    } as any);

    vi.mocked(IssueDefinitionRepository.findOrCreateByRule).mockRejectedValue(
      new Error('DB Error')
    );

    await expect(AnalysisService.process(mockPayload)).rejects.toThrow();

    expect(mockTransaction.rollback).toHaveBeenCalled();

    expect(PageVersionRepository.updateStatus).toHaveBeenCalledWith(
      'pv-123',
      'failed'
    );
  });

  it('should skip processing if analysis is already completed', async () => {
    vi.mocked(PageVersionRepository.findById).mockResolvedValue({
      id: 'pv-123',
      html_path: 'path/to.html',
      analysis_status: 'completed',
    } as any);

    await AnalysisService.process(mockPayload);

    expect(AxeAnalyzer.analyze).not.toHaveBeenCalled();
    expect(getHtmlFromStorage).not.toHaveBeenCalled();
  });
});
