'use client';

import { ProjectsByStatus } from '@/types';

const statusColors: Record<string, string> = {
  'Planning': 'bg-blue-400',
  'In Progress': 'bg-primary',
  'Review': 'bg-purple-400',
  'On Hold': 'bg-gray-400',
  'Completed': 'bg-green-400',
};

const statusLabels: Record<string, { bg: string; text: string }> = {
  'Planning': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'In Progress': { bg: 'bg-orange-100', text: 'text-orange-700' },
  'Review': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'On Hold': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'Completed': { bg: 'bg-green-100', text: 'text-green-700' },
};

export function ChartByStatus({ data }: { data: ProjectsByStatus[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.status} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusLabels[item.status].bg} ${statusLabels[item.status].text}`}>
              {item.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-32">
              <div
                className={`h-full ${statusColors[item.status]}`}
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-foreground w-6 text-right">{item.count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
