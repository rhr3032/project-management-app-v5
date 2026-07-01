import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getAllNotificationsForUser, getNotificationsForUser } from '@/lib/notification-service';

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const includeAll = request.nextUrl.searchParams.get('all') === 'true';
    const payload = includeAll ? await getAllNotificationsForUser(user.id) : await getNotificationsForUser(user.id);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}