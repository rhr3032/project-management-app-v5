'use client';

import Link from 'next/link';
import { ArrowLeft, Bell, Palette, Settings2, ShieldCheck } from 'lucide-react';

const settingGroups = [
  {
    title: 'Appearance',
    description: 'Adjust the look and feel of the workspace.',
    icon: Palette,
    items: ['Theme preference', 'Density', 'Accent color'],
  },
  {
    title: 'Notifications',
    description: 'Control how and when you get updates.',
    icon: Bell,
    items: ['Email alerts', 'In-app notifications', 'Daily summary'],
  },
  {
    title: 'Security',
    description: 'Keep your account safe and private.',
    icon: ShieldCheck,
    items: ['Password', 'Session management', 'Trusted devices'],
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/">
          <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </Link>

        <section className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Settings2 size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Workspace</p>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage preferences, notifications, and account behavior.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {settingGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title} className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{group.title}</h2>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item} className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
