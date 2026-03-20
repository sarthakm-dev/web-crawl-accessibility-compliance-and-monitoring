import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteSiteDialog } from '../DeleteSiteDialog';
import api from '@/utils/api';
import { toast } from 'sonner';

vi.mock('@/utils/api', () => ({
  default: {
    delete: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('DeleteSiteDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens dialog when trigger button is clicked', () => {
    render(<DeleteSiteDialog siteId="123" onDeleted={vi.fn()} />);
    fireEvent.click(screen.getByRole('button')); // trigger button
    expect(screen.getByText('Delete this site?')).toBeInTheDocument();
  });

  it('calls api.delete and shows success toast on delete', async () => {
    (api.delete as any).mockResolvedValue({});
    const onDeleted = vi.fn();

    render(<DeleteSiteDialog siteId="123" onDeleted={onDeleted} />);
    fireEvent.click(screen.getByRole('button')); // open dialog

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/api/sites/123');
      expect(onDeleted).toHaveBeenCalledWith('123');
      expect(toast.success).toHaveBeenCalledWith('Site deleted');
    });
  });

  it('shows error toast on failure', async () => {
    (api.delete as any).mockRejectedValue(new Error('fail'));

    render(<DeleteSiteDialog siteId="123" onDeleted={vi.fn()} />);
    fireEvent.click(screen.getByRole('button')); // open dialog

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete site');
    });
  });

  it('closes dialog when cancel is clicked', () => {
    render(<DeleteSiteDialog siteId="123" onDeleted={vi.fn()} />);
    fireEvent.click(screen.getByRole('button'));

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Delete this site?')).not.toBeInTheDocument();
  });
});
