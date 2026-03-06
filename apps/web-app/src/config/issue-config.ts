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
