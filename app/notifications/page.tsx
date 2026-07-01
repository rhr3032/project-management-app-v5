'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, CheckCheck, Clock3, Filter, RefreshCw } from 'lucide-react';
import type { NotificationFeedResponse, NotificationItem } from '@/lib/notification-types';
import { getCachedProjectNotifications, PROJECT_NOTIFICATION_CREATED_EVENT } from '@/lib/notification-client';

type FilterMode = 'all' | 'unread' | 'read';

const toneStyles: Record<NotificationItem['tone'], { ring: string; badge: string; label: string }> = {
  danger: { ring: 'border-red-500/30', badge: 'bg-red-400', label: 'Overdue' },
  warning: { ring: 'border-amber-500/30', badge: 'bg-amber-400', label: 'Warning' },
  info: { ring: 'border-cyan-500/30', badge: 'bg-cyan-400', label: 'Info' },
};

const filterButtons: Array<{ value: FilterMode; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
];

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getCachedProjectNotifications());
  const [unreadCount, setUnreadCount] = useState(() => getCachedProjectNotifications().filter((item) => !item.isRead).length);
  const [filter, setFilter] = useState<FilterMode>('all');

  const fetchNotifications = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const response = await fetch('/api/notifications?all=true');
      if (!response.ok) {
        const cachedNotifications = getCachedProjectNotifications();
        if (cachedNotifications.length > 0) {
          setNotifications(cachedNotifications);
          setUnreadCount(cachedNotifications.filter((item) => !item.isRead).length);
        }
        return;
      }

      const payload: NotificationFeedResponse = await response.json();
      const cachedNotifications = getCachedProjectNotifications();
      const nextNotifications = payload.notifications.length > 0 ? payload.notifications : cachedNotifications;

      setNotifications(nextNotifications);
      setUnreadCount(nextNotifications.filter((item) => !item.isRead).length);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const cachedNotifications = getCachedProjectNotifications();
    if (cachedNotifications.length > 0) {
      setNotifications(cachedNotifications);
      setUnreadCount(cachedNotifications.filter((item) => !item.isRead).length);
      setLoading(false);
    }

    fetchNotifications();

    const handleProjectNotificationCreated = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationItem>;
      const notification = customEvent.detail;

      setNotifications((current) => {
        if (current.some((item) => item.id === notification.id)) {
          return current;
        }

        return [notification, ...current];
      });

      setUnreadCount((count) => count + (notification.isRead ? 0 : 1));
    };

    window.addEventListener(PROJECT_NOTIFICATION_CREATED_EVENT, handleProjectNotificationCreated as EventListener);

    return () => {
      window.removeEventListener(PROJECT_NOTIFICATION_CREATED_EVENT, handleProjectNotificationCreated as EventListener);
    };
  }, []);

  const visibleNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter((item) => !item.isRead);
    return notifications.filter((item) => item.isRead);
  }, [filter, notifications]);

  const markRead = async (notificationId: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
    setUnreadCount((count) => Math.max(0, count - 1));

    try {
      await fetch(`/api/notifications/${notificationId}`, { method: 'PATCH' });
    } catch {
      // Re-sync on the next refresh.
    }
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter((item) => !item.isRead).map((item) => item.id);
    if (unreadIds.length === 0) return;

    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    try {
      await Promise.all(unreadIds.map((id) => fetch(`/api/notifications/${id}`, { method: 'PATCH' })));
    } catch {
      // Re-sync on the next refresh.
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/">
          <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </Link>

        <section className="glass-card p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
              <Bell size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Workspace</p>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="mt-1 text-muted-foreground">Track deadline reminders, status updates, and new project alerts.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
              {unreadCount} unread
            </div>
            <button
              type="button"
              onClick={() => fetchNotifications(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
            >
              <CheckCheck size={15} />
              Mark all read
            </button>
          </div>
        </section>

        <section className="glass-card p-4 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              {filterButtons.map((button) => (
                <button
                  key={button.value}
                  type="button"
                  onClick={() => setFilter(button.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === button.value
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
              <Filter size={14} />
              {visibleNotifications.length} shown
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              Loading notifications...
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
                <Clock3 size={22} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">No notifications here</h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                When a project deadline approaches, a status changes, or a new project is created, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleNotifications.map((notification) => {
                const tone = toneStyles[notification.tone];

                return (
                  <div
                    key={notification.id}
                    className={`rounded-2xl border bg-white/4 p-4 transition-all ${tone.ring} ${notification.isRead ? 'opacity-80' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${tone.badge}`} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-sm font-semibold text-foreground">{notification.title}</h2>
                            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {tone.label}
                            </span>
                            {notification.isRead && (
                              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Read
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{notification.description}</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Project: <span className="text-foreground">{notification.projectName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={() => markRead(notification.id)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white/10"
                          >
                            Mark read
                          </button>
                        )}
                        <Link
                          href={notification.href}
                          className="rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-400"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}