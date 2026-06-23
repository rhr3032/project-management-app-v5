'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Plus, Bold, Italic, Underline, Strikethrough } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    company: '',
    description: '',
  });
  const [resourceLinks, setResourceLinks] = useState<Array<{ url: string; title: string }>>([]);
  const [newLink, setNewLink] = useState({ url: '', title: '' });
  const [loading, setLoading] = useState(false);

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
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          resourceLinks,
          tags: formData.tags.split(',').map(t => t.trim()),
        }),
      });
      if (response.ok) {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Beautiful Header */}
      <div className="bg-gradient-to-r from-primary via-blue-500 to-cyan-500 text-white p-8 md:p-12 animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          <Link href="/projects">
            <button className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-smooth">
              <ChevronLeft size={20} />
              Back to Projects
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Create New Project</h1>
          <p className="text-white/90 text-lg">Add a new project to your workspace and start collaborating</p>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeInUp">

          {/* Project Info Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-smooth">
          <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            PROJECT INFORMATION
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Redesign Onboarding Flow"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>UI/UX Design</option>
                  <option>Web App</option>
                  <option>Mobile App</option>
                  <option>Logo</option>
                  <option>Branding</option>
                  <option>Illustration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>Review</option>
                  <option>On Hold</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Effort <span className="text-red-500">*</span>
                </label>
                <select
                  name="effort"
                  value={formData.effort}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>XS</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Device</label>
                <select
                  name="device"
                  value={formData.device}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Desktop</option>
                  <option>Mobile</option>
                  <option>Tablet</option>
                  <option>TV</option>
                  <option>Post</option>
                  <option>Car</option>
                  <option>Watch</option>
                  <option>All</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Owner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-smooth">
          <h2 className="text-lg font-bold text-rose-700 mb-6 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            PROJECT TIMELINE
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Client Section */}
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-smooth">
          <h2 className="text-lg font-bold text-cyan-700 mb-6 flex items-center gap-2">
            <span className="text-2xl">👤</span>
            CLIENT INFORMATION
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  placeholder="e.g. hello@acme.com"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  placeholder="e.g. +1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-smooth">
          <h2 className="text-lg font-bold text-purple-700 mb-6 flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            PROJECT LINKS
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Preview Link</label>
              <input
                type="url"
                name="previewLink"
                value={formData.previewLink}
                onChange={handleInputChange}
                placeholder="https://preview.yourproject.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Resource Links</label>

              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Link title (e.g., GitHub Repo)"
                  value={newLink.title}
                  onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Link URL (e.g., https://github.com/...)"
                    value={newLink.url}
                    onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <Button
                    type="button"
                    onClick={handleAddLink}
                    disabled={!newLink.title || !newLink.url}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {resourceLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">No resource links yet. Add one above.</p>
              ) : (
                <div className="space-y-2">
                  {resourceLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-blue-50 p-3 rounded-lg border border-primary/20">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{link.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="text-muted-foreground hover:text-red-500 text-lg font-bold ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Strategy Section */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-smooth">
          <h2 className="text-lg font-bold text-yellow-700 mb-6 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            PROJECT STRATEGY
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Short Overview</label>
              <textarea
                name="shortOverview"
                value={formData.shortOverview}
                onChange={handleInputChange}
                placeholder="A concise 1-2 sentence summary of what this project is and why it matters."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Business Goal</label>
              <textarea
                name="businessGoal"
                value={formData.businessGoal}
                onChange={handleInputChange}
                placeholder="What business outcome does this project achieve? e.g. Increase conversion by 20%."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Target Audience</label>
              <textarea
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="Who is this project designed for? Describe the primary users."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Competitors (optional)</label>
              <textarea
                name="competitors"
                value={formData.competitors}
                onChange={handleInputChange}
                placeholder="List competing products or alternatives, e.g. Notion, Linear, Asana."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
              />
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-smooth">
          <h2 className="text-lg font-bold text-green-700 mb-6 flex items-center gap-2">
            <span className="text-2xl">🏷️</span>
            PROJECT TAGS
          </h2>

          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="design, mobile, core (comma-separated)"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 pb-12">
          <Link href="/projects">
            <button
              type="button"
              className="px-8 py-3 border-2 border-muted rounded-lg text-foreground hover:bg-secondary hover:border-border transition-smooth font-semibold"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-blue-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-smooth font-semibold"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}
