import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Cell,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { data, COLORS } from "../../config/issue-config"

export function IssueBreakdownChart() {
  return (
 
      <ChartContainer
        className="h-56 w-full"
        config={{
          value: {
            label: "Issues",
            color: "#3b82f6",
          },
        }}
      >
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />

          <XAxis
            dataKey="severity"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />

          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.severity}
                fill={COLORS[entry.severity]}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    
  )
}