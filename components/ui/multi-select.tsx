'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Settings, Plus, Trash2, ChevronDown, Check, Loader2 } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  selected: string[];
  onChange: (selected: string[]) => void;
  type: 'tech' | 'tool';
  placeholder?: string;
  required?: boolean;
}

export function MultiSelect({
  label,
  selected = [],
  onChange,
  type,
  placeholder = 'Select options...',
  required = false,
}: MultiSelectProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isManaging, setIsManaging] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [manageSearch, setManageSearch] = useState('');
  const [apiError, setApiError] = useState('');
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Fetch options on mount
  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoading(true);
        const res = await fetch(`/api/options?type=${type}`);
        if (res.ok) {
          const data = await res.json();
          setOptions(data);
        }
      } catch (err) {
        console.error('Failed to load options:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, [type]);

  // Open dropdown and compute position from trigger bounding rect
  const openDropdown = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(true);
  };

  // Close on outside click or scroll
  useEffect(() => {
    if (!isOpen) return;

    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setIsOpen(false);
    }

    function handleScroll(e: Event) {
      // Ignore scroll events that happen inside the dropdown list itself
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    }

    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleToggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleRemoveOption = (e: React.MouseEvent, option: string) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== option));
  };

  const handleAddOption = async (optionName: string) => {
    const trimmed = optionName.trim();
    if (!trimmed) return;

    try {
      setApiError('');
      const res = await fetch('/api/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name: trimmed }),
      });

      if (res.ok) {
        if (!options.includes(trimmed)) {
          setOptions((prev) => [...prev, trimmed].sort((a, b) => a.localeCompare(b)));
        }
        if (!selected.includes(trimmed)) {
          onChange([...selected, trimmed]);
        }
        setSearch('');
        setNewOption('');
      } else {
        const errorData = await res.json();
        setApiError(errorData.error || 'Failed to add option');
      }
    } catch (err) {
      setApiError('Failed to add option. Try again.');
      console.error(err);
    }
  };

  const handleDeleteOption = async (optionName: string) => {
    if (!confirm(`Are you sure you want to delete "${optionName}"? This will remove it from the available options.`)) {
      return;
    }

    try {
      setApiError('');
      const res = await fetch(`/api/options?type=${type}&name=${encodeURIComponent(optionName)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setOptions((prev) => prev.filter((o) => o !== optionName));
        onChange(selected.filter((s) => s !== optionName));
      } else {
        const errorData = await res.json();
        setApiError(errorData.error || 'Failed to delete option');
      }
    } catch (err) {
      setApiError('Failed to delete option. Try again.');
      console.error(err);
    }
  };

  const filteredOptions = options.filter(
    (opt) => opt.toLowerCase().includes(search.toLowerCase()) && !selected.includes(opt)
  );

  const managedOptionsFiltered = options.filter((opt) =>
    opt.toLowerCase().includes(manageSearch.toLowerCase())
  );

  const showAddBtn = search.trim() && !options.some((o) => o.toLowerCase() === search.trim().toLowerCase());

  const dropdown = isOpen && dropdownRect && mounted ? createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: dropdownRect.top,
        left: dropdownRect.left,
        width: dropdownRect.width,
        zIndex: 99999,
      }}
      className="rounded-xl border border-white/10 bg-slate-950 shadow-2xl overflow-hidden max-h-[320px] flex flex-col"
    >
      {/* Search Input */}
      <div className="p-3 border-b border-white/[0.06] flex items-center gap-2">
        <Search size={14} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="w-full bg-transparent border-0 p-0 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0"
        />
        {search && (
          <button type="button" onClick={() => setSearch('')} className="text-muted-foreground hover:text-white flex-shrink-0">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Options List */}
      <div className="flex-1 overflow-y-auto max-h-[220px]">
        {/* Selected Options */}
        {selected.length > 0 && search === '' && (
          <div className="p-1 border-b border-white/[0.04]">
            <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Selected</div>
            {selected.map((opt) => (
              <div
                key={opt}
                onClick={() => handleToggleOption(opt)}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/10 text-primary-foreground text-sm cursor-pointer hover:bg-primary/20 m-1 transition-all"
              >
                <span>{opt}</span>
                <Check size={14} className="text-indigo-400" />
              </div>
            ))}
          </div>
        )}

        {/* Available Options */}
        <div className="p-1">
          {selected.length > 0 && search === '' && (
            <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Available</div>
          )}
          {filteredOptions.length === 0 && !showAddBtn ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">No options available</div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt}
                onClick={() => handleToggleOption(opt)}
                className="flex items-center px-3 py-2 rounded-lg text-foreground text-sm cursor-pointer hover:bg-white/[0.06] m-0.5 transition-all"
              >
                {opt}
              </div>
            ))
          )}
          {showAddBtn && (
            <div
              onClick={() => handleAddOption(search)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-indigo-400 hover:text-indigo-300 text-sm cursor-pointer hover:bg-indigo-500/10 m-0.5 border border-dashed border-indigo-500/30 transition-all font-semibold"
            >
              <Plus size={14} />
              Add "{search}" to list
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-muted-foreground px-2">{options.length} options</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setIsManaging(true); setIsOpen(false); }}
          className="flex items-center gap-1 px-2.5 py-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all font-semibold"
        >
          <Settings size={12} />
          Manage Options
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-foreground/80 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={openDropdown}
        className="w-full min-h-[48px] px-4 py-2 border border-white/10 rounded-xl glass-input flex items-center justify-between gap-2 cursor-pointer hover:border-white/20 transition-all select-none"
      >
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          ) : (
            selected.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 border border-primary/30 text-indigo-300 rounded-lg text-xs font-semibold hover:bg-primary/35 transition-all"
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => handleRemoveOption(e, item)}
                  className="p-0.5 rounded-md hover:bg-white/10 text-indigo-300/70 hover:text-white transition-all"
                >
                  <X size={10} />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground flex-shrink-0">
          {loading && <Loader2 size={14} className="animate-spin text-primary" />}
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Portal dropdown */}
      {dropdown}

      {/* Manage Options Modal */}
      {isManaging && mounted && createPortal(
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-slate-900 border border-white/10 p-6 flex flex-col rounded-2xl max-h-[90vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                ⚙️ Manage {type === 'tech' ? 'Tech Stack' : 'Tools Used'} List
              </h3>
              <button
                type="button"
                onClick={() => { setIsManaging(false); setManageSearch(''); setNewOption(''); setApiError(''); }}
                className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {apiError && (
              <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                ⚠️ {apiError}
              </div>
            )}

            <div className="mb-4 flex gap-2">
              <input
                type="text"
                placeholder={`Add new ${type === 'tech' ? 'technology' : 'tool'}...`}
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddOption(newOption)}
                className="flex-1 px-3 py-2 border border-white/10 rounded-xl bg-white/[0.04] text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => handleAddOption(newOption)}
                disabled={!newOption.trim()}
                className="px-4 py-2 bg-primary hover:bg-primary/80 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search database..."
                value={manageSearch}
                onChange={(e) => setManageSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-white/10 rounded-xl bg-white/[0.04] text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-2 max-h-[250px]">
              {managedOptionsFiltered.length === 0 ? (
                <p className="text-xs text-center py-6 text-muted-foreground">No options found</p>
              ) : (
                managedOptionsFiltered.map((opt) => (
                  <div key={opt} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/[0.04] text-sm text-foreground transition-all group">
                    <span className="font-medium">{opt}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(opt)}
                      className="p-1 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex justify-end">
              <button
                type="button"
                onClick={() => { setIsManaging(false); setManageSearch(''); setNewOption(''); setApiError(''); }}
                className="px-5 py-2 bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] text-foreground text-sm font-semibold rounded-xl transition-all"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
