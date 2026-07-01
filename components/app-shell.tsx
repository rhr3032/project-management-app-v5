'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { TopNav } from '@/components/top-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isLoginPage = pathname === '/login';
  const showSidebar = !isLoginPage && user;

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1400px] px-4 md:px-6 pb-6 pt-6">
        {children}
      </main>
    </div>
  );
}
