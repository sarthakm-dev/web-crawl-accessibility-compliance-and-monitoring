import { useState, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useIssues } from '@/hooks/useReports';
import { getImpactColor } from '@/utils/color';
import { toast } from 'sonner';

import type { Issue, SummaryProps } from '@/types/report.types';

export function IssuesCards({ siteId, startDate, endDate }: SummaryProps) {
  const [severity, setSeverity] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useIssues(
    siteId,
    severity === 'all' ? undefined : severity,
    page,
    startDate,
    endDate
  );

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load issues');
    }

    if (!isLoading && data && data.rows.length === 0) {
      toast.info('No issues found for selected filters');
    }
  }, [isError, data, isLoading]);

  if (isLoading || !data) return null;

  const issues: Issue[] = data.rows ?? [];
  const total = data.count ?? 0;
  const totalPages = Math.ceil(total / 10);

  const filtered = issues.filter(i =>
    i.page_url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Issues</h2>

        <div className="flex gap-3">
          <Input
            placeholder="Search page..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-60 bg-white"
          />

          <Select
            value={severity}
            onValueChange={v => {
              setSeverity(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="serious">Serious</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="minor">Minor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Issues */}

      <div className="space-y-4">
        {filtered.map(issue => (
          <Card key={issue.id} className="shadow-sm border-none">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-medium truncate max-w-[70%]">
                  {issue.page_url}
                </p>

                <Badge
                  variant="secondary"
                  className={`${getImpactColor(issue.severity)} capitalize`}
                >
                  {issue.severity}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Rule: {issue.rule_id}
              </p>

              <p className="text-sm">{issue.message}</p>

              <p className="text-xs text-muted-foreground truncate">
                Selector: {issue.selector}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
