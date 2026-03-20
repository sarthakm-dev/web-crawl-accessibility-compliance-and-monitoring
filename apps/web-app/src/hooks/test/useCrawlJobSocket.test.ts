import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useCrawlJobSocket } from '../useCrawlJobSocket';
import { socket } from '@/utils/socket';
import type { CrawlJob } from '@packages/shared-types/crawl-job.types';
import type { CrawlJobUpdatedEvent } from '@/types/crawl.types';

// Mock socket globally
vi.mock('@/utils/socket', () => ({
  socket: {
    on: vi.fn(),
    off: vi.fn(),
  },
}));

describe('useCrawlJobSocket', () => {
  it('registers and unregisters socket listeners', () => {
    const setJobs = vi.fn();

    const { unmount } = renderHook(() =>
      useCrawlJobSocket(setJobs, 'site-123')
    );

    expect(socket.on).toHaveBeenCalledWith(
      'crawl-job-updated',
      expect.any(Function)
    );

    unmount();

    expect(socket.off).toHaveBeenCalledWith(
      'crawl-job-updated',
      expect.any(Function)
    );
  });

  it('ignores events for other siteIds', () => {
    const initialJobs: CrawlJob[] = [{ id: 'job-1', status: 'pending' } as any];
    let jobs = initialJobs;

    const setJobs = (updater: any) => {
      jobs = updater(jobs);
    };

    renderHook(() => useCrawlJobSocket(setJobs, 'site-123'));

    const event: CrawlJobUpdatedEvent = {
      jobId: 'job-1',
      siteId: 'other-site',
      status: 'completed',
    };

    act(() => {
      const handler = (socket.on as any).mock.calls[0][1];
      handler(event);
    });

    expect(jobs[0].status).toBe('pending');
  });
});
