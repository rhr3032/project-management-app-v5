import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getProjectsByStatus, getProjectsByType, getProjectsByPriority, getProjectsMonthlyTrend } from '@/lib/api';
import { getPrisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const techStack = request.nextUrl.searchParams.get('techStack');
    const toolsUsed = request.nextUrl.searchParams.get('toolsUsed');

    const where: any = {};
    if (techStack && techStack !== 'All Tech Stack') {
      where.techStack = {
        array_contains: techStack,
      };
    }
    if (toolsUsed && toolsUsed !== 'All Tools Used') {
      where.toolsUsed = {
        array_contains: toolsUsed,
      };
    }

    const prisma = getPrisma();
    const [stats, byStatus, byType, byPriority, monthlyTrend, projects] = await Promise.all([
      getDashboardStats(where),
      getProjectsByStatus(where),
      getProjectsByType(where),
      getProjectsByPriority(where),
      getProjectsMonthlyTrend(where),
      prisma.project.findMany({
        where,
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
