import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession, COOKIE_NAME_EXPORT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieValue = request.cookies.get(COOKIE_NAME_EXPORT)?.value;
    const user = await getUserFromSession(cookieValue);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication check failed' }, { status: 500 });
  }
}
