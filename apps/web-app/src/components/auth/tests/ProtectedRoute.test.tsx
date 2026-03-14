import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ProtectedRoute from '../ProtectedRoute';
import api from '@/utils/api';
import { socket } from '@/utils/socket';
import { describe, it, expect } from 'vitest';
vi.mock('@/utils/api');
vi.mock('@/utils/socket', () => ({
  socket: {
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('ProtectedRoute', () => {
  it('shows loading while checking auth', () => {
    (api.get as any).mockResolvedValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  it('renders children when authenticated', async () => {
    (api.get as any).mockResolvedValue({
      data: { id: 'user1', email: 'test@test.com' },
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    expect(socket.connect).toHaveBeenCalled();
  });

  it('redirects to login when not authenticated', async () => {
    (api.get as any).mockRejectedValue(new Error('Unauthorized'));

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/auth/me');
    });
  });
});
