export interface IssueRowProps {
  title: string;
  site: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  pages: number;
  status: "Open" | "In Progress" | "Resolved";
}