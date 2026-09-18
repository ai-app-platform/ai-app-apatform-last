import { useState } from 'react';
import { Card, PageHeader, Badge } from '../components/ui';
import { contextEngine, type AssembledContext } from '../engine/ContextEngine';
import { Layers, Search, ArrowDown, FileText, Brain, Database, BookOpen } from 'lucide-react';

export default function ContextEnginePage() {
  const [assembledContext, setAssembledContext] = useState<AssembledContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskId] = useState('tk1');
  const [agentId] = useState('a2');

  const handleAssemble = async () => {
    setLoading(true);
    const ctx = await contextEngine.assembleContext(taskId, agentId, 'p1', 'پیاده‌سازی OAuth2 Login');
    setAssembledContext(ctx);
    setLoading(false);
  };

  const retrievalOrder = contextEngine.getRetrievalOrder();

  const levelColors: Record<number, string> = {
    1: 'border-emerald-500/30 bg-emerald-500/5',
    2: 'border-blue-500/30 bg-blue-500/5',
    3: 'border-purple-500/30 bg-purple-500/5',
  };

  const levelLabels: Record<number, string> = {
    1: 'Level 1 — Canonical Local Context',
    2: 'Level 2 — Current Codebase',
    3: 'Level 3 — Deep / Historical Retrieval',
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Context Engine" description="جمع‌آوری و Assembly Context برای Agentها" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Retrieval Strategy */}
        <Card className="xl:col-span-1 p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" />
            Context Retrieval Order
          </h3>
          <div className="space-y-2">
            {retrievalOrder.map(item => (
              <div key={item.step} className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-800/20">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm text-zinc-200">{item.source}</p>
                  <p className="text-xs text-zinc-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800">
            <button
              onClick={handleAssemble}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Layers className="w-4 h-4" />
              {loading ? 'در حال Assembly...' : 'Assemble Context'}
            </button>
          </div>

          <div className="mt-4 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
            <p className="text-xs text-indigo-300">◆ اصل Local-first: Context فقط باید شامل اطلاعات Relevant برای Task و Step جاری باشد.</p>
          </div>
        </Card>

        {/* Assembled Context */}
        <div className="xl:col-span-2 space-y-4">
          {assembledContext ? (
            <>
              {/* Context Stats */}
              <Card className="p-5">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
                    <div className="text-xl font-bold text-white">{assembledContext.sources.length}</div>
                    <div className="text-xs text-zinc-500">Sources</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
                    <div className="text-xl font-bold text-white">{assembledContext.tokenCount.toLocaleString()}</div>
                    <div className="text-xs text-zinc-500">Tokens</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-800/30 rounded-lg">
                    <div className="text-xl font-bold text-white">
                      {assembledContext.sources.filter(s => s.level === 1).length}/{assembledContext.sources.filter(s => s.level === 2).length}/{assembledContext.sources.filter(s => s.level === 3).length}
                    </div>
                    <div className="text-xs text-zinc-500">L1 / L2 / L3</div>
                  </div>
                </div>
              </Card>

              {/* Sources by Level */}
              {[1, 2, 3].map(level => {
                const levelSources = assembledContext.sources.filter(s => s.level === level);
                if (levelSources.length === 0) return null;
                return (
                  <Card key={level} className={`p-5 border ${levelColors[level]}`}>
                    <h4 className="text-xs font-bold text-zinc-300 mb-3 flex items-center gap-2">
                      {level === 1 ? <BookOpen className="w-4 h-4 text-emerald-400" /> :
                       level === 2 ? <FileText className="w-4 h-4 text-blue-400" /> :
                       <Database className="w-4 h-4 text-purple-400" />}
                      {levelLabels[level]}
                    </h4>
                    <div className="space-y-2">
                      {levelSources.map((source, i) => (
                        <div key={i} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/40">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-zinc-200">{source.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500">{(source.relevance * 100).toFixed(0)}%</span>
                              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${source.relevance * 100}%` }} />
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-mono" dir="ltr">{source.description}</p>
                          <pre className="mt-2 text-xs text-zinc-400 bg-[#0a0c14] p-2 rounded font-mono overflow-x-auto max-h-24" dir="ltr">
                            {source.data}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}

              {/* Final Prompt */}
              <Card className="p-5">
                <h4 className="text-xs font-bold text-zinc-300 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-amber-400" />
                  Final Model Input (Prompt)
                </h4>
                <pre className="text-xs text-zinc-300 bg-[#0a0c14] border border-zinc-800 rounded-lg p-4 overflow-x-auto max-h-64 font-mono leading-6" dir="ltr">
                  {assembledContext.finalPrompt}
                </pre>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-zinc-400">آماده Assembly</h3>
              <p className="text-sm text-zinc-500 mt-1">برای مشاهده Context Assembly، دکمه را بزنید</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
