


export interface Site {
  id: string;
  name: string;
  base_url: string;
}

export interface SummaryProps {
  siteId: string;
  crawlJobId?: string;
  startDate?: string;
  endDate?: string;
}

export interface TopPage {
  page_url: string;
  total_issues: number;
  critical_count: number;
}

export type QueryParams = Record<string, string | number>;

export interface FilterProps {
  siteId: string;
  setSiteId: (v: string) => void;
  startDate: string;
  endDate: string;
  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;
  onGenerate: () => void;
}

export type Issue = {
  id: string;
  page_url: string;
  rule_id: string;
  severity: "minor" | "moderate" | "serious" | "critical";
  selector: string;
  message: string;
  detected_at: string;
};

export type IssuesResponse = {
  rows: Issue[];
  count: number;
};