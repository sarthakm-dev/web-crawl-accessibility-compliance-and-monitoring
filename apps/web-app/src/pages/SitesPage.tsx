import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/utils/api';
import { useCallback } from 'react';
import { type Site } from '../../../../packages/shared-types/site.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import PlayIcon from "@/assets/icons/play.svg?react";

export default function SitesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(search);
  const [sites, setSites] = useState<Site[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;

  const status = searchParams.get('status') || 'all';
  const hasPermission = useAuthStore(state => state.hasPermission);
  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/site?page=${page}&limit=${limit}&search=${search}&status=${status}`
        );
        console.log(res.data);
        setSites(res.data.data ?? []);
        setTotalPages(res.data.pagination.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [page, limit, search, status]);

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

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ search: searchInput });
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput, updateParams]);

  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Sites</h1>
            <p className="text-sm text-muted-foreground">
              Manage your monitored websites
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-transparent shadow-none rounded-xl border-none">
          <Input
            placeholder="Search sites..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-72 bg-background"
          />

          <Select
            value={status}
            onValueChange={(value: string) => updateParams({ status: value })}
          >
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={limit.toString()}
            onValueChange={(value: string) => updateParams({ limit: value })}
          >
            <SelectTrigger className="w-28 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {hasPermission('site:create') && (
                <Button className="bg-blue-700 rounded-lg shadow-sm hover:bg-primary/90">
                  + Add Site
                </Button>
              )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Site</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  placeholder="Site Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <Input
                  placeholder="https://example.com"
                  value={baseUrl}
                  onChange={e => setBaseUrl(e.target.value)}
                />
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>

                <Button
                  onClick={async () => {
                    await api.post('/api/site', {
                      name,
                      baseUrl,
                    });

                    setOpen(false);
                    setName('');
                    setBaseUrl('');
                    window.location.reload();
                  }}
                  className="bg-blue-700 hover:bg-blue-800 shadow-sm"
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="rounded-xl border-none shadow-sm">
          <CardContent className="p-0">
            {loading && (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                Updating results...
              </div>
            )}

            <Table className="border-none">
              <TableHeader>
                <TableRow className="bg-muted/50 border-none">
                  <TableHead className='text-center'>Name</TableHead>
                  <TableHead className='text-center'>Base URL</TableHead>
                  <TableHead className='text-center'>Status</TableHead>
                  <TableHead className='text-center'>Created At</TableHead>
                  {hasPermission('crawl:trigger') && (
                    <TableHead className='text-center'>Start Crawl</TableHead>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && sites.length === 0 ? (
                  [...Array(limit)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sites.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No sites found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sites.map(site => (
                    <TableRow
                      key={site.id}
                      onClick={() => navigate(`/sites/${site.id}`)}
                      className="cursor-pointer border-none hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="font-medium text-center">{site.name}</TableCell>

                      <TableCell className="text-muted-foreground text-center">
                        {site.base_url}
                      </TableCell>

                      <TableCell className='text-center'>
                        <Badge
                          variant="secondary"
                          className={
                            site.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-600'
                          }
                          
                        >
                          {site.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground text-center">
                        {new Date(site.created_at).toLocaleDateString()}
                      </TableCell >
                      {hasPermission('crawl:trigger') && (<TableCell className='text-center'>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={async e => {
                            e.stopPropagation();

                            try {
                              await api.post('/api/crawl', {
                                siteId: site.id,
                                triggerType: 'manual',
                              });

                              toast.success('Crawl started successfully');
                            } catch (err) {
                              console.error(err);
                              toast.error('Failed to start crawl');
                            }
                          }}
                       
                        >
                          <PlayIcon />
                        </Button>
                      </TableCell>)}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
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
    </div>
  );
}
