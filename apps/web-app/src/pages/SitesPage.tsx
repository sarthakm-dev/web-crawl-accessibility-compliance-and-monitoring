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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { BugIcon, TrashIcon } from 'lucide-react';
import axios from 'axios';
import { TableFilters } from '@/components/common/TableFilters';
import { siteFilterConfig } from '@/config/table-filter-config';
import { columns } from '@/config/site-columns';
import { PaginationControls } from '@/components/common/Pagination';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;

  const status = searchParams.get('status') || 'all';
  const hasPermission = useAuthStore(state => state.hasPermission);

  const handleCreateSite = async () => {
    try {
      await api.post('/api/sites', {
        name,
        baseUrl,
      });

      setOpen(false);
      setName('');
      setBaseUrl('');

      await fetchSites();

      toast.success('Site created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create site');
    }
  };
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

  const toggleSiteSelection = (siteId: string) => {
    setSelectedSites(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };
  const handleBulkDelete = async () => {
    if (selectedSites.length === 0) return;

    try {
      await api.delete('/api/sites/bulk', {
        data: { ids: selectedSites },
      });
      setSites(prev => prev.filter(site => !selectedSites.includes(site.id)));
      setSelectedSites([]);

      toast.success('Sites deleted successfully');
    } catch (err) {
      toast.error(`Failed to delete sites${err}`);
    }
  };
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
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput, setSearchParams, limit, status]);

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
        {/* Filter */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Sites */}
          <TableFilters
            search={searchInput}
            status={status}
            limit={limit}
            statusOptions={siteFilterConfig.statusOptions}
            limitOptions={siteFilterConfig.limitOptions}
            searchPlaceholder="Search sites..."
            onSearchChange={setSearchInput}
            onStatusChange={value => updateParams({ status: value })}
            onLimitChange={value => updateParams({ limit: value })}
          />

          {/* Add Site */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {hasPermission('site:create') && (
                <Button className="bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm">
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
                  onClick={handleCreateSite}
                  className="bg-blue-700 hover:bg-blue-800 shadow-sm"
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {selectedSites.length > 0 && hasPermission('site:delete') && (
            <Button
              variant="destructive"
              className="ml-2"
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedSites.length})
            </Button>
          )}
        </div>
        {/* Table */}
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
                  <TableHead className="text-center">
                    <Checkbox
                      checked={
                        sites.length > 0 &&
                        selectedSites.length === sites.length
                      }
                      onCheckedChange={checked => {
                        if (checked) {
                          setSelectedSites(sites.map(site => site.id));
                        } else {
                          setSelectedSites([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Base URL</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Created At</TableHead>
                  {hasPermission('crawl:trigger') && (
                    <TableHead className="text-center">Start Crawl</TableHead>
                  )}
                  {hasPermission('site:delete') && (
                    <TableHead className="text-center">Delete</TableHead>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && sites.length === 0 ? (
                  [...Array(limit)].map((_, i) => (
                    <TableRow key={i}>
                      {columns.map((_, idx) => (
                        <TableCell className="text-center" key={idx}>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : sites.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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
                      <TableCell
                        className="text-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedSites.includes(site.id)}
                          onCheckedChange={() => toggleSiteSelection(site.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        {site.name}
                      </TableCell>

                      <TableCell className="text-muted-foreground text-center">
                        {site.base_url}
                      </TableCell>

                      <TableCell className="text-center">
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
                      </TableCell>
                      {hasPermission('crawl:trigger') && (
                        <TableCell className="text-center">
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
                              } catch {
                                toast.error('Failed to start crawl');
                              }
                            }}
                            className="cursor-pointer"
                          >
                            <BugIcon className="text-blue-700" />
                          </Button>
                        </TableCell>
                      )}
                      {hasPermission('site:delete') && (
                        <TableCell className="text-center">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="cursor-pointer"
                                size="icon"
                                onClick={e => e.stopPropagation()}
                              >
                                <TrashIcon className="text-red-500" />
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete this site?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={async e => {
                                    e.stopPropagation();
                                    await api.delete(`/api/sites/${site.id}`);
                                    setSites(prev =>
                                      prev.filter(s => s.id !== site.id)
                                    );
                                  }}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <PaginationControls
          page={page}
          limit={limit}
          totalPages={totalPages}
          search={search}
          status={status}
          setSearchParams={setSearchParams}
        />
      </div>
    </div>
  );
}
