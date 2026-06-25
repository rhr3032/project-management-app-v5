'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus, Calendar, User, TrendingUp } from 'lucide-react';
import { Project, ProjectStatus } from '@/types';
import { TypeBadge, ProjectTypeBadge, PriorityBadge } from '@/components/badges';

const ALL_STATUSES: ProjectStatus[] = [
  'Research','Planning','In Progress','Review','On Hold','Completed',
  'Cancelled','Archived','Pending Approval','Approved','Rejected',
  'Needs Revision','In Testing','Ready for Deployment','Deployed',
  'Maintenance','Closed',
];

const STATUS_CONFIG: Record<ProjectStatus, { gradient: string; glow: string; icon: string; accent: string }> = {
  'Research':            { gradient: 'from-sky-600 to-sky-800',     glow: 'rgba(14,165,233,0.2)',    icon: '🔬', accent: 'border-sky-500/30 bg-sky-500/10' },
  'Planning':            { gradient: 'from-blue-600 to-blue-800',   glow: 'rgba(59,130,246,0.2)',    icon: '📋', accent: 'border-blue-500/30 bg-blue-500/10' },
  'In Progress':         { gradient: 'from-orange-500 to-orange-700', glow: 'rgba(249,115,22,0.2)', icon: '⚡', accent: 'border-orange-500/30 bg-orange-500/10' },
  'Review':              { gradient: 'from-purple-600 to-purple-800', glow: 'rgba(147,51,234,0.2)', icon: '👁️', accent: 'border-purple-500/30 bg-purple-500/10' },
  'On Hold':             { gradient: 'from-yellow-500 to-yellow-700', glow: 'rgba(234,179,8,0.2)',  icon: '⏸️', accent: 'border-yellow-500/30 bg-yellow-500/10' },
  'Completed':           { gradient: 'from-green-600 to-green-800',  glow: 'rgba(34,197,94,0.2)',   icon: '✅', accent: 'border-green-500/30 bg-green-500/10' },
  'Cancelled':           { gradient: 'from-red-600 to-red-800',      glow: 'rgba(239,68,68,0.2)',   icon: '❌', accent: 'border-red-500/30 bg-red-500/10' },
  'Archived':            { gradient: 'from-slate-600 to-slate-800',  glow: 'rgba(100,116,139,0.2)', icon: '🗃️', accent: 'border-slate-500/30 bg-slate-500/10' },
  'Pending Approval':    { gradient: 'from-amber-500 to-amber-700',  glow: 'rgba(245,158,11,0.2)',  icon: '⌛', accent: 'border-amber-500/30 bg-amber-500/10' },
  'Approved':            { gradient: 'from-emerald-500 to-emerald-700', glow: 'rgba(16,185,129,0.2)', icon: '🎯', accent: 'border-emerald-500/30 bg-emerald-500/10' },
  'Rejected':            { gradient: 'from-rose-600 to-rose-800',    glow: 'rgba(244,63,94,0.2)',   icon: '🚫', accent: 'border-rose-500/30 bg-rose-500/10' },
  'Needs Revision':      { gradient: 'from-pink-500 to-pink-700',    glow: 'rgba(236,72,153,0.2)',  icon: '✏️', accent: 'border-pink-500/30 bg-pink-500/10' },
  'In Testing':          { gradient: 'from-violet-600 to-violet-800', glow: 'rgba(139,92,246,0.2)', icon: '🧪', accent: 'border-violet-500/30 bg-violet-500/10' },
  'Ready for Deployment':{ gradient: 'from-teal-600 to-teal-800',   glow: 'rgba(20,184,166,0.2)',   icon: '🚀', accent: 'border-teal-500/30 bg-teal-500/10' },
  'Deployed':            { gradient: 'from-cyan-600 to-cyan-800',   glow: 'rgba(6,182,212,0.2)',    icon: '🌐', accent: 'border-cyan-500/30 bg-cyan-500/10' },
  'Maintenance':         { gradient: 'from-indigo-600 to-indigo-800', glow: 'rgba(99,102,241,0.2)', icon: '🔧', accent: 'border-indigo-500/30 bg-indigo-500/10' },
  'Closed':              { gradient: 'from-gray-600 to-gray-800',    glow: 'rgba(107,114,128,0.2)', icon: '🔒', accent: 'border-gray-500/30 bg-gray-500/10' },
};

