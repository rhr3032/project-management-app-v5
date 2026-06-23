export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'On Hold' | 'Completed';
export type ProjectType = 'UI/UX Design' | 'Web App' | 'Mobile App' | 'Logo' | 'Branding' | 'Illustration';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ProjectDevice = 'Desktop' | 'Mobile' | 'Tablet' | 'TV' | 'Post' | 'Car' | 'Watch' | 'All';
export type ProjectEffort = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  effort: ProjectEffort;
  device: ProjectDevice;
  owner: string;
  startDate: string;
  endDate: string;
  deadline: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  previewLink: string;
  resourceLinks: Array<{ url: string; title: string }>;
  shortOverview: string;
  businessGoal: string;
  targetAudience: string;
  competitors: string;
  tags: string[];
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  inProgress: number;
  completed: number;
  criticalPriority: number;
}

export interface ProjectsByStatus {
  status: ProjectStatus;
  count: number;
}

export interface ProjectsByType {
  type: ProjectType;
  count: number;
}
