import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { ProtectedRoute } from '../ProtectedRoute';
import { useAuthStore } from '@/store/auth-store';

// Mock the store
vi.mock('@/store/auth-store', () => ({
  useAuthStore: vi.fn(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to / when no user is present', () => {
    (useAuthStore as any).mockReturnValue({ user: null });

    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(container.innerHTML).toContain('Login Page');
  });

  it('renders protected content when user exists', () => {
    (useAuthStore as any).mockReturnValue({ user: { id: '1' } });

    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(container.innerHTML).toContain('Protected Content');
  });
});
