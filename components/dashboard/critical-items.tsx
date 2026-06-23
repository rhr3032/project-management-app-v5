'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/types';
import { AlertCircle } from 'lucide-react';

export function CriticalItems() {
  const [criticalProjects, setCriticalProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCriticalProjects() {
      try {
        const res = await fetch('/api/projects');
        const projects: Project[] = await res.json();
        const critical = projects.filter(p => p.priority === 'Critical').slice(0, 3);
        setCriticalProjects(critical);
      } catch (error) {
        console.error('Failed to fetch critical projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCriticalProjects();
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;

  if (criticalProjects.length === 0) {
    return <div className="text-sm text-muted-foreground">No critical items</div>;
  }

  return (
    <div className="space-y-3">
      {criticalProjects.map((project) => (
        <div key={project.id} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/20">
          <AlertCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{project.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{project.status} · {project.priority}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
