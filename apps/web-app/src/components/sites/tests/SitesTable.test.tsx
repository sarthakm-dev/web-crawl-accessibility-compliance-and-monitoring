import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SitesTable } from '../SitesTable';
import { BrowserRouter } from 'react-router-dom';

vi.mock('@/utils/api');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/store/auth-store', () => ({
  useAuthStore: (cb: any) => cb({ hasPermission: () => true }),
}));

const mockSites = [
  {
    id: '1',
    name: 'Test Site',
    base_url: 'https://test.com',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const defaultProps = {
  sites: mockSites,
  loading: false,
  limit: 5,
  selectedIds: [],
  onToggleSelect: vi.fn(),
  onSelectAll: vi.fn(),
  onClearSelection: vi.fn(),
  isAllSelected: false,
  onSiteDeleted: vi.fn(),
};

const renderComponent = (props = defaultProps) => {
  return render(
    <BrowserRouter>
      <SitesTable {...props} />
    </BrowserRouter>
  );
};

describe('SitesTable', () => {
  it('renders the table with site data', () => {
    renderComponent();
    expect(screen.getByText('Test Site')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows empty state when no sites are provided', () => {
    renderComponent({ ...defaultProps, sites: [] });
    expect(screen.getByText('No sites found.')).toBeInTheDocument();
  });

  it('calls onToggleSelect when a checkbox is clicked', () => {
    renderComponent();
    const checkboxes = screen.getAllByRole('checkbox');

    fireEvent.click(checkboxes[1]);
    expect(defaultProps.onToggleSelect).toHaveBeenCalledWith('1');
  });
});
