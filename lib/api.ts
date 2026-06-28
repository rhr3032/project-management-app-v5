import type { Prisma, Project as PrismaProject } from '@prisma/client';
import { DashboardStats, Project, ProjectsByStatus, ProjectsByType } from '@/types';
import { getPrisma } from '@/lib/prisma';

type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'status' | 'priority' | 'effort' | 'device'> & {
  type: string;
  status: string;
  priority: string;
  effort: string;
  device: string;
};
type ProjectUpdateInput = Partial<ProjectInput>;

const dashboardStatuses = [
  'Research','Planning','In Progress','Review','On Hold','Completed',
  'Cancelled','Archived','Pending Approval','Approved','Rejected',
  'Needs Revision','In Testing','Ready for Deployment','Deployed','Maintenance','Closed',
];
const dashboardTypes = [
  'UI/UX Design', 'Web Development', 'Mobile App Development'
];

function toStringArray(value: Prisma.JsonValue): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function toResourceLinks(value: Prisma.JsonValue): Project['resourceLinks'] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is { url: string; title: string } => {
      const link = item as Record<string, unknown>;
      return (
        typeof item === 'object' &&
        item !== null &&
        !Array.isArray(item) &&
        typeof link.url === 'string' &&
        typeof link.title === 'string'
      );
    })
    .map((item) => ({ url: item.url, title: item.title }));
}

function toProject(project: PrismaProject): Project {
  return {
    ...project,
    resourceLinks: toResourceLinks(project.resourceLinks),
    tags: toStringArray(project.tags),
    techStack: toStringArray(project.techStack),
    toolsUsed: toStringArray(project.toolsUsed),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  } as Project;
}

function toProjectCreateData(project: ProjectInput): Prisma.ProjectCreateInput {
  return {
    ...project,
    resourceLinks: project.resourceLinks,
    tags: project.tags,
    techStack: project.techStack,
    toolsUsed: project.toolsUsed,
  };
}

function toProjectUpdateData(updates: ProjectUpdateInput): Prisma.ProjectUpdateInput {
  const { resourceLinks, tags, techStack, toolsUsed, ...rest } = updates;

  return {
    ...rest,
    ...(resourceLinks ? { resourceLinks } : {}),
    ...(tags ? { tags } : {}),
    ...(techStack ? { techStack } : {}),
    ...(toolsUsed ? { toolsUsed } : {}),
  };
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getPrisma().project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return projects.map(toProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const project = await getPrisma().project.findUnique({
    where: { id },
  });

  return project ? toProject(project) : null;
}

export async function createProject(project: ProjectInput): Promise<Project> {
  const created = await getPrisma().project.create({
    data: toProjectCreateData(project),
  });

  return toProject(created);
}

export async function updateProject(id: string, updates: ProjectUpdateInput): Promise<Project | null> {
  try {
    const updated = await getPrisma().project.update({
      where: { id },
      data: toProjectUpdateData(updates),
    });

    return toProject(updated);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return null;
    }

    throw error;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await getPrisma().project.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return false;
    }

    throw error;
  }
}

export async function getDashboardStats(where?: Prisma.ProjectWhereInput): Promise<DashboardStats> {
  const prisma = getPrisma();
  const [totalProjects, inProgress, completed, criticalPriority, importantPriority] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.count({ where: { ...where, status: 'In Progress' } }),
    prisma.project.count({ where: { ...where, status: 'Completed' } }),
    prisma.project.count({ where: { ...where, priority: 'Critical' } }),
    prisma.project.count({ where: { ...where, priority: 'Important' } }),
  ]);

  return {
    totalProjects,
    inProgress,
    completed,
    criticalPriority,
    importantPriority,
  };
}

export async function getProjectsByStatus(where?: Prisma.ProjectWhereInput): Promise<ProjectsByStatus[]> {
  const grouped = await getPrisma().project.groupBy({
    by: ['status'],
    where,
    _count: { status: true },
  });

  return dashboardStatuses.map((status) => ({
    status: status as ProjectsByStatus['status'],
    count: grouped.find((item) => item.status === status)?._count.status ?? 0,
  }));
}

export async function getProjectsByType(where?: Prisma.ProjectWhereInput): Promise<ProjectsByType[]> {
  const grouped = await getPrisma().project.groupBy({
    by: ['projectType'],
    where,
    _count: { projectType: true },
  });

  return dashboardTypes.map((type) => ({
    type: type as ProjectsByType['type'],
    count: grouped.find((item) => item.projectType === type)?._count.projectType ?? 0,
  }));
}

export async function updateProjectStatus(id: string, status: string): Promise<Project | null> {
  return updateProject(id, { status });
}

export async function getProjectsByPriority(where?: Prisma.ProjectWhereInput) {
  const grouped = await getPrisma().project.groupBy({
    by: ['priority'],
    where,
    _count: { priority: true },
  });

  const priorities = ['Critical', 'Urgent', 'Immediate', 'High', 'Important', 'Major', 'Medium', 'Minor', 'Low', 'Optional', 'Backlog', 'Strategic', 'Key Initiative', 'Quick Win'];
  return priorities.map((p) => ({
    priority: p,
    count: grouped.find((item) => item.priority === p)?._count.priority ?? 0,
  }));
}

export async function getProjectsMonthlyTrend(where?: Prisma.ProjectWhereInput) {
  const prisma = getPrisma();
  const projects = await prisma.project.findMany({
    where,
    select: { createdAt: true },
  });

  const monthlyCounts: Record<string, number> = {};
  const months = [];

  // Generate last 6 months list
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({ key, label });
    monthlyCounts[key] = 0;
  }

  projects.forEach((p) => {
    const d = new Date(p.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyCounts[key] !== undefined) {
      monthlyCounts[key]++;
    }
  });

  return months.map((m) => ({
    month: m.label,
    projects: monthlyCounts[m.key],
  }));
}
