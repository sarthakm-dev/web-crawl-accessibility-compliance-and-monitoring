import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrawlService } from '../src/services/crawl.service';
import { CrawlJobRepository } from '../src/repositories/crawl-job.repository';
import { CrawlQueueRepository } from '../src/repositories/crawl-queue.repository';
import { PageRepository } from '../src/repositories/page.repository';
import { PageVersionRepository } from '../src/repositories/page-version.repository';
import { getBrowser } from '../src/browser/browser';
import { uploadHtml } from '../src/storage/upload-html';
import { publishToAnalysis } from '../src/publishers/analysis.publisher';
import { env } from '@packages/shared-config/env';

vi.mock('../src/repositories/crawl-job.repository');
vi.mock('../src/repositories/crawl-queue.repository');
vi.mock('../src/repositories/page.repository');
vi.mock('../src/repositories/page-version.repository');
vi.mock('../src/browser/browser');
vi.mock('../src/storage/upload-html');
vi.mock('../src/publishers/analysis.publisher');

describe('CrawlService', () => {
  let mockChannel: any;
  let mockBrowser: any;
  let mockPage: any;

  const payload = {
    jobId: 'job-123',
    siteId: 'site-456',
    baseUrl: 'https://example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockChannel = {
      sendToQueue: vi.fn(),
    };

    mockPage = {
      goto: vi.fn().mockResolvedValue({ status: () => 200 }),
      content: vi.fn().mockResolvedValue('<html></html>'),
      title: vi.fn().mockResolvedValue('Test Page'),
      $$eval: vi
        .fn()
        .mockResolvedValue([
          'https://example.com/about',
          'https://external.com',
          'invalid-url',
        ]),
      close: vi.fn(),
    };

    mockBrowser = {
      newPage: vi.fn().mockResolvedValue(mockPage),
    };
    (getBrowser as any).mockResolvedValue(mockBrowser);
  });

  it('should complete crawl successfully', async () => {
    (CrawlQueueRepository.getNextPending as any)
      .mockResolvedValueOnce({ id: 'q1', url: 'https://example.com' })
      .mockResolvedValueOnce(null);
    (PageRepository.upsert as any).mockResolvedValue({ id: 'page1' });
    (uploadHtml as any).mockResolvedValue('s3/path');
    (PageVersionRepository.create as any).mockResolvedValue({ id: 'version1' });

    await CrawlService.processJob(payload, mockChannel);

    expect(CrawlJobRepository.updateStatus).toHaveBeenCalledWith(
      'job-123',
      'completed'
    );

    expect(publishToAnalysis).toHaveBeenCalledWith({
      pageVersionId: 'version1',
    });

    expect(mockChannel.sendToQueue).toHaveBeenCalled();
  });

  it('should mark queue item failed when page crawl fails', async () => {
    (CrawlQueueRepository.getNextPending as any)
      .mockResolvedValueOnce({ id: 'q1', url: 'https://example.com' })
      .mockResolvedValueOnce(null);

    mockPage.goto.mockRejectedValue(new Error('Navigation error'));

    await CrawlService.processJob(payload, mockChannel);

    expect(CrawlQueueRepository.updateStatus).toHaveBeenCalledWith(
      'q1',
      'failed'
    );
  });

  it('should mark job failed when browser fails to launch', async () => {
    (getBrowser as any).mockRejectedValue(new Error('Browser failed'));

    await CrawlService.processJob(payload, mockChannel);

    expect(CrawlJobRepository.updateStatus).toHaveBeenCalledWith(
      'job-123',
      'failed'
    );

    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'crawl_events',
      expect.any(Buffer),
      { persistent: true }
    );
  });

  it('should respect MAX_PAGES limit', async () => {
    env.MAX_PAGES = 1;
    (CrawlQueueRepository.getNextPending as any).mockResolvedValue({
      id: 'q1',
      url: 'https://example.com',
    });
    (PageRepository.upsert as any).mockResolvedValue({ id: 'p1' });
    (PageVersionRepository.create as any).mockResolvedValue({ id: 'v1' });

    await CrawlService.processJob(payload, mockChannel);

    expect(CrawlQueueRepository.getNextPending).toHaveBeenCalledTimes(1);
  });

  it('should handle missing response object (status 0)', async () => {
    (CrawlQueueRepository.getNextPending as any)
      .mockResolvedValueOnce({ id: 'q1', url: 'https://example.com' })
      .mockResolvedValueOnce(null);

    mockPage.goto.mockResolvedValue(null);
    (PageRepository.upsert as any).mockResolvedValue({ id: 'p1' });
    (PageVersionRepository.create as any).mockResolvedValue({ id: 'v1' });

    await CrawlService.processJob(payload, mockChannel);

    expect(PageVersionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        http_status: 0,
      })
    );
  });
});
