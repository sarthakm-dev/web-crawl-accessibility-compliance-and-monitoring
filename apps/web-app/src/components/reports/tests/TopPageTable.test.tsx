import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TopPagesTable } from '../TopPageTable';
import * as hooks from '@/hooks/useReports';
import { toast } from 'sonner';

vi.mock('@/hooks/useReports');

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('TopPagesTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table rows', () => {
    vi.spyOn(hooks, 'useTopPages').mockReturnValue({
      data: [
        {
          page_url: 'https://example.com',
          total_issues: 10,
          critical_count: 3,
        },
      ],
      isLoading: false,
      isError: false,
    } as any);

    render(
      <TopPagesTable
        siteId="site1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    expect(screen.getByText('Top Problem Pages')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows error toast when request fails', () => {
    vi.spyOn(hooks, 'useTopPages').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(
      <TopPagesTable
        siteId="site1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    expect(toast.error).toHaveBeenCalledWith('Failed to load top pages');
  });

  it('shows info toast when no pages found', () => {
    vi.spyOn(hooks, 'useTopPages').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    render(
      <TopPagesTable
        siteId="site1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    expect(toast.info).toHaveBeenCalledWith(
      'No problem pages found for selected dates'
    );
  });

  it('renders nothing while loading', () => {
    vi.spyOn(hooks, 'useTopPages').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    const { container } = render(
      <TopPagesTable
        siteId="site1"
        startDate="2024-01-01"
        endDate="2024-01-02"
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
