import { useEffect } from 'react';
import { socket } from '@/utils/socket';
import { type CrawlJob } from '@packages/shared-types/crawl-job.types';
import type { CrawlJobUpdatedEvent } from '@/types/crawl.types';

export function useCrawlJobSocket(
  setJobs: React.Dispatch<React.SetStateAction<CrawlJob[]>>,
  siteId?: string
) {
  useEffect(() => {
    const handleUpdate = (event: CrawlJobUpdatedEvent) => {
      // If siteId is provided, only update jobs for that site
      if (siteId && event.siteId !== siteId) return;

      setJobs(prev =>
        prev.map(job =>
          job.id === event.jobId ? { ...job, status: event.status } : job
        )
      );
    };

    socket.on('crawl-job-updated', handleUpdate);

    return () => {
      socket.off('crawl-job-updated', handleUpdate);
    };
  }, [setJobs, siteId]);
}
