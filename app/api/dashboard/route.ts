import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getProjectsByStatus, getProjectsByType, getProjectsByPriority, getProjectsMonthlyTrend } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const [stats, byStatus, byType, byPriority, monthlyTrend] = await Promise.all([
      getDashboardStats(),
      getProjectsByStatus(),
      getProjectsByType(),
      getProjectsByPriority(),
      getProjectsMonthlyTrend(),
    ]);

    return NextResponse.json({
      stats,
      byStatus,
      byType,
      byPriority,
      monthlyTrend,
    });
  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
