import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SummaryCards } from '../SummaryCards';
import * as hooks from '@/hooks/useReports';
import { toast } from 'sonner';

vi.mock('@/hooks/useReports');
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('SummaryCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders summary cards', () => {
    vi.spyOn(hooks, 'useSiteSummary').mockReturnValue({
      data: {
        pages_crawled: 20,
        total_issues: 15,
        accessibility_score: 85,
      },
      isLoading: false,
      isError: false,
    } as any);

    render(
      <SummaryCards
        siteId="site1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    expect(screen.getByText('Pages Crawled')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();

    expect(screen.getByText('Total Issues')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();

    expect(screen.getByText('Accessibility Score')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('shows error toast when request fails', () => {
    vi.spyOn(hooks, 'useSiteSummary').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(
      <SummaryCards
        siteId="site1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    expect(toast.error).toHaveBeenCalledWith('Failed to load summary data');
  });

  it('shows info toast when no data available', () => {
    vi.spyOn(hooks, 'useSiteSummary').mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as any);

    render(
      <SummaryCards
        siteId="site1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    expect(toast.info).toHaveBeenCalledWith(
      'No crawl data available for selected dates'
    );
  });

  it('renders nothing while loading', () => {
    vi.spyOn(hooks, 'useSiteSummary').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    const { container } = render(
      <SummaryCards
        siteId="site1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
