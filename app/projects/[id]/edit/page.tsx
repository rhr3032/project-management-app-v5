'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Project } from '@/types';
import { RichTextEditor } from '@/components/rich-text-editor';

const PROJECT_STATUSES = [
  'Research','Planning','In Progress','Review','On Hold','Completed','Cancelled',
  'Archived','Pending Approval','Approved','Rejected','Needs Revision',
  'In Testing','Ready for Deployment','Deployed','Maintenance','Closed',
];
const PROJECT_TYPES = [
  'UI/UX Design', 'Web Development', 'Mobile App Development'
] as const;

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
const PROJECT_PRIORITIES = [
  'Low','Medium','High','Critical','Urgent','Immediate','Important','Optional',
  'Backlog','Future','Long-term','Short-term','Strategic','Tactical','Operational',
  'Key Initiative','Quick Win','Major Project','Minor Project',
];
const PROJECT_DEVICES = [
  'Desktop','Mobile','Tablet','TV','POS','Car','Watch','All','None',
  'Custom Device','Wearable','IoT Device','AR/VR Headset','Game Console',
  'Smart Home Device','Industrial Equipment','Medical Device','Drone',
  'Robot','Kiosk','Interactive Display',
];
const PROJECT_EFFORTS = [
  'XS','S','M','L','XL','XXL','XXXL','Minimal','Moderate','Significant',
  'Extensive','Intensive','Comprehensive','In-depth','Thorough','Exhaustive',
  'All-encompassing',
];

const formFieldClass = "w-full px-4 py-2.5 border border-white/10 rounded-xl glass-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all";
const labelClass = "block text-sm font-semibold text-foreground/80 mb-2";

