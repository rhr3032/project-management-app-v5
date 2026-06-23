'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { RichTextEditor } from '@/components/rich-text-editor';

const PROJECT_STATUSES = [
  'Research','Planning','In Progress','Review','On Hold','Completed','Cancelled',
  'Archived','Pending Approval','Approved','Rejected','Needs Revision',
  'In Testing','Ready for Deployment','Deployed','Maintenance','Closed',
];

const PROJECT_TYPES = [
  'UI/UX Design','Website','Web App','Mobile App','Logo','Branding','Illustration',
  'Marketing Material','Video Production','Photography','Content Creation','SEO',
  'Social Media Campaign','Email Campaign','Print Design','Packaging Design',
  '3D Modeling','Animation','Game Development','AR/VR Experience','IoT Project',
  'AI/ML Project','Data Visualization','E-commerce Platform','SaaS Product',
  'Enterprise Software','Open Source Contribution','Research Project',
];

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
      <span className="text-xl">{emoji}</span>
      {title}
    </h2>
    {children}
  </div>
);

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: 'UI/UX Design',
    status: 'Planning',
    priority: 'Medium',
    effort: 'M',
    device: 'Desktop',
    owner: '',
    company: '',
    startDate: '',
    endDate: '',
    deadline: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    previewLink: '',
    shortOverview: '',
    businessGoal: '',
    targetAudience: '',
    competitors: '',
    tags: '',
  });
  const [description, setDescription] = useState('');
  const [resourceLinks, setResourceLinks] = useState<Array<{ url: string; title: string }>>([]);
  const [newLink, setNewLink] = useState({ url: '', title: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLink = () => {
    if (newLink.url && newLink.title) {
      setResourceLinks(prev => [...prev, newLink]);
      setNewLink({ url: '', title: '' });
    }
  };

  const handleRemoveLink = (index: number) => {
    setResourceLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          description,
          resourceLinks,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      if (response.ok) {
        router.push('/projects');
      } else {
        const data = await response.json();
        setError(data.error ? JSON.stringify(data.error) : 'Failed to create project');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const SelectField = ({ name, label, options, required }: { name: string; label: string; options: string[]; required?: boolean }) => (
    <div>
      <label className={labelClass}>{label} {required && <span className="text-red-400">*</span>}</label>
      <select name={name} value={(formData as Record<string,string>)[name]} onChange={handleInputChange} className={formFieldClass}>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-cyan-900 text-white px-8 py-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <Link href="/projects">
            <button className="flex items-center gap-2 text-white/70 hover:text-white mb-5 transition-all text-sm">
              <ChevronLeft size={18} /> Back to Projects
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Create New Project</h1>
          <p className="text-white/70 text-lg">Add a new project to your workspace</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeInUp">

          {/* Project Information */}
          <SectionCard emoji="📋" title="PROJECT INFORMATION" colorClass="text-indigo-400">
            <div className="space-y-5">
              {/* Project Name */}
              <div>
                <label className={labelClass}>Project Name <span className="text-red-400">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  placeholder="e.g. Redesign Onboarding Flow" className={formFieldClass} required />
              </div>

              {/* Type & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField name="type" label="Project Type" options={PROJECT_TYPES} required />
                <SelectField name="status" label="Project Status" options={PROJECT_STATUSES} required />
              </div>

              {/* Priority, Effort, Device */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField name="priority" label="Priority" options={PROJECT_PRIORITIES} required />
                <SelectField name="effort" label="Effort" options={PROJECT_EFFORTS} required />
                <SelectField name="device" label="Device" options={PROJECT_DEVICES} />
              </div>

              {/* Owner & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Owner Name <span className="text-red-400">*</span></label>
                  <input type="text" name="owner" value={formData.owner} onChange={handleInputChange}
                    placeholder="e.g. John Smith" className={formFieldClass} required />
                </div>
                <div>
                  <label className={labelClass}>Company Name</label>
                  <input type="text" name="company" value={formData.company} onChange={handleInputChange}
                    placeholder="e.g. Acme Corp" className={formFieldClass} />
                </div>
              </div>

              {/* Description - Rich Text Editor */}
              <div>
                <label className={labelClass}>Project Description</label>
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Write a detailed project description with rich formatting..."
                />
              </div>
            </div>
          </SectionCard>

          {/* Project Timeline */}
          <SectionCard emoji="📅" title="PROJECT TIMELINE" colorClass="text-rose-400">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['startDate', 'endDate', 'deadline'].map(field => (
                <div key={field}>
                  <label className={labelClass}>{field === 'startDate' ? 'Start Date' : field === 'endDate' ? 'End Date' : 'Deadline'}</label>
                  <input type="date" name={field} value={(formData as Record<string,string>)[field]} onChange={handleInputChange} className={formFieldClass} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Client Information */}
          <SectionCard emoji="👤" title="CLIENT INFORMATION" colorClass="text-cyan-400">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Client Name</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange}
                  placeholder="e.g. Acme Corp" className={formFieldClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleInputChange}
                    placeholder="hello@acme.com" className={formFieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567" className={formFieldClass} />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Project Links */}
          <SectionCard emoji="🔗" title="PROJECT LINKS" colorClass="text-purple-400">
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Preview Link</label>
                <input type="url" name="previewLink" value={formData.previewLink} onChange={handleInputChange}
                  placeholder="https://preview.yourproject.com" className={formFieldClass} />
              </div>
              <div>
                <label className={labelClass}>Resource Links</label>
                <div className="space-y-3 mb-3">
                  <input type="text" placeholder="Link title (e.g. GitHub Repo)"
                    value={newLink.title} onChange={e => setNewLink(p => ({ ...p, title: e.target.value }))}
                    className={formFieldClass} />
                  <div className="flex gap-2">
                    <input type="url" placeholder="https://github.com/..."
                      value={newLink.url} onChange={e => setNewLink(p => ({ ...p, url: e.target.value }))}
                      className={`${formFieldClass} flex-1`} />
                    <button type="button" onClick={handleAddLink}
                      disabled={!newLink.title || !newLink.url}
                      className="px-4 py-2.5 bg-primary hover:bg-primary/80 disabled:opacity-40 text-white rounded-xl transition-all flex-shrink-0">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                {resourceLinks.length === 0 ? (
                  <p className="text-sm text-muted-foreground bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl">No resource links yet.</p>
                ) : (
                  <div className="space-y-2">
                    {resourceLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-primary/[0.08] border border-primary/20 p-3 rounded-xl">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{link.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveLink(idx)}
                          className="ml-2 p-1 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Project Strategy */}
          <SectionCard emoji="🎯" title="PROJECT STRATEGY" colorClass="text-amber-400">
            <div className="space-y-4">
              {[
                { name: 'shortOverview', label: 'Short Overview', placeholder: 'A concise 1-2 sentence summary of what this project is and why it matters.' },
                { name: 'businessGoal', label: 'Business Goal', placeholder: 'What business outcome does this project achieve? e.g. Increase conversion by 20%.' },
                { name: 'targetAudience', label: 'Target Audience', placeholder: 'Who is this project designed for? Describe the primary users.' },
                { name: 'competitors', label: 'Competitors (optional)', placeholder: 'List competing products or alternatives, e.g. Notion, Linear, Asana.' },
              ].map(field => (
                <div key={field.name}>
                  <label className={labelClass}>{field.label}</label>
                  <textarea name={field.name} value={(formData as Record<string,string>)[field.name]} onChange={handleInputChange}
                    placeholder={field.placeholder} rows={3}
                    className={`${formFieldClass} resize-none`} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Tags */}
          <SectionCard emoji="🏷️" title="PROJECT TAGS" colorClass="text-emerald-400">
            <div>
              <label className={labelClass}>Tags (comma-separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleInputChange}
                placeholder="design, mobile, core" className={formFieldClass} />
            </div>
          </SectionCard>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-2 pb-12">
            <Link href="/projects">
              <button type="button" className="px-8 py-3 border border-white/10 rounded-xl text-foreground hover:bg-white/[0.06] transition-all font-medium">
                Cancel
              </button>
            </Link>
            <button type="submit" disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl disabled:opacity-50 shadow-lg shadow-indigo-500/20 transition-all font-semibold flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : '✨ Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
