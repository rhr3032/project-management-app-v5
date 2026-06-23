import { Project, DashboardStats, ProjectsByStatus, ProjectsByType } from '@/types';

// Mock data - will be replaced with actual DB queries when DATABASE_URL is available
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of our mobile app interface',
    type: 'UI/UX Design',
    status: 'Review',
    priority: 'Critical',
    effort: 'M',
    device: 'Mobile',
    owner: 'Raisul R.',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    deadline: '2026-07-15',
    clientName: 'Vanguard Logistics Corp',
    clientEmail: 'contact@vanguard.com',
    clientPhone: '+1 (555) 123-4567',
    previewLink: 'https://preview.yourproject.com',
    resourceLinks: [{ url: 'https://figma.com/project', title: 'Figma Design' }],
    shortOverview: 'A concise 1-2 sentence summary of what this project is and why it matters.',
    businessGoal: 'Increase conversion by 20%.',
    targetAudience: 'Primary users and stakeholders.',
    competitors: 'Notion, Linear, Asana',
    tags: ['design', 'mobile', 'core'],
    company: 'Vanguard Logistics Corp',
    createdAt: '2026-06-01',
    updatedAt: '2026-06-23',
  },
  {
    id: '2',
    name: 'Website Optimization',
    description: 'Performance and UX optimization for desktop',
    type: 'Web App',
    status: 'In Progress',
    priority: 'High',
    effort: 'L',
    device: 'Desktop',
    owner: 'Raisul',
    startDate: '2026-06-22',
    endDate: '2026-07-22',
    deadline: '2026-07-22',
    clientName: 'Vanguard Logistics Corp',
    clientEmail: 'contact@vanguard.com',
    clientPhone: '+1 (555) 987-6543',
    previewLink: 'https://preview.yourproject.com',
    resourceLinks: [{ url: 'https://github.com/repo', title: 'GitHub Repo' }],
    shortOverview: 'A concise 1-2 sentence summary.',
    businessGoal: 'Increase conversion by 20%.',
    targetAudience: 'Primary users.',
    competitors: 'Notion, Linear',
    tags: ['web', 'optimization'],
    company: 'Vanguard Logistics Corp',
    createdAt: '2026-06-10',
    updatedAt: '2026-06-23',
  },
  {
    id: '3',
    name: 'Brand Identity System',
    description: 'Complete branding and design system creation',
    type: 'Branding',
    status: 'Planning',
    priority: 'Medium',
    effort: 'XL',
    device: 'All',
    owner: 'Jordan Lee',
    startDate: '2026-06-24',
    endDate: '2026-09-24',
    deadline: '2026-09-24',
    clientName: 'Tech Innovations Inc',
    clientEmail: 'hello@techinnovations.com',
    clientPhone: '+1 (555) 246-8135',
    previewLink: 'https://preview.yourproject.com',
    resourceLinks: [{ url: 'https://brand.guide', title: 'Brand Guide' }],
    shortOverview: 'A concise summary.',
    businessGoal: 'Establish strong brand presence.',
    targetAudience: 'B2B and B2C customers.',
    competitors: 'Notion, Linear, Asana',
    tags: ['branding', 'design'],
    company: 'Tech Innovations Inc',
    createdAt: '2026-05-20',
    updatedAt: '2026-06-23',
  },
];

export async function getProjects(): Promise<Project[]> {
  // TODO: Replace with actual DB query when DATABASE_URL is available
  return mockProjects;
}

export async function getProject(id: string): Promise<Project | null> {
  // TODO: Replace with actual DB query
  return mockProjects.find(p => p.id === id) || null;
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  // TODO: Replace with actual DB insert
  const newProject: Project = {
    ...project,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProjects.push(newProject);
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  // TODO: Replace with actual DB update
  const index = mockProjects.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const updated = {
    ...mockProjects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  mockProjects[index] = updated;
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  // TODO: Replace with actual DB delete
  const index = mockProjects.findIndex(p => p.id === id);
  if (index === -1) return false;
  mockProjects.splice(index, 1);
  return true;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const projects = await getProjects();
  return {
    totalProjects: projects.length,
    inProgress: projects.filter(p => p.status === 'In Progress').length,
    completed: projects.filter(p => p.status === 'Completed').length,
    criticalPriority: projects.filter(p => p.priority === 'Critical').length,
  };
}

export async function getProjectsByStatus(): Promise<ProjectsByStatus[]> {
  const projects = await getProjects();
  const statuses: ProjectStatus[] = ['Planning', 'In Progress', 'Review', 'On Hold', 'Completed'];
  return statuses.map(status => ({
    status,
    count: projects.filter(p => p.status === status).length,
  }));
}

export async function getProjectsByType(): Promise<ProjectsByType[]> {
  const projects = await getProjects();
  const types: ProjectType[] = ['UI/UX Design', 'Web App', 'Mobile App'];
  return types.map(type => ({
    type,
    count: projects.filter(p => p.type === type).length,
  }));
}

export function updateProjectStatus(id: string, status: ProjectStatus): Project | null {
  const project = mockProjects.find(p => p.id === id);
  if (project) {
    project.status = status;
    project.updatedAt = new Date().toISOString();
    return project;
  }
  return null;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'On Hold' | 'Completed';
export type ProjectType = 'UI/UX Design' | 'Web App' | 'Mobile App';
