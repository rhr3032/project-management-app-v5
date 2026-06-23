'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import { StatusBadge, TypeBadge, PriorityBadge, DeviceBadge } from '@/components/badges';
import { Calendar, User, Building2 } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [deviceFilter, setDeviceFilter] = useState('All Devices');
  const [sortBy, setSortBy] = useState('Newest First');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data: Project[] = await res.json();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All Statuses') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (typeFilter !== 'All Types') {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    if (priorityFilter !== 'All Priorities') {
      filtered = filtered.filter(p => p.priority === priorityFilter);
    }

    if (deviceFilter !== 'All Devices') {
      filtered = filtered.filter(p => p.device === deviceFilter);
    }

    // Sort
    if (sortBy === 'Newest First') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'Oldest First') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, typeFilter, priorityFilter, deviceFilter, sortBy]);

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">{filteredProjects.length} total projects</p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus size={16} className="mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All Statuses</option>
            <option>Planning</option>
            <option>In Progress</option>
            <option>Review</option>
            <option>On Hold</option>
            <option>Completed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All Types</option>
            <option>UI/UX Design</option>
            <option>Web App</option>
            <option>Mobile App</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All Priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>

          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All Devices</option>
            <option>XS</option>
            <option>M</option>
            <option>L</option>
            <option>Desktop</option>
            <option>Mobile</option>
            <option>Tablet</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-sm text-muted-foreground">No projects found</div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground hover:text-primary text-lg">{project.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <TypeBadge type={project.type} />
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                    <DeviceBadge device={project.device} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
