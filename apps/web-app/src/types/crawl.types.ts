export type CrawlJobUpdatedEvent = {
  jobId: string;
  siteId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
};

export interface AnalysisJobEvent {
  siteId: string;
  jobId: string;
}

type IssueBreakdown = {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
};

export type Props = {
  data?: IssueBreakdown | null;
};
