import { describe, it, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import '@testing-library/jest-dom';
import api from '@/utils/api';
import { socket } from '@/utils/socket';
import type { Mock } from 'vitest';
vi.mock('@/utils/api', () => ({
  default: { get: vi.fn() },
}));
vi.mock('@/store/auth-store', () => ({
  useAuthStore: { getState: () => ({ setUser: vi.fn() }) },
}));
vi.mock('@/utils/socket', () => ({
  socket: { connect: vi.fn(), disconnect: vi.fn() },
}));
vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

describe('ProtectedRoute', () => {
  it('renders children when authenticated', async () => {
    (api.get as Mock).mockResolvedValueOnce({ data: { id: 1, name: 'User' } });

    render(
      <ProtectedRoute>
        <div>Private Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText(/Checking authentication/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Private Content')).toBeInTheDocument();
      expect(socket.connect).toHaveBeenCalled();
    });
  });
});
