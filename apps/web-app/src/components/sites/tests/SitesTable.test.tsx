import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SitesTable } from '../SitesTable';
import { BrowserRouter } from 'react-router-dom';
import api from '@/utils/api';
import { socket } from '@/utils/socket';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));
vi.mock('@/utils/socket', () => ({
  socket: {
    on: vi.fn(),
    off: vi.fn(),
  },
}));
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
    scheduled_crawl_time: '09:30',
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
  beforeEach(() => {
    vi.clearAllMocks();
    (api.get as any).mockResolvedValue({ data: { data: [] } });
  });

  it('renders the table with site data', async () => {
    renderComponent();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(screen.getByText('Test Site')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('09:30')).toBeInTheDocument();
  });

  it('shows empty state when no sites are provided', () => {
    renderComponent({ ...defaultProps, sites: [] });
    expect(screen.getByText('No sites found.')).toBeInTheDocument();
  });

  it('calls onToggleSelect when a checkbox is clicked', async () => {
    renderComponent();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    const checkboxes = screen.getAllByRole('checkbox');

    fireEvent.click(checkboxes[1]);
    expect(defaultProps.onToggleSelect).toHaveBeenCalledWith('1');
  });

  it('disables the crawl button when the site has a pending crawl', async () => {
    (api.get as any).mockImplementation((_url: string, config?: any) => {
      if (
        config?.params?.siteId === '1' &&
        config?.params?.status === 'pending'
      ) {
        return Promise.resolve({ data: { data: [{ id: 'job-1' }] } });
      }

      return Promise.resolve({ data: { data: [] } });
    });

    renderComponent();

    const crawlButton = await screen.findByRole('button', {
      name: 'Crawl in progress for Test Site',
    });

    expect(crawlButton).toBeDisabled();

    fireEvent.click(crawlButton);

    expect(api.post).not.toHaveBeenCalled();
  });

  it('re-enables the crawl button when the active crawl completes', async () => {
    (api.get as any).mockImplementation((_url: string, config?: any) => {
      if (
        config?.params?.siteId === '1' &&
        config?.params?.status === 'pending'
      ) {
        return Promise.resolve({ data: { data: [{ id: 'job-1' }] } });
      }

      return Promise.resolve({ data: { data: [] } });
    });

    renderComponent();

    await screen.findByRole('button', {
      name: 'Crawl in progress for Test Site',
    });

    const updateHandler = (socket.on as any).mock.calls.find(
      (call: [string, (event: unknown) => void]) =>
        call[0] === 'crawl-job-updated'
    )?.[1];

    expect(updateHandler).toBeTypeOf('function');

    act(() => {
      updateHandler({
        siteId: '1',
        jobId: 'job-1',
        status: 'completed',
      });
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Start crawl for Test Site' })
      ).toBeEnabled();
    });
  });
});
