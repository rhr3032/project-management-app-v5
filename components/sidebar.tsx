'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderOpen, Layout, Plus, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/' },
  { icon: <FolderOpen size={20} />, label: 'Projects', href: '/projects', badge: 3 },
  { icon: <Layout size={20} />, label: 'Board', href: '/board', badge: 1 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-56 lg:w-64 bg-sidebar border-r border-sidebar-border h-screen flex-col fixed left-0 top-0 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
            P
          </div>
          <div>
            <h1 className="font-bold text-foreground">Project Hub</h1>
            <p className="text-xs text-muted-foreground">Design & Dev</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-smooth ${
                    isActive
                      ? 'bg-primary/15 text-primary font-semibold shadow-sm'
                      : 'text-sidebar-foreground hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-xs bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-semibold">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <Link href="/projects/new" className="w-full">
          <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground shadow-md transition-smooth">
            <Plus size={16} className="mr-2" />
            New Project
          </Button>
        </Link>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-sidebar-foreground hover:bg-primary/10 rounded-lg transition-smooth">
          <Moon size={16} />
          Dark Mode
        </button>
      </div>
    </div>
  );
}
