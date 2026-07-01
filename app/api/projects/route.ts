import { NextRequest, NextResponse } from 'next/server';
import { getProject, getProjects, createProject } from '@/lib/api';
import { createProjectCreatedNotificationForAllUsers } from '@/lib/notification-service';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  type: z.string().min(1),
  projectType: z.string().min(1),
  status: z.string().min(1),
  priority: z.string().min(1),
  effort: z.string().min(1),
  device: z.string().default(''),
  creatorName: z.string().min(1),
  industry: z.string().min(1),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  deadline: z.string().default(''),
  clientName: z.string().default(''),
  clientEmail: z.string().default(''),
  clientPhone: z.string().default(''),
  clientAddress: z.string().default(''),
  previewLink: z.string().default(''),
  resourceLinks: z.array(z.object({ url: z.string(), title: z.string() })).default([]),
  shortOverview: z.string().default(''),
  businessGoal: z.string().default(''),
  targetAudience: z.string().default(''),
  competitors: z.string().default(''),
  tags: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  toolsUsed: z.array(z.string()).default([]),
  company: z.string().default(''),
});

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (id) {
      const project = await getProject(id);
      return project
        ? NextResponse.json(project)
        : NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = projectSchema.parse(body);
    const project = await createProject(validatedData);

    await createProjectCreatedNotificationForAllUsers({
      id: project.id,
      name: project.name,
      status: project.status,
      deadline: project.deadline,
      creatorName: project.creatorName,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('POST Project Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
