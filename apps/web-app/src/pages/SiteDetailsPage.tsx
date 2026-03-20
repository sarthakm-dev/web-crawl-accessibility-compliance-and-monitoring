import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '@/utils/api';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

import { type Site } from '@packages/shared-types/site.types';
import { type CrawlJob } from '@packages/shared-types/crawl-job.types';

import { useAuthStore } from '@/store/auth-store';
import { columns } from '@/config/site-columns';

import { PaginationControls } from '@/components/common/Pagination';
import { useCrawlJobSocket } from '@/hooks/useCrawlJobSocket';

export default function SiteDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 10);

  const [site, setSite] = useState<Site | null>(null);
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const hasPermission = useAuthStore(state => state.hasPermission);

  const fetchJobs = useCallback(async () => {
    if (!id) return;

    try {
      const res = await api.get(
        `/api/crawl?siteId=${id}&page=${page}&limit=${limit}`
      );
      setJobs(res.data.data ?? []);
      setTotalPages(res.data.pagination?.totalPages ?? 1);
    } catch {
      toast.error('Failed to load jobs');
    }
  }, [id, page, limit]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const siteRes = await api.get(`/api/sites/${id}`);

        setSite(siteRes.data);

        await fetchJobs();
      } catch {
        toast.error('Failed to load site');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, fetchJobs]);

  useCrawlJobSocket(setJobs, id);

  const startCrawl = async () => {
    if (!id) return;

    try {
      await api.post('/api/crawl', {
        siteId: id,
        triggerType: 'manual',
      });

      await fetchJobs();

      toast.success('Crawl started');
    } catch {
      toast.error('Failed to start crawl');
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!site) {
    return <div className="p-8 text-muted-foreground">Site not found.</div>;
  }

  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Site Details */}

        <Card className="rounded-xl shadow-sm border-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold">{site.name}</h1>
                <p className="text-muted-foreground">{site.base_url}</p>
              </div>

              <Badge
                className={
                  site.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }
              >
                {site.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Created on {new Date(site.created_at).toLocaleDateString()}
              </p>

              {hasPermission('crawl:trigger') && (
                <Button
                  onClick={startCrawl}
                  disabled={!site.is_active}
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  Start Crawl
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Crawl Jobs */}

        <Card className="rounded-xl shadow-sm border-none">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {columns.map(col => (
                    <TableHead key={col.key} className="text-center">
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No crawl jobs yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map(job => (
                    <TableRow key={job.id} className="border-none">
                      <TableCell className="font-mono text-xs text-center">
                        {job.id}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={
                            job.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : job.status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        {job.triggerType}
                      </TableCell>

                      <TableCell className="text-center">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Pagination */}
        <PaginationControls
          page={page}
          limit={limit}
          totalPages={totalPages}
          setSearchParams={setSearchParams}
        />
      </div>
    </div>
  );
}
