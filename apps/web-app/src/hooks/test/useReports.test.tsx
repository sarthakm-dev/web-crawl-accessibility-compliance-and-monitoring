import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import api from '@/utils/api';
import {
  useSiteSummary,
  useSeverityBreakdown,
  useTopPages,
  useIssues,
} from '../useReports';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('report hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useSiteSummary fetches summary', async () => {
    (api.get as any).mockResolvedValue({ data: { pages_crawled: 5 } });

    const { result } = renderHook(() => useSiteSummary('site1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/api/reports/site-summary', {
      params: { siteId: 'site1' },
    });
  });

  it('useSeverityBreakdown fetches severity data', async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useSeverityBreakdown('site1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalled();
  });

  it('useTopPages fetches top pages', async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    const { result } = renderHook(() => useTopPages('site1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalled();
  });

  it('useIssues fetches issues', async () => {
    (api.get as any).mockResolvedValue({
      data: { rows: [], count: 0 },
    });

    const { result } = renderHook(() => useIssues('site1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/api/reports/issues-table', {
      params: { siteId: 'site1', page: 1 },
    });
  });
});
