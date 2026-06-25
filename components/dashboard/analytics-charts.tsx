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
  monthlyTrend: Array<{ month: string; projects: number }>;
  byPriority: Array<{ priority: string; count: number }>;
}

const priorityColorMap: Record<string, string> = {
  'Low': '#06b6d4',       // Cyan/Sky
  'Medium': '#6366f1',    // Indigo/Blue
  'High': '#f97316',      // Orange
  'Critical': '#ef4444',  // Red
};

export function AnalyticsCharts({ monthlyTrend, byPriority }: AnalyticsChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      return (
        <div className="backdrop-blur-md bg-slate-950/80 border border-white/10 p-3 rounded-xl shadow-xl">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <p className="text-sm font-semibold text-foreground">
              Projects: <span className="text-indigo-400">{payload[0].value}</span>
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Trend Area Chart */}
      <div className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project Velocity</h2>
            <p className="text-lg font-semibold text-foreground mt-1">Monthly Creation Trend</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
            Last 6 Months
          </span>
        </div>
        
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="month" 
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
              <Tooltip content={<TrendTooltip />} />
              <Area 
                type="monotone" 
                dataKey="projects" 
                name="Projects" 
                stroke="#6366f1" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#trendGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Bar Chart */}
      <div className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Priority Distribution</h2>
            <p className="text-lg font-semibold text-foreground mt-1">Projects by Priority</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 border border-purple-500/25 text-purple-400">
            Workload Severity
          </span>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byPriority} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                maxBarSize={40}
              >
                {byPriority.map((entry, index) => (
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
