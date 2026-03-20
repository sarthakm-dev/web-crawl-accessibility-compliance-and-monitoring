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

  const handleCrawl = async (e: React.MouseEvent, siteId: string) => {
    e.stopPropagation();
    try {
      await api.post('/api/crawl', {
        siteId,
        triggerType: 'manual',
      });
      toast.success('Crawl started successfully');
    } catch {
      toast.error('Failed to start crawl');
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

                  <TableCell className="text-muted-foreground text-center">
                    {new Date(site.created_at).toLocaleDateString()}
                  </TableCell>

                  {hasPermission('crawl:trigger') && (
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        variant="outline"
                        name="crawl"
                        onClick={e => handleCrawl(e, site.id)}
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
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
