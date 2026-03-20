import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDebouncedSearch } from '../useDebouncedSearch';
import type { UseDebouncedSearchOptions } from '@/types/sites.types';

describe('useDebouncedSearch', () => {
  beforeEach(() => {
    // Reset URL for each test
    window.history.pushState({}, '', '/?page=2');
  });

  it('initializes with provided search value', () => {
    const setSearchParams = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedSearch({
        search: 'initial',
        limit: 10,
        status: 'active',
        setSearchParams,
        delay: 200,
      } as UseDebouncedSearchOptions)
    );

    expect(result.current.searchInput).toBe('initial');
  });

  it('updates searchInput when search prop changes', () => {
    const setSearchParams = vi.fn();

    const { result, rerender } = renderHook(
      (props: UseDebouncedSearchOptions) => useDebouncedSearch(props),
      {
        initialProps: {
          search: 'first',
          limit: 10,
          status: 'active',
          setSearchParams,
          delay: 200,
        },
      }
    );

    expect(result.current.searchInput).toBe('first');

    rerender({
      search: 'second',
      limit: 10,
      status: 'active',
      setSearchParams,
      delay: 200,
    });

    expect(result.current.searchInput).toBe('second');
  });

  it('calls setSearchParams after debounce delay', async () => {
    vi.useFakeTimers();
    const setSearchParams = vi.fn();

    const { result } = renderHook(() =>
      useDebouncedSearch({
        search: 'query',
        limit: 5,
        status: 'inactive',
        setSearchParams,
        delay: 300,
      } as UseDebouncedSearchOptions)
    );

    act(() => {
      result.current.setSearchInput('new-query');
    });

    // Fast-forward timers
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(setSearchParams).toHaveBeenCalledWith({
      page: '2',
      limit: '5',
      search: 'new-query',
      status: 'inactive',
    });

    vi.useRealTimers();
  });
});
