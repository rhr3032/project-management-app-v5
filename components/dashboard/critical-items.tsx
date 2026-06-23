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
        <div key={project.id} className="flex items-start gap-3">
          <div className="mt-1">
            <AlertCircle size={16} className="text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{project.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                Review
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
