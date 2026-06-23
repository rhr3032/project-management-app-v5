'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Calendar, User, TrendingUp, FileText, Zap, Eye, Pause, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project, ProjectStatus } from '@/types';
import { TypeBadge, PriorityBadge, EffortBadge } from '@/components/badges';

type BoardStatus = Extract<ProjectStatus, 'Planning' | 'In Progress' | 'Review' | 'On Hold' | 'Completed'>;

const statuses: BoardStatus[] = ['Planning', 'In Progress', 'Review', 'On Hold', 'Completed'];

const statusConfig: Record<BoardStatus, { bg: string; text: string; border: string; icon: React.ReactNode; gradient: string }> = {
  'Planning': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <FileText size={20} />, gradient: 'from-blue-400 to-blue-600' },
  'In Progress': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: <Zap size={20} />, gradient: 'from-orange-400 to-orange-600' },
  'Review': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: <Eye size={20} />, gradient: 'from-purple-400 to-purple-600' },
  'On Hold': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <Pause size={20} />, gradient: 'from-yellow-400 to-yellow-600' },
  'Completed': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <CheckCircle size={20} />, gradient: 'from-green-400 to-green-600' },
};

function isBoardStatus(status: ProjectStatus): status is BoardStatus {
  return statuses.includes(status as BoardStatus);
}

export default function BoardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [projectsByStatus, setProjectsByStatus] = useState<Record<BoardStatus, Project[]>>({
    'Planning': [],
    'In Progress': [],
    'Review': [],
    'On Hold': [],
    'Completed': [],
  });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data: Project[] = await res.json();
        setProjects(data);

        const grouped: Record<BoardStatus, Project[]> = {
          'Planning': [],
          'In Progress': [],
          'Review': [],
          'On Hold': [],
          'Completed': [],
        };

        data.forEach(project => {
          if (isBoardStatus(project.status)) {
            grouped[project.status].push(project);
          }
        });

        setProjectsByStatus(grouped);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleDragStart = (project: Project) => {
    setDraggedProject(project);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (newStatus: BoardStatus, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedProject) return;

    if (draggedProject.status === newStatus) {
      setDraggedProject(null);
      return;
    }

    if (!isBoardStatus(draggedProject.status)) {
      setDraggedProject(null);
      return;
    }

    const previousStatus = draggedProject.status;
    const updatedProject = { ...draggedProject, status: newStatus };
    
    setProjects(prev => 
      prev.map(p => p.id === draggedProject.id ? updatedProject : p)
    );

    setProjectsByStatus(prev => ({
      ...prev,
      [previousStatus]: prev[previousStatus].filter((p) => p.id !== draggedProject.id),
      [newStatus]: [...prev[newStatus], updatedProject],
    }));

    setDraggedProject(null);

    try {
      const response = await fetch(`/api/projects/${draggedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to persist project status');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      setProjects(prev => 
        prev.map(p => p.id === draggedProject.id ? draggedProject : p)
      );
      setProjectsByStatus(prev => ({
        ...prev,
        [newStatus]: prev[newStatus].filter((p) => p.id !== draggedProject.id),
        [previousStatus]: [...prev[previousStatus], draggedProject],
      }));
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-8 animate-fadeInUp">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="text-primary" size={32} />
              Board
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Projects organized by status</p>
          </div>
          <Link href="/projects/new" className="w-full md:w-auto">
            <Button className="w-full md:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground shadow-lg">
              <Plus size={16} className="mr-2" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Kanban Board - Responsive */}
      <div className="overflow-x-auto pb-8 -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex gap-6 md:gap-4 min-w-full md:min-w-0 md:grid md:grid-cols-5">
          {statuses.map(status => {
            const config = statusConfig[status];
            const statusProjects = projectsByStatus[status];

            return (
              <div key={status} className="flex-shrink-0 w-80 md:w-auto md:flex-1 flex flex-col animate-slideInLeft" style={{ animationDelay: `${statuses.indexOf(status) * 100}ms` }}>
                {/* Column Header */}
                <div className="mb-4 sticky top-0 z-10">
                  <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${config.bg} border ${config.border}`}>
                    <div className="flex items-center gap-2">
                      <div className={`${config.text}`}>
                        {config.icon}
                      </div>
                      <div>
                        <h2 className={`text-sm font-bold ${config.text}`}>{status}</h2>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white ${config.text}`}>
                      {statusProjects.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div 
                  className={`flex-1 space-y-3 rounded-xl p-4 min-h-[500px] ${config.bg} border-2 ${config.border} transition-all`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(status, e)}
                >
                  {statusProjects.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-12 flex items-center justify-center h-full">
                      <div>
                        <p className="text-2xl mb-2">✨</p>
                        <p>No projects yet</p>
                      </div>
                    </div>
                  ) : (
                    statusProjects.map((project, idx) => (
                      <div 
                        key={project.id}
                        draggable
                        onDragStart={() => handleDragStart(project)}
                        onClick={() => {}}
                        className={`bg-white rounded-lg p-4 border-2 border-transparent hover:border-primary/50 shadow-sm hover:shadow-lg cursor-grab active:cursor-grabbing transition-smooth group ${
                          draggedProject?.id === project.id ? 'opacity-50 ring-2 ring-primary' : ''
                        }`}
                      >
                        {/* Top border accent */}
                        <div className={`h-1 -mx-4 -mt-4 mb-4 rounded-t-lg bg-gradient-to-r ${config.gradient}`}></div>

                        <Link href={`/projects/${project.id}`}>
                          <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>

                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {project.description}
                          </p>
                        </Link>

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <TypeBadge type={project.type} />
                          <PriorityBadge priority={project.priority} />
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span className="truncate">{project.owner}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
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
