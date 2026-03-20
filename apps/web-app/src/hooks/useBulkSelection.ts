import { useState } from 'react';

export function useBulkSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const isAllSelected = (ids: string[]) =>
    ids.length > 0 && selectedIds.length === ids.length;

  return {
    selectedIds,
    toggle,
    selectAll,
    clearSelection,
    isSelected,
    isAllSelected,
  };
}
