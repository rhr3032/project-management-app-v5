import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');
    const prisma = getPrisma();

    if (type === 'tech') {
      const options = await prisma.techOption.findMany({
        orderBy: { name: 'asc' },
      });
      return NextResponse.json(options.map(o => o.name));
    } else if (type === 'tool') {
      const options = await prisma.toolOption.findMany({
        orderBy: { name: 'asc' },
      });
      return NextResponse.json(options.map(o => o.name));
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('GET Options Error:', error);
    return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, name } = await request.json();
    if (!type || !name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Missing type or name parameter' }, { status: 400 });
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
    }

    const prisma = getPrisma();

    if (type === 'tech') {
      const existing = await prisma.techOption.findUnique({
        where: { name: trimmedName },
      });
      if (existing) {
        return NextResponse.json(existing);
      }
      const option = await prisma.techOption.create({
        data: { name: trimmedName },
      });
      return NextResponse.json(option, { status: 201 });
    } else if (type === 'tool') {
      const existing = await prisma.toolOption.findUnique({
        where: { name: trimmedName },
      });
      if (existing) {
        return NextResponse.json(existing);
      }
      const option = await prisma.toolOption.create({
        data: { name: trimmedName },
      });
      return NextResponse.json(option, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('POST Option Error:', error);
    return NextResponse.json({ error: 'Failed to create option' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');
    const name = request.nextUrl.searchParams.get('name');

    if (!type || !name) {
      return NextResponse.json({ error: 'Missing type or name parameter' }, { status: 400 });
    }

    const prisma = getPrisma();

    if (type === 'tech') {
      await prisma.techOption.delete({
        where: { name },
      });
      return NextResponse.json({ ok: true });
    } else if (type === 'tool') {
      await prisma.toolOption.delete({
        where: { name },
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('DELETE Option Error:', error);
    if (error instanceof Error && (error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete option' }, { status: 500 });
  }
}
