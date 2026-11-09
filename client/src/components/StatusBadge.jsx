import React from 'react';

const statusConfig = {
  PENDING: {
    label: 'Pending Review',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200'
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  ACCEPTED: {
    label: 'Accepted / Scope Active',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200'
  },
  DECLINED: {
    label: 'Declined',
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200'
  },
  COMPLETED: {
    label: 'Completed Engagement',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200'
  }
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status,
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
}
