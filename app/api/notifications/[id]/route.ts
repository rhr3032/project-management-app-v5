import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { markNotificationAsRead } from '@/lib/notification-service';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getSessionFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await context.params;
    const updated = await markNotificationAsRead(user.id, id);

    return updated
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}