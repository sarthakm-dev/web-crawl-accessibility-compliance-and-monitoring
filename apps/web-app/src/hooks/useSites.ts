import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type Site } from '@packages/shared-types/site.types';
import api from '@/utils/api';
import axios from 'axios';
import { toast } from 'sonner';

export function useSites() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;

  const [sites, setSites] = useState<Site[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchSites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/sites?page=${page}&limit=${limit}&search=${search}&status=${status}`
      );
      setSites(res.data.data ?? []);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          `${err.response?.data.error || err.response?.data.message || 'Something went wrong'}`
        );
      } else {
        toast.error('Unexpected Error');
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const updateParams = useCallback(
    (params: Record<string, string>) => {
      setSearchParams({
        page: '1',
        limit: limit.toString(),
        search,
        status,
        ...params,
      });
    },
    [setSearchParams, limit, search, status]
  );

  const removeSite = (siteId: string) => {
    setSites(prev => prev.filter(s => s.id !== siteId));
  };

  const removeSites = (siteIds: string[]) => {
    setSites(prev => prev.filter(s => !siteIds.includes(s.id)));
  };

  return {
    sites,
    loading,
    page,
    limit,
    search,
    status,
    totalPages,
    searchParams,
    setSearchParams,
    fetchSites,
    updateParams,
    removeSite,
    removeSites,
  };
}
