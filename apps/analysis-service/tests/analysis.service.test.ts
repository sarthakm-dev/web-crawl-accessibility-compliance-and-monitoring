import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/repositories/page-version.repository', () => ({
  PageVersionRepository: {
    findById: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

vi.mock('../src/repositories/issue-definition.repository', () => ({
  IssueDefinitionRepository: {
    findOrCreateByRule: vi.fn(),
  },
}));

vi.mock('../src/repositories/issue-instance.repository', () => ({
  IssueInstanceRepository: {
    create: vi.fn(),
  },
}));

vi.mock('../src/repositories/issue-status-history.repository', () => ({
  IssueStatusHistoryRepository: {
    create: vi.fn(),
  },
}));

vi.mock('../src/analysers/axe.analyser', () => ({
  AxeAnalyzer: {
    analyze: vi.fn(),
  },
}));

vi.mock('@packages/shared-config/database', () => ({
  sequelize: {
    transaction: vi.fn(),
  },
}));

import { AnalysisService } from '../src/services/analysis.service';

import { PageVersionRepository } from '../src/repositories/page-version.repository';
import { IssueDefinitionRepository } from '../src/repositories/issue-definition.repository';
import { IssueInstanceRepository } from '../src/repositories/issue-instance.repository';
import { AxeAnalyzer } from '../src/analysers/axe.analyser';
import { sequelize } from '@packages/shared-config/database';

const mockPageRepo = vi.mocked(PageVersionRepository);
const mockIssueDefRepo = vi.mocked(IssueDefinitionRepository);
const mockInstanceRepo = vi.mocked(IssueInstanceRepository);
const mockAnalyzer = vi.mocked(AxeAnalyzer);
const mockSequelize = vi.mocked(sequelize);

describe('AnalysisService', () => {
  const transaction = {
    commit: vi.fn(),
    rollback: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSequelize.transaction.mockResolvedValue(transaction);
  });

  it('should throw if page version not found', async () => {
    mockPageRepo.findById.mockResolvedValue(null);

    await expect(
      AnalysisService.process({ pageVersionId: '1' })
    ).rejects.toThrow('Page version or HTML not found');
  });

  it('should skip if analysis already completed', async () => {
    mockPageRepo.findById.mockResolvedValue({
      html_content: '<html/>',
      analysis_status: 'completed',
    } as any);

    await AnalysisService.process({ pageVersionId: '1' });

    expect(mockPageRepo.updateStatus).not.toHaveBeenCalled();
  });

  it('should process violations successfully', async () => {
    mockPageRepo.findById.mockResolvedValue({
      html_content: '<html/>',
      analysis_status: 'pending',
    } as any);

    mockAnalyzer.analyze.mockResolvedValue({
      violations: [
        {
          impact: 'serious',
          nodes: [
            {
              target: ['#main'],
              failureSummary: 'failure',
            },
          ],
        },
      ],
    } as any);

    mockIssueDefRepo.findOrCreateByRule.mockResolvedValue([
      { id: 'def1' },
    ] as any);

    mockInstanceRepo.create.mockResolvedValue({ id: 'instance1' } as any);

    await AnalysisService.process({ pageVersionId: '1' });

    expect(transaction.commit).toHaveBeenCalled();
  });

  it('should rollback on error', async () => {
    mockPageRepo.findById.mockResolvedValue({
      html_content: '<html/>',
      analysis_status: 'pending',
    } as any);

    mockAnalyzer.analyze.mockResolvedValue({
      violations: [
        {
          nodes: [
            {
              target: ['#main'],
              failureSummary: 'failure',
            },
          ],
        },
      ],
    } as any);

    mockIssueDefRepo.findOrCreateByRule.mockRejectedValue(
      new Error('DB error')
    );

    await expect(
      AnalysisService.process({ pageVersionId: '1' })
    ).rejects.toThrow();

    expect(transaction.rollback).toHaveBeenCalled();
  });

  it('should default impact to minor if violation impact missing', async () => {
    mockPageRepo.findById.mockResolvedValue({
      html_content: '<html/>',
      analysis_status: 'pending',
    } as any);

    mockAnalyzer.analyze.mockResolvedValue({
      violations: [
        {
          nodes: [
            {
              target: ['#main'],
              failureSummary: 'failure',
            },
          ],
        },
      ],
    } as any);

    mockIssueDefRepo.findOrCreateByRule.mockResolvedValue([
      { id: 'def1' },
    ] as any);

    mockInstanceRepo.create.mockResolvedValue({
      id: 'instance1',
    } as any);

    await AnalysisService.process({ pageVersionId: '1' });

    expect(mockInstanceRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        impact: 'minor',
      }),
      expect.anything()
    );
  });
});
