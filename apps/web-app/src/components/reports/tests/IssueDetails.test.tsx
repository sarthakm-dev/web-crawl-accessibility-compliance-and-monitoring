import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IssuesCards } from '../IssueDetails';
import * as hooks from '@/hooks/useReports';
import { toast } from 'sonner';

vi.mock('@/hooks/useReports');

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const mockIssues = {
  rows: [
    {
      id: '1',
      page_url: 'https://example.com',
      rule_id: 'img-alt',
      message: 'Image missing alt',
      selector: 'img',
      severity: 'critical',
    },
  ],
  count: 1,
};

describe('IssuesCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders issues', () => {
    vi.spyOn(hooks, 'useIssues').mockReturnValue({
      data: mockIssues,
      isLoading: false,
      isError: false,
    } as any);

    render(
      <IssuesCards siteId="site1" startDate="2024-01-01" endDate="2024-01-02" />
    );

    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('Image missing alt')).toBeInTheDocument();
  });

  it('filters issues by search', async () => {
    const user = userEvent.setup();

    vi.spyOn(hooks, 'useIssues').mockReturnValue({
      data: mockIssues,
      isLoading: false,
      isError: false,
    } as any);

    render(
      <IssuesCards siteId="site1" startDate="2024-01-01" endDate="2024-01-02" />
    );

    const input = screen.getByPlaceholderText('Search page...');

    await user.type(input, 'example');

    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  it('shows error toast when request fails', () => {
    vi.spyOn(hooks, 'useIssues').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(
      <IssuesCards siteId="site1" startDate="2024-01-01" endDate="2024-01-02" />
    );

    expect(toast.error).toHaveBeenCalledWith('Failed to load issues');
  });

  it('shows info toast when no issues found', () => {
    vi.spyOn(hooks, 'useIssues').mockReturnValue({
      data: { rows: [], count: 0 },
      isLoading: false,
      isError: false,
    } as any);

    render(
      <IssuesCards siteId="site1" startDate="2024-01-01" endDate="2024-01-02" />
    );

    expect(toast.info).toHaveBeenCalledWith(
      'No issues found for selected filters'
    );
  });

  it('handles pagination next button', async () => {
    const user = userEvent.setup();

    vi.spyOn(hooks, 'useIssues').mockReturnValue({
      data: { ...mockIssues, count: 20 },
      isLoading: false,
      isError: false,
    } as any);

    render(
      <IssuesCards siteId="site1" startDate="2024-01-01" endDate="2024-01-02" />
    );

    const nextButton = screen.getByRole('button', { name: /next/i });

    await user.click(nextButton);

    expect(screen.getByText(/Page 2/)).toBeInTheDocument();
  });
});
