'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Pencil, Trash2, Calendar, User, Building2 } from 'lucide-react';
import { Project } from '@/types';
import { StatusBadge, TypeBadge, ProjectTypeBadge, PriorityBadge, DeviceBadge } from '@/components/badges';
import { ConfirmDialog } from '@/components/confirm-dialog';

const ALL_STATUSES = [
  'All Statuses','Research','Planning','In Progress','Review','On Hold',
  'Completed','Cancelled','Archived','Pending Approval','Approved','Rejected',
  'Needs Revision','In Testing','Ready for Deployment','Deployed','Maintenance','Closed',
];

const ALL_PROJECT_TYPES = ['All Project Types', 'UI/UX Design', 'Web Development', 'Mobile App Development'] as const;

const CATEGORIES_BY_TYPE = {
  'UI/UX Design': [
    'UI/UX Design', 'Logo', 'Branding', 'Illustration', 'Marketing Material',
    'Video Production', 'Photography', 'Content Creation', 'Social Media Campaign',
    'Email Campaign', 'Print Design', 'Packaging Design', '3D Modeling', 'Animation',
    'Research Project', 'Wireframe', 'Prototyping', 'Design System', 'User Research',
    'Mobile UI Design', 'Web UI Design', 'Icon Set',
    'Design Audit', 'Typography System', 'Pitch Deck', 'Newsletter Template', 'Style Guide',
    'Motion Graphics', 'Infographic Design', 'Persona Creation', 'Journey Mapping', 'Site Mapping',
    'Information Architecture', 'Usability Testing', 'Interactive Prototype', 'Poster Design', 'Billboard Design',
    'Brochure Design', 'Card Design', 'Vector Art', 'Matte Painting', 'Storyboarding'
  ],
  'Web Development': [
    'Website', 'Web App', 'E-commerce Platform', 'SaaS Product', 'Enterprise Software',
    'SEO', 'Data Visualization', 'Open Source Contribution', 'Dashboard', 'ERP Software',
    'LMS Platform', 'CMS Platform', 'Full-Stack App', 'API Integration', 'Landing Page', 'Web Portal',
    'Headless CMS', 'Serverless App', 'Progressive Web App (PWA)', 'Single Page App (SPA)', 'Static Site Generator',
    'E-Learning Hub', 'Real-time Chat App', 'CRM Integration', 'Payment Gateway Integration', 'GraphQL API',
    'RESTful API', 'Web Scraper', 'Devops Setup', 'Docker Deployment', 'Cloud Migration',
    'WebSockets Integration', 'Web Accessibility (a11y)', 'Site Security Audit', 'Performance Optimization', 'Database Migration'
  ],
  'Mobile App Development': [
    'Mobile App', 'AR/VR Experience', 'IoT Project', 'AI/ML Project', 'Game Development',
    'iOS App', 'Android App', 'Cross-Platform App', 'Flutter App', 'React Native App', 'Wearable App',
    'Mobile Game', 'Bluetooth Integration', 'Push Notification Service', 'Mobile Analytics', 'Native iOS Dev',
    'Native Android Dev', 'App Store Optimization (ASO)', 'SQLite Integration', 'CoreML Integration', 'TensorFlow Lite',
    'Location Services (GPS)', 'HealthKit Integration', 'Apple Watch App', 'Android Wear App', 'Hybrid App',
    'Cordova App', 'Capacitor App', 'App Payment System', 'Firebase Integration', 'Mobile Security System'
  ]
} as const;

const ALL_CATEGORIES = [
  'All Categories',
  ...CATEGORIES_BY_TYPE['UI/UX Design'],
  ...CATEGORIES_BY_TYPE['Web Development'],
  ...CATEGORIES_BY_TYPE['Mobile App Development']
];

const ALL_PRIORITIES = [
  'All Priorities','Low','Medium','High','Critical','Urgent','Immediate','Important',
  'Optional','Backlog','Future','Long-term','Short-term','Strategic','Tactical',
  'Operational','Key Initiative','Quick Win','Major Project','Minor Project',
];

const ALL_DEVICES = [
  'All Devices','Desktop','Mobile','Tablet','TV','POS','Car','Watch','All','None',
  'Custom Device','Wearable','IoT Device','AR/VR Headset','Game Console',
  'Smart Home Device','Industrial Equipment','Medical Device','Drone','Robot',
  'Kiosk','Interactive Display',
];

