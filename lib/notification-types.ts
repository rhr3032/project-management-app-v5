export type NotificationTone = 'danger' | 'warning' | 'info';

export type NotificationKind =
  | 'deadline-overdue'
  | 'deadline-today'
  | 'deadline-7'
  | 'deadline-5'
  | 'deadline-3'
  | 'status-change'
  | 'new-project';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  tone: NotificationTone;
  title: string;
  description: string;
  href: string;
  projectId: string;
  projectName: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationFeedResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}