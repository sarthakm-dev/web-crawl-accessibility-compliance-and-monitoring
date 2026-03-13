import { BarChart, Bar, XAxis, CartesianGrid, Cell } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { COLORS, ISSUE_CONFIG } from '../../config/issue-config';
import type { Props } from '@/types/crawl.types';

export function IssueBreakdownChart({ data }: Props) {
  if (!data) return null;

  const chartData = ISSUE_CONFIG.map(cfg => ({
    severity: cfg.severity,
    value: data[cfg.severity as keyof typeof data] ?? 0,
  }));

  return (
    <ChartContainer
      className="h-50 w-full"
      config={{
        value: {
          label: 'Issues',
          color: '#3b82f6',
        },
      }}
    >
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />

        <XAxis
          dataKey="severity"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {chartData.map(entry => (
            <Cell key={entry.severity} fill={COLORS[entry.severity]} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
