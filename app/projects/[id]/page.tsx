'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, Mail, Phone, Target, Users, Tag, Link2, Pencil, Trash2 } from 'lucide-react';
import { Project } from '@/types';
import { StatusBadge, TypeBadge, ProjectTypeBadge, PriorityBadge, EffortBadge, DeviceBadge } from '@/components/badges';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { RichTextViewer } from '@/components/rich-text-viewer';

const STATUS_GRADIENTS: Record<string, string> = {
  'Research':             'from-sky-900 via-sky-800 to-slate-900',
  'Planning':             'from-blue-900 via-blue-800 to-slate-900',
  'In Progress':          'from-orange-900 via-orange-800 to-slate-900',
  'Review':               'from-purple-900 via-purple-800 to-slate-900',
  'On Hold':              'from-yellow-900 via-yellow-800 to-slate-900',
  'Completed':            'from-green-900 via-green-800 to-slate-900',
  'Cancelled':            'from-red-900 via-red-800 to-slate-900',
  'Archived':             'from-slate-800 via-slate-700 to-slate-900',
  'Pending Approval':     'from-amber-900 via-amber-800 to-slate-900',
  'Approved':             'from-emerald-900 via-emerald-800 to-slate-900',
  'Rejected':             'from-rose-900 via-rose-800 to-slate-900',
  'Needs Revision':       'from-pink-900 via-pink-800 to-slate-900',
  'In Testing':           'from-violet-900 via-violet-800 to-slate-900',
  'Ready for Deployment': 'from-teal-900 via-teal-800 to-slate-900',
  'Deployed':             'from-cyan-900 via-cyan-800 to-slate-900',
  'Maintenance':          'from-indigo-900 via-indigo-800 to-slate-900',
  'Closed':               'from-gray-800 via-gray-700 to-slate-900',
};

const STATUS_COLORS: Record<string, { dot: string; label: string; ring: string }> = {
  'Research':             { dot: 'bg-sky-400',      label: 'text-sky-300',      ring: 'ring-sky-500/30' },
  'Planning':             { dot: 'bg-blue-400',     label: 'text-blue-300',     ring: 'ring-blue-500/30' },
  'In Progress':          { dot: 'bg-orange-400',   label: 'text-orange-300',   ring: 'ring-orange-500/30' },
  'Review':               { dot: 'bg-purple-400',   label: 'text-purple-300',   ring: 'ring-purple-500/30' },
  'On Hold':              { dot: 'bg-yellow-400',   label: 'text-yellow-300',   ring: 'ring-yellow-500/30' },
  'Completed':            { dot: 'bg-green-400',    label: 'text-green-300',    ring: 'ring-green-500/30' },
  'Cancelled':            { dot: 'bg-red-400',      label: 'text-red-300',      ring: 'ring-red-500/30' },
  'Archived':             { dot: 'bg-slate-400',    label: 'text-slate-300',    ring: 'ring-slate-500/30' },
  'Pending Approval':     { dot: 'bg-amber-400',    label: 'text-amber-300',    ring: 'ring-amber-500/30' },
  'Approved':             { dot: 'bg-emerald-400',  label: 'text-emerald-300',  ring: 'ring-emerald-500/30' },
  'Rejected':             { dot: 'bg-rose-400',     label: 'text-rose-300',     ring: 'ring-rose-500/30' },
  'Needs Revision':       { dot: 'bg-pink-400',     label: 'text-pink-300',     ring: 'ring-pink-500/30' },
  'In Testing':           { dot: 'bg-violet-400',   label: 'text-violet-300',   ring: 'ring-violet-500/30' },
  'Ready for Deployment': { dot: 'bg-teal-400',     label: 'text-teal-300',     ring: 'ring-teal-500/30' },
  'Deployed':             { dot: 'bg-cyan-400',     label: 'text-cyan-300',     ring: 'ring-cyan-500/30' },
  'Maintenance':          { dot: 'bg-indigo-400',   label: 'text-indigo-300',   ring: 'ring-indigo-500/30' },
  'Closed':               { dot: 'bg-gray-400',     label: 'text-gray-300',     ring: 'ring-gray-500/30' },
};

function formatLogDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) { setProject(null); return; }
        setProject(await res.json());
      } catch { setProject(null); }
      finally { setLoading(false); }
    }
    if (projectId) fetchProject();
  }, [projectId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) router.push('/projects');
    } catch { console.error('Delete failed'); }
    finally { setDeleting(false); setDeleteDialog(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!project) return (
    <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center">
      <p className="text-4xl mb-4">🔍</p>
      <h2 className="text-2xl font-bold text-foreground mb-2">Project not found</h2>
      <Link href="/projects"><button className="text-indigo-400 hover:text-indigo-300 mt-4 transition-colors">← Back to Projects</button></Link>
    </div>
  );

  const gradient = STATUS_GRADIENTS[project.status] || 'from-indigo-900 via-indigo-800 to-slate-900';
  const statusColor = STATUS_COLORS[project.status] || { dot: 'bg-indigo-400', label: 'text-indigo-300', ring: 'ring-indigo-500/30' };
  const statusLogs = project.statusLogs ?? [];

  const Section = ({ icon, title, children, className = '' }: { icon?: React.ReactNode; title: string; children: React.ReactNode; className?: string }) => (
    <div className={`glass-card p-6 ${className}`}>
      <h3 className="text-xs font-bold text-muted-foreground mb-5 flex items-center gap-2 uppercase tracking-wider">
        {icon} {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className={`bg-gradient-to-br ${gradient} text-white pt-8 pb-14 px-4 md:px-8 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/projects">
              <button className="flex items-center gap-2 text-white/70 hover:text-white transition-all text-sm">
                <ChevronLeft size={18} /> Back to Projects
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Link href={`/projects/${project.id}/edit`}>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all border border-white/20">
                  <Pencil size={13} /> Edit
                </button>
              </Link>
              <button
                onClick={() => setDeleteDialog(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-medium transition-all border border-red-500/30"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{project.name}</h1>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <ProjectTypeBadge projectType={project.projectType} />
            <TypeBadge type={project.type} />
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <EffortBadge effort={project.effort} />
            {project.device && <DeviceBadge device={project.device} />}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fadeInUp mt-6">

        {/* Row 1: Creator & Company | Current Status + Status History */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Creator & Company */}
          <Section title="Creator & Company">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">CREATOR NAME</p>
                <p className="text-lg font-bold text-foreground">{project.creatorName || '—'}</p>
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-muted-foreground font-semibold mb-1">COMPANY</p>
                <p className="text-base font-semibold text-foreground">{project.company || '—'}</p>
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-muted-foreground font-semibold mb-1">INDUSTRY</p>
                <p className="text-base font-semibold text-foreground">{project.industry || '—'}</p>
              </div>
            </div>
          </Section>

          {/* Right column: Current Status card + Status History log stacked */}
          <div className="flex flex-col gap-4">
            {/* Current Status Card */}
            <div className="glass-card p-5">
              <h3 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wider">
                🟢 Current Status
              </h3>
              <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] ring-1 ${statusColor.ring}`}>
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${statusColor.dot} shadow-lg animate-pulse`} />
                <span className={`text-lg font-bold ${statusColor.label}`}>{project.status}</span>
              </div>
              {/* Timeline condensed under current status */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
                {[
                  { label: 'Start', value: project.startDate },
                  { label: 'End', value: project.endDate },
                  { label: 'Deadline', value: project.deadline },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className={`font-semibold text-xs ${label === 'Deadline' ? 'text-indigo-400' : 'text-foreground'}`}>
                      {value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History Log */}
            <div className="glass-card p-5 flex flex-col flex-1">
              <h3 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wider">
                📋 Status History
              </h3>

              {statusLogs.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground italic">No status changes recorded yet.</p>
                </div>
              ) : (
                <div
                  className="space-y-2 overflow-y-auto pr-1"
                  style={{ maxHeight: '152px' }}
                >
                  {statusLogs.map((log, idx) => {
                    const { date, time } = formatLogDate(log.changedAt);
                    const toColor = STATUS_COLORS[log.toStatus] || { dot: 'bg-indigo-400', label: 'text-indigo-300' };
                    const isFirst = idx === 0;
                    return (
                      <div
                        key={log.id}
                        className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${isFirst ? 'bg-white/[0.06] ring-1 ring-white/10' : 'bg-white/[0.02]'}`}
                      >
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center pt-0.5 gap-1 flex-shrink-0">
                          <span className={`w-2.5 h-2.5 rounded-full ${toColor.dot} ${isFirst ? 'shadow-md' : 'opacity-60'}`} />
                          {idx < statusLogs.length - 1 && (
                            <span className="w-px h-3 bg-white/10" />
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {log.fromStatus ? (
                              <>
                                <span className="text-[10px] text-muted-foreground font-medium truncate">{log.fromStatus}</span>
                                <span className="text-[10px] text-muted-foreground">→</span>
                              </>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic">Created as</span>
                            )}
                            <span className={`text-[11px] font-bold ${toColor.label} truncate`}>{log.toStatus}</span>
                            {isFirst && (
                              <span className="ml-auto text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full ring-1 ring-emerald-500/20 flex-shrink-0">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {date} · {time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client */}
        {(project.clientName || project.clientEmail || project.clientPhone || project.clientAddress) && (
          <Section icon="👤" title="Client Information">
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">NAME</p>
                <p className="font-semibold text-foreground">{project.clientName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center gap-1"><Mail size={12} /> EMAIL</p>
                {project.clientEmail
                  ? <a href={`mailto:${project.clientEmail}`} className="font-semibold text-indigo-400 hover:underline break-all">{project.clientEmail}</a>
                  : <p className="text-muted-foreground">—</p>}
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center gap-1"><Phone size={12} /> PHONE</p>
                {project.clientPhone
                  ? <a href={`tel:${project.clientPhone}`} className="font-semibold text-indigo-400 hover:underline">{project.clientPhone}</a>
                  : <p className="text-muted-foreground">—</p>}
              </div>
            </div>
            {project.clientAddress && (
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center gap-1">📍 ADDRESS</p>
                <p className="text-sm font-semibold text-foreground">{project.clientAddress}</p>
              </div>
            )}
          </Section>
        )}

        {/* Description */}
        {project.description && (
          <Section title="Project Description">
            <RichTextViewer content={project.description} />
          </Section>
        )}

        {/* Links */}
        {(project.previewLink || (project.resourceLinks && project.resourceLinks.length > 0)) && (
          <Section icon={<Link2 size={14} />} title="Project Links">
            <div className="space-y-3">
              {project.previewLink && (
                <a href={project.previewLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all text-indigo-400 font-medium text-sm">
                  🎨 {project.previewLink.replace(/^https?:\/\//, '').slice(0, 60)}
                  <ExternalLink size={14} className="flex-shrink-0 ml-auto" />
                </a>
              )}
              {project.resourceLinks?.map((link, idx) => (
                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all text-indigo-400 font-medium text-sm">
                  📎 {link.title}
                  <ExternalLink size={14} className="flex-shrink-0 ml-auto" />
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Strategy */}
        {(project.shortOverview || project.businessGoal || project.targetAudience || project.competitors) && (
          <Section icon={<Target size={14} />} title="Project Strategy">
            <div className="grid sm:grid-cols-2 gap-4">
              {project.shortOverview && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs font-bold text-purple-400 mb-2">📄 OVERVIEW</p>
                  <RichTextViewer content={project.shortOverview} />
                </div>
              )}
              {project.businessGoal && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs font-bold text-amber-400 mb-2">🎯 BUSINESS GOAL</p>
                  <RichTextViewer content={project.businessGoal} />
                </div>
              )}
              {project.targetAudience && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1"><Users size={12} /> TARGET AUDIENCE</p>
                  <RichTextViewer content={project.targetAudience} />
                </div>
              )}
              {project.competitors && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs font-bold text-rose-400 mb-2">🏆 COMPETITORS</p>
                  <RichTextViewer content={project.competitors} />
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Tech Stack & Tools */}
        {((project.techStack && project.techStack.length > 0) || (project.toolsUsed && project.toolsUsed.length > 0)) && (
          <Section title="Tech Stack & Tools Used">
            <div className="space-y-4">
              {project.techStack && project.techStack.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-wider">💻 Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-semibold transition-all">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.toolsUsed && project.toolsUsed.length > 0 && (
                <div className={project.techStack && project.techStack.length > 0 ? "pt-4 border-t border-white/[0.06]" : ""}>
                  <p className="text-[10px] font-bold text-cyan-400 mb-2 uppercase tracking-wider">🧰 Tools Used</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.toolsUsed.map((tool, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-lg text-xs font-semibold transition-all">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <Section icon={<Tag size={14} />} title="Project Tags">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold hover:bg-indigo-500/20 transition-all">
                  #{tag}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialog}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete Project'}
        cancelLabel="Keep Project"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
        danger
      />
    </div>
  );
}
