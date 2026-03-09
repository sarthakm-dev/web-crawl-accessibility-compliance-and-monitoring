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
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import api from '@/utils/api';
import { socket } from '@/utils/socket';

import axios from 'axios';
import { toast } from 'sonner';

import { columns } from '@/config/crawl-job-columns';
import { statusConfig } from '@/config/status-config';

import { PaginationControls } from '@/components/common/Pagination';
import { TableFilters } from '@/components/common/TableFilters';

import { type CrawlJob } from '../../../../packages/shared-types/crawl-job.types';
import { crawlJobFilterConfig } from '@/config/table-filter-config';
import type { CrawlJobUpdatedEvent } from '@/types/crawl.types';
export default function CrawlJobsPage() {
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const status = searchParams.get('status') || 'all';

  const fetchJobs = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get('/api/crawl', {
        params: {
          page,
          limit,
          search,
          status: status === 'all' ? undefined : status,
        },
      });

      setJobs(res.data.data ?? []);
      setTotalPages(res.data.pagination?.totalPages ?? 1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.error ||
            err.response?.data?.message ||
            'Something went wrong'
        );
      } else {
        toast.error('Unexpected error');
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const handleJobUpdate = (event: CrawlJobUpdatedEvent) => {
      setJobs(prev =>
        prev.map(job =>
          job.id === event.jobId ? { ...job, status: event.status } : job
        )
      );
    };
    socket.connect();
    socket.on('crawl-job-updated', handleJobUpdate);

    return () => {
      socket.off('crawl-job-updated', handleJobUpdate);
    };
  }, []);

  const toggleJobSelection = (id: string) => {
    setSelectedJobs(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    );
  };

  const deleteJobs = async () => {
    try {
      await api.request({
        method: 'delete',
        url: '/api/crawl/bulk',
        data: { ids: selectedJobs },
      });

      toast.success('Jobs deleted successfully');

      setSelectedJobs([]);
      fetchJobs();
    } catch {
      toast.error('Failed to delete jobs');
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}

      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Crawl Jobs</h1>
        <p className="text-muted-foreground">Monitor crawl execution history</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <TableFilters
          search={search}
          status={status}
          limit={limit}
          searchPlaceholder="Search crawl jobs..."
          statusOptions={crawlJobFilterConfig.statusOptions}
          limitOptions={crawlJobFilterConfig.limitOptions}
          onSearchChange={value =>
            setSearchParams({
              page: '1',
              search: value,
              status,
              limit: limit.toString(),
            })
          }
          onStatusChange={value =>
            setSearchParams({
              page: '1',
              search,
              status: value,
              limit: limit.toString(),
            })
          }
          onLimitChange={value =>
            setSearchParams({
              page: '1',
              search,
              status,
              limit: value.toString(),
            })
          }
        />

        {/* Delete button */}

        {selectedJobs.length > 0 && (
          <div className="flex justify-end">
            <Button variant="destructive" onClick={deleteJobs}>
              Delete Selected ({selectedJobs.length})
            </Button>
          </div>
        )}
      </div>

      {/* Table */}

      <Card className="border-none rounded-xl shadow-sm bg-background/60 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted border-muted">
              <TableHead className="text-center">
                <Checkbox
                  checked={
                    jobs.length > 0 && selectedJobs.length === jobs.length
                  }
                  onCheckedChange={checked => {
                    if (checked) {
                      setSelectedJobs(jobs.map(j => j.id));
                    } else {
                      setSelectedJobs([]);
                    }
                  }}
                />
              </TableHead>

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
                    <TableCell />
                    {columns.map((_, idx) => (
                      <TableCell key={idx} className="text-center">
                        <Skeleton className="h-4 w-32 mx-auto" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : jobs.map(job => (
                  <TableRow
                    key={job.id}
                    className="hover:bg-muted/40 bg-background border-none transition"
                  >
                    {/* Checkbox */}

                    <TableCell className="text-center">
                      <Checkbox
                        className="text-blue-700"
                        checked={selectedJobs.includes(job.id)}
                        onCheckedChange={() => toggleJobSelection(job.id)}
                      />
                    </TableCell>

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

      {/* Pagination */}

      <PaginationControls
        page={page}
        limit={limit}
        totalPages={totalPages}
        search={search}
        status={status}
        setSearchParams={setSearchParams}
      />
    </div>
  );
}
