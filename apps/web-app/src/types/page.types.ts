export type PaginationControlsProps = {
  page: number;
  limit: number;
  totalPages: number;
  search?: string;
  status?: string;
  setSearchParams: (params: Record<string, string>) => void;
};

type TrendPoint = {
  created_at: string;
  accessibility_score: number;
};

export type Props = {
  data?: TrendPoint[];
};

export type LatestJob = {
  id: string;
  status: string;
  pages_crawled?: number;
  Site?: {
    name: string;
  };
};
