import { Button } from '@/components/ui/button';
import { TableFilters } from '@/components/common/TableFilters';
import { siteFilterConfig } from '@/config/table-filter-config';
import { useAuthStore } from '@/store/auth-store';
import { CreateSiteDialog } from './CreateSiteDialog';
import type { SitesToolbarProps } from '@/types/sites.types';

export function SitesToolbar({
  searchInput,
  status,
  limit,
  selectedCount,
  onSearchChange,
  onStatusChange,
  onLimitChange,
  onSiteCreated,
  onBulkDelete,
}: SitesToolbarProps) {
  const hasPermission = useAuthStore(state => state.hasPermission);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <TableFilters
        search={searchInput}
        status={status}
        limit={limit}
        statusOptions={siteFilterConfig.statusOptions}
        limitOptions={siteFilterConfig.limitOptions}
        searchPlaceholder="Search sites..."
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onLimitChange={onLimitChange}
      />

      {hasPermission('site:create') && (
        <CreateSiteDialog onCreated={onSiteCreated} />
      )}

      {selectedCount > 0 && hasPermission('site:delete') && (
        <Button variant="destructive" className="ml-2" onClick={onBulkDelete}>
          Delete Selected ({selectedCount})
        </Button>
      )}
    </div>
  );
}
