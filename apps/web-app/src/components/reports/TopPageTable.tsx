import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useTopPages } from '@/hooks/useReports';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type { SummaryProps, TopPage } from '@/types/report.types';

export function TopPagesTable({ siteId, startDate, endDate }: SummaryProps) {
  const { data, isLoading, isError } = useTopPages(siteId, startDate, endDate);
  const pages: TopPage[] = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load top pages');
    }

    if (!isLoading && pages.length === 0) {
      toast.info('No problem pages found for selected dates');
    }
  }, [isError, pages, isLoading]);

  if (isLoading) return null;

  return (
    <div className="bg-white border-none rounded-lg p-4">
      <h2 className="font-semibold mb-4">Top Problem Pages</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page</TableHead>
            <TableHead>Issues</TableHead>
            <TableHead>Critical</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pages.map(page => (
            <TableRow key={page.page_url} className="hover:bg-muted/50">
              <TableCell className="max-w-55 truncate">
                {page.page_url}
              </TableCell>

              <TableCell>{page.total_issues}</TableCell>

              <TableCell className="text-red-600 font-medium">
                {page.critical_count}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
