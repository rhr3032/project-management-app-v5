import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getProjectsByStatus, getProjectsByType } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const [stats, byStatus, byType] = await Promise.all([
      getDashboardStats(),
      getProjectsByStatus(),
      getProjectsByType(),
    ]);

    return NextResponse.json({
      stats,
      byStatus,
      byType,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
