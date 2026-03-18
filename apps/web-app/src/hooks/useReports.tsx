import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import type { IssuesResponse, QueryParams } from '@/types/report.types';

export function useSiteSummary(
  siteId: string,
  startDate?: string,
  endDate?: string,
  crawlJobId?: string
) {
  return useQuery({
    queryKey: ['site-summary', siteId, startDate, endDate, crawlJobId],
    queryFn: async () => {
      const params: QueryParams = { siteId };

      if (crawlJobId) params.crawlJobId = crawlJobId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/api/reports/site-summary', { params });

      return res.data;
    },
    enabled: !!siteId,
  });
}

export function useSeverityBreakdown(
  siteId: string,
  startDate?: string,
  endDate?: string,
  crawlJobId?: string
) {
  return useQuery({
    queryKey: ['severity', siteId, startDate, endDate, crawlJobId],
    queryFn: async () => {
      const params: QueryParams = { siteId };

      if (crawlJobId) params.crawlJobId = crawlJobId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/api/reports/issues', { params });

      return res.data;
    },
    select: data => (Array.isArray(data) ? data : []),
    enabled: !!siteId,
  });
}

export function useTopPages(
  siteId: string,
  startDate?: string,
  endDate?: string,
  crawlJobId?: string
) {
  return useQuery({
    queryKey: ['top-pages', siteId, startDate, endDate, crawlJobId],
    queryFn: async () => {
      const params: QueryParams = { siteId };

      if (crawlJobId) params.crawlJobId = crawlJobId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/api/reports/top-pages', { params });

      return res.data;
    },
    select: data => (Array.isArray(data) ? data : []),
    enabled: !!siteId,
  });
}

export function useIssues(
  siteId: string,
  severity?: string,
  page = 1,
  startDate?: string,
  endDate?: string,
  crawlJobId?: string
) {
  return useQuery<IssuesResponse>({
    queryKey: [
      'issues',
      siteId,
      severity,
      page,
      startDate,
      endDate,
      crawlJobId,
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        siteId,
        page,
      };

      if (severity) params.severity = severity;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (crawlJobId) params.crawlJobId = crawlJobId;

      const res = await api.get('/api/reports/issues-table', { params });

      return res.data;
    },
    select: (data): IssuesResponse => ({
      rows: Array.isArray(data?.rows) ? data.rows : [],
      count: typeof data?.count === 'number' ? data.count : 0,
    }),
    enabled: !!siteId,
  });
}
