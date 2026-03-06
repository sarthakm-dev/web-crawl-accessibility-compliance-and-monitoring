export type PaginationControlsProps = {
  page: number;
  limit: number;
  totalPages: number;
  search?: string;
  status?: string;
  setSearchParams: (params: Record<string, string>) => void;
};
