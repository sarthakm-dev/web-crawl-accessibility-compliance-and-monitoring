import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/utils/api';
import { type CrawlJob } from '../../../../packages/shared-types/crawl-job.types';
import { RefreshCwIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { statusConfig } from '@/config/status-config';
import { columns } from '@/config/crawl-job-columns';

export default function CrawlJobsPage() {
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const status = searchParams.get('status') || 'all';

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/crawl?page=${page}&limit=${limit}`);
      setJobs(res.data.data ?? []);
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
  }, [page, limit]);
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Crawl Jobs</h1>
        <p className="text-muted-foreground">Monitor crawl execution history</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {jobs.length} crawl jobs
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchJobs}
          disabled={loading}
          className="gap-2 text-blue-700"
        >
          <RefreshCwIcon />
        </Button>
      </div>
      {/* Crawl Jobs table */}
      <Card className="border-none rounded-xl shadow-sm bg-background/60 backdrop-blur-sm">
        <Table className="rounded-xl">
          <TableHeader>
            <TableRow className="border-b bg-muted border-muted">
              {columns.map(col => (
                <TableHead key={col.key} className="text-center">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading
              ? [...Array(limit)].map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, idx) => (
                      <TableCell className="text-center" key={idx}>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : jobs.map(job => (
                  <TableRow
                    key={job.id}
                    className="hover:bg-muted/40 bg-background border-none transition cursor-pointer"
                  >
                    <TableCell className="font-medium text-center">
                      {job.id}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-center">
                      {job.site?.name ?? '-'}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge className={statusConfig[job.status].className}>
                        {statusConfig[job.status].label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      {job.triggerType}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-center">
                      {job.requestedBy?.name ?? '-'}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-center">
                      {new Date(job.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex justify-end items-center gap-4 pt-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() =>
            setSearchParams({
              page: (page - 1).toString(),
              limit: limit.toString(),
              search,
              status,
            })
          }
        >
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() =>
            setSearchParams({
              page: (page + 1).toString(),
              limit: limit.toString(),
              search,
              status,
            })
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
