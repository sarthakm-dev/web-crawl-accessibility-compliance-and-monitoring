import { useSites } from '@/hooks/useSites';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { SitesToolbar } from '@/components/sites/SitesToolbar';
import { SitesTable } from '@/components/sites/SitesTable';
import { PaginationControls } from '@/components/common/Pagination';
import api from '@/utils/api';
import { toast } from 'sonner';

export default function SitesPage() {
  const {
    sites,
    loading,
    page,
    limit,
    search,
    status,
    totalPages,
    setSearchParams,
    fetchSites,
    updateParams,
    removeSite,
    removeSites,
  } = useSites();

  const { searchInput, setSearchInput } = useDebouncedSearch({
    search,
    limit,
    status,
    setSearchParams,
  });

  const { selectedIds, toggle, selectAll, clearSelection, isAllSelected } =
    useBulkSelection();

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await api.delete('/api/sites/bulk', {
        data: { ids: selectedIds },
      });
      removeSites(selectedIds);
      clearSelection();
      toast.success('Sites deleted successfully');
    } catch (err) {
      toast.error(`Failed to delete sites: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Sites</h1>
          <p className="text-sm text-muted-foreground">
            Manage your monitored websites
          </p>
        </div>

        <SitesToolbar
          searchInput={searchInput}
          status={status}
          limit={limit}
          selectedCount={selectedIds.length}
          onSearchChange={setSearchInput}
          onStatusChange={value => updateParams({ status: value })}
          onLimitChange={value => updateParams({ limit: value })}
          onSiteCreated={fetchSites}
          onBulkDelete={handleBulkDelete}
        />

        <SitesTable
          sites={sites}
          loading={loading}
          limit={limit}
          selectedIds={selectedIds}
          onToggleSelect={toggle}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          isAllSelected={isAllSelected(sites.map(s => s.id))}
          onSiteDeleted={removeSite}
        />

        <PaginationControls
          page={page}
          limit={limit}
          totalPages={totalPages}
          search={search}
          status={status}
          setSearchParams={setSearchParams}
        />
      </div>
    </div>
  );
}
