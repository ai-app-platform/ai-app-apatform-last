import { useState, useRef, useEffect } from 'react';
import { sections, type Section, type SectionContent } from './data/sections';

function CodeBlock({ text, label }: { text: string; label?: string }) {
  return (
    <div className="my-4">
      {label && (
        <div className="text-xs text-zinc-500 mb-1 font-medium">{label}</div>
      )}
      <div className="code-block">{text}</div>
    </div>
  );
}

function TreeBlock({ text, label }: { text: string; label?: string }) {
  return (
    <div className="my-4">
      {label && (
        <div className="text-xs text-zinc-500 mb-1 font-medium">{label}</div>
      )}
      <div className="tree-block">{text}</div>
    </div>
  );
}

function HighlightBox({ text }: { text: string }) {
  return (
    <div className="highlight-box my-4 text-sm leading-7">
      <span className="text-indigo-300 font-semibold">◆ </span>
      {text}
    </div>
  );
}

function BlockquoteBox({ text }: { text: string }) {
  return (
    <div className="my-4 border-r-4 border-indigo-500 bg-indigo-500/5 rounded-l-lg px-5 py-3 text-sm leading-8 text-indigo-100">
      {text}
    </div>
  );
}

function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-lg border border-zinc-800">
      <table className="doc-table" dir="ltr">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InvariantsList({ items }: { items: string[] }) {
  return (
    <div className="my-4 space-y-2">
      {items.map((item, i) => (
        <div key={i} className="invariant-item">
          <span className="text-indigo-400 font-bold ml-2">{i + 1}.</span>
          {item}
        </div>
      ))}
    </div>
  );
}

function renderContent(content: SectionContent, index: number) {
  switch (content.type) {
    case 'paragraph':
      return <p key={index} className="my-3 text-sm leading-8 text-zinc-300">{content.text}</p>;
    case 'heading':
      if (content.level === 2)
        return <h2 key={index} className="text-xl font-bold text-white mt-8 mb-3">{content.text}</h2>;
      return <h3 key={index} className="text-base font-semibold text-indigo-300 mt-6 mb-2">{content.text}</h3>;
    case 'code':
      return <CodeBlock key={index} text={content.text} label={content.label} />;
    case 'tree':
      return <TreeBlock key={index} text={content.text} label={content.label} />;
    case 'list':
      return (
        <ul key={index} className="my-3 space-y-1.5 pr-4">
          {content.items.map((item, i) => (
            <li key={i} className="text-sm text-zinc-300 leading-7 list-disc">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol key={index} className="my-3 space-y-1.5 pr-4 list-decimal">
          {content.items.map((item, i) => (
            <li key={i} className="text-sm text-zinc-300 leading-7">
              {item}
            </li>
          ))}
        </ol>
      );
    case 'table':
      return <DocTable key={index} headers={content.headers} rows={content.rows} />;
    case 'highlight':
      return <HighlightBox key={index} text={content.text} />;
    case 'invariants':
      return <InvariantsList key={index} items={content.items} />;
    case 'blockquote':
      return <BlockquoteBox key={index} text={content.text} />;
    default:
      return null;
  }
}

function SectionView({ section }: { section: Section }) {
  return (
    <div className="section-content" key={section.id}>
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-indigo-600/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
          {section.number}
        </span>
        <h2 className="text-2xl font-bold text-white">{section.title}</h2>
      </div>
      <div className="border-t border-zinc-800 pt-4">
        {section.content.map((c, i) => renderContent(c, i))}
      </div>
    </div>
  );
}

function Sidebar({ 
  activeSection, 
  onSelect, 
  isOpen,
  onClose 
}: { 
  activeSection: string; 
  onSelect: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed top-0 right-0 h-full w-80 bg-[#12141e] border-l border-zinc-800 
        overflow-y-auto z-50 transition-transform duration-300
        lg:static lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-[#12141e]/95 backdrop-blur-sm border-b border-zinc-800 p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">AI App Platform</h1>
              <p className="text-xs text-zinc-500">سند مرجع معماری</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3">
          <div className="text-xs text-zinc-500 font-semibold px-3 py-2 mb-1">بخش A — معماری کلی سیستم</div>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                onSelect(section.id);
                onClose();
              }}
              className={`sidebar-item w-full text-right px-3 py-2 rounded-lg text-sm flex items-start gap-2 ${
                activeSection === section.id ? 'active text-indigo-300' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-xs font-mono text-zinc-600 mt-0.5 shrink-0">{section.number}</span>
              <span className="leading-6">{section.title}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3 text-xs text-zinc-500">
      <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span>{current}/{total}</span>
    </div>
  );
}

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];
  const currentIndex = sections.findIndex(s => s.id === activeSectionId);

  const handleSelect = (id: string) => {
    setActiveSectionId(id);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const goNext = () => {
    if (currentIndex < sections.length - 1) {
      handleSelect(sections[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      handleSelect(sections[currentIndex - 1].id);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goNext();
      if (e.key === 'ArrowRight') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1117]">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSectionId} 
        onSelect={handleSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 border-b border-zinc-800 bg-[#0f1117]/95 backdrop-blur-sm px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">بخش {activeSection.number}</span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-xs text-zinc-500">{currentIndex + 1} از {sections.length}</span>
                </div>
              </div>
            </div>
            <ProgressBar current={currentIndex + 1} total={sections.length} />
          </div>
        </header>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8 lg:px-12">
            <SectionView section={activeSection} />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-800">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                بخش قبلی
              </button>
              <button
                onClick={goNext}
                disabled={currentIndex === sections.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                بخش بعدی
                <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
