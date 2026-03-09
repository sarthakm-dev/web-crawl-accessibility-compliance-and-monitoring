export const columns = [
  { key: 'url', label: 'URL' },
  { key: 'status', label: 'Status' },
  { key: 'impact', label: 'Impact' },
  { key: 'firstDetected', label: 'First Detected' },
];

export const severityStyles = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-700',
};

export const statusStyles = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  Resolved: 'bg-green-100 text-green-700',
};

export const data = [
  { severity: 'Critical', value: 0 },
  { severity: 'High', value: 0 },
  { severity: 'Medium', value: 0 },
  { severity: 'Low', value: 0 },
];

export const COLORS: Record<string, string> = {
  critical: '#ef4444',
  serious: '#f97316',
  moderate: '#eab308',
  minor: '#22c55e',
};
