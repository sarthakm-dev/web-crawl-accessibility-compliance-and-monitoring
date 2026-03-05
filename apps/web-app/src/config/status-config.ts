export const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-700',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-100 text-red-700',
  },
  running: {
    label: 'Running',
    className: 'bg-yellow-100 text-yellow-700',
  },
};
