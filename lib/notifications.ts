import type { Project } from '@/types';

export type NotificationTone = 'danger' | 'warning' | 'info';
export type NotificationKind = 'deadline-overdue' | 'deadline-today' | 'deadline-soon' | 'status-change' | 'new-project';

export interface ProjectNotification {
  id: string;
  kind: NotificationKind;
  tone: NotificationTone;
  title: string;
  description: string;
  href: string;
  projectId: string;
  projectName: string;
  createdAt: string;
}

export interface ProjectSnapshotEntry {
  name: string;
  status: string;
  deadline: string;
  updatedAt: string;
}

export type ProjectSnapshot = Record<string, ProjectSnapshotEntry>;

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfLocalDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function getDaysUntilDeadline(deadline: string, now = new Date()) {
  if (!deadline) return null;

  const deadlineDate = parseLocalDate(deadline);
  if (!deadlineDate) return null;

  const diff = startOfLocalDay(deadlineDate).getTime() - startOfLocalDay(now).getTime();
  return Math.round(diff / DAY_MS);
}

export function createProjectSnapshot(projects: Project[]): ProjectSnapshot {
  return projects.reduce<ProjectSnapshot>((snapshot, project) => {
    snapshot[project.id] = {
      name: project.name,
      status: project.status,
      deadline: project.deadline || '',
      updatedAt: project.updatedAt,
    };
    return snapshot;
  }, {});
}

function buildDeadlineNotification(project: Project, daysLeft: number): ProjectNotification | null {
  const baseHref = `/projects/${project.id}`;

  if (daysLeft < 0) {
    return {
      id: `deadline-overdue-${project.id}`,
      kind: 'deadline-overdue',
      tone: 'danger',
      title: `${project.name} is overdue`,
      description: `Deadline passed ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago.`,
      href: baseHref,
      projectId: project.id,
      projectName: project.name,
      createdAt: project.updatedAt || project.createdAt,
    };
  }

  if (daysLeft === 0) {
    return {
      id: `deadline-today-${project.id}`,
      kind: 'deadline-today',
      tone: 'warning',
      title: `${project.name} is due today`,
      description: 'The project deadline is today.',
      href: baseHref,
      projectId: project.id,
      projectName: project.name,
      createdAt: project.updatedAt || project.createdAt,
    };
  }

  if (daysLeft <= 3) {
    return {
      id: `deadline-3-${project.id}`,
      kind: 'deadline-soon',
      tone: 'warning',
      title: `${project.name} deadline in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
      description: `Reminder: the deadline is approaching within 3 days.`,
      href: baseHref,
      projectId: project.id,
      projectName: project.name,
      createdAt: project.updatedAt || project.createdAt,
    };
  }

  if (daysLeft <= 5) {
    return {
      id: `deadline-5-${project.id}`,
      kind: 'deadline-soon',
      tone: 'info',
      title: `${project.name} deadline in ${daysLeft} days`,
      description: `Reminder: the deadline is approaching within 5 days.`,
      href: baseHref,
      projectId: project.id,
      projectName: project.name,
      createdAt: project.updatedAt || project.createdAt,
    };
  }

  if (daysLeft <= 7) {
    return {
      id: `deadline-7-${project.id}`,
      kind: 'deadline-soon',
      tone: 'info',
      title: `${project.name} deadline in ${daysLeft} days`,
      description: `Reminder: the deadline is approaching within 7 days.`,
      href: baseHref,
      projectId: project.id,
      projectName: project.name,
      createdAt: project.updatedAt || project.createdAt,
    };
  }

  return null;
}

export function buildProjectNotifications(projects: Project[], previousSnapshot?: ProjectSnapshot) {
  const snapshot = createProjectSnapshot(projects);
  const notifications: ProjectNotification[] = [];
  const previousSnapshotKeys = previousSnapshot ? Object.keys(previousSnapshot) : [];

  for (const project of projects) {
    const daysLeft = getDaysUntilDeadline(project.deadline);

    if (daysLeft !== null) {
      const deadlineNotification = buildDeadlineNotification(project, daysLeft);
      if (deadlineNotification) {
        notifications.push(deadlineNotification);
      }
    }

    const previous = previousSnapshot?.[project.id];

    if (previous && previous.status !== project.status) {
      notifications.push({
        id: `status-${project.id}-${project.updatedAt}`,
        kind: 'status-change',
        tone: 'info',
        title: `${project.name} status changed`,
        description: `Status updated from ${previous.status} to ${project.status}.`,
        href: `/projects/${project.id}`,
        projectId: project.id,
        projectName: project.name,
        createdAt: project.updatedAt || project.createdAt,
      });
    }

    if (previousSnapshotKeys.length > 0 && !previous) {
      notifications.push({
        id: `new-project-${project.id}`,
        kind: 'new-project',
        tone: 'info',
        title: `New project: ${project.name}`,
        description: `${project.creatorName || 'A new project'} was added to the workspace.`,
        href: `/projects/${project.id}`,
        projectId: project.id,
        projectName: project.name,
        createdAt: project.createdAt,
      });
    }
  }

  const toneRank: Record<NotificationTone, number> = {
    danger: 0,
    warning: 1,
    info: 2,
  };

  notifications.sort((left, right) => {
    const toneDiff = toneRank[left.tone] - toneRank[right.tone];
    if (toneDiff !== 0) return toneDiff;
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });

  return { notifications, snapshot };
}
