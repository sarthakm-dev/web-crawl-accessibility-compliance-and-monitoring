import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const data = [
  { severity: "Critical", value: 16 },
  { severity: "High", value: 20 },
  { severity: "Medium", value: 30 },
  { severity: "Low", value: 34 },
]

export function IssueBreakdownChart() {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="severity" />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}