const selectClass = "px-3 py-2.5 border border-white/10 rounded-xl glass-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [projectTypeFilter, setProjectTypeFilter] = useState('All Project Types');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [deviceFilter, setDeviceFilter] = useState('All Devices');
  const [sortBy, setSortBy] = useState('Newest First');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; projectId: string; projectName: string }>({
    open: false, projectId: '', projectName: '',
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      const data: Project[] = await res.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }

  const availableCategories = projectTypeFilter === 'All Project Types'
    ? ALL_CATEGORIES
    : ['All Categories', ...CATEGORIES_BY_TYPE[projectTypeFilter as keyof typeof CATEGORIES_BY_TYPE]];

  const handleProjectTypeFilterChange = (val: string) => {
    setProjectTypeFilter(val);
    if (val !== 'All Project Types') {
      const allowed = CATEGORIES_BY_TYPE[val as keyof typeof CATEGORIES_BY_TYPE];
      if (categoryFilter !== 'All Categories' && !allowed.includes(categoryFilter as any)) {
        setCategoryFilter('All Categories');
      }
    }
  };

  useEffect(() => {
    let filtered = [...projects];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term) ||
        p.owner.toLowerCase().includes(term) ||
        (p.company || '').toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'All Statuses') filtered = filtered.filter(p => p.status === statusFilter);
    if (projectTypeFilter !== 'All Project Types') filtered = filtered.filter(p => p.projectType === projectTypeFilter);
    if (categoryFilter !== 'All Categories') filtered = filtered.filter(p => p.type === categoryFilter);
    if (priorityFilter !== 'All Priorities') filtered = filtered.filter(p => p.priority === priorityFilter);
    if (deviceFilter !== 'All Devices') filtered = filtered.filter(p => p.device === deviceFilter);

    if (sortBy === 'Newest First') filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === 'Oldest First') filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else if (sortBy === 'Name A-Z') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'Name Z-A') filtered.sort((a, b) => b.name.localeCompare(a.name));

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, projectTypeFilter, categoryFilter, priorityFilter, deviceFilter, sortBy]);

  const openDeleteDialog = (e: React.MouseEvent, project: Project) => {
    e.preventDefault(); e.stopPropagation();
    setDeleteDialog({ open: true, projectId: project.id, projectName: project.name });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${deleteDialog.projectId}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== deleteDialog.projectId));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, projectId: '', projectName: '' });
    }
  };

  // Strip HTML tags for display
  const getPlainText = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').slice(0, 140);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fadeInUp">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1 text-sm">{filteredProjects.length} of {projects.length} projects</p>
        </div>
        <Link href="/projects/new">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm">
            <Plus size={16} /> New Project
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-52">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search projects..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-xl glass-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
          </div>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectClass}>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={projectTypeFilter} onChange={e => handleProjectTypeFilterChange(e.target.value)} className={selectClass}>
            {ALL_PROJECT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className={selectClass}>
            {availableCategories.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className={selectClass}>
            {ALL_PRIORITIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)} className={selectClass}>
            {ALL_DEVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClass}>
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Name A-Z</option>
            <option>Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-24 animate-fadeIn">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-lg font-semibold text-foreground mb-1">No projects found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or create a new project</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="glass-card p-5 animate-fadeInUp cursor-pointer group"
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Top row: title */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-foreground hover:text-indigo-400 text-base transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                  </div>

                  {/* Description (strip HTML) */}
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                      {getPlainText(project.description)}{project.description.length > 140 ? '...' : ''}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <ProjectTypeBadge projectType={project.projectType} />
                    <TypeBadge type={project.type} />
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                    {project.device && <DeviceBadge device={project.device} />}
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {project.owner && (
                      <span className="flex items-center gap-1">
                        <User size={12} /> {project.owner}
                      </span>
                    )}
                    {project.company && (
                      <span className="flex items-center gap-1">
                        <Building2 size={12} /> {project.company}
                      </span>
                    )}
                    {project.endDate && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/projects/${project.id}`} onClick={e => e.stopPropagation()}>
                    <button
                      title="View Project"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-indigo-500/20 hover:text-indigo-400 text-muted-foreground text-xs font-medium transition-all border border-white/[0.06] hover:border-indigo-500/30"
                    >
                      <Eye size={13} /> View
                    </button>
                  </Link>
                  <Link href={`/projects/${project.id}/edit`} onClick={e => e.stopPropagation()}>
                    <button
                      title="Edit Project"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-amber-500/20 hover:text-amber-400 text-muted-foreground text-xs font-medium transition-all border border-white/[0.06] hover:border-amber-500/30"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                  </Link>
                  <button
                    onClick={e => openDeleteDialog(e, project)}
                    title="Delete Project"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 text-muted-foreground text-xs font-medium transition-all border border-white/[0.06] hover:border-red-500/30"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteDialog.projectName}"? This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete Project'}
        cancelLabel="Keep Project"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, projectId: '', projectName: '' })}
        danger
      />
    </div>
  );
}
