import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useBulkSelection } from '../useBulkSelection';

describe('useBulkSelection', () => {
  it('initializes with empty selection', () => {
    const { result } = renderHook(() => useBulkSelection());
    expect(result.current.selectedIds).toEqual([]);
  });

  it('toggles selection on and off', () => {
    const { result } = renderHook(() => useBulkSelection());

    act(() => {
      result.current.toggle('id-1');
    });
    expect(result.current.selectedIds).toEqual(['id-1']);
    expect(result.current.isSelected('id-1')).toBe(true);

    act(() => {
      result.current.toggle('id-1');
    });
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.isSelected('id-1')).toBe(false);
  });

  it('selects all ids', () => {
    const { result } = renderHook(() => useBulkSelection());
    const ids = ['id-1', 'id-2', 'id-3'];

    act(() => {
      result.current.selectAll(ids);
    });

    expect(result.current.selectedIds).toEqual(ids);
    expect(result.current.isAllSelected(ids)).toBe(true);
  });

  it('clears selection', () => {
    const { result } = renderHook(() => useBulkSelection());

    act(() => {
      result.current.selectAll(['id-1', 'id-2']);
    });
    expect(result.current.selectedIds).toEqual(['id-1', 'id-2']);

    act(() => {
      result.current.clearSelection();
    });
    expect(result.current.selectedIds).toEqual([]);
  });

  it('isAllSelected returns false if not all ids are selected', () => {
    const { result } = renderHook(() => useBulkSelection());
    const ids = ['id-1', 'id-2'];

    act(() => {
      result.current.toggle('id-1');
    });

    expect(result.current.isAllSelected(ids)).toBe(false);
  });
});
