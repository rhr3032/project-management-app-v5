'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, LayoutDashboard, FolderOpen, Layout, LogOut, MoonStar, Settings, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import type { NotificationFeedResponse, NotificationItem } from '@/lib/notification-types';
import { PROJECT_NOTIFICATION_CREATED_EVENT, PROJECT_NOTIFICATIONS_REFRESH_KEY } from '@/lib/notification-client';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard', href: '/' },
  { icon: <FolderOpen size={16} />, label: 'Projects', href: '/projects' },
  { icon: <Layout size={16} />, label: 'Board', href: '/board' },
];

const toneClasses: Record<NotificationItem['tone'], string> = {
  danger: 'bg-red-400 shadow-red-400/30',
  warning: 'bg-amber-400 shadow-amber-400/30',
  info: 'bg-cyan-400 shadow-cyan-400/30',
};

export function TopNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      const clickedUserMenu = userMenuRef.current?.contains(target);
      const clickedNotificationMenu = notificationMenuRef.current?.contains(target);

      if (!clickedUserMenu) {
        setUserMenuOpen(false);
      }

      if (!clickedNotificationMenu) {
        setNotificationMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
        setNotificationMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let active = true;
    let lastSeenRefreshToken = window.localStorage.getItem(PROJECT_NOTIFICATIONS_REFRESH_KEY);

    const handleProjectNotificationsUpdated = () => {
      void loadNotifications();
    };

    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) return;

        const payload: NotificationFeedResponse = await response.json();

        if (!active) return;

        setNotifications(payload.notifications);
        setUnreadCount(payload.unreadCount);
      } catch {
        if (active) {
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    };

    loadNotifications();
    const storedRefreshToken = window.localStorage.getItem(PROJECT_NOTIFICATIONS_REFRESH_KEY);
    if (storedRefreshToken && storedRefreshToken !== lastSeenRefreshToken) {
      lastSeenRefreshToken = storedRefreshToken;
      void loadNotifications();
    }

    window.addEventListener('project-notifications-updated', handleProjectNotificationsUpdated);
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
    const handleStorage = (event: StorageEvent) => {
      if (event.key === PROJECT_NOTIFICATIONS_REFRESH_KEY && event.newValue && event.newValue !== lastSeenRefreshToken) {
        lastSeenRefreshToken = event.newValue;
        void loadNotifications();
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = window.setInterval(loadNotifications, 30000);

    return () => {
      active = false;
      window.removeEventListener('project-notifications-updated', handleProjectNotificationsUpdated);
      window.removeEventListener(PROJECT_NOTIFICATION_CREATED_EVENT, handleProjectNotificationCreated as EventListener);
      window.removeEventListener('storage', handleStorage);
      window.clearInterval(interval);
    };
  }, [pathname]);

  const handleNotificationClick = async (notificationId: string) => {
    setNotificationMenuOpen(false);
    setNotifications((current) => current.filter((notification) => notification.id !== notificationId));
    setUnreadCount((count) => Math.max(0, count - 1));

    try {
      await fetch(`/api/notifications/${notificationId}`, { method: 'PATCH' });
    } catch {
      // ignore; the next refresh will reconcile the list
    }
  };

  return (
    <header className="sticky top-0 z-50 px-4 md:px-6 pt-4">
      <div className="glass-sidebar mx-auto flex h-16 max-w-7xl items-center gap-3 rounded-2xl px-4 md:px-5 shadow-lg shadow-black/20">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/30">
            D
          </div>
          <span className="hidden sm:block text-sm font-medium text-foreground">Your Brand</span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = item.href !== '#' && pathname === item.href;
            const disabled = item.href === '#';

            const content = (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 shadow-sm border border-blue-500/20'
                    : disabled
                      ? 'text-muted-foreground/60'
                      : 'text-muted-foreground hover:bg-white/6 hover:text-foreground'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </span>
            );

            return item.href === '#' ? (
              <button key={item.label} type="button" className="cursor-default">
                {content}
              </button>
            ) : (
              <Link key={item.label} href={item.href}>{content}</Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground transition-all"
            aria-label="Theme toggle"
          >
            <MoonStar size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              setNotificationMenuOpen((open) => !open);
              setUserMenuOpen(false);
            }}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground transition-all relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-400 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationMenuOpen && (
            <div ref={notificationMenuRef} className="absolute right-4 top-20 z-50 w-88 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#101526] shadow-xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">{unreadCount} unread alerts</p>
                </div>
                <Link
                  href="/notifications"
                  onClick={() => setNotificationMenuOpen(false)}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View all
                </Link>
              </div>

              <div className="max-h-112 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No project notifications right now.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.href}
                      onClick={() => handleNotificationClick(notification.id)}
                      className="flex items-start gap-3 border-t border-white/5 px-4 py-3 transition-colors hover:bg-white/6"
                    >
                      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${toneClasses[notification.tone]} shadow-sm`} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">{notification.title}</span>
                        <span className="block text-xs leading-relaxed text-muted-foreground">{notification.description}</span>
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}

          {user && (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/4 px-2 py-1.5 pr-3 text-left hover:bg-white/[0.07] transition-all"
                title="Account menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-500 text-xs font-bold text-white">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:flex flex-col min-w-0 text-left leading-tight">
                  <span className="truncate text-sm font-semibold text-foreground">{user.name || 'Admin'}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#101526] shadow-xl shadow-black/30">
                  <Link href="/profile" onClick={() => setUserMenuOpen(false)}>
                    <div className="flex items-center gap-2 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-white/6">
                      <UserCircle2 size={16} className="text-muted-foreground" />
                      Profile
                    </div>
                  </Link>
                  <Link href="/settings" onClick={() => setUserMenuOpen(false)}>
                    <div className="flex items-center gap-2 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-white/6 border-t border-white/10">
                      <Settings size={16} className="text-muted-foreground" />
                      Settings
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-white/6"
                  >
                    <LogOut size={16} className="text-muted-foreground" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}