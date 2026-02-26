export interface CrawlJob {
  id: string;
  status: string;
  triggerType: string;
  createdAt: string;
  site: {
    id: string;
    name: string;
  };
  requestedBy: {
    id: string;
    name: string;
    email: string;
  };
}