const SectionCard = ({ emoji, title, colorClass, children }: { emoji: string; title: string; colorClass: string; children: React.ReactNode }) => (
  <div className="glass-card p-8">
    <h2 className={`text-base font-bold mb-6 flex items-center gap-2 ${colorClass}`}>
      <span className="text-xl">{emoji}</span>{title}
    </h2>
    {children}
  </div>
);

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [formData, setFormData] = useState<Partial<Project> & { tags?: string }>({});
  const [description, setDescription] = useState('');
  const [resourceLinks, setResourceLinks] = useState<Array<{ url: string; title: string }>>([]);
  const [newLink, setNewLink] = useState({ url: '', title: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) { router.push('/projects'); return; }
        const project: Project = await res.json();
        let matchedProjectType = project.projectType;
        if (!matchedProjectType) {
          matchedProjectType = 'Web Development'; // default fallback
          for (const [pType, categories] of Object.entries(CATEGORIES_BY_TYPE)) {
            if (categories.includes(project.type)) {
              matchedProjectType = pType as any;
              break;
            }
          }
        }
        setFormData({
          projectType: matchedProjectType,
          ...project,
          tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
        });
        setDescription(project.description || '');
        setResourceLinks(project.resourceLinks || []);
      } catch { router.push('/projects'); }
      finally { setLoading(false); }
    }
    if (projectId) fetchProject();
  }, [projectId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'projectType') {
      const defaultCategory = CATEGORIES_BY_TYPE[value as keyof typeof CATEGORIES_BY_TYPE][0];
      setFormData(prev => ({ ...prev, projectType: value as any, type: defaultCategory }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const tagsArray = typeof formData.tags === 'string'
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : formData.tags;

      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, description, resourceLinks, tags: tagsArray }),
      });
      if (res.ok) router.push(`/projects/${projectId}`);
      else { const d = await res.json(); setError(d.error || 'Failed to update project'); }
    } catch { setError('Network error. Please try again.'); }
    finally { setSaving(false); }
  };

  const SelectField = ({ name, label, options = [] }: { name: string; label: string; options?: readonly string[] | string[] }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <select name={name} value={(formData as Record<string,string>)[name] || ''} onChange={handleInputChange} className={formFieldClass}>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-orange-900 to-red-900 text-white px-8 py-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <Link href={`/projects/${projectId}`}>
            <button className="flex items-center gap-2 text-white/70 hover:text-white mb-5 transition-all text-sm">
              <ChevronLeft size={18} /> Back to Project
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Edit Project</h1>
          <p className="text-white/70 text-lg">{formData.name}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeInUp">
          <SectionCard emoji="📋" title="PROJECT INFORMATION" colorClass="text-indigo-400">
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Project Name <span className="text-red-400">*</span></label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange}
                  placeholder="Project name" className={formFieldClass} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField name="projectType" label="Project Type" options={PROJECT_TYPES as unknown as string[]} />
                <SelectField name="type" label="Category" options={CATEGORIES_BY_TYPE[formData.projectType as keyof typeof CATEGORIES_BY_TYPE] || []} />
                <SelectField name="status" label="Project Status" options={PROJECT_STATUSES} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField name="priority" label="Priority" options={PROJECT_PRIORITIES} />
                <SelectField name="effort" label="Effort" options={PROJECT_EFFORTS} />
                <SelectField name="device" label="Device" options={PROJECT_DEVICES} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Owner Name <span className="text-red-400">*</span></label>
                  <input type="text" name="owner" value={formData.owner || ''} onChange={handleInputChange}
                    placeholder="e.g. John Smith" className={formFieldClass} required />
                </div>
                <div>
                  <label className={labelClass}>Company Name</label>
                  <input type="text" name="company" value={formData.company || ''} onChange={handleInputChange}
                    placeholder="e.g. Acme Corp" className={formFieldClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Project Description</label>
                <RichTextEditor content={description} onChange={setDescription}
                  placeholder="Write a detailed project description..." />
              </div>
            </div>
          </SectionCard>

          <SectionCard emoji="📅" title="PROJECT TIMELINE" colorClass="text-rose-400">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['startDate','endDate','deadline'].map(field => (
                <div key={field}>
                  <label className={labelClass}>{field === 'startDate' ? 'Start Date' : field === 'endDate' ? 'End Date' : 'Deadline'}</label>
                  <input type="date" name={field} value={(formData as Record<string,string>)[field] || ''} onChange={handleInputChange} className={formFieldClass} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard emoji="👤" title="CLIENT INFORMATION" colorClass="text-cyan-400">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Client Name</label>
                <input type="text" name="clientName" value={formData.clientName || ''} onChange={handleInputChange}
                  placeholder="e.g. Acme Corp" className={formFieldClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="clientEmail" value={formData.clientEmail || ''} onChange={handleInputChange}
                    placeholder="hello@acme.com" className={formFieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" name="clientPhone" value={formData.clientPhone || ''} onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567" className={formFieldClass} />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard emoji="🔗" title="PROJECT LINKS" colorClass="text-purple-400">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Preview Link</label>
                <input type="url" name="previewLink" value={formData.previewLink || ''} onChange={handleInputChange}
                  placeholder="https://preview.yourproject.com" className={formFieldClass} />
              </div>
              <div>
                <label className={labelClass}>Resource Links</label>
                <div className="space-y-3 mb-3">
                  <input type="text" placeholder="Link title" value={newLink.title}
                    onChange={e => setNewLink(p => ({ ...p, title: e.target.value }))} className={formFieldClass} />
                  <div className="flex gap-2">
                    <input type="url" placeholder="https://..." value={newLink.url}
                      onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))}
                      className={`${formFieldClass} flex-1`} />
                    <button type="button" onClick={() => {
                      if (newLink.url && newLink.title) { setResourceLinks(p => [...p, newLink]); setNewLink({ url: '', title: '' }); }
                    }} className="px-4 py-2.5 bg-primary hover:bg-primary/80 text-white rounded-xl transition-all">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                {resourceLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-primary/[0.08] border border-primary/20 p-3 rounded-xl">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{link.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <button type="button" onClick={() => setResourceLinks(p => p.filter((_, i) => i !== idx))}
                      className="ml-2 p-1 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard emoji="🎯" title="PROJECT STRATEGY" colorClass="text-amber-400">
            <div className="space-y-4">
              {[
                { name: 'shortOverview', label: 'Short Overview', placeholder: 'A concise 1-2 sentence summary.' },
                { name: 'businessGoal', label: 'Business Goal', placeholder: 'What business outcome does this achieve?' },
                { name: 'targetAudience', label: 'Target Audience', placeholder: 'Who is this project designed for?' },
                { name: 'competitors', label: 'Competitors (optional)', placeholder: 'List competing products.' },
              ].map(f => (
                <div key={f.name}>
                  <label className={labelClass}>{f.label}</label>
                  <textarea name={f.name} value={(formData as Record<string,string>)[f.name] || ''} onChange={handleInputChange}
                    placeholder={f.placeholder} rows={3} className={`${formFieldClass} resize-none`} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard emoji="🏷️" title="PROJECT TAGS" colorClass="text-emerald-400">
            <div>
              <label className={labelClass}>Tags (comma-separated)</label>
              <input type="text" name="tags" value={typeof formData.tags === 'string' ? formData.tags : ''} onChange={handleInputChange}
                placeholder="design, mobile, core" className={formFieldClass} />
            </div>
          </SectionCard>

          <div className="flex items-center justify-end gap-4 pt-2 pb-12">
            <Link href={`/projects/${projectId}`}>
              <button type="button" className="px-8 py-3 border border-white/10 rounded-xl text-foreground hover:bg-white/[0.06] transition-all font-medium">
                Cancel
              </button>
            </Link>
            <button type="submit" disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl disabled:opacity-50 shadow-lg shadow-amber-500/20 transition-all font-semibold flex items-center gap-2">
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              ) : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
