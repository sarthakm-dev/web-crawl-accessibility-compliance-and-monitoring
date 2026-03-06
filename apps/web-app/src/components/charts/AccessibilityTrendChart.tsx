import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { date: "Feb 15", score: 0 },
  { date: "Feb 16", score: 0 },
  { date: "Feb 17", score: 0 },
  { date: "Feb 18", score: 0 },
  { date: "Feb 19", score: 0 },
]

export function AccessibilityTrendChart() {
  return (
    <ChartContainer
      className="h-56 w-full"
      config={{
        score: {
          label: "Accessibility Score",
          color: "#2563eb",
        },
      }}
    >
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [`${value}%`, "Score"]}
            />
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
  )
}