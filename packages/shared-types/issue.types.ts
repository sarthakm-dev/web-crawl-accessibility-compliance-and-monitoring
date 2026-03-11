export interface IssueRowProps {
  title: string;
  site: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  pages: number;
  status: "Open" | "In Progress" | "Resolved";
}

export type SeverityBreakdown = {
  severity: string
  count: number
}

export type PageBreakdown = {
  page_id: string
  page_url: string
  total_issues: number
  critical_count: number
  serious_count: number
  moderate_count: number
  minor_count: number
}