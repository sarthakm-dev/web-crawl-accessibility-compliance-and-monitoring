export type CrawlJobUpdatedEvent = {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
};

type IssueBreakdown = {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
};

export type Props = {
  data?: IssueBreakdown | null;
};
