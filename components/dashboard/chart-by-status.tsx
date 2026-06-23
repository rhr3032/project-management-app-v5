'use client';

import { ProjectsByStatus } from '@/types';

const statusColors: Record<string, string> = {
  'Research': 'bg-sky-400',
  'Planning': 'bg-blue-400',
  'In Progress': 'bg-orange-400',
  'Review': 'bg-purple-400',
  'On Hold': 'bg-yellow-400',
  'Completed': 'bg-green-400',
  'Cancelled': 'bg-red-400',
  'Archived': 'bg-slate-400',
  'Pending Approval': 'bg-amber-400',
  'Approved': 'bg-emerald-400',
  'Rejected': 'bg-rose-400',
  'Needs Revision': 'bg-pink-400',
  'In Testing': 'bg-violet-400',
  'Ready for Deployment': 'bg-teal-400',
  'Deployed': 'bg-cyan-400',
  'Maintenance': 'bg-indigo-400',
  'Closed': 'bg-gray-400',
};

const statusLabels: Record<string, { bg: string; text: string }> = {
  'Research': { bg: 'bg-sky-500/15 border border-sky-500/25', text: 'text-sky-400' },
  'Planning': { bg: 'bg-blue-500/15 border border-blue-500/25', text: 'text-blue-400' },
  'In Progress': { bg: 'bg-orange-500/15 border border-orange-500/25', text: 'text-orange-400' },
  'Review': { bg: 'bg-purple-500/15 border border-purple-500/25', text: 'text-purple-400' },
  'On Hold': { bg: 'bg-yellow-500/15 border border-yellow-500/25', text: 'text-yellow-400' },
  'Completed': { bg: 'bg-green-500/15 border border-green-500/25', text: 'text-green-400' },
  'Cancelled': { bg: 'bg-red-500/15 border border-red-500/25', text: 'text-red-400' },
  'Archived': { bg: 'bg-slate-500/15 border border-slate-500/25', text: 'text-slate-400' },
  'Pending Approval': { bg: 'bg-amber-500/15 border border-amber-500/25', text: 'text-amber-400' },
  'Approved': { bg: 'bg-emerald-500/15 border border-emerald-500/25', text: 'text-emerald-400' },
  'Rejected': { bg: 'bg-rose-500/15 border border-rose-500/25', text: 'text-rose-400' },
  'Needs Revision': { bg: 'bg-pink-500/15 border border-pink-500/25', text: 'text-pink-400' },
  'In Testing': { bg: 'bg-violet-500/15 border border-violet-500/25', text: 'text-violet-400' },
  'Ready for Deployment': { bg: 'bg-teal-500/15 border border-teal-500/25', text: 'text-teal-400' },
  'Deployed': { bg: 'bg-cyan-500/15 border border-cyan-500/25', text: 'text-cyan-400' },
  'Maintenance': { bg: 'bg-indigo-500/15 border border-indigo-500/25', text: 'text-indigo-400' },
  'Closed': { bg: 'bg-gray-500/15 border border-gray-500/25', text: 'text-gray-400' },
};

export function ChartByStatus({ data }: { data: ProjectsByStatus[] }) {
  // Only display statuses that have active projects, to keep the dashboard clean
  const activeData = data.filter((item) => item.count > 0);
  const maxCount = Math.max(...activeData.map((d) => d.count), 1);

  if (activeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
        <p>No project statuses to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeData.map((item) => {
        const colorClass = statusColors[item.status] || 'bg-primary';
        const labelStyle = statusLabels[item.status] || {
          bg: 'bg-white/10 border border-white/15',
          text: 'text-foreground',
        };

        return (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${labelStyle.bg} ${labelStyle.text}`}>
                {item.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-32">
                <div
                  className={`h-full ${colorClass}`}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-6 text-right">{item.count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

