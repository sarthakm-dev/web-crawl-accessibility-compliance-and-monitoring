import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SitesToolbar } from '../SitesToolbar';

vi.mock('@/store/auth-store', () => ({
  useAuthStore: (selector: any) =>
    selector({
      hasPermission: (perm: string) => {
        if (perm === 'site:create') return true;
        if (perm === 'site:delete') return true;
        return false;
      },
    }),
}));

describe('SitesToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    searchInput: '',
    status: 'all',
    limit: 5,
    selectedCount: 0,
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onLimitChange: vi.fn(),
    onSiteCreated: vi.fn(),
    onBulkDelete: vi.fn(),
  };

  it('renders TableFilters with correct props', () => {
    render(<SitesToolbar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search sites...')).toBeInTheDocument();
  });

  it('renders CreateSiteDialog when user has site:create permission', () => {
    render(<SitesToolbar {...defaultProps} />);
    expect(screen.getByText('+ Add Site')).toBeInTheDocument();
  });

  it('does not render Delete Selected button when selectedCount is 0', () => {
    render(<SitesToolbar {...defaultProps} />);
    expect(screen.queryByText(/Delete Selected/)).not.toBeInTheDocument();
  });

  it('renders Delete Selected button when selectedCount > 0 and permission granted', () => {
    render(<SitesToolbar {...defaultProps} selectedCount={3} />);
    expect(screen.getByText('Delete Selected (3)')).toBeInTheDocument();
  });

  it('calls onBulkDelete when Delete Selected button clicked', () => {
    const onBulkDelete = vi.fn();
    render(
      <SitesToolbar
        {...defaultProps}
        selectedCount={2}
        onBulkDelete={onBulkDelete}
      />
    );
    fireEvent.click(screen.getByText('Delete Selected (2)'));
    expect(onBulkDelete).toHaveBeenCalled();
  });
});
