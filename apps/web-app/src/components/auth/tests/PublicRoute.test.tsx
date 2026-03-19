import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { PublicRoute } from '../PublicRoute';
import { useAuthStore } from '@/store/auth-store';

// Mock the store
vi.mock('@/store/auth-store', () => ({
  useAuthStore: vi.fn(),
}));

describe('PublicRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /dashboard when user exists', () => {
    (useAuthStore as any).mockReturnValue({ user: { id: '1' } });

    const { container } = render(
      <MemoryRouter initialEntries={['/auth']}>
        <Routes>
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<div>Auth Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(container.innerHTML).toContain('Dashboard Page');
  });

  it('renders outlet content when no user exists', () => {
    (useAuthStore as any).mockReturnValue({ user: null });

    const { container } = render(
      <MemoryRouter initialEntries={['/auth']}>
        <Routes>
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<div>Auth Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(container.innerHTML).toContain('Auth Page');
  });
});
