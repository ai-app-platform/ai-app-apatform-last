import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, StatusBadge, Badge, Modal } from '../components/ui';
import { Wrench, Plus, Code, Search, FileText, Terminal, Shield, Database } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  code: <Code className="w-5 h-5" />,
  git: <Terminal className="w-5 h-5" />,
  build: <Terminal className="w-5 h-5" />,
  test: <Shield className="w-5 h-5" />,
  search: <Search className="w-5 h-5" />,
  file: <FileText className="w-5 h-5" />,
  external: <Database className="w-5 h-5" />,
  context: <Database className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  code: 'text-blue-400 bg-blue-500/10',
  git: 'text-orange-400 bg-orange-500/10',
  build: 'text-emerald-400 bg-emerald-500/10',
  test: 'text-purple-400 bg-purple-500/10',
  search: 'text-cyan-400 bg-cyan-500/10',
  file: 'text-amber-400 bg-amber-500/10',
  external: 'text-pink-400 bg-pink-500/10',
  context: 'text-indigo-400 bg-indigo-500/10',
};

export default function ToolsPage() {
  const { tools, connectors, fetchTools, fetchConnectors } = useStore();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTools();
    fetchConnectors();
  }, []);

  const filtered = filter === 'all' ? tools : tools.filter(t => t.category === filter);
  const selected = tools.find(t => t.id === selectedTool);
  const categories = [...new Set(tools.map(t => t.category))];

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Toolها"
        description="مدیریت Toolهای قابل استفاده توسط Agentها"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Tool جدید
          </button>
        }
      />

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === 'all' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'}`}>
          همه ({tools.length})
        </button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === cat ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'}`}>
            {cat} ({tools.filter(t => t.category === cat).length})
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((tool) => (
          <Card key={tool.id} className="p-5 hover:border-indigo-500/30 transition-all cursor-pointer" >
            <div onClick={() => setSelectedTool(tool.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[tool.category]}`}>
                  {categoryIcons[tool.category]}
                </div>
                <StatusBadge status={tool.status} />
              </div>
              <h3 className="text-sm font-bold text-white font-mono mb-1" dir="ltr">{tool.name}</h3>
              <p className="text-xs text-zinc-400 mb-3">{tool.description}</p>
              <div className="flex items-center gap-2">
                <Badge>{tool.category}</Badge>
                {tool.connectorId && (
                  <Badge variant="purple">
                    {connectors.find(c => c.id === tool.connectorId)?.name}
                  </Badge>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-800/60">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {tool.permissions.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-zinc-800/50 rounded text-zinc-400">
                      {p.action}:{p.scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tool Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelectedTool(null)} title={selected?.name || ''} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categoryColors[selected.category]}`}>
                {categoryIcons[selected.category]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono" dir="ltr">{selected.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge>{selected.category}</Badge>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-300">{selected.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Input Schema</h4>
                <pre className="text-xs text-zinc-300 bg-zinc-900/50 p-3 rounded-lg overflow-auto" dir="ltr">
                  {JSON.stringify(selected.schema.input, null, 2)}
                </pre>
              </Card>
              <Card className="p-4">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Output Schema</h4>
                <pre className="text-xs text-zinc-300 bg-zinc-900/50 p-3 rounded-lg overflow-auto" dir="ltr">
                  {JSON.stringify(selected.schema.output, null, 2)}
                </pre>
              </Card>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {selected.permissions.map((p, i) => (
                  <Badge key={i} variant="info">{p.action} : {p.scope}</Badge>
                ))}
              </div>
            </div>

            {selected.connectorId && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Connector</h4>
                <Badge variant="purple">{connectors.find(c => c.id === selected.connectorId)?.name}</Badge>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
