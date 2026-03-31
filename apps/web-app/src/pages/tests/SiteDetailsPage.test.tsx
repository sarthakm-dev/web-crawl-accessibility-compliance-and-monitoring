import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SiteDetailsPage from '../SiteDetailsPage';
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

vi.mock('@/hooks/useCrawlJobSocket', () => ({
  useCrawlJobSocket: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@/store/auth-store', () => ({
  useAuthStore: (
    selector: (state: { hasPermission: () => boolean }) => boolean
  ) => selector({ hasPermission: () => true }),
}));

const mockSite = {
  id: 'site-1',
  name: 'Example Site',
  base_url: 'https://example.com',
  is_active: true,
  scheduled_crawl_time: '07:00',
  created_at: '2026-03-20T00:00:00.000Z',
};

const mockJobs = [
  {
    id: 'job-1',
    status: 'pending',
    triggerType: 'manual',
    createdAt: '2026-03-20T00:00:00.000Z',
  },
];

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/sites/site-1']}>
      <Routes>
        <Route path="/sites/:id" element={<SiteDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('SiteDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables the start crawl button when the site has a pending crawl', async () => {
    (api.get as any).mockImplementation((url: string, config?: any) => {
      if (url === '/api/sites/site-1') {
        return Promise.resolve({ data: mockSite });
      }

      if (url === '/api/crawl?siteId=site-1&page=1&limit=10') {
        return Promise.resolve({
          data: { data: mockJobs, pagination: { totalPages: 1 } },
        });
      }

      if (url === '/api/crawl' && config?.params?.status === 'pending') {
        return Promise.resolve({ data: { data: mockJobs } });
      }

      if (url === '/api/crawl' && config?.params?.status === 'running') {
        return Promise.resolve({ data: { data: [] } });
      }

      throw new Error(`Unhandled request: ${url}`);
    });

    renderPage();

    const button = await screen.findByRole('button', {
      name: 'Crawl In Progress',
    });

    expect(screen.getByText('Daily crawl: 07:00')).toBeInTheDocument();
    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(api.post).not.toHaveBeenCalled();
  });

  it('re-enables the start crawl button when the active crawl completes', async () => {
    (api.get as any).mockImplementation((url: string, config?: any) => {
      if (url === '/api/sites/site-1') {
        return Promise.resolve({ data: mockSite });
      }

      if (url === '/api/crawl?siteId=site-1&page=1&limit=10') {
        return Promise.resolve({
          data: { data: mockJobs, pagination: { totalPages: 1 } },
        });
      }

      if (url === '/api/crawl' && config?.params?.status === 'pending') {
        return Promise.resolve({ data: { data: mockJobs } });
      }

      if (url === '/api/crawl' && config?.params?.status === 'running') {
        return Promise.resolve({ data: { data: [] } });
      }

      throw new Error(`Unhandled request: ${url}`);
    });

    renderPage();

    await screen.findByRole('button', {
      name: 'Crawl In Progress',
    });

    const updateHandler = (socket.on as any).mock.calls.find(
      (call: [string, (event: unknown) => void]) =>
        call[0] === 'crawl-job-updated'
    )?.[1];

    expect(updateHandler).toBeTypeOf('function');

    act(() => {
      updateHandler({
        siteId: 'site-1',
        jobId: 'job-1',
        status: 'completed',
      });
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Start Crawl' })).toBeEnabled();
    });
  });
});
