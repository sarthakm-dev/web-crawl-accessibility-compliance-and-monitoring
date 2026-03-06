type StatusOption = {
  value: string;
  label: string;
};
type LimitOption = {
  value: number;
  label: string;
};
export type TableFiltersProps = {
  search: string;
  status?: string;
  limit?: number;
  searchPlaceholder?: string;
  showStatus?: boolean;
  showLimit?: boolean;
  statusOptions?: StatusOption[];
  limitOptions?: LimitOption[];
  onSearchChange: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onLimitChange?: (value: string) => void;
};
