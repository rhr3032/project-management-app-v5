'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { ProjectsByStatus } from '@/types';

interface StatusAnalyticsChartProps {
  data: ProjectsByStatus[];
  projects: any[];
}

const statusColorMap: Record<string, string> = {
  'Research': '#38bdf8',             // Sky
  'Planning': '#60a5fa',             // Blue
  'In Progress': '#fb923c',          // Orange
  'Review': '#c084fc',               // Purple
  'On Hold': '#facc15',              // Yellow
  'Completed': '#4ade80',            // Green
  'Cancelled': '#f87171',            // Red
  'Archived': '#94a3b8',             // Slate
  'Pending Approval': '#fbbf24',     // Amber
  'Approved': '#34d399',             // Emerald
  'Rejected': '#f43f5e',             // Rose
  'Needs Revision': '#f472b6',       // Pink
  'In Testing': '#818cf8',           // Indigo
  'Ready for Deployment': '#2dd4bf', // Teal
  'Deployed': '#22d3ee',             // Cyan
  'Maintenance': '#a78bfa',          // Violet
  'Closed': '#6b7280',               // Gray
};

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export function StatusAnalyticsChart({ data, projects }: StatusAnalyticsChartProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="glass-card p-6 mb-8 min-h-[350px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-xs">Loading status analytics...</p>
        </div>
      </div>
    );
  }

  // Include the 14 specified project statuses
  const targetStatuses = [
    'Research',
    'In Progress',
    'Review',
    'On Hold',
    'Completed',
    'Cancelled',
    'Pending Approval',
    'Approved',
    'Rejected',
    'In Testing',
    'Needs Revision',
    'Maintenance',
    'Deployed',
    'Ready for Deployment',
  ];

  const chartData = targetStatuses.map((status) => {
    const count = projects.filter((p) => {
      if (p.status !== status) return false;
      const date = new Date(p.createdAt);
      return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
    }).length;
    return {
      status,
      count,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const color = statusColorMap[d.status] || '#6366f1';
      return (
        <div className="backdrop-blur-md bg-slate-950/80 border border-white/10 p-3 rounded-xl shadow-xl">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Status: {d.status}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
            <p className="text-sm font-semibold text-foreground">
              Projects: <span style={{ color }}>{d.count}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const availableYears = Array.from(new Set([
    new Date().getFullYear(),
    ...projects.map(p => new Date(p.createdAt).getFullYear())
  ])).sort((a, b) => b - a);

  return (
    <div className="glass-card p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.12s' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Status Distribution
          </h2>
          <p className="text-lg font-semibold text-foreground mt-1">Projects by Status</p>
        </div>
        
        <div className="flex gap-2 items-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-1.5 border border-white/10 rounded-xl glass-input text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-slate-950"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value} className="bg-slate-950">
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 border border-white/10 rounded-xl glass-input text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-slate-950"
          >
            {availableYears.map((y) => (
              <option key={y} value={y} className="bg-slate-950">
                {y}
              </option>
            ))}
          </select>

          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
            Workflow Progress
          </span>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="status"
              stroke="#7a8299"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#7a8299"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="count" name="Projects" radius={[6, 6, 0, 0]} maxBarSize={50}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={statusColorMap[entry.status] || '#6366f1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
