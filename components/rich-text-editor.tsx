'use client';

import './rich-text-editor.css';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { FontFamily } from '@tiptap/extension-font-family';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  
  List, ListOrdered, CheckSquare, Quote, Minus, Undo2, Redo2,
  Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Palette, Highlighter, Type, Maximize2, Minimize2,
  Download, Subscript as SubIcon, Superscript as SupIcon,
  FileCode, FileText, FileDown
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing your project description...' }: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: { HTMLAttributes: { class: 'editor-code-block' } },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'editor-image' },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder }),
      Subscript,
      Superscript,
      FontFamily,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Auto-save with debounce
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(() => {
        onChange(html);
      }, 500);
    },
  });

  // Sync content from parent
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
  }, []);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const exportAs = (format: 'html' | 'markdown' | 'text') => {
    if (!editor) return;
    let content = '';
    let filename = 'document';
    let mimeType = 'text/plain';

    switch (format) {
      case 'html':
        content = editor.getHTML();
        filename = 'document.html';
        mimeType = 'text/html';
        break;
      case 'text':
        content = editor.getText();
        filename = 'document.txt';
        break;
      case 'markdown':
        // Basic HTML to Markdown conversion
        content = editor.getText();
        filename = 'document.md';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  if (!editor) return null;

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#94a3b8'];
  const highlightColors = ['#fef08a', '#bbf7d0', '#bae6fd', '#ddd6fe', '#fecdd3', '#fed7aa'];
  const fonts = ['Default', 'Inter', 'Georgia', 'Courier New', 'Comic Sans MS', 'Arial', 'Times New Roman'];

  const ToolbarButton = ({ onClick, active, title, children, className = '' }: {
    onClick: () => void; active?: boolean; title: string; children: React.ReactNode; className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-all ${
        active
          ? 'bg-primary/20 text-primary shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
      } ${className}`}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => <div className="w-px h-5 bg-white/10 mx-1" />;

  return (
    <div
      ref={editorContainerRef}
      className={`editor-wrapper ${isFullscreen ? 'editor-fullscreen' : ''}`}
    >
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="flex items-center gap-0.5 flex-wrap">
          {/* Heading Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            >
              <Type size={14} />
              <span>Heading</span>
            </button>
            {showHeadingMenu && (
              <div className="absolute top-full left-0 mt-1 glass-modal rounded-lg p-1 z-50 min-w-[120px]">
                <button type="button" onClick={() => { editor.chain().focus().setParagraph().run(); setShowHeadingMenu(false); }} className="block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-white/10 text-foreground">Paragraph</button>
                {([1, 2, 3, 4, 5, 6] as const).map(level => (
                  <button key={level} type="button" onClick={() => { editor.chain().focus().toggleHeading({ level }).run(); setShowHeadingMenu(false); }}
                    className={`block w-full text-left px-3 py-1.5 rounded hover:bg-white/10 ${editor.isActive('heading', { level }) ? 'text-primary' : 'text-foreground'}`}
                    style={{ fontSize: `${1.2 - level * 0.1}rem`, fontWeight: 'bold' }}
                  >
                    H{level}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Family */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            >
              <span>Font</span>
            </button>
            {showFontMenu && (
              <div className="absolute top-full left-0 mt-1 glass-modal rounded-lg p-1 z-50 min-w-[160px]">
                {fonts.map(font => (
                  <button key={font} type="button"
                    onClick={() => { font === 'Default' ? editor.chain().focus().unsetFontFamily().run() : editor.chain().focus().setFontFamily(font).run(); setShowFontMenu(false); }}
                    className="block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-white/10 text-foreground"
                    style={{ fontFamily: font === 'Default' ? 'inherit' : font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ToolbarDivider />

          {/* Inline Formatting */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)">
            <UnderlineIcon size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} title="Superscript">
            <SupIcon size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} title="Subscript">
            <SubIcon size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
            <Code size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Color */}
          <div className="relative">
            <ToolbarButton onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }} title="Text Color">
              <Palette size={15} />
            </ToolbarButton>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 glass-modal rounded-lg p-2 z-50 flex gap-1 flex-wrap w-36">
                {colors.map(color => (
                  <button key={color} type="button" onClick={() => { editor.chain().focus().setColor(color).run(); setShowColorPicker(false); }}
                    className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <button type="button" onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 w-full text-center"
                >Reset</button>
              </div>
            )}
          </div>

          {/* Highlight */}
          <div className="relative">
            <ToolbarButton onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }} title="Highlight">
              <Highlighter size={15} />
            </ToolbarButton>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 glass-modal rounded-lg p-2 z-50 flex gap-1 flex-wrap w-36">
                {highlightColors.map(color => (
                  <button key={color} type="button" onClick={() => { editor.chain().focus().toggleHighlight({ color }).run(); setShowHighlightPicker(false); }}
                    className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <button type="button" onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightPicker(false); }}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 w-full text-center"
                >Reset</button>
              </div>
            )}
          </div>

          <ToolbarDivider />

          {/* Alignment */}
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <AlignLeft size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
            <AlignCenter size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
            <AlignRight size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
            <AlignJustify size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
            <ListOrdered size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Task List">
            <CheckSquare size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Blocks */}
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
            <Quote size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
            <FileCode size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
            <Minus size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Insert */}
          <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Add Link">
            <LinkIcon size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="Add Image">
            <ImageIcon size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={insertTable} title="Insert Table">
            <TableIcon size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Undo/Redo */}
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)">
            <Undo2 size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)">
            <Redo2 size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Export */}
          <div className="relative">
            <ToolbarButton onClick={() => setShowExportMenu(!showExportMenu)} title="Export">
              <Download size={15} />
            </ToolbarButton>
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1 glass-modal rounded-lg p-1 z-50 min-w-[140px]">
                <button type="button" onClick={() => exportAs('html')} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-white/10 text-foreground">
                  <FileCode size={14} /> HTML
                </button>
                <button type="button" onClick={() => exportAs('markdown')} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-white/10 text-foreground">
                  <FileDown size={14} /> Markdown
                </button>
                <button type="button" onClick={() => exportAs('text')} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-white/10 text-foreground">
                  <FileText size={14} /> Plain Text
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <ToolbarButton
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="editor-body">
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="editor-statusbar">
        <span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} characters</span>
        <span>•</span>
        <span>{editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words</span>
        <span className="ml-auto text-green-400 text-xs">Auto-save enabled</span>
      </div>
    </div>
  );
}
