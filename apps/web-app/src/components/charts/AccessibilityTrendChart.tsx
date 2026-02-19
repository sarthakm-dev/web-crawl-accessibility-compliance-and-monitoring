import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const data = [
  { date: "Apr 18", score: 72 },
  { date: "Apr 19", score: 75 },
  { date: "Apr 20", score: 76 },
  { date: "Apr 21", score: 77 },
  { date: "Apr 22", score: 79 },
]

export function AccessibilityTrendChart() {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}