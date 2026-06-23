import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/api';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  type: z.enum(['UI/UX Design', 'Web App', 'Mobile App']),
  status: z.enum(['Planning', 'In Progress', 'Review', 'On Hold', 'Completed']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  effort: z.enum(['XS', 'S', 'M', 'L', 'XL']),
  device: z.enum(['XS', 'M', 'L', 'Desktop', 'Mobile', 'Tablet']),
  owner: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  deadline: z.string(),
  clientName: z.string(),
  clientEmail: z.string(),
  previewLink: z.string(),
  resourceLinks: z.array(z.object({ url: z.string(), title: z.string() })),
  shortOverview: z.string(),
  businessGoal: z.string(),
  targetAudience: z.string(),
  competitors: z.string(),
  tags: z.array(z.string()),
  company: z.string(),
});

export async function GET(request: NextRequest) {
  try {
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
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
