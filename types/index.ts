export type ProjectStatus = 'Research' | 'Planning' | 'In Progress' | 'Review' | 'On Hold' | 'Completed' | 'Cancelled' | 'Archived' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Needs Revision' | 'In Testing' | 'Ready for Deployment' | 'Deployed' | 'Maintenance' | 'Closed';
export type ProjectType = 'UI/UX Design' | 'Web Development' | 'Mobile App Development';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical' | 'Urgent' | 'Immediate' | 'Important' | 'Optional' | 'Backlog' | 'Future' | 'Long-term' | 'Short-term' | 'Strategic' | 'Tactical' | 'Operational' | 'Key Initiative' | 'Quick Win' | 'Major' | 'Minor';
export type ProjectDevice = 'Desktop' | 'Mobile' | 'Tablet' | 'TV' | 'POS' | 'Car' | 'Watch' | 'All' | 'None' | 'Custom Device' | 'Wearable' | 'IoT Device' | 'AR/VR Headset' | 'Game Console' | 'Smart Home Device' | 'Industrial Equipment' | 'Medical Device' | 'Drone' | 'Robot' | 'Kiosk' | 'Interactive Display';
export type ProjectEffort = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'Minimal' | 'Moderate' | 'Significant' | 'Extensive' | 'Intensive' | 'Comprehensive' | 'In-depth' | 'Thorough' | 'Exhaustive' | 'All-encompassing';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: string; // Project Category
  projectType: ProjectType; // High-level Project Type
  status: ProjectStatus;
  priority: ProjectPriority;
  effort: ProjectEffort;
  device: ProjectDevice;
  creatorName: string;
  industry: string;
  startDate: string;
  endDate: string;
  deadline: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  previewLink: string;
  resourceLinks: Array<{ url: string; title: string }>;
  shortOverview: string;
  businessGoal: string;
  targetAudience: string;
  competitors: string;
  tags: string[];
  techStack: string[];
  toolsUsed: string[];
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  inProgress: number;
  completed: number;
  criticalPriority: number;
  importantPriority: number;
}

export interface ProjectsByStatus {
  status: ProjectStatus;
  count: number;
}

export interface ProjectsByType {
  type: ProjectType;
  count: number;
}
