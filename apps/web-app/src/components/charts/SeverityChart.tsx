import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { useSeverityBreakdown } from '@/hooks/useReports';

interface Props {
  siteId: string;
  crawlJobId?: string;
}

export function SeverityChart({ siteId }: Props) {
  const { data, isLoading, isError } = useSeverityBreakdown(siteId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4">
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg p-4">
        <p className="text-sm text-red-500">Failed to load severity chart</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-none rounded-lg p-4">
      <h2 className="font-semibold mb-4">Issue Severity Breakdown</h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data || []}>
          <XAxis dataKey="severity" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
