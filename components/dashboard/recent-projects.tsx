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
          <div className="glass-card p-4 hover:scale-[1.01] transition-all cursor-pointer" style={{ animationDelay: '0ms' }}>
            <h3 className="font-semibold text-foreground hover:text-indigo-400 transition-colors mb-1">{project.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {(project.description || '').replace(/<[^>]*>/g, '').slice(0, 100)}
            </p>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <TypeBadge type={project.type} />
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User size={12} />{project.owner}</span>
              {project.company && <span className="flex items-center gap-1"><Building2 size={12} />{project.company}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
