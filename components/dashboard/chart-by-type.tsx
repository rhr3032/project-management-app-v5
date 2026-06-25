'use client';

import { ProjectsByType } from '@/types';

const typeColors: Record<string, string> = {
  'UI/UX Design': 'bg-pink-400',
  'Web Development': 'bg-indigo-400',
  'Mobile App Development': 'bg-purple-400',
};

const typeLabels: Record<string, { bg: string; text: string }> = {
  'UI/UX Design': { bg: 'bg-pink-500/12 border border-pink-500/20', text: 'text-pink-400' },
  'Web Development': { bg: 'bg-indigo-500/12 border border-indigo-500/20', text: 'text-indigo-400' },
  'Mobile App Development': { bg: 'bg-purple-500/12 border border-purple-500/20', text: 'text-purple-400' },
};

export function ChartByType({ data }: { data: ProjectsByType[] }) {
  // Only display types that have active projects, to keep the dashboard clean
  const activeData = data.filter((item) => item.count > 0);
  const maxCount = Math.max(...activeData.map((d) => d.count), 1);

  if (activeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
        <p>No project types to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeData.map((item) => {
        const colorClass = typeColors[item.type] || 'bg-primary';
        const labelStyle = typeLabels[item.type] || {
          bg: 'bg-white/10 border border-white/15',
          text: 'text-foreground',
        };

        return (
          <div key={item.type} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${labelStyle.bg} ${labelStyle.text}`}>
                {item.type}
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

