export const issueFilterConfig = {
  statusOptions: [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ],
  limitOptions: [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
  ],
  showLimit: true,
  showStatus: true,
};

export const siteFilterConfig = {
  statusOptions: [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
  limitOptions: [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
  ],
  showLimit: true,
  showStatus: true,
};
export const crawlJobFilterConfig = {
  statusOptions: [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Running', value: 'running' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' },
  ],
  limitOptions: [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
  ],
  showLimit: true,
  showStatus: true,
};
