import { useState } from 'react';
import { sections } from '../data/sections';
import { Card, Badge } from '../components/ui';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export default function ArchitecturePage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('a1');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = (content: any, index: number) => {
    switch (content.type) {
      case 'paragraph':
        return <p key={index} className="my-2 text-sm leading-7 text-zinc-300">{content.text}</p>;
      case 'heading':
        return content.level === 2
          ? <h2 key={index} className="text-lg font-bold text-white mt-6 mb-2">{content.text}</h2>
          : <h3 key={index} className="text-sm font-semibold text-indigo-300 mt-4 mb-1">{content.text}</h3>;
      case 'code':
        return (
          <div key={index} className="my-3">
            <pre className="text-xs leading-6 bg-[#0d0f16] border border-zinc-800 rounded-lg p-3 overflow-x-auto text-zinc-300 font-mono" dir="ltr">{content.text}</pre>
          </div>
        );
      case 'tree':
        return (
          <div key={index} className="my-3">
            <pre className="text-xs leading-6 bg-[#0d0f16] border border-zinc-800 rounded-lg p-3 overflow-x-auto text-indigo-300 font-mono" dir="ltr">{content.text}</pre>
          </div>
        );
      case 'list':
        return (
          <ul key={index} className="my-2 space-y-1 pr-4">
            {content.items.map((item: string, i: number) => (
              <li key={i} className="text-sm text-zinc-300 leading-7 list-disc">{item}</li>
            ))}
          </ul>
        );
      case 'numbered-list':
        return (
          <ol key={index} className="my-2 space-y-1 pr-4 list-decimal">
            {content.items.map((item: string, i: number) => (
              <li key={i} className="text-sm text-zinc-300 leading-7">{item}</li>
            ))}
          </ol>
        );
      case 'table':
        return (
          <div key={index} className="my-3 overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-sm" dir="ltr">
              <thead>
                <tr className="bg-zinc-800/50">
                  {content.headers.map((h: string, i: number) => (
                    <th key={i} className="px-3 py-2 text-right text-xs font-semibold text-zinc-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row: string[], ri: number) => (
                  <tr key={ri} className="border-t border-zinc-800/40">
                    {row.map((cell: string, ci: number) => (
                      <td key={ci} className="px-3 py-2 text-zinc-300">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'highlight':
        return (
          <div key={index} className="my-3 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg text-sm text-indigo-200">
            <span className="text-indigo-400 font-bold">◆ </span>{content.text}
          </div>
        );
      case 'invariants':
        return (
          <div key={index} className="my-3 space-y-1.5">
            {content.items.map((item: string, i: number) => (
              <div key={i} className="border-r-3 border-indigo-500 pr-3 py-1.5 bg-indigo-500/5 rounded-r-lg text-sm text-zinc-300" style={{ borderRight: '3px solid #6366f1' }}>
                <span className="text-indigo-400 font-bold ml-2">{i + 1}.</span>{item}
              </div>
            ))}
          </div>
        );
      case 'blockquote':
        return (
          <div key={index} className="my-3 border-r-4 border-indigo-500 bg-indigo-500/5 rounded-l-lg px-4 py-2 text-sm text-indigo-100">
            {content.text}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">سند مرجع معماری</h1>
          <p className="text-sm text-zinc-400">AI App Platform — سند کامل معماری سیستم</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Section Navigation */}
        {sidebarOpen && (
          <div className="hidden xl:block w-64 shrink-0">
            <Card className="p-3 sticky top-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="text-xs text-zinc-500 font-semibold px-2 py-1.5 mb-1">بخش A — معماری کلی</div>
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setExpandedSection(s.id)}
                  className={`w-full text-right px-2 py-1.5 rounded text-xs transition-colors ${
                    expandedSection === s.id ? 'bg-indigo-500/10 text-indigo-300' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <span className="font-mono text-zinc-600 ml-1">{s.number}</span>
                  {s.title}
                </button>
              ))}
            </Card>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {sections.map(section => (
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="purple">{section.number}</Badge>
                  <h2 className="text-base font-bold text-white">{section.title}</h2>
                </div>
                {expandedSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-400" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="px-5 pb-5 border-t border-zinc-800/40">
                  {section.content.map((c, i) => renderContent(c, i))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
