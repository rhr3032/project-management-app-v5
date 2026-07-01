import { getPrisma } from '@/lib/prisma';
import type { NotificationFeedResponse, NotificationItem, NotificationKind } from '@/lib/notification-types';
import {
  buildDeadlineNotification,
  getEventNotificationUniqueKey,
  getNotificationUniqueKey,
  type ProjectNotificationSource,
} from '@/lib/notification-rules';

type ProjectLite = ProjectNotificationSource;

const DEADLINE_KINDS: NotificationKind[] = [
  'deadline-overdue',
  'deadline-today',
  'deadline-7',
  'deadline-5',
  'deadline-3',
];

function toNotificationItem(notification: {
  id: string;
  kind: string;
  tone: string;
  title: string;
  description: string;
  href: string;
  projectId: string;
  projectName: string;
  isRead: boolean;
  createdAt: Date;
}): NotificationItem {
  return {
    id: notification.id,
    kind: notification.kind as NotificationKind,
    tone: notification.tone as NotificationItem['tone'],
    title: notification.title,
    description: notification.description,
    href: notification.href,
    projectId: notification.projectId,
    projectName: notification.projectName,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  };
}

export async function syncDeadlineNotificationsForUser(userId: string) {
  const prisma = getPrisma();
  const projects: ProjectLite[] = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      deadline: true,
      creatorName: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const activeKeys: string[] = [];

  for (const project of projects) {
    const draft = buildDeadlineNotification(project);
    if (!draft) continue;

    const uniqueKey = getNotificationUniqueKey(userId, draft.kind, project.id);
    activeKeys.push(uniqueKey);

    await prisma.notification.upsert({
      where: { uniqueKey },
      update: {
        projectName: project.name,
        kind: draft.kind,
        tone: draft.tone,
        title: draft.title,
        description: draft.description,
        href: draft.href,
        isActive: true,
        isRead: false,
        readAt: null,
      },
      create: {
        uniqueKey,
        userId,
        projectId: project.id,
        projectName: project.name,
        kind: draft.kind,
        tone: draft.tone,
        title: draft.title,
        description: draft.description,
        href: draft.href,
        isActive: true,
        isRead: false,
      },
    });
  }

  if (activeKeys.length > 0) {
    await prisma.notification.updateMany({
      where: {
        userId,
        kind: { in: DEADLINE_KINDS },
        uniqueKey: { notIn: activeKeys },
      },
      data: { isActive: false },
    });
  } else {
    await prisma.notification.updateMany({
      where: {
        userId,
        kind: { in: DEADLINE_KINDS },
      },
      data: { isActive: false },
    });
  }
}

export async function getNotificationsForUser(userId: string): Promise<NotificationFeedResponse> {
  await syncDeadlineNotificationsForUser(userId);

  const prisma = getPrisma();
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      isActive: true,
      isRead: false,
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    notifications: notifications.map(toNotificationItem),
    unreadCount: notifications.length,
  };
}

export async function getAllNotificationsForUser(userId: string): Promise<NotificationFeedResponse> {
  await syncDeadlineNotificationsForUser(userId);

  const prisma = getPrisma();
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return {
    notifications: notifications.map(toNotificationItem),
    unreadCount,
  };
}

export async function createProjectCreatedNotification(userId: string, project: ProjectLite) {
  const prisma = getPrisma();
  const uniqueKey = getEventNotificationUniqueKey(userId, 'new-project', project.id, project.createdAt.toISOString());

  await prisma.notification.upsert({
    where: { uniqueKey },
    update: {
      projectName: project.name,
      title: `New project: ${project.name}`,
      description: `${project.creatorName || 'A new project'} was added to the workspace.`,
      href: `/projects/${project.id}`,
      isActive: true,
    },
    create: {
      uniqueKey,
      userId,
      projectId: project.id,
      projectName: project.name,
      kind: 'new-project',
      tone: 'info',
      title: `New project: ${project.name}`,
      description: `${project.creatorName || 'A new project'} was added to the workspace.`,
      href: `/projects/${project.id}`,
      isActive: true,
    },
  });
}

export async function createProjectCreatedNotificationForAllUsers(project: ProjectLite) {
  const prisma = getPrisma();
  const users = await prisma.user.findMany({ select: { id: true } });

  await Promise.all(users.map((user) => createProjectCreatedNotification(user.id, project)));
}

export async function createProjectStatusChangeNotification(
  userId: string,
  project: ProjectLite,
  previousStatus: string,
) {
  if (!previousStatus || previousStatus === project.status) {
    return;
  }

  const prisma = getPrisma();
  const uniqueKey = getEventNotificationUniqueKey(userId, 'status-change', project.id, project.updatedAt.toISOString());

  await prisma.notification.upsert({
    where: { uniqueKey },
    update: {
      projectName: project.name,
      title: `${project.name} status changed`,
      description: `Status updated from ${previousStatus} to ${project.status}.`,
      href: `/projects/${project.id}`,
      isActive: true,
    },
    create: {
      uniqueKey,
      userId,
      projectId: project.id,
      projectName: project.name,
      kind: 'status-change',
      tone: 'info',
      title: `${project.name} status changed`,
      description: `Status updated from ${previousStatus} to ${project.status}.`,
      href: `/projects/${project.id}`,
      isActive: true,
    },
  });
}

export async function createProjectStatusChangeNotificationForAllUsers(
  project: ProjectLite,
  previousStatus: string,
) {
  const prisma = getPrisma();
  const users = await prisma.user.findMany({ select: { id: true } });

  await Promise.all(users.map((user) => createProjectStatusChangeNotification(user.id, project, previousStatus)));
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  const prisma = getPrisma();

  try {
    const result = await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return result.count > 0;
  } catch {
    return false;
  }
}