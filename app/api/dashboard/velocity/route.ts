import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const now = new Date();
    const monthStr = searchParams.get('month');
    const yearStr = searchParams.get('year');

    const month = monthStr ? parseInt(monthStr, 10) : now.getMonth() + 1;
    const year = yearStr ? parseInt(yearStr, 10) : now.getFullYear();

    if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
      return NextResponse.json({ error: 'Invalid month or year' }, { status: 400 });
    }

    const projects = await getProjects();

    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyData = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const label = new Date(year, month - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyData.push({
        day: String(d),
        label,
        dateStr,
        created: 0,
        completed: 0,
        closed: 0,
      });
    }

    projects.forEach((project) => {
      // 1. Created Date
      const createdDate = new Date(project.createdAt);
      if (
        createdDate.getFullYear() === year &&
        createdDate.getMonth() + 1 === month
      ) {
        const day = createdDate.getDate();
        if (day >= 1 && day <= daysInMonth) {
          dailyData[day - 1].created++;
        }
      }

      // 2. Completed Date
      if (project.status === 'Completed') {
        const completedDate = project.endDate ? new Date(project.endDate) : new Date(project.updatedAt);
        if (
          !isNaN(completedDate.getTime()) &&
          completedDate.getFullYear() === year &&
          completedDate.getMonth() + 1 === month
        ) {
          const day = completedDate.getDate();
          if (day >= 1 && day <= daysInMonth) {
            dailyData[day - 1].completed++;
          }
        }
      }

      // 3. Closed Date
      if (project.status === 'Closed') {
        const closedDate = project.endDate ? new Date(project.endDate) : new Date(project.updatedAt);
        if (
          !isNaN(closedDate.getTime()) &&
          closedDate.getFullYear() === year &&
          closedDate.getMonth() + 1 === month
        ) {
          const day = closedDate.getDate();
          if (day >= 1 && day <= daysInMonth) {
            dailyData[day - 1].closed++;
          }
        }
      }
    });

    // Also get the list of available years dynamically
    const yearsSet = new Set<number>();
    projects.forEach((p) => {
      yearsSet.add(new Date(p.createdAt).getFullYear());
    });
    yearsSet.add(now.getFullYear());
    const availableYears = Array.from(yearsSet).sort((a, b) => b - a);

    return NextResponse.json({
      trend: dailyData,
      availableYears,
    });
  } catch (error) {
    console.error('Velocity API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch velocity data' }, { status: 500 });
  }
}
