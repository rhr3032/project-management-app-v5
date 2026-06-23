'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, Mail, Phone, FileText, Target, Users, Zap, Tag, Link2 } from 'lucide-react';
import { Project } from '@/types';
import { StatusBadge, TypeBadge, PriorityBadge, EffortBadge, DeviceBadge } from '@/components/badges';

const statusGradients: Record<string, string> = {
  'Planning': 'from-blue-400 to-blue-600',
  'In Progress': 'from-orange-400 to-orange-600',
  'Review': 'from-purple-400 to-purple-600',
  'On Hold': 'from-yellow-400 to-yellow-600',
  'Completed': 'from-green-400 to-green-600',
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) {
          setProject(null);
          return;
        }

        const found: Project = await res.json();
        setProject(found);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
  if (!project) return (
    <div className="p-4 md:p-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground">Project not found</h2>
        <Link href="/projects">
          <button className="text-primary hover:underline mt-4">← Back to Projects</button>
        </Link>
      </div>
    </div>
  );

  const gradient = statusGradients[project.status] || 'from-primary to-blue-600';

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Header */}
      <div className={`bg-gradient-to-r ${gradient} text-white pt-8 pb-12 px-4 md:px-8 animate-fadeIn`}>
        <div className="max-w-6xl mx-auto">
          <Link href="/projects">
            <button className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-smooth">
              <ChevronLeft size={20} />
              Back to Projects
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-balance">{project.name}</h1>
          <p className="text-white/90 mb-6 text-lg max-w-2xl">{project.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <TypeBadge type={project.type} />
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <EffortBadge effort={project.effort} />
            {project.device && <DeviceBadge device={project.device} />}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6 animate-fadeInUp">
        {/* Project Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Owner & Company */}
        <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-smooth">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">OWNER</h3>
              <p className="text-xl font-bold text-foreground">{project.owner}</p>
            </div>
            <Zap className="text-primary" size={24} />
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">COMPANY</h3>
            <p className="text-lg font-semibold text-foreground">{project.company}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-smooth">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            📅 PROJECT TIMELINE
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Start</span>
              <span className="font-semibold text-foreground">{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">End</span>
              <span className="font-semibold text-foreground">{new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Deadline</span>
              <span className="font-bold text-primary">{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-primary/10 p-6 hover:shadow-lg transition-smooth">
        <h3 className="text-sm font-semibold text-muted-foreground mb-6 flex items-center gap-2">
          👤 CLIENT INFORMATION
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-2">FULL NAME</p>
            <p className="text-lg font-bold text-foreground">{project.clientName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-2 flex items-center gap-1">
              <Mail size={14} /> EMAIL
            </p>
            <a href={`mailto:${project.clientEmail}`} className="font-semibold text-primary hover:underline break-all">
              {project.clientEmail}
            </a>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold mb-2 flex items-center gap-1">
              <Phone size={14} /> PHONE
            </p>
            <a href={`tel:${project.clientPhone}`} className="font-semibold text-primary hover:underline">
              {project.clientPhone || 'N/A'}
            </a>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200/50 p-6 hover:shadow-lg transition-smooth">
        <h3 className="text-sm font-semibold text-muted-foreground mb-6 flex items-center gap-2">
          <Link2 size={18} className="text-cyan-600" /> PROJECT LINKS
        </h3>
        <div className="space-y-4">
          {project.previewLink && (
            <div className="bg-white rounded-lg p-4 border border-cyan-100">
              <p className="text-xs font-semibold text-muted-foreground mb-2">🎨 PREVIEW LINK</p>
              <a
                href={project.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-blue-700 flex items-center gap-2 break-all"
              >
                {project.previewLink.replace('https://', '')}
                <ExternalLink size={16} className="flex-shrink-0" />
              </a>
            </div>
          )}

          {project.resourceLinks && project.resourceLinks.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-3">📚 RESOURCE LINKS</p>
              <div className="space-y-2">
                {project.resourceLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-3 border border-cyan-100 font-semibold text-primary hover:bg-primary/5 flex items-center gap-2 transition-smooth"
                  >
                    {link.title}
                    <ExternalLink size={16} className="flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground bg-white/50 p-3 rounded-lg">No additional resource links yet.</p>
          )}
        </div>
      </div>

      {/* Project Strategy Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200/50 p-6 hover:shadow-lg transition-smooth">
        <h3 className="text-sm font-semibold text-muted-foreground mb-6 flex items-center gap-2">
          <Target size={18} className="text-purple-600" /> PROJECT STRATEGY
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {project.shortOverview && (
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <p className="text-xs font-bold text-purple-600 mb-2 flex items-center gap-1">
                <FileText size={14} /> OVERVIEW
              </p>
              <p className="text-sm text-foreground leading-relaxed">{project.shortOverview}</p>
            </div>
          )}

          {project.businessGoal && (
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <p className="text-xs font-bold text-purple-600 mb-2 flex items-center gap-1">
                🎯 BUSINESS GOAL
              </p>
              <p className="text-sm text-foreground leading-relaxed">{project.businessGoal}</p>
            </div>
          )}

          {project.targetAudience && (
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <p className="text-xs font-bold text-purple-600 mb-2 flex items-center gap-1">
                <Users size={14} /> TARGET AUDIENCE
              </p>
              <p className="text-sm text-foreground leading-relaxed">{project.targetAudience}</p>
            </div>
          )}

          {project.competitors && (
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <p className="text-xs font-bold text-purple-600 mb-2">🏆 COMPETITORS</p>
              <p className="text-sm text-foreground leading-relaxed">{project.competitors}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tags Section */}
      {project.tags && project.tags.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50 p-6 hover:shadow-lg transition-smooth">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Tag size={18} className="text-orange-600" /> PROJECT TAGS
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200 hover:shadow-md transition-smooth"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
