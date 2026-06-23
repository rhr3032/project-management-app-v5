'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/stat-card';
import { ChartByStatus } from '@/components/dashboard/chart-by-status';
import { ChartByType } from '@/components/dashboard/chart-by-type';
import { CriticalItems } from '@/components/dashboard/critical-items';
import { RecentProjects } from '@/components/dashboard/recent-projects';
import { DashboardStats, ProjectsByStatus, ProjectsByType } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [byStatus, setByStatus] = useState<ProjectsByStatus[]>([]);
  const [byType, setByType] = useState<ProjectsByType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        setStats(data.stats);
        setByStatus(data.byStatus);
        setByType(data.byType);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {stats?.totalProjects || 0} projects across your workspace
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus size={16} className="mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          title="TOTAL PROJECTS"
          value={stats?.totalProjects || 0}
          icon="📋"
        />
        <StatCard
          title="IN PROGRESS"
          value={stats?.inProgress || 0}
          icon="⏱️"
        />
        <StatCard
          title="COMPLETED"
          value={stats?.completed || 0}
          icon="✅"
        />
        <StatCard
          title="CRITICAL PRIORITY"
          value={stats?.criticalPriority || 0}
          icon="⚠️"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">BY STATUS</h2>
          <ChartByStatus data={byStatus} />
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">BY TYPE</h2>
          <ChartByType data={byType} />
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">CRITICAL ITEMS</h2>
          <CriticalItems />
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground">RECENT PROJECTS</h2>
          <Link href="/projects" className="text-primary hover:text-primary/80 text-sm font-medium">
            View all →
          </Link>
        </div>
        <RecentProjects />
      </div>
    </div>
  );
}
