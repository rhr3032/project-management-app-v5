import type { NotificationKind, NotificationTone } from '@/lib/notification-types';

export type ProjectNotificationSource = {
  id: string;
  name: string;
  status: string;
  deadline: string;
  creatorName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationDraft = {
  kind: NotificationKind;
  tone: NotificationTone;
  title: string;
  description: string;
  href: string;
};

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

export function buildDeadlineNotification(project: ProjectNotificationSource): NotificationDraft | null {
  const daysLeft = getDaysUntilDeadline(project.deadline);
  if (daysLeft === null || daysLeft > 7) return null;

  const href = `/projects/${project.id}`;

  if (daysLeft < 0) {
    return {
      kind: 'deadline-overdue',
      tone: 'danger',
      title: `${project.name} is overdue`,
      description: `Deadline passed ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago.`,
      href,
    };
  }

  if (daysLeft === 0) {
    return {
      kind: 'deadline-today',
      tone: 'warning',
      title: `${project.name} is due today`,
      description: 'The project deadline is today.',
      href,
    };
  }

  if (daysLeft <= 3) {
    return {
      kind: 'deadline-3',
      tone: 'warning',
      title: `${project.name} deadline in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
      description: 'Reminder: the deadline is approaching within 3 days.',
      href,
    };
  }

  if (daysLeft <= 5) {
    return {
      kind: 'deadline-5',
      tone: 'info',
      title: `${project.name} deadline in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
      description: 'Reminder: the deadline is approaching within 5 days.',
      href,
    };
  }

  return {
    kind: 'deadline-7',
    tone: 'info',
    title: `${project.name} deadline in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
    description: 'Reminder: the deadline is approaching within 7 days.',
    href,
  };
}

export function getNotificationUniqueKey(userId: string, kind: NotificationKind, projectId: string) {
  return `${userId}:${kind}:${projectId}`;
}

export function getEventNotificationUniqueKey(userId: string, kind: NotificationKind, projectId: string, stamp: string) {
  return `${userId}:${kind}:${projectId}:${stamp}`;
}