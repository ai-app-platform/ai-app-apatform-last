import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, Badge } from '../components/ui';
import { memoryManager, type LongTermMemory, type MemoryEvent } from '../engine/ContextEngine';
import { Brain, Database, Archive, FileText, Lightbulb, Shield, BookOpen } from 'lucide-react';

// ============================================
// Memory Detail Page
// ============================================
export function MemoryDetailPage() {
  const [longTermMemories, setLongTermMemories] = useState<LongTermMemory[]>([]);
  const [events, setEvents] = useState<MemoryEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'long-term' | 'runtime' | 'events'>('long-term');

  useEffect(() => {
    memoryManager.initMockData();
    setLongTermMemories(memoryManager.getLongTermMemories());
    setEvents(memoryManager.getEvents());
  }, []);

  const categoryIcons: Record<string, React.ReactNode> = {
    pattern: <Lightbulb className="w-4 h-4 text-amber-400" />,
    decision: <Shield className="w-4 h-4 text-indigo-400" />,
    lesson: <BookOpen className="w-4 h-4 text-emerald-400" />,
    convention: <FileText className="w-4 h-4 text-purple-400" />,
  };

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours} ساعت پیش`;
    return `${Math.floor(hours / 24)} روز پیش`;
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Memory Management" description="مدیریت حافظه Runtime و Long-Term" />

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'long-term' as const, label: 'Long-Term Memory', icon: <Database className="w-4 h-4" /> },
          { id: 'runtime' as const, label: 'Runtime Memory', icon: <Brain className="w-4 h-4" /> },
          { id: 'events' as const, label: 'Memory Events', icon: <Archive className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Long-Term Memory */}
      {activeTab === 'long-term' && (
        <div className="space-y-3">
          {longTermMemories.length === 0 ? (
            <Card className="p-8 text-center">
              <Database className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">حافظه Long-Term خالی است</p>
            </Card>
          ) : (
            longTermMemories.map(mem => (
              <Card key={mem.id} className="p-4 hover:border-indigo-500/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center shrink-0">
                    {categoryIcons[mem.category]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={mem.category === 'decision' ? 'info' : mem.category === 'lesson' ? 'success' : mem.category === 'pattern' ? 'warning' : 'purple'}>
                        {mem.category}
                      </Badge>
                      {mem.validated && <Badge variant="success">✓ Validated</Badge>}
                      {mem.indexedInRAG && <Badge variant="purple">RAG Indexed</Badge>}
                    </div>
                    <p className="text-sm text-zinc-200">{mem.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                      <span>Project: {mem.projectId}</span>
                      <span dir="ltr">Source: {mem.source}</span>
                      <span>{formatTime(mem.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Runtime Memory */}
      {activeTab === 'runtime' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-white mb-3">Active Memory Structure</h3>
            <div className="code-block text-xs">
{`.ai/runtime/
├── current-task.md      — وضعیت Task جاری
├── current-plan.md      — Plan فعلی
├── discoveries.md       — کشفیات Agent
├── decisions.md         — تصمیمات گرفته‌شده
├── touched-files.md     — فایل‌های تغییر یافته
├── test-results.md      — نتایج تست
└── task-summary.md      — خلاصه Task`}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-bold text-white mb-3">Memory Lifecycle</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Task Execution', color: 'bg-blue-500/20 text-blue-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Runtime Events', color: 'bg-amber-500/20 text-amber-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Active Memory', color: 'bg-purple-500/20 text-purple-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Task Summary', color: 'bg-indigo-500/20 text-indigo-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'Long-Term Memory', color: 'bg-emerald-500/20 text-emerald-300' },
                { label: '→', color: 'text-zinc-600' },
                { label: 'RAG Index', color: 'bg-pink-500/20 text-pink-300' },
              ].map((item, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${item.color}`}>
                  {item.label}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-300">◆ RAG ≠ Memory Source of Truth</p>
              <p className="text-xs text-zinc-400 mt-1">حافظه Long-Term روی Disk نگهداری می‌شود. RAG فقط لایه Retrieval است.</p>
            </div>
          </Card>
        </div>
      )}

      {/* Events */}
      {activeTab === 'events' && (
        <div className="space-y-2">
          {events.length === 0 ? (
            <Card className="p-8 text-center">
              <Archive className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-400">رویداد حافظه‌ای ثبت نشده</p>
              <p className="text-xs text-zinc-500 mt-1">پس از اجرای یک Task، رویدادها اینجا نمایش داده می‌شوند</p>
            </Card>
          ) : (
            events.map(event => (
              <Card key={event.id} className="p-3">
                <div className="flex items-center gap-3">
                  <Badge variant={event.type === 'decision' ? 'info' : event.type === 'discovery' ? 'success' : event.type === 'error' ? 'error' : 'default'}>
                    {event.type}
                  </Badge>
                  <span className="text-sm text-zinc-200 flex-1">{event.content}</span>
                  <span className="text-xs text-zinc-500">{formatTime(event.timestamp)}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// Execution Trace Page
// ============================================
export function ExecutionTracePage() {
  const { tasks, projects, agents } = useStore();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const selectedProject = selectedTask ? projects.find(p => p.id === selectedTask.projectId) : null;

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Execution Trace" description="ردیابی و بازتولید اجرای Taskها" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Task List */}
        <Card className="xl:col-span-1 p-5">
          <h3 className="text-sm font-bold text-white mb-3">Taskها</h3>
          <div className="space-y-2">
            {tasks.map(task => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full text-right p-3 rounded-lg border transition-all ${
                    selectedTaskId === task.id
                      ? 'border-indigo-500/50 bg-indigo-500/10'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-800/20'
                  }`}
                >
                  <div className="text-sm text-zinc-200">{task.title}</div>
                  <div className="text-xs text-zinc-500 mt-1">{project?.name} • v{task.version}</div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Trace Detail */}
        <div className="xl:col-span-3 space-y-4">
          {selectedTask ? (
            <>
              {/* Trace Header */}
              <Card className="p-5">
                <h3 className="text-base font-bold text-white mb-3">{selectedTask.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500">Project</span>
                    <p className="text-zinc-200">{selectedProject?.name}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Branch</span>
                    <p className="text-zinc-200 font-mono" dir="ltr">{selectedTask.branch || '—'}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Workflow</span>
                    <p className="text-zinc-200">{selectedTask.workflowId || '—'}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Version</span>
                    <p className="text-zinc-200">v{selectedTask.version}</p>
                  </div>
                </div>
              </Card>

              {/* Execution Trace */}
              <Card className="p-5">
                <h3 className="text-sm font-bold text-white mb-3">Execution Trace</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Project Resolution', value: selectedProject?.name || '—', status: 'done' },
                    { label: 'Workspace Preparation', value: `/workspace/${selectedTask.projectId}`, status: 'done' },
                    { label: 'Task Branch', value: selectedTask.branch || 'feature/task-branch', status: 'done' },
                    { label: 'Knowledge Resolution', value: '3 knowledge entries resolved', status: 'done' },
                    { label: 'Agent Team', value: `${selectedTask.assignedAgents.length} agents`, status: 'done' },
                    { label: 'Workflow', value: selectedTask.workflowId || 'software-development', status: 'done' },
                    { label: 'Context Assembly', value: '~2400 tokens', status: 'done' },
                    { label: 'Planning', value: selectedTask.plan ? `${selectedTask.plan.steps.length} steps` : '—', status: selectedTask.plan ? 'done' : 'skipped' },
                    { label: 'Agent Selection', value: selectedTask.plan ? `${selectedTask.plan.selectedAgents.length} selected` : '—', status: selectedTask.plan ? 'done' : 'skipped' },
                    { label: 'Execution', value: selectedTask.status === 'completed' ? 'Completed' : selectedTask.status === 'failed' ? 'Failed' : 'In Progress', status: selectedTask.status === 'completed' ? 'done' : selectedTask.status === 'failed' ? 'error' : 'pending' },
                    { label: 'Build/Test', value: selectedTask.result?.testResults ? `${selectedTask.result.testResults.passed}/${selectedTask.result.testResults.total} passed` : '—', status: selectedTask.result ? 'done' : 'skipped' },
                    { label: 'Commit', value: selectedTask.result?.commitSha || '—', status: selectedTask.result?.commitSha ? 'done' : 'skipped' },
                    { label: 'Pull Request', value: selectedTask.result?.prUrl || '—', status: selectedTask.result?.prUrl ? 'done' : 'skipped' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/20">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        item.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                        item.status === 'error' ? 'bg-red-500/20 text-red-400' :
                        item.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-zinc-700/50 text-zinc-500'
                      }`}>
                        {item.status === 'done' ? '✓' : item.status === 'error' ? '✗' : item.status === 'pending' ? '◉' : '—'}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-zinc-200">{item.label}</span>
                      </div>
                      <span className="text-xs text-zinc-400 font-mono" dir="ltr">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Reproducibility Info */}
              <Card className="p-5">
                <h3 className="text-sm font-bold text-white mb-3">Reproducibility Snapshot</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: 'Agent Versions', value: selectedTask.assignedAgents.map(id => {
                      const a = agents.find(ag => ag.id === id);
                      return a ? `${a.name}:v${a.version}` : id;
                    }).join(', ') || '—' },
                    { label: 'Workflow Version', value: `v${selectedTask.version}` },
                    { label: 'Knowledge Version', value: 'Platform v2, Project v3' },
                    { label: 'RAG Index Version', value: 'v1.5.0' },
                    { label: 'Parser Version', value: 'v2.1.0' },
                    { label: 'Embedding Model', value: 'text-embedding-3-small' },
                    { label: 'Model Config', value: 'gpt-4o, temp=0.2' },
                    { label: 'Context Snapshot', value: '2,400 tokens, 9 sources' },
                    { label: 'Team Version', value: 'v2' },
                  ].map((item, i) => (
                    <div key={i} className="p-2 bg-zinc-800/20 rounded-lg">
                      <span className="text-zinc-500 block">{item.label}</span>
                      <span className="text-zinc-200 font-mono text-[10px]" dir="ltr">{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-zinc-400">یک Task انتخاب کنید</h3>
              <p className="text-sm text-zinc-500 mt-1">Execution Trace و اطلاعات Reproducibility نمایش داده خواهد شد</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
