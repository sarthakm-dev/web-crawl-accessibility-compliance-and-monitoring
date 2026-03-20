import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('AuthInitializer', () => {
  let mockSetUser: any;
  let mockClearUser: any;
  let authApi: any;
  let AuthInitializer: any;

  beforeEach(async () => {
    vi.resetModules();
    mockSetUser = vi.fn();
    mockClearUser = vi.fn();

    vi.doMock('@/store/auth-store', () => ({
      useAuthStore: vi.fn((selector: any) =>
        selector({
          setUser: mockSetUser,
          clearUser: mockClearUser,
        })
      ),
    }));

    vi.doMock('@/utils/api', () => ({
      default: {
        get: vi.fn(),
      },
    }));

    authApi = (await import('@/utils/api')).default;
    AuthInitializer = (await import('../AuthInitializer')).default;
  });

  it('calls setUser when auth succeeds', async () => {
    authApi.get.mockResolvedValue({ data: { id: 1 } });

    render(
      <AuthInitializer>
        <div>App</div>
      </AuthInitializer>
    );

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({ id: 1 });
    });
  });

  it('calls clearUser when auth fails', async () => {
    authApi.get.mockRejectedValue(new Error('Unauthorized'));

    render(
      <AuthInitializer>
        <div>App</div>
      </AuthInitializer>
    );

    await waitFor(() => {
      expect(mockClearUser).toHaveBeenCalled();
    });
  });

  it('renders children', () => {
    const { getByText } = render(
      <AuthInitializer>
        <div>Child Component</div>
      </AuthInitializer>
    );

    expect(getByText('Child Component')).toBeInTheDocument();
  });
});
