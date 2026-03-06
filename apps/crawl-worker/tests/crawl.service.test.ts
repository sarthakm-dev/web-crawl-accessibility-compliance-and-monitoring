import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CrawlService } from '../src/services/crawl.service';
import { CrawlJobRepository } from '../src/repositories/crawl-job.repository';
import { CrawlQueueRepository } from '../src/repositories/crawl-queue.repository';
import { PageRepository } from '../src/repositories/page.repository';
import { PageVersionRepository } from '../src/repositories/page-version.repository';
import { publishToAnalysis } from '../src/publishers/analysis.publisher';
import { getBrowser } from '../src/browser/browser';

vi.mock('../src/repositories/crawl-job.repository');
vi.mock('../src/repositories/crawl-queue.repository');
vi.mock('../src/repositories/page.repository');
vi.mock('../src/repositories/page-version.repository');
vi.mock('../src/publishers/analysis.publisher');
vi.mock('../src/browser/browser');

describe('CrawlService.processJob', () => {
  const mockPayload = {
    jobId: 'job-1',
    siteId: 'site-1',
    baseUrl: 'https://test.com',
  };

  const mockPage = {
    goto: vi.fn().mockResolvedValue({ status: () => 200 }),
    content: vi
      .fn()
      .mockResolvedValue(
        '<html><body><a href="https://test.com"></a></body></html>'
      ),
    title: vi.fn().mockResolvedValue('Test Title'),
    $$eval: vi
      .fn()
      .mockResolvedValue(['https://test.com', 'https://external.com']),
    close: vi.fn(),
  };

  const mockBrowser = {
    newPage: vi.fn().mockResolvedValue(mockPage),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getBrowser as any).mockResolvedValue(mockBrowser);
  });

  it('should process the seed URL and discover internal links', async () => {
    vi.mocked(CrawlQueueRepository.getNextPending)
      .mockResolvedValueOnce({ id: 'q1', url: 'https://test.com' } as any)
      .mockResolvedValueOnce(null);

    vi.mocked(PageRepository.upsert).mockResolvedValue({ id: 'p1' } as any);
    vi.mocked(PageVersionRepository.create).mockResolvedValue({
      id: 'v1',
    } as any);

    await CrawlService.processJob(mockPayload);

    expect(CrawlJobRepository.updateStatus).toHaveBeenCalledWith(
      'job-1',
      'running'
    );
    expect(CrawlJobRepository.updateStatus).toHaveBeenCalledWith(
      'job-1',
      'completed'
    );

    expect(mockPage.goto).toHaveBeenCalledWith(
      'https://test.com',
      expect.any(Object)
    );
    expect(publishToAnalysis).toHaveBeenCalledWith({ pageVersionId: 'v1' });

    expect(CrawlQueueRepository.createIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://test.com',
      })
    );
    expect(CrawlQueueRepository.createIfNotExists).not.toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://external.com',
      })
    );
  });

  it('should handle failures gracefully and update status to failed', async () => {
    vi.mocked(CrawlQueueRepository.getNextPending).mockRejectedValue(
      new Error('DB Error')
    );

    await CrawlService.processJob(mockPayload);

    expect(CrawlJobRepository.updateStatus).toHaveBeenCalledWith(
      'job-1',
      'failed'
    );
  });
  it('should mark an individual queue item as failed if page processing throws', async () => {
    vi.mocked(CrawlQueueRepository.getNextPending)
      .mockResolvedValueOnce({
        id: 'queue-fail-id',
        url: 'https://test.com',
      } as any)
      .mockResolvedValueOnce(null);

    mockPage.goto.mockRejectedValueOnce(new Error('Navigation Timeout'));

    await CrawlService.processJob(mockPayload);

    expect(CrawlQueueRepository.updateStatus).toHaveBeenCalledWith(
      'queue-fail-id',
      'failed'
    );

    expect(CrawlJobRepository.updateStatus).toHaveBeenCalledWith(
      'job-1',
      'completed'
    );
  });
  it('should extract and process internal links using $$eval', async () => {
    vi.mocked(CrawlQueueRepository.getNextPending)
      .mockResolvedValueOnce({ id: 'q1', url: 'https://test.com' } as any)
      .mockResolvedValueOnce(null);

    vi.mocked(PageRepository.upsert).mockResolvedValue({ id: 'p1' } as any);
    vi.mocked(PageVersionRepository.create).mockResolvedValue({
      id: 'v1',
    } as any);

    mockPage.$$eval.mockImplementation((_selector, fn) => {
      const anchors = [
        { href: 'https://test.com' },
        { href: 'https://external.com' },
      ];
      return Promise.resolve(fn(anchors));
    });

    await CrawlService.processJob(mockPayload);

    expect(mockPage.$$eval).toHaveBeenCalledWith(
      'a[href]',
      expect.any(Function)
    );

    expect(CrawlQueueRepository.createIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://test.com' })
    );

    expect(CrawlQueueRepository.createIfNotExists).not.toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://otherdomain.com' })
    );
  });

  it('should skip invalid URLs in the link loop', async () => {
    vi.mocked(CrawlQueueRepository.getNextPending)
      .mockResolvedValueOnce({ id: 'q1', url: 'https://test.com' } as any)
      .mockResolvedValueOnce(null);

    vi.mocked(PageRepository.upsert).mockResolvedValue({ id: 'p1' } as any);
    vi.mocked(PageVersionRepository.create).mockResolvedValue({
      id: 'v1',
    } as any);

    mockPage.$$eval.mockResolvedValue(['not-a-valid-url', 'https://test.com']);

    await CrawlService.processJob(mockPayload);

    expect(CrawlQueueRepository.createIfNotExists).toHaveBeenCalledTimes(2);
    expect(CrawlQueueRepository.createIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://test.com' })
    );
  });
});
