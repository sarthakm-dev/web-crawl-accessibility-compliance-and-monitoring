import { Card, CardContent } from '@/components/ui/card';
import { useSiteSummary } from '@/hooks/useReports';

interface Props {
  siteId: string;
  crawlJobId?: string;
}

export function SummaryCards({ siteId }: Props) {
  const { data, isLoading, isError } = useSiteSummary(siteId);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading summary...</div>
    );
  }

  if (isError || !data) {
    return <div className="text-sm text-red-500">Failed to load summary</div>;
  }

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
