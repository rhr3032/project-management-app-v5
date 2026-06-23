import { NextResponse } from 'next/server';
import { seedUser } from '@/lib/auth';

export async function POST() {
  try {
    const user = await seedUser();
    return NextResponse.json({
      message: 'Seed user created successfully',
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed user' }, { status: 500 });
  }
}
