'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, LayoutDashboard, FolderOpen, Layout, LogOut, MoonStar, Settings } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard', href: '/' },
  { icon: <FolderOpen size={16} />, label: 'Projects', href: '/projects' },
  { icon: <Layout size={16} />, label: 'Board', href: '/board' },
  { icon: <Settings size={16} />, label: 'Settings', href: '#' },
];

export function TopNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-white/6 hover:text-foreground transition-all relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-400 ring-2 ring-background" />
          </button>

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
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-white/6"
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