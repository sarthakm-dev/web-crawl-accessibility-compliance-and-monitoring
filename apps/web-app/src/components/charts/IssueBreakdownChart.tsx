import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

const data = [
  { severity: "Critical", value: 0 },
  { severity: "High", value: 0 },
  { severity: "Medium", value: 0 },
  { severity: "Low", value: 0 },
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