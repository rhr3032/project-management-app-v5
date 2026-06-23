'use client';

import { ProjectsByType } from '@/types';

const typeColors: Record<string, string> = {
  'UI/UX Design': 'bg-primary',
  'Web App': 'bg-cyan-400',
  'Mobile App': 'bg-purple-400',
};

const typeLabels: Record<string, { bg: string; text: string }> = {
  'UI/UX Design': { bg: 'bg-pink-100', text: 'text-pink-700' },
  'Web App': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  'Mobile App': { bg: 'bg-purple-100', text: 'text-purple-700' },
};

export function ChartByType({ data }: { data: ProjectsByType[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.type} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${typeLabels[item.type].bg} ${typeLabels[item.type].text}`}>
              {item.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-32">
              <div
                className={`h-full ${typeColors[item.type]}`}
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
