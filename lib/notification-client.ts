'use client';

import type { NotificationItem } from '@/lib/notification-types';

export const PROJECT_NOTIFICATIONS_REFRESH_KEY = 'project-hub-notifications-refresh';
export const PROJECT_NOTIFICATION_CREATED_EVENT = 'project-notification-created';
const PROJECT_NOTIFICATION_CACHE_KEY = 'project-hub-notification-cache';

function readNotificationCache(): NotificationItem[] {
  try {
    const raw = window.localStorage.getItem(PROJECT_NOTIFICATION_CACHE_KEY);
    return raw ? (JSON.parse(raw) as NotificationItem[]) : [];
  } catch {
    return [];
  }
}

function writeNotificationCache(notifications: NotificationItem[]) {
  window.localStorage.setItem(PROJECT_NOTIFICATION_CACHE_KEY, JSON.stringify(notifications.slice(0, 20)));
}

export function notifyProjectNotificationsUpdated() {
  const timestamp = String(Date.now());
  window.localStorage.setItem(PROJECT_NOTIFICATIONS_REFRESH_KEY, timestamp);
  window.dispatchEvent(new Event('project-notifications-updated'));
}

export function emitProjectNotification(notification: NotificationItem) {
  const cachedNotifications = readNotificationCache();
  const nextNotifications = [notification, ...cachedNotifications.filter((item) => item.id !== notification.id)];

  writeNotificationCache(nextNotifications);
  window.dispatchEvent(new CustomEvent<NotificationItem>(PROJECT_NOTIFICATION_CREATED_EVENT, { detail: notification }));
}

export function getCachedProjectNotifications() {
  return readNotificationCache();
}