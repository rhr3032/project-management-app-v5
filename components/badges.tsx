'use client';

import { ProjectStatus, ProjectPriority, ProjectType } from '@/types';

function StatusBadge({ status }: { status: ProjectStatus }) {
  const colors: Partial<Record<ProjectStatus, { bg: string; text: string }>> = {
    'Research':             { bg: 'bg-sky-500/15 border border-sky-500/25',      text: 'text-sky-400' },
    'Planning':             { bg: 'bg-blue-500/15 border border-blue-500/25',    text: 'text-blue-400' },
    'In Progress':          { bg: 'bg-orange-500/15 border border-orange-500/25', text: 'text-orange-400' },
    'Review':               { bg: 'bg-purple-500/15 border border-purple-500/25', text: 'text-purple-400' },
    'On Hold':              { bg: 'bg-yellow-500/15 border border-yellow-500/25', text: 'text-yellow-400' },
    'Completed':            { bg: 'bg-green-500/15 border border-green-500/25',  text: 'text-green-400' },
    'Cancelled':            { bg: 'bg-red-500/15 border border-red-500/25',      text: 'text-red-400' },
    'Archived':             { bg: 'bg-slate-500/15 border border-slate-500/25',  text: 'text-slate-400' },
    'Pending Approval':     { bg: 'bg-amber-500/15 border border-amber-500/25',  text: 'text-amber-400' },
    'Approved':             { bg: 'bg-emerald-500/15 border border-emerald-500/25', text: 'text-emerald-400' },
    'Rejected':             { bg: 'bg-rose-500/15 border border-rose-500/25',    text: 'text-rose-400' },
    'Needs Revision':       { bg: 'bg-pink-500/15 border border-pink-500/25',    text: 'text-pink-400' },
    'In Testing':           { bg: 'bg-violet-500/15 border border-violet-500/25', text: 'text-violet-400' },
    'Ready for Deployment': { bg: 'bg-teal-500/15 border border-teal-500/25',   text: 'text-teal-400' },
    'Deployed':             { bg: 'bg-cyan-500/15 border border-cyan-500/25',    text: 'text-cyan-400' },
    'Maintenance':          { bg: 'bg-indigo-500/15 border border-indigo-500/25', text: 'text-indigo-400' },
    'Closed':               { bg: 'bg-gray-500/15 border border-gray-500/25',    text: 'text-gray-400' },
  };
  const { bg, text } = colors[status] || { bg: 'bg-white/10 border border-white/15', text: 'text-foreground' };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${bg} ${text}`}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  const colors: Partial<Record<ProjectPriority, { bg: string; text: string }>> = {
    'Low':           { bg: 'bg-blue-500/12 border border-blue-500/20',   text: 'text-blue-400' },
    'Medium':        { bg: 'bg-yellow-500/12 border border-yellow-500/20', text: 'text-yellow-400' },
    'High':          { bg: 'bg-orange-500/12 border border-orange-500/20', text: 'text-orange-400' },
    'Critical':      { bg: 'bg-red-500/12 border border-red-500/20',      text: 'text-red-400' },
    'Urgent':        { bg: 'bg-red-600/15 border border-red-600/25',      text: 'text-red-300' },
    'Immediate':     { bg: 'bg-rose-500/12 border border-rose-500/20',    text: 'text-rose-400' },
    'Important':     { bg: 'bg-amber-500/12 border border-amber-500/20',  text: 'text-amber-400' },
    'Optional':      { bg: 'bg-slate-500/12 border border-slate-500/20',  text: 'text-slate-400' },
    'Backlog':       { bg: 'bg-gray-500/12 border border-gray-500/20',    text: 'text-gray-400' },
    'Strategic':     { bg: 'bg-purple-500/12 border border-purple-500/20', text: 'text-purple-400' },
    'Key Initiative':{ bg: 'bg-indigo-500/12 border border-indigo-500/20', text: 'text-indigo-400' },
    'Quick Win':     { bg: 'bg-green-500/12 border border-green-500/20',  text: 'text-green-400' },
    'Major':         { bg: 'bg-violet-500/12 border border-violet-500/20', text: 'text-violet-400' },
    'Minor':         { bg: 'bg-cyan-500/12 border border-cyan-500/20',   text: 'text-cyan-400' },
  };
  const { bg, text } = colors[priority] || { bg: 'bg-white/8 border border-white/12', text: 'text-muted-foreground' };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${bg} ${text}`}>{priority}</span>;
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    // UI/UX Design related
    'UI/UX Design':           { bg: 'bg-pink-500/12 border border-pink-500/20',      text: 'text-pink-400' },
    'Logo':                   { bg: 'bg-amber-500/12 border border-amber-500/20',    text: 'text-amber-400' },
    'Branding':               { bg: 'bg-rose-500/12 border border-rose-500/20',      text: 'text-rose-400' },
    'Illustration':           { bg: 'bg-violet-500/12 border border-violet-500/20',  text: 'text-violet-400' },
    'Print Design':           { bg: 'bg-fuchsia-500/12 border border-fuchsia-500/20', text: 'text-fuchsia-400' },
    'Packaging Design':       { bg: 'bg-orange-500/12 border border-orange-500/20',  text: 'text-orange-400' },
    '3D Modeling':            { bg: 'bg-cyan-500/12 border border-cyan-500/20',      text: 'text-cyan-400' },
    'Animation':              { bg: 'bg-pink-500/12 border border-pink-500/20',      text: 'text-pink-400' },
    'Design System':          { bg: 'bg-sky-500/12 border border-sky-500/20',        text: 'text-sky-400' },
    'User Research':          { bg: 'bg-emerald-500/12 border border-emerald-500/20', text: 'text-emerald-400' },
    'Prototyping':            { bg: 'bg-blue-500/12 border border-blue-500/20',      text: 'text-blue-400' },
    'Wireframe':              { bg: 'bg-slate-500/12 border border-slate-500/20',    text: 'text-slate-400' },
    'Web App UI Design':      { bg: 'bg-cyan-500/12 border border-cyan-500/20',      text: 'text-cyan-400' },
    'Admin Portal Design':    { bg: 'bg-indigo-500/12 border border-indigo-500/20',  text: 'text-indigo-400' },
    'Admin Panel Design':     { bg: 'bg-violet-500/12 border border-violet-500/20',  text: 'text-violet-400' },
    'Dashboard UI Design':    { bg: 'bg-blue-500/12 border border-blue-500/20',      text: 'text-blue-400' },
    'Analytics Dashboard Design': { bg: 'bg-teal-500/12 border border-teal-500/20',  text: 'text-teal-400' },
    'SaaS App UI Design':     { bg: 'bg-sky-500/12 border border-sky-500/20',        text: 'text-sky-400' },
    'CRM Dashboard Design':   { bg: 'bg-purple-500/12 border border-purple-500/20',  text: 'text-purple-400' },
    'Client Portal Design':   { bg: 'bg-emerald-500/12 border border-emerald-500/20', text: 'text-emerald-400' },
    'Customer Portal UI Design': { bg: 'bg-cyan-500/12 border border-cyan-500/20',   text: 'text-cyan-400' },
    'Web Portal UI Design':   { bg: 'bg-indigo-500/12 border border-indigo-500/20',  text: 'text-indigo-400' },
    'E-commerce App Design':  { bg: 'bg-orange-500/12 border border-orange-500/20',  text: 'text-orange-400' },
    'Marketplace App Design': { bg: 'bg-pink-500/12 border border-pink-500/20',      text: 'text-pink-400' },
    'Responsive Web Design':  { bg: 'bg-green-500/12 border border-green-500/20',    text: 'text-green-400' },
    'Mobile-First Web Design': { bg: 'bg-fuchsia-500/12 border border-fuchsia-500/20', text: 'text-fuchsia-400' },
    'Product Redesign':       { bg: 'bg-rose-500/12 border border-rose-500/20',      text: 'text-rose-400' },
    'UX Strategy':            { bg: 'bg-amber-500/12 border border-amber-500/20',    text: 'text-amber-400' },

    // Web Development related
    'Website':                { bg: 'bg-sky-500/12 border border-sky-500/20',        text: 'text-sky-400' },
    'Web App':                { bg: 'bg-cyan-500/12 border border-cyan-500/20',      text: 'text-cyan-400' },
    'E-commerce Platform':    { bg: 'bg-orange-500/12 border border-orange-500/20',  text: 'text-orange-400' },
    'SaaS Product':           { bg: 'bg-teal-500/12 border border-teal-500/20',      text: 'text-teal-400' },
    'Enterprise Software':    { bg: 'bg-indigo-500/12 border border-indigo-500/20',  text: 'text-indigo-400' },
    'SEO':                    { bg: 'bg-green-500/12 border border-green-500/20',    text: 'text-green-400' },
    'Dashboard':              { bg: 'bg-blue-500/12 border border-blue-500/20',      text: 'text-blue-400' },
    'ERP Software':           { bg: 'bg-indigo-500/12 border border-indigo-500/20',  text: 'text-indigo-400' },
    'LMS Platform':           { bg: 'bg-violet-500/12 border border-violet-500/20',  text: 'text-violet-400' },
    'CMS System':             { bg: 'bg-teal-500/12 border border-teal-500/20',      text: 'text-teal-400' },
    'Landing Page':           { bg: 'bg-sky-500/12 border border-sky-500/20',        text: 'text-sky-400' },
    'API Integration':        { bg: 'bg-yellow-500/12 border border-yellow-500/20',  text: 'text-yellow-400' },

    // Mobile App Development related
    'Mobile App':             { bg: 'bg-purple-500/12 border border-purple-500/20',  text: 'text-purple-400' },
    'AR/VR Experience':       { bg: 'bg-pink-500/12 border border-pink-500/20',      text: 'text-pink-400' },
    'IoT Project':            { bg: 'bg-indigo-500/12 border border-indigo-500/20',  text: 'text-indigo-400' },
    'AI/ML Project':          { bg: 'bg-violet-500/12 border border-violet-500/20',  text: 'text-violet-400' },
    'Game Development':       { bg: 'bg-rose-500/12 border border-rose-500/20',      text: 'text-rose-400' },
    'iOS Application':        { bg: 'bg-purple-500/12 border border-purple-500/20',  text: 'text-purple-400' },
    'Android Application':    { bg: 'bg-green-500/12 border border-green-500/20',    text: 'text-green-400' },
    'Cross-Platform Application': { bg: 'bg-cyan-500/12 border border-cyan-500/20',    text: 'text-cyan-400' },
    'Flutter App':            { bg: 'bg-sky-500/12 border border-sky-500/20',        text: 'text-sky-400' },
    'React Native App':       { bg: 'bg-blue-500/12 border border-blue-500/20',      text: 'text-blue-400' },

    // Website Categories (expanded)
    'Website Design':           { bg: 'bg-sky-500/12 border border-sky-500/20',        text: 'text-sky-400' },
    'Corporate Website Design': { bg: 'bg-sky-500/12 border border-sky-500/20',        text: 'text-sky-400' },
    'Business Website Design':  { bg: 'bg-blue-500/12 border border-blue-500/20',      text: 'text-blue-400' },
    'Portfolio Website Design': { bg: 'bg-indigo-500/12 border border-indigo-500/20',  text: 'text-indigo-400' },
    'Landing Page Design':      { bg: 'bg-violet-500/12 border border-violet-500/20',  text: 'text-violet-400' },
    'E-commerce Website Design':{ bg: 'bg-orange-500/12 border border-orange-500/20',  text: 'text-orange-400' },
    'Marketplace Design':       { bg: 'bg-pink-500/12 border border-pink-500/20',      text: 'text-pink-400' },
    'SaaS Website':             { bg: 'bg-teal-500/12 border border-teal-500/20',      text: 'text-teal-400' },
    'Blog Website':             { bg: 'bg-emerald-500/12 border border-emerald-500/20', text: 'text-emerald-400' },
    'News Portal Website':      { bg: 'bg-rose-500/12 border border-rose-500/20',      text: 'text-rose-400' },
    'Educational Website':      { bg: 'bg-amber-500/12 border border-amber-500/20',    text: 'text-amber-400' },
    'Directory Website':        { bg: 'bg-cyan-500/12 border border-cyan-500/20',      text: 'text-cyan-400' },
    'Membership Website':       { bg: 'bg-purple-500/12 border border-purple-500/20',  text: 'text-purple-400' },
    'Booking Platform':         { bg: 'bg-fuchsia-500/12 border border-fuchsia-500/20', text: 'text-fuchsia-400' },
    'Real Estate Website':      { bg: 'bg-indigo-500/12 border border-indigo-500/20',  text: 'text-indigo-400' },
    'Healthcare Website':       { bg: 'bg-green-500/12 border border-green-500/20',    text: 'text-green-400' },
    'Event Website':            { bg: 'bg-yellow-500/12 border border-yellow-500/20',  text: 'text-yellow-400' },

    // Software Categories (expanded)
    'CRM Platform':             { bg: 'bg-blue-500/12 border border-blue-500/20',      text: 'text-blue-400' },
    'HRM Software':             { bg: 'bg-pink-500/12 border border-pink-500/20',      text: 'text-pink-400' },
    'POS System':               { bg: 'bg-rose-500/12 border border-rose-500/20',      text: 'text-rose-400' },
    'Inventory Management System': { bg: 'bg-orange-500/12 border border-orange-500/20', text: 'text-orange-400' },
    'Project Management System': { bg: 'bg-amber-500/12 border border-amber-500/20',   text: 'text-amber-400' },
    'Enterprise Portal':        { bg: 'bg-indigo-500/12 border border-indigo-500/20',  text: 'text-indigo-400' },
    'Customer Portal':          { bg: 'bg-cyan-500/12 border border-cyan-500/20',      text: 'text-cyan-400' },

    // Mobile App Categories (expanded)
    'Mobile App UI Design':     { bg: 'bg-pink-500/12 border border-pink-500/20',      text: 'text-pink-400' },
    'Tablet Application':       { bg: 'bg-blue-500/12 border border-blue-500/20',      text: 'text-blue-400' },
    'SaaS Mobile Application':  { bg: 'bg-teal-500/12 border border-teal-500/20',      text: 'text-teal-400' },
    'E-commerce Mobile Application': { bg: 'bg-orange-500/12 border border-orange-500/20', text: 'text-orange-400' },
    'Business Mobile Application': { bg: 'bg-sky-500/12 border border-sky-500/20',     text: 'text-sky-400' },
  };
  const { bg, text } = colors[type] || { bg: 'bg-white/8 border border-white/12', text: 'text-muted-foreground' };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${bg} ${text}`}>{type}</span>;
}

function ProjectTypeBadge({ projectType }: { projectType: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    'UI/UX Design':           { bg: 'bg-pink-500/15 border border-pink-500/25',      text: 'text-pink-400' },
    'Web Development':        { bg: 'bg-indigo-500/15 border border-indigo-500/25',  text: 'text-indigo-400' },
    'Mobile App Development': { bg: 'bg-purple-500/15 border border-purple-500/25', text: 'text-purple-400' },
  };
  const { bg, text } = colors[projectType] || { bg: 'bg-white/10 border border-white/15', text: 'text-foreground' };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${bg} ${text}`}>{projectType}</span>;
}

