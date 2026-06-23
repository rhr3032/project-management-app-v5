'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, Mail, Phone, Target, Users, Tag, Link2, Pencil, Trash2 } from 'lucide-react';
import { Project } from '@/types';
import { StatusBadge, TypeBadge, PriorityBadge, EffortBadge, DeviceBadge } from '@/components/badges';
import { ConfirmDialog } from '@/components/confirm-dialog';

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
            <TypeBadge type={project.type} />
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <EffortBadge effort={project.effort} />
            {project.device && <DeviceBadge device={project.device} />}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fadeInUp mt-6">
        {/* Owner & Timeline */}
        <div className="grid md:grid-cols-2 gap-6">
          <Section title="Owner & Company">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1">OWNER</p>
                <p className="text-lg font-bold text-foreground">{project.owner || '—'}</p>
              </div>
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-muted-foreground font-semibold mb-1">COMPANY</p>
                <p className="text-base font-semibold text-foreground">{project.company || '—'}</p>
              </div>
            </div>
          </Section>

          <Section icon="📅" title="Project Timeline">
            <div className="space-y-3">
              {[
                { label: 'Start', value: project.startDate },
                { label: 'End', value: project.endDate },
                { label: 'Deadline', value: project.deadline },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className={`font-semibold text-sm ${label === 'Deadline' ? 'text-indigo-400' : 'text-foreground'}`}>
                    {value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Client */}
        {(project.clientName || project.clientEmail || project.clientPhone) && (
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
          </Section>
        )}

        {/* Description */}
        {project.description && (
          <Section title="Project Description">
            <div
              className="prose-editor text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
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
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.shortOverview}</p>
                </div>
              )}
              {project.businessGoal && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs font-bold text-amber-400 mb-2">🎯 BUSINESS GOAL</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.businessGoal}</p>
                </div>
              )}
              {project.targetAudience && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1"><Users size={12} /> TARGET AUDIENCE</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.targetAudience}</p>
                </div>
              )}
              {project.competitors && (
                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <p className="text-xs font-bold text-rose-400 mb-2">🏆 COMPETITORS</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.competitors}</p>
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
