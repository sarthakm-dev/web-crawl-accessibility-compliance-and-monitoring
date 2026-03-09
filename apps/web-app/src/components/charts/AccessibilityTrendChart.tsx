import { LineChart, Line, XAxis, CartesianGrid } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Props } from '@/types/page.types';

export function AccessibilityTrendChart({ data = [] }: Props) {
  const chartData = data.map(item => ({
    date: new Date(item.created_at).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    score: item.accessibility_score,
  }));

  return (
    <ChartContainer
      className="h-50 w-full"
      config={{
        score: {
          label: 'Accessibility Score',
          color: '#2563eb',
        },
      }}
    >
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent formatter={value => [`${value}%`, 'Score']} />
          }
        />

        <Line
          type="monotone"
          dataKey="score"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