export default function BoardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ProjectStatus | null>(null);
  const [projectsByStatus, setProjectsByStatus] = useState<Record<ProjectStatus, Project[]>>(
    () => Object.fromEntries(ALL_STATUSES.map(s => [s, []])) as Record<ProjectStatus, Project[]>
  );
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data: Project[] = await res.json();
        setProjects(data);

        const grouped = Object.fromEntries(ALL_STATUSES.map(s => [s, []])) as Record<ProjectStatus, Project[]>;
        data.forEach(p => {
          if (grouped[p.status] !== undefined) grouped[p.status].push(p);
        });
        setProjectsByStatus(grouped);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleDragStart = (project: Project) => setDraggedProject(project);

  const handleDragOver = (e: React.DragEvent, status: ProjectStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(status);
  };

  const handleDragLeave = () => setDragOverStatus(null);

  const handleDrop = async (newStatus: ProjectStatus, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStatus(null);
    if (!draggedProject || draggedProject.status === newStatus) {
      setDraggedProject(null);
      return;
    }

    const previousStatus = draggedProject.status;
    const updatedProject = { ...draggedProject, status: newStatus };

    setProjectsByStatus(prev => ({
      ...prev,
      [previousStatus]: prev[previousStatus].filter(p => p.id !== draggedProject.id),
      [newStatus]: [...prev[newStatus], updatedProject],
    }));
    setDraggedProject(null);

    try {
      const res = await fetch(`/api/projects/${draggedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
    } catch {
      // Revert
      setProjectsByStatus(prev => ({
        ...prev,
        [newStatus]: prev[newStatus].filter(p => p.id !== draggedProject.id),
        [previousStatus]: [...prev[previousStatus], draggedProject],
      }));
    }
  };

  const getPlainText = (html: string) => html ? html.replace(/<[^>]*>/g, '').slice(0, 80) : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Loading board...</p>
        </div>
      </div>
    );
  }

  const totalProjects = projects.length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="glass-header sticky top-0 z-20 px-4 md:px-8 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Project Board</h1>
              <p className="text-xs text-muted-foreground">{totalProjects} projects · {ALL_STATUSES.length} columns</p>
            </div>
          </div>
          <Link href="/projects/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm">
              <Plus size={15} /> New Project
            </button>
          </Link>
        </div>
      </div>

      {/* Board */}
      <div ref={boardRef} className="kanban-scroll flex-1 px-4 md:px-6 pb-8 pt-4 overflow-y-hidden flex flex-col">
        <div className="flex gap-4 flex-1 h-full pb-2" style={{ minWidth: `${ALL_STATUSES.length * 296}px` }}>
          {ALL_STATUSES.map((status, colIdx) => {
            const config = STATUS_CONFIG[status];
            const statusProjects = projectsByStatus[status];
            const isDragTarget = dragOverStatus === status;

            return (
              <div
                key={status}
                className="flex-shrink-0 w-72 flex flex-col h-full animate-slideInLeft"
                style={{ animationDelay: `${colIdx * 40}ms` }}
              >
                {/* Column Header */}
                <div className={`mb-3 p-3 rounded-xl border ${config.accent} transition-all flex-shrink-0`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{config.icon}</span>
                      <span className="text-xs font-bold text-foreground">{status}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${config.gradient} text-white`}>
                      {statusProjects.length}
                    </span>
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  className={`flex-1 overflow-y-auto rounded-xl border-2 transition-all p-2.5 space-y-3 ${
                    isDragTarget
                      ? `border-dashed ${config.accent} shadow-lg`
                      : 'border-transparent bg-white/[0.02]'
                  }`}
                  onDragOver={e => handleDragOver(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(status, e)}
                  style={isDragTarget ? { boxShadow: `0 0 20px ${config.glow}` } : undefined}
                >
                  {statusProjects.length === 0 ? (
                    <div className="h-24 flex items-center justify-center text-center text-muted-foreground/40 text-xs border-2 border-dashed border-white/[0.06] rounded-xl">
                      <div>
                        <p className="text-lg mb-1">+</p>
                        <p>Drop here</p>
                      </div>
                    </div>
                  ) : (
                    statusProjects.map(project => (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={() => handleDragStart(project)}
                        className={`glass-card overflow-hidden p-4 cursor-grab active:cursor-grabbing transition-all group select-none ${
                          draggedProject?.id === project.id ? 'opacity-40 scale-95' : 'hover:scale-[1.01]'
                        }`}
                        style={{ animationDelay: '0ms' }}
                      >
                        {/* Top accent bar */}
                        <div className={`h-0.5 -mx-4 -mt-4 mb-3 bg-gradient-to-r ${config.gradient}`} />

                        <Link href={`/projects/${project.id}`} onClick={e => e.stopPropagation()}>
                          <h3 className="font-semibold text-sm text-foreground mb-1.5 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                            {project.name}
                          </h3>
                          {project.description && (
                            <p className="text-xs text-muted-foreground mb-2.5 line-clamp-2 leading-relaxed">
                              {getPlainText(project.description)}
                            </p>
                          )}
                        </Link>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <ProjectTypeBadge projectType={project.projectType} />
                          <TypeBadge type={project.type} />
                          <PriorityBadge priority={project.priority} />
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2.5 border-t border-white/[0.06]">
                          <span className="flex items-center gap-1 truncate">
                            <User size={11} />{project.owner}
                          </span>
                          {project.deadline && (
                            <span className="flex items-center gap-1 flex-shrink-0">
                              <Calendar size={11} />
                              {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
