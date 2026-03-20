import type { UseDebouncedSearchOptions } from '@/types/sites.types';
import { useEffect, useState } from 'react';

export function useDebouncedSearch({
  search,
  limit,
  status,
  setSearchParams,
  delay = 500,
}: UseDebouncedSearchOptions) {
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const currentPage = params.get('page') || '1';

      setSearchParams({
        page: currentPage,
        limit: limit.toString(),
        search: searchInput,
        status,
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [searchInput, setSearchParams, limit, status, delay]);

  return { searchInput, setSearchInput };
}
