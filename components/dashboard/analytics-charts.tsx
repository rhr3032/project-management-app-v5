'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface AnalyticsChartsProps {
  monthlyTrend?: Array<{ month: string; projects: number }>;
  byPriority: Array<{ priority: string; count: number }>;
  projects: any[];
  techStackFilter?: string;
  toolsUsedFilter?: string;
}

const priorityColorMap: Record<string, string> = {
  'Critical': '#ef4444',      // Red
  'Urgent': '#f43f5e',        // Rose
  'Immediate': '#fda4af',     // Soft Rose
  'High': '#f97316',          // Orange
  'Important': '#eab308',     // Amber
  'Major': '#8b5cf6',         // Violet
  'Medium': '#6366f1',        // Indigo
  'Minor': '#06b6d4',         // Cyan
  'Low': '#10b981',           // Emerald
  'Optional': '#94a3b8',      // Slate
  'Backlog': '#6b7280',       // Gray
  'Strategic': '#a855f7',     // Purple
  'Key Initiative': '#4f46e5',// Indigo Dark
  'Quick Win': '#22c55e',     // Green
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

export function AnalyticsCharts({ byPriority, projects, techStackFilter, toolsUsedFilter }: AnalyticsChartsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [velocityTrend, setVelocityTrend] = useState<any[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([new Date().getFullYear()]);
  const [chartLoading, setChartLoading] = useState(true);

  // Separate states for Priority Chart Month/Year
  const [priorityMonth, setPriorityMonth] = useState<number>(new Date().getMonth() + 1);
  const [priorityYear, setPriorityYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchVelocityData() {
      setChartLoading(true);
      try {
        const res = await fetch(`/api/dashboard/velocity?month=${selectedMonth}&year=${selectedYear}&techStack=${techStackFilter || ''}&toolsUsed=${toolsUsedFilter || ''}`);
        if (!res.ok) throw new Error('Failed to fetch velocity data');
        const data = await res.json();
        setVelocityTrend(data.trend || []);
        if (data.availableYears) {
          setAvailableYears(data.availableYears);
        }
      } catch (err) {
        console.error('Failed to fetch velocity trend:', err);
      } finally {
        setChartLoading(false);
      }
    }
    if (mounted) {
      fetchVelocityData();
    }
  }, [selectedMonth, selectedYear, mounted, techStackFilter, toolsUsedFilter]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 min-h-[350px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground text-xs">Loading analytics...</p>
          </div>
        </div>
        <div className="glass-card p-6 min-h-[350px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground text-xs">Loading priorities...</p>
          </div>
        </div>
      </div>
    );
  }

  // Custom tooltips matching the dark glassmorphism system
  const TrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-md bg-slate-950/80 border border-white/10 p-3 rounded-xl shadow-xl space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            {data.label}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <p className="text-xs font-semibold text-foreground">
              Created: <span className="text-indigo-400">{data.created}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <p className="text-xs font-semibold text-foreground">
              Completed: <span className="text-emerald-400">{data.completed}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <p className="text-xs font-semibold text-foreground">
              Closed: <span className="text-rose-400">{data.closed}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const PriorityTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const color = priorityColorMap[data.priority] || '#6366f1';
      return (
        <div className="backdrop-blur-md bg-slate-950/80 border border-white/10 p-3 rounded-xl shadow-xl">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{data.priority} Priority</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
            <p className="text-sm font-semibold text-foreground">
              Projects: <span style={{ color }}>{payload[0].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Keep the list of priorities in order for the bar chart
  const targetPriorities = ['Critical', 'Urgent', 'High', 'Important', 'Major', 'Minor', 'Low', 'Quick Win'];
  const sortedPriorityData = targetPriorities.map(p => {
    const count = projects.filter(project => {
      if (project.priority !== p) return false;
      const date = new Date(project.createdAt);
      return date.getMonth() + 1 === priorityMonth && date.getFullYear() === priorityYear;
    }).length;
    return {
      priority: p,
      count
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Velocity trend Area Chart */}
      <div className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project Velocity</h2>
            <p className="text-lg font-semibold text-foreground mt-1">Daily Trends</p>
          </div>
          
          <div className="flex gap-2">
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
          </div>
        </div>
        
        <div className="h-[260px] w-full relative">
          {chartLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px] z-10 rounded-xl">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : null}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={velocityTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#7a8299" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                interval={0}
              />
              <YAxis 
                stroke="#7a8299" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip content={<TrendTooltip />} />
              <Area 
                type="monotone" 
                dataKey="created" 
                name="Created" 
                stroke="#6366f1" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#createdGrad)" 
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                name="Completed" 
                stroke="#10b981" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#completedGrad)" 
              />
              <Area 
                type="monotone" 
                dataKey="closed" 
                name="Closed" 
                stroke="#f43f5e" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#closedGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Bar Chart */}
      <div className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Priority Distribution</h2>
            <p className="text-lg font-semibold text-foreground mt-1">Projects by Priority</p>
          </div>
          
          <div className="flex gap-2 items-center">
            <select
              value={priorityMonth}
              onChange={(e) => setPriorityMonth(Number(e.target.value))}
              className="px-3 py-1.5 border border-white/10 rounded-xl glass-input text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-slate-950"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value} className="bg-slate-950">
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={priorityYear}
              onChange={(e) => setPriorityYear(Number(e.target.value))}
              className="px-3 py-1.5 border border-white/10 rounded-xl glass-input text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-slate-950"
            >
              {availableYears.map((y) => (
                <option key={y} value={y} className="bg-slate-950">
                  {y}
                </option>
              ))}
            </select>

            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 border border-purple-500/25 text-purple-400">
              Workload Severity
            </span>
          </div>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedPriorityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="priority" 
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
              <Tooltip content={<PriorityTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar 
                dataKey="count" 
                name="Projects" 
                radius={[6, 6, 0, 0]}
                maxBarSize={30}
              >
                {sortedPriorityData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={priorityColorMap[entry.priority] || '#6366f1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
