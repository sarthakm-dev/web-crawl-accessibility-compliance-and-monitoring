import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useSites } from '../useSites';
import type { Site } from '@packages/shared-types/site.types';

import axios from 'axios';
import { toast } from 'sonner';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('axios');
vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

let params = new URLSearchParams('?page=1&limit=5&search=&status=all');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => {
      const setParams = (newParams: Record<string, string>) => {
        params = new URLSearchParams(newParams as any);

        for (const [key] of params.entries()) {
          params.delete(key);
        }
        for (const [key, value] of Object.entries(newParams)) {
          params.set(key, value);
        }
      };
      return [params, setParams];
    },
  };
});

describe('useSites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useSites());
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(5);
    expect(result.current.search).toBe('');
    expect(result.current.status).toBe('all');
    expect(result.current.sites).toEqual([]);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.loading).toBe(true);
  });

  it('fetchSites updates sites and totalPages on success', async () => {
    const mockSites: Site[] = [{ id: '1', name: 'Site A' } as any];
    const api = (await import('@/utils/api')).default;
    (api.get as any).mockResolvedValue({
      data: { data: mockSites, pagination: { totalPages: 3 } },
    });

    const { result } = renderHook(() => useSites());

    await act(async () => {
      await result.current.fetchSites();
    });

    expect(result.current.sites).toEqual(mockSites);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.loading).toBe(false);
  });

  it('fetchSites calls toast.error on axios error', async () => {
    const api = (await import('@/utils/api')).default;
    (api.get as any).mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: 'API Error' } },
    });
    (axios.isAxiosError as any).mockReturnValue(true);

    const { result } = renderHook(() => useSites());

    await act(async () => {
      await result.current.fetchSites();
    });

    expect(toast.error).toHaveBeenCalledWith('API Error');
    expect(result.current.loading).toBe(false);
  });

  it('removeSite removes a site by id', () => {
    const { result } = renderHook(() => useSites());

    act(() => {
      result.current.setSearchParams({});
      result.current.removeSite('1');
    });

    expect(result.current.sites.find(s => s.id === '1')).toBeUndefined();
  });

  it('removeSites removes multiple sites', () => {
    const { result } = renderHook(() => useSites());

    act(() => {
      result.current.setSearchParams({});
      result.current.removeSites(['1', '2']);
    });

    expect(
      result.current.sites.find(s => ['1', '2'].includes(s.id))
    ).toBeUndefined();
  });
});
