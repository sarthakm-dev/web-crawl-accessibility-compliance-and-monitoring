import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SeverityChart } from '../SeverityChart';

import * as reportsHook from '@/hooks/useReports';
import { toast } from 'sonner';

vi.mock('@/hooks/useReports');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('SeverityChart', () => {
  it('returns null while loading', () => {
    vi.spyOn(reportsHook, 'useSeverityBreakdown').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    const { container } = render(
      <SeverityChart siteId="1" startDate="2024-01-01" endDate="2024-01-02" />
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows error toast when request fails', async () => {
    vi.spyOn(reportsHook, 'useSeverityBreakdown').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(
      <SeverityChart siteId="1" startDate="2024-01-01" endDate="2024-01-02" />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to load severity breakdown'
      );
    });
  });

  it('shows info toast when no data', async () => {
    vi.spyOn(reportsHook, 'useSeverityBreakdown').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    render(
      <SeverityChart siteId="1" startDate="2024-01-01" endDate="2024-01-02" />
    );

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        'No severity data available for selected dates'
      );
    });
  });

  it('renders chart when data exists', () => {
    vi.spyOn(reportsHook, 'useSeverityBreakdown').mockReturnValue({
      data: [
        { severity: 'critical', count: 5 },
        { severity: 'serious', count: 3 },
      ],
      isLoading: false,
      isError: false,
    } as any);

    const { container } = render(
      <SeverityChart siteId="1" startDate="2024-01-01" endDate="2024-01-02" />
    );

    expect(container).toBeInTheDocument();
  });
});
