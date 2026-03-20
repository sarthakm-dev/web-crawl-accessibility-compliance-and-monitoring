import { type SetURLSearchParams } from 'react-router-dom';
import { type Site } from '@packages/shared-types/site.types';

export interface UseDebouncedSearchOptions {
  search: string;
  limit: number;
  status: string;
  setSearchParams: SetURLSearchParams;
  delay?: number;
}

export interface SitesToolbarProps {
  searchInput: string;
  status: string;
  limit: number;
  selectedCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onSiteCreated: () => Promise<void>;
  onBulkDelete: () => Promise<void>;
}

export interface SitesTableProps {
  sites: Site[];
  loading: boolean;
  limit: number;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearSelection: () => void;
  isAllSelected: boolean;
  onSiteDeleted: (siteId: string) => void;
}

export interface DeleteSiteDialogProps {
  siteId: string;
  onDeleted: (siteId: string) => void;
}

export interface CreateSiteDialogProps {
  onCreated: () => Promise<void>;
}
