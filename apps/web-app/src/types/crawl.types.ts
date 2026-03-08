export type CrawlJobUpdatedEvent = {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
};
