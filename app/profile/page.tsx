'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Shield, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link href="/">
          <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </Link>

        <section className="glass-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile</p>
                <h1 className="text-3xl font-bold text-foreground">{user?.name || 'Admin'}</h1>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
              Signed in as <span className="text-foreground font-semibold">{user?.email}</span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="glass-card p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <UserCircle2 size={18} className="text-blue-400" /> Account Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium text-foreground">{user?.name || 'Admin'}</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground break-all">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Shield size={18} className="text-cyan-400" /> Security
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manage account access and keep your workspace secure from this area.
            </p>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
              Password changes and authentication options can be managed from the settings screen.
            </div>
          </div>
        </section>

        <section className="glass-card p-6 space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Mail size={18} className="text-purple-400" /> Contact
          </h2>
          <p className="text-sm text-muted-foreground">
            Need to update your account information? Use the settings screen to manage workspace preferences and account options.
          </p>
        </section>
      </div>
    </div>
  );
}
