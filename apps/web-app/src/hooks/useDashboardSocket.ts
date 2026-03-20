import { useEffect } from 'react';
import { socket } from '@/utils/socket';
import type { AnalysisJobEvent } from '@/types/crawl.types';

export function useDashboardSocket(
  onJobUpdated: (event: AnalysisJobEvent) => void
) {
  useEffect(() => {
    socket.on('analysis-job-updated', onJobUpdated);

    return () => {
      socket.off('analysis-job-updated', onJobUpdated);
    };
  }, [onJobUpdated]);
}
