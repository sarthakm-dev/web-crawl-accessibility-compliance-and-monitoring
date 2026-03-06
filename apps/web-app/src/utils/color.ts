import type { Issue } from '../types/issue.types';

export const getStatusColor = (status: Issue['status']) => {
  switch (status) {
    case 'open':
      return 'bg-orange-100 hover:bg-orange-200 text-orange-700';
    case 'in_progress':
      return 'bg-blue-100 hover:bg-blue-200 text-blue-700';
    case 'resolved':
      return 'bg-green-100 hover:bg-green-200 text-green-700';
    case 'closed':
      return 'bg-gray-200 hover:bg-gray-300 text-gray-700';
  }
};

export const getImpactColor = (impact: Issue['impact']) => {
  switch (impact) {
    case 'minor':
      return 'bg-gray-100 hover:bg-gray-200 text-gray-600';
    case 'moderate':
      return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700';
    case 'serious':
      return 'bg-orange-200 hover:bg-orange-300 text-orange-800';
    case 'critical':
      return 'bg-red-200 hover:bg-red-300 text-red-800';
  }
};
