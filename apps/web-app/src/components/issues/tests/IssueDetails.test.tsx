import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/store/auth-store');
vi.mock('@mui/lab', () => ({
  Timeline: ({ children }: any) => <div>{children}</div>,
  TimelineItem: ({ children }: any) => <div>{children}</div>,
  TimelineSeparator: ({ children }: any) => <div>{children}</div>,
  TimelineConnector: () => <div />,
  TimelineContent: ({ children }: any) => <div>{children}</div>,
  TimelineDot: () => <div />,
}));
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: any) => <div>{children}</div>,
  SheetContent: ({ children }: any) => <div>{children}</div>,
  SheetHeader: ({ children }: any) => <div>{children}</div>,
  SheetTitle: ({ children }: any) => <div>{children}</div>,
  SheetDescription: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('@mui/material/Typography', () => ({
  default: ({ children }: any) => <span>{children}</span>,
}));
import { IssueDetailsSheet } from '../IssueDetails';
import * as authStore from '@/store/auth-store';
import type { IssueDetail } from '@/types/issue.types';
import userEvent from '@testing-library/user-event';
describe('IssueDetailsSheet', () => {
  const mockIssue: IssueDetail = {
    id: '1',
    title: 'Missing alt attribute',
    impact: 'critical',
    status: 'open',
    selector: 'img',
    wcag_reference: '1.1.1',
    url: 'https://example.com',
    firstDetected: '2024-01-01',

    IssueStatusHistories: [
      {
        id: '1',
        new_status: 'open',
        previous_status: null,
        changed_at: new Date().toISOString(),
        note: 'Issue created',
        User: {
          name: 'Admin',
          email: 'admin@test.com',
        },
      },
    ],

    IssueNotes: [],
  };

  const props = {
    issue: mockIssue,
    open: true,
    onOpenChange: vi.fn(),
    onStatusChange: vi.fn(),
    onAddComment: vi.fn(),
  };

  beforeEach(() => {
    vi.spyOn(authStore, 'useAuthStore').mockImplementation((selector: any) =>
      selector({
        hasPermission: () => true,
      })
    );
  });

  it('renders issue title', () => {
    render(<IssueDetailsSheet {...props} />);

    expect(screen.getByText('Missing alt attribute')).toBeInTheDocument();
  });

  it('renders issue impact badge', () => {
    render(<IssueDetailsSheet {...props} />);

    expect(screen.getByText('critical')).toBeInTheDocument();
  });

  it('shows add comment textarea', () => {
    render(<IssueDetailsSheet {...props} />);

    expect(
      screen.getByPlaceholderText('Write a comment...')
    ).toBeInTheDocument();
  });

  it('calls onAddComment when clicking add comment', async () => {
    const user = userEvent.setup();

    render(<IssueDetailsSheet {...props} />);

    const textarea = screen.getByPlaceholderText('Write a comment...');
    const button = screen.getByText('Add Comment');

    await user.type(textarea, 'Test comment');
    await user.click(button);

    expect(props.onAddComment).toHaveBeenCalledWith('1', 'Test comment');
  });
});
