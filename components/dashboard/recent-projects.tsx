'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types';
import { StatusBadge, TypeBadge, PriorityBadge } from '@/components/badges';
import { Calendar, User, Building2 } from 'lucide-react';

export function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data: Project[] = await res.json();
        setProjects(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;

  if (projects.length === 0) {
    return <div className="text-sm text-muted-foreground">No projects yet</div>;
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <div className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground hover:text-primary">{project.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={project.type} />
                <StatusBadge status={project.status} />
                <PriorityBadge priority={project.priority} />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{project.owner}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 size={14} />
                <span>{project.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(project.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
