import { NextRequest, NextResponse } from 'next/server';
import { deleteProject, getProject, updateProject } from '@/lib/api';
import { z } from 'zod';

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.string().min(1).optional(),
  projectType: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  priority: z.string().min(1).optional(),
  effort: z.string().min(1).optional(),
  device: z.string().optional(),
  owner: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  deadline: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().optional(),
  clientPhone: z.string().optional(),
  previewLink: z.string().optional(),
  resourceLinks: z.array(z.object({ url: z.string(), title: z.string() })).optional(),
  shortOverview: z.string().optional(),
  businessGoal: z.string().optional(),
  targetAudience: z.string().optional(),
  competitors: z.string().optional(),
  tags: z.array(z.string()).optional(),
  company: z.string().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProject(id);

    return project
      ? NextResponse.json(project)
      : NextResponse.json({ error: 'Project not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates = updateProjectSchema.parse(body);
    const project = await updateProject(id, updates);

    return project
      ? NextResponse.json(project)
      : NextResponse.json({ error: 'Project not found' }, { status: 404 });
  } catch (error) {
    console.error('PATCH Project Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteProject(id);

    return deleted
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: 'Project not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
