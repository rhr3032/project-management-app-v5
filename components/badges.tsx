'use client';

import { ProjectStatus, ProjectPriority, ProjectType } from '@/types';

function StatusBadge({ status }: { status: ProjectStatus }) {
  const colors: Record<ProjectStatus, { bg: string; text: string }> = {
    'Planning': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'In Progress': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'Review': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'On Hold': { bg: 'bg-gray-100', text: 'text-gray-700' },
    'Completed': { bg: 'bg-green-100', text: 'text-green-700' },
  };

  const { bg, text } = colors[status];
  return <span className={`px-2 py-1 rounded text-xs font-medium ${bg} ${text}`}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  const colors: Record<ProjectPriority, { bg: string; text: string }> = {
    'Low': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    'High': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'Critical': { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const { bg, text } = colors[priority];
  return <span className={`px-2 py-1 rounded text-xs font-medium ${bg} ${text}`}>{priority}</span>;
}

function TypeBadge({ type }: { type: ProjectType }) {
  const colors: Record<ProjectType, { bg: string; text: string }> = {
    'UI/UX Design': { bg: 'bg-pink-100', text: 'text-pink-700' },
    'Web App': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    'Mobile App': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'Logo': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'Branding': { bg: 'bg-rose-100', text: 'text-rose-700' },
    'Illustration': { bg: 'bg-violet-100', text: 'text-violet-700' },
  };

  const { bg, text } = colors[type] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  return <span className={`px-2 py-1 rounded-lg text-xs font-bold ${bg} ${text}`}>{type}</span>;
}

function EffortBadge({ effort }: { effort: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    'XS': { bg: 'bg-green-100', text: 'text-green-700' },
    'S': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'M': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    'L': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'XL': { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const { bg, text } = colors[effort] || colors['M'];
  return <span className={`px-2 py-1 rounded text-xs font-medium ${bg} ${text}`}>{effort}</span>;
}

function DeviceBadge({ device }: { device: string }) {
  const colors: Record<string, { bg: string; text: string; icon: string }> = {
    'Desktop': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🖥️' },
    'Mobile': { bg: 'bg-purple-100', text: 'text-purple-700', icon: '📱' },
    'Tablet': { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: '📱' },
    'TV': { bg: 'bg-red-100', text: 'text-red-700', icon: '📺' },
    'Post': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '📮' },
    'Car': { bg: 'bg-green-100', text: 'text-green-700', icon: '🚗' },
    'Watch': { bg: 'bg-pink-100', text: 'text-pink-700', icon: '⌚' },
    'All': { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: '🌐' },
    'XS': { bg: 'bg-red-100', text: 'text-red-700', icon: '📱' },
    'M': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '📱' },
    'L': { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🖥️' },
  };

  const config = colors[device] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: '💻' };
  return <span className={`px-3 py-1 rounded-lg text-xs font-bold ${config.bg} ${config.text} flex items-center gap-1 w-fit`}>
    <span>{config.icon}</span>
    <span>{device}</span>
  </span>;
}

export { StatusBadge, PriorityBadge, TypeBadge, EffortBadge, DeviceBadge };
