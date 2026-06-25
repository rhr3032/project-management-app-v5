import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getProjectsByStatus, getProjectsByType, getProjectsByPriority, getProjectsMonthlyTrend } from '@/lib/api';
import { getPrisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const [stats, byStatus, byType, byPriority, monthlyTrend, projects] = await Promise.all([
      getDashboardStats(),
      getProjectsByStatus(),
      getProjectsByType(),
      getProjectsByPriority(),
      getProjectsMonthlyTrend(),
      prisma.project.findMany({
        select: {
          id: true,
          createdAt: true,
          priority: true,
          status: true,
        },
      }),
    ]);

    return NextResponse.json({
      stats,
      byStatus,
      byType,
      byPriority,
      monthlyTrend,
      projects: projects.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString()
      })),
    });
  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
