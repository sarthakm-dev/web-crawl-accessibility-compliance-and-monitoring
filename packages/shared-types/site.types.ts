export interface Site {
  id: string;
  name: string;
  base_url: string;
  is_active: boolean;
  scheduled_crawl_time: string | null;
  created_at: string;
}
