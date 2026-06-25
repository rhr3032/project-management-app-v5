'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChartByStatus } from '@/components/dashboard/chart-by-status';
import { ChartByType } from '@/components/dashboard/chart-by-type';
import { CriticalItems } from '@/components/dashboard/critical-items';
import { RecentProjects } from '@/components/dashboard/recent-projects';
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts';
import { StatusAnalyticsChart } from '@/components/dashboard/status-analytics-chart';
import { DashboardStats, ProjectsByStatus, ProjectsByType } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [byStatus, setByStatus] = useState<ProjectsByStatus[]>([]);
  const [byType, setByType] = useState<ProjectsByType[]>([]);
  const [byPriority, setByPriority] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        const data = await res.json();
        setStats(data.stats || null);
        setByStatus(data.byStatus || []);
        setByType(data.byType || []);
        setByPriority(data.byPriority || []);
        setMonthlyTrend(data.monthlyTrend || []);
        setProjects(data.projects || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fadeInUp">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {stats?.totalProjects || 0} projects across your workspace
          </p>
        </div>
        <Link href="/projects/new">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm">
            <Plus size={16} /> New Project
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="TOTAL PROJECTS" value={stats?.totalProjects || 0} icon={<TrendingUp size={20} />} color="indigo" />
        <StatCard title="IN PROGRESS" value={stats?.inProgress || 0} icon={<Clock size={20} />} color="orange" />
        <StatCard title="COMPLETED" value={stats?.completed || 0} icon={<CheckCircle2 size={20} />} color="green" />
        <StatCard title="CRITICAL" value={stats?.criticalPriority || 0} icon={<AlertTriangle size={20} />} color="red" />
        <StatCard title="IMPORTANT" value={stats?.importantPriority || 0} icon={<AlertTriangle size={20} />} color="purple" />
      </div>

      {/* Analytics Visualization (Recharts) */}
      <AnalyticsCharts monthlyTrend={monthlyTrend} byPriority={byPriority} projects={projects} />

      {/* Full-width Status Analytics Chart */}
      <StatusAnalyticsChart data={byStatus} projects={projects} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">By Status</h2>
          <ChartByStatus data={byStatus} />
        </div>
        <div className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">By Project Type</h2>
          <ChartByType data={byType} />
        </div>
        <div className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">Critical Items</h2>
          <CriticalItems />
        </div>
      </div>

      {/* Recent Projects */}
      <div className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Projects</h2>
          <Link href="/projects" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>
        <RecentProjects />
      </div>
    </div>
  );
}
