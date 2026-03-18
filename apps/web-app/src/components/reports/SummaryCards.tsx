import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSiteSummary } from '@/hooks/useReports';
import type { SummaryProps } from '@/types/report.types';
import { toast } from 'sonner';

export function SummaryCards({ siteId, startDate, endDate }: SummaryProps) {
  const { data, isLoading, isError } = useSiteSummary(
    siteId,
    startDate,
    endDate
  );
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load summary data');
    }

    if (!isLoading && data === null) {
      toast.info('No crawl data available for selected dates');
    }
  }, [isError, data, isLoading]);

  if (isLoading || !data) return null;

  const stats = [
    { label: 'Pages Crawled', value: data.pages_crawled ?? 0 },
    { label: 'Total Issues', value: data.total_issues ?? 0 },
    {
      label: 'Accessibility Score',
      value: `${data.accessibility_score ?? 0}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map(s => (
        <Card className="border-none shadow-sm" key={s.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-semibold">{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
