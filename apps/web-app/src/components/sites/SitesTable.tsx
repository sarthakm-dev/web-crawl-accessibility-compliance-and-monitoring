import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BugIcon } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { DeleteSiteDialog } from './DeleteSiteDialog';
import { columns } from '@/config/site-columns';
import api from '@/utils/api';
import { toast } from 'sonner';
import type { SitesTableProps } from '@/types/sites.types';
import { socket } from '@/utils/socket';
import type { CrawlJobUpdatedEvent } from '@/types/crawl.types';

type ActiveCrawlStatus = CrawlJobUpdatedEvent['status'] | null;

const isActiveCrawlStatus = (
  status: ActiveCrawlStatus
): status is Exclude<ActiveCrawlStatus, 'completed' | 'failed' | null> =>
  status === 'pending' || status === 'running';

export function SitesTable({
  sites,
  loading,
  limit,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  isAllSelected,
  onSiteDeleted,
}: SitesTableProps) {
  const navigate = useNavigate();
  const hasPermission = useAuthStore(state => state.hasPermission);
  const [activeCrawlStatuses, setActiveCrawlStatuses] = useState<
    Record<string, ActiveCrawlStatus>
  >({});
  const [startingSiteIds, setStartingSiteIds] = useState<string[]>([]);
  const totalColumns =
    5 +
    1 +
    (hasPermission('crawl:trigger') ? 1 : 0) +
    (hasPermission('site:delete') ? 1 : 0);

  useEffect(() => {
    if (sites.length === 0) {
      setActiveCrawlStatuses({});
      return;
    }

    const fetchActiveStatuses = async () => {
      const statuses = await Promise.all(
        sites.map(async site => {
          for (const status of ['pending', 'running'] as const) {
            const res = await api.get('/api/crawl', {
              params: {
                siteId: site.id,
                status,
                page: 1,
                limit: 1,
              },
            });

            if ((res.data.data ?? []).length > 0) {
              return [site.id, status] as const;
            }
          }

          return [site.id, null] as const;
        })
      );

      setActiveCrawlStatuses(Object.fromEntries(statuses));
    };

    void fetchActiveStatuses();
  }, [sites]);

  useEffect(() => {
    const handleJobUpdate = (event: CrawlJobUpdatedEvent) => {
      setActiveCrawlStatuses(prev => {
        if (!(event.siteId in prev)) return prev;

        return {
          ...prev,
          [event.siteId]: isActiveCrawlStatus(event.status)
            ? event.status
            : null,
        };
      });
    };

    socket.on('crawl-job-updated', handleJobUpdate);

    return () => {
      socket.off('crawl-job-updated', handleJobUpdate);
    };
  }, []);

  const handleCrawl = async (e: React.MouseEvent, siteId: string) => {
    e.stopPropagation();
    if (
      isActiveCrawlStatus(activeCrawlStatuses[siteId]) ||
      startingSiteIds.includes(siteId)
    ) {
      return;
    }

    try {
      setStartingSiteIds(prev => [...prev, siteId]);
      await api.post('/api/crawl', {
        siteId,
        triggerType: 'manual',
      });
      setActiveCrawlStatuses(prev => ({ ...prev, [siteId]: 'pending' }));
      toast.success('Crawl started successfully');
    } catch {
      toast.error('Failed to start crawl');
    } finally {
      setStartingSiteIds(prev => prev.filter(id => id !== siteId));
    }
  };

  return (
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
                  checked={isAllSelected}
                  onCheckedChange={checked => {
                    if (checked) {
                      onSelectAll(sites.map(s => s.id));
                    } else {
                      onClearSelection();
                    }
                  }}
                />
              </TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Base URL</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Daily Crawl</TableHead>
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
                  colSpan={totalColumns}
                  className="text-center py-12 text-muted-foreground"
                >
                  No sites found.
                </TableCell>
              </TableRow>
            ) : (
              sites.map(site => {
                const hasActiveCrawl = isActiveCrawlStatus(
                  activeCrawlStatuses[site.id]
                );
                const isStarting = startingSiteIds.includes(site.id);

                return (
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
                        checked={selectedIds.includes(site.id)}
                        onCheckedChange={() => onToggleSelect(site.id)}
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

                    <TableCell className="text-center text-muted-foreground">
                      {site.scheduled_crawl_time || 'Manual only'}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-center">
                      {new Date(site.created_at).toLocaleDateString()}
                    </TableCell>

                    {hasPermission('crawl:trigger') && (
                      <TableCell className="text-center">
                        <Button
                          size="icon"
                          variant="outline"
                          name="crawl"
                          aria-label={
                            isStarting
                              ? `Starting crawl for ${site.name}`
                              : hasActiveCrawl
                                ? `Crawl in progress for ${site.name}`
                                : `Start crawl for ${site.name}`
                          }
                          title={
                            isStarting
                              ? 'Starting crawl'
                              : hasActiveCrawl
                                ? 'Crawl in progress'
                                : 'Start crawl'
                          }
                          onClick={e => handleCrawl(e, site.id)}
                          disabled={
                            !site.is_active || isStarting || hasActiveCrawl
                          }
                          className="cursor-pointer"
                        >
                          <BugIcon className="text-blue-700" />
                        </Button>
                      </TableCell>
                    )}

                    {hasPermission('site:delete') && (
                      <TableCell className="text-center">
                        <DeleteSiteDialog
                          siteId={site.id}
                          onDeleted={onSiteDeleted}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
