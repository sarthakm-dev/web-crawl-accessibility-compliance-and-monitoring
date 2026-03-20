import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateSiteDialog } from '../CreateSiteDialog';
import api from '@/utils/api';
import { toast } from 'sonner';

vi.mock('@/utils/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CreateSiteDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens dialog when trigger button is clicked', () => {
    render(<CreateSiteDialog onCreated={vi.fn()} />);
    const trigger = screen.getByText('+ Add Site');
    fireEvent.click(trigger);
    expect(screen.getByText('Add New Site')).toBeInTheDocument();
  });

  it('updates inputs correctly', () => {
    render(<CreateSiteDialog onCreated={vi.fn()} />);
    fireEvent.click(screen.getByText('+ Add Site'));

    const nameInput = screen.getByPlaceholderText('Site Name');
    const urlInput = screen.getByPlaceholderText('https://example.com');

    fireEvent.change(nameInput, { target: { value: 'My Site' } });
    fireEvent.change(urlInput, { target: { value: 'https://mysite.com' } });

    expect(nameInput).toHaveValue('My Site');
    expect(urlInput).toHaveValue('https://mysite.com');
  });

  it('submits successfully', async () => {
    (api.post as any).mockResolvedValue({});

    const onCreated = vi.fn();
    render(<CreateSiteDialog onCreated={onCreated} />);
    fireEvent.click(screen.getByText('+ Add Site'));

    fireEvent.change(screen.getByPlaceholderText('Site Name'), {
      target: { value: 'My Site' },
    });
    fireEvent.change(screen.getByPlaceholderText('https://example.com'), {
      target: { value: 'https://mysite.com' },
    });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/sites', {
        name: 'My Site',
        baseUrl: 'https://mysite.com',
      });
      expect(onCreated).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Site created successfully');
    });
  });

  it('shows error toast on failure', async () => {
    (api.post as any).mockRejectedValue(new Error('fail'));

    render(<CreateSiteDialog onCreated={vi.fn()} />);
    fireEvent.click(screen.getByText('+ Add Site'));

    fireEvent.change(screen.getByPlaceholderText('Site Name'), {
      target: { value: 'Bad Site' },
    });
    fireEvent.change(screen.getByPlaceholderText('https://example.com'), {
      target: { value: 'https://bad.com' },
    });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create site');
    });
  });
});