function EffortBadge({ effort }: { effort: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    'XS':      { bg: 'bg-green-500/12 border border-green-500/20',    text: 'text-green-400' },
    'S':       { bg: 'bg-blue-500/12 border border-blue-500/20',      text: 'text-blue-400' },
    'M':       { bg: 'bg-yellow-500/12 border border-yellow-500/20',  text: 'text-yellow-400' },
    'L':       { bg: 'bg-orange-500/12 border border-orange-500/20',  text: 'text-orange-400' },
    'XL':      { bg: 'bg-red-500/12 border border-red-500/20',        text: 'text-red-400' },
    'XXL':     { bg: 'bg-rose-500/12 border border-rose-500/20',      text: 'text-rose-400' },
    'XXXL':    { bg: 'bg-purple-500/12 border border-purple-500/20',  text: 'text-purple-400' },
    'Minimal': { bg: 'bg-emerald-500/12 border border-emerald-500/20', text: 'text-emerald-400' },
  };
  const { bg, text } = colors[effort] || { bg: 'bg-white/8 border border-white/12', text: 'text-muted-foreground' };
  return <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${bg} ${text}`}>{effort}</span>;
}

function DeviceBadge({ device }: { device: string }) {
  const icons: Record<string, string> = {
    'Desktop': '🖥️', 'Mobile': '📱', 'Tablet': '📲', 'TV': '📺',
    'POS': '🖨️', 'Car': '🚗', 'Watch': '⌚', 'All': '🌐', 'None': '—',
    'Wearable': '⌚', 'IoT Device': '🔌', 'AR/VR Headset': '🥽',
    'Game Console': '🎮', 'Drone': '🚁', 'Robot': '🤖', 'Kiosk': '🖥️',
  };
  const icon = icons[device] || '💻';
  return (
    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-white/[0.07] border border-white/[0.1] text-muted-foreground flex items-center gap-1 w-fit">
      <span>{icon}</span><span>{device}</span>
    </span>
  );
}

export { StatusBadge, PriorityBadge, TypeBadge, ProjectTypeBadge, EffortBadge, DeviceBadge };
