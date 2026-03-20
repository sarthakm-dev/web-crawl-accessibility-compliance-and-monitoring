import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDashboardSocket } from '../useDashboardSocket';
import { socket } from '@/utils/socket';

vi.mock('@/utils/socket', () => ({
  socket: {
    on: vi.fn(),
    off: vi.fn(),
  },
}));

describe('useDashboardSocket', () => {
  const onJobUpdated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register the event listener on mount', () => {
    renderHook(() => useDashboardSocket(onJobUpdated));

    expect(socket.on).toHaveBeenCalledWith(
      'analysis-job-updated',
      onJobUpdated
    );
  });

  it('should unregister the event listener on unmount', () => {
    const { unmount } = renderHook(() => useDashboardSocket(onJobUpdated));

    unmount();

    expect(socket.off).toHaveBeenCalledWith(
      'analysis-job-updated',
      onJobUpdated
    );
  });

  it('should re-register listener if onJobUpdated callback changes', () => {
    const { rerender } = renderHook(
      ({ callback }) => useDashboardSocket(callback),
      { initialProps: { callback: onJobUpdated } }
    );

    const newCallback = vi.fn();
    rerender({ callback: newCallback });

    expect(socket.off).toHaveBeenCalledWith(
      'analysis-job-updated',
      onJobUpdated
    );
    expect(socket.on).toHaveBeenCalledWith('analysis-job-updated', newCallback);
  });
});
