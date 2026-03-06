import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TableFiltersProps } from '@/types/table.types';

export function TableFilters({
  search,
  status,
  limit,
  searchPlaceholder = 'Search...',
  showStatus = true,
  showLimit = true,
  statusOptions,
  limitOptions,
  onSearchChange,
  onStatusChange,
  onLimitChange,
}: TableFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search */}
      <Input
        placeholder={searchPlaceholder}
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-72 bg-background"
      />

      {/* Status */}
      {showStatus && onStatusChange && statusOptions && (
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-40 bg-background">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>

          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.label} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Limit */}
      {showLimit && onLimitChange && limitOptions &&  (
        <Select value={limit?.toString()} onValueChange={onLimitChange}>
          <SelectTrigger className="w-28 bg-background">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {limitOptions.map(option => (
              <SelectItem key={option.label} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
