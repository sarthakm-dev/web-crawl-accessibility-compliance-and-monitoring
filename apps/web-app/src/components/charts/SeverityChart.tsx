import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useSeverityBreakdown } from '@/hooks/useReports';
import type { SummaryProps } from '@/types/report.types';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function SeverityChart({ siteId, startDate, endDate }: SummaryProps) {
  const { data, isLoading, isError } = useSeverityBreakdown(
    siteId,
    startDate,
    endDate
  );

  useEffect(() => {
    if (isError) {
      toast.error('Failed to load severity breakdown');
    }

    if (!isLoading && data && data.length === 0) {
      toast.info('No severity data available for selected dates');
    }
  }, [isError, data, isLoading]);

  if (isLoading || !data) return null;

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Issue Severity Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="severity" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
