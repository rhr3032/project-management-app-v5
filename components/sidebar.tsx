'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, Layout, Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/' },
  { icon: <FolderOpen size={20} />, label: 'Projects', href: '/projects' },
  { icon: <Layout size={20} />, label: 'Board', href: '/board' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="hidden md:flex w-56 lg:w-64 glass-sidebar h-screen flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 flex-shrink-0">
            P
          </div>
          <div>
            <h1 className="font-bold text-foreground">Projectory</h1>
            <p className="text-xs text-muted-foreground">Design &amp; Dev.</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 font-semibold shadow-sm border border-indigo-500/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.06]'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-400' : ''}>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06] space-y-3">
        <Link href="/projects/new" className="w-full block">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
            <Plus size={16} />
            New Project
          </button>
        </Link>

        {user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
