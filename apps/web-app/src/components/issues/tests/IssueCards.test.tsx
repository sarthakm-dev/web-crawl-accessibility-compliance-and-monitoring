import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { IssuesCardList } from '../IssueCards';
import * as authStore from '@/store/auth-store';
import type { Issue } from '@/types/issue.types';

vi.mock('@/store/auth-store');

describe('IssuesCardList', () => {
  const mockIssue: Issue = {
    id: '1',
    title: 'Missing alt attribute',
    url: 'https://example.com',
    selector: 'img',
    impact: 'critical',
    status: 'open',
    firstDetected: '2024-01-01',
  };

  const props = {
    issues: [mockIssue],
    onSelect: vi.fn(),
    onStatusChange: vi.fn(),
    search: '',
    status: '',
    limit: 10,
    setSearchParams: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();

    vi.spyOn(authStore, 'useAuthStore').mockImplementation((selector: any) =>
      selector({
        hasPermission: () => true,
      })
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders issues', () => {
    render(<IssuesCardList {...props} />);

    expect(screen.getByText('Missing alt attribute')).toBeInTheDocument();
  });

  it('calls onSelect when issue card clicked', () => {
    render(<IssuesCardList {...props} />);

    fireEvent.click(screen.getByText('Missing alt attribute'));

    expect(props.onSelect).toHaveBeenCalledWith(mockIssue);
  });

  it('renders search input', () => {
    render(<IssuesCardList {...props} />);

    expect(screen.getByPlaceholderText('Search issues...')).toBeInTheDocument();
  });

  it('shows status badge when permission exists', () => {
    render(<IssuesCardList {...props} />);

    expect(screen.getByText('open')).toBeInTheDocument();
  });
});
