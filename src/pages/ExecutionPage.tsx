import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, StatusBadge, Badge } from '../components/ui';
import { getExecutionEngine, type ExecutionState, type ExecutionLog } from '../engine/TaskExecutionEngine';
import { Play, Square, Terminal, Bot, FileText, CheckCircle2, AlertTriangle, Info, XCircle, Activity } from 'lucide-react';

export default function ExecutionPage() {
  const { tasks, projects } = useStore();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [executionState, setExecutionState] = useState<ExecutionState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const selectedTask = tasks.find(t => t.id === selectedTaskId);
  const selectedProject = selectedTask ? projects.find(p => p.id === selectedTask.projectId) : null;

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [executionState?.logs.length]);

  const startExecution = async () => {
    if (!selectedTaskId) return;
    setIsRunning(true);
    const engine = getExecutionEngine(selectedTaskId);
    
    engine.subscribe((state) => {
      setExecutionState({ ...state });
    });

    await engine.execute();
    setIsRunning(false);
  };

  const stopExecution = () => {
    if (!selectedTaskId) return;
    const engine = getExecutionEngine(selectedTaskId);
    engine.abort();
    setIsRunning(false);
  };

  const logIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'error': return <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />;
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'debug': return <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0" />;
      default: return <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
  };

  const phaseLabels: Record<string, string> = {
    idle: 'آماده',
    resolving_project: 'Resolve پروژه',
    preparing_workspace: 'آماده‌سازی Workspace',
    creating_branch: 'ایجاد Branch',
    resolving_knowledge: 'Resolve Knowledge',
    resolving_team: 'Resolve Team',
    resolving_workflow: 'Resolve Workflow',
    loading_context: 'بارگذاری Context',
    planning: 'برنامه‌ریزی',
    selecting_agents: 'انتخاب Agentها',
    building_graph: 'ساخت Execution Graph',
    executing: 'اجرای Agentها',
    validating: 'اعتبارسنجی',
    reviewing: 'بررسی کد',
    committing: 'Commit',
    pushing: 'Push',
    creating_pr: 'ایجاد PR',
    updating_memory: 'بروزرسانی Memory',
    completed: 'تکمیل شده',
    failed: 'ناموفق',
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Execution Monitor"
        description="مانیتورینگ لحظه‌ای اجرای Taskها و Agentها"
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Task Selection */}
        <Card className="xl:col-span-1 p-5">
          <h3 className="text-sm font-bold text-white mb-3">انتخاب Task</h3>
          <div className="space-y-2">
            {tasks.map(task => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <button
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setExecutionState(null);
                  }}
                  className={`w-full text-right p-3 rounded-lg border transition-all ${
                    selectedTaskId === task.id
                      ? 'border-indigo-500/50 bg-indigo-500/10'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-800/20'
                  }`}
                >
                  <div className="text-sm text-zinc-200 font-medium">{task.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500">{project?.name}</span>
                    <StatusBadge status={task.status} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          {selectedTask && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              {!isRunning ? (
                <button
                  onClick={startExecution}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  شروع اجرا
                </button>
              ) : (
                <button
                  onClick={stopExecution}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Square className="w-4 h-4" />
                  توقف
                </button>
              )}
            </div>
          )}
        </Card>

        {/* Execution View */}
        <div className="xl:col-span-3 space-y-4">
          {executionState ? (
            <>
              {/* Progress */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Activity className={`w-5 h-5 ${isRunning ? 'text-amber-400 animate-pulse' : executionState.phase === 'completed' ? 'text-emerald-400' : 'text-red-400'}`} />
                    <h3 className="text-base font-bold text-white">
                      {phaseLabels[executionState.phase] || executionState.phase}
                    </h3>
                  </div>
                  <div className="text-sm text-zinc-400">{executionState.progress}%</div>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      executionState.phase === 'failed' ? 'bg-red-500' :
                      executionState.phase === 'completed' ? 'bg-emerald-500' :
                      'bg-gradient-to-l from-indigo-500 to-purple-500'
                    }`}
                    style={{ width: `${executionState.progress}%` }}
                  />
                </div>
                {executionState.currentAgent && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-indigo-300">
                    <Bot className="w-4 h-4" />
                    <span>Agent فعال: {executionState.currentAgent}</span>
                  </div>
                )}
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">{executionState.logs.length}</div>
                  <div className="text-xs text-zinc-500">لاگ‌ها</div>
                </div>
                <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">{executionState.fileChanges.length}</div>
                  <div className="text-xs text-zinc-500">فایل تغییر یافته</div>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg text-center">
                  <div className="text-lg font-bold text-emerald-400">{executionState.testResults?.passed || 0}</div>
                  <div className="text-xs text-zinc-500">تست موفق</div>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-400">{executionState.testResults?.failed || 0}</div>
                  <div className="text-xs text-zinc-500">تست ناموفق</div>
                </div>
              </div>

              {/* Execution Log */}
              <Card className="p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-400" />
                  Execution Log
                </h3>
                <div className="bg-[#0a0c14] rounded-lg border border-zinc-800 p-4 max-h-96 overflow-y-auto font-mono text-xs space-y-1" dir="ltr">
                  {executionState.logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 py-0.5">
                      <span className="text-zinc-600 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                      </span>
                      {logIcon(log.level)}
                      <span className={`${
                        log.level === 'error' ? 'text-red-300' :
                        log.level === 'success' ? 'text-emerald-300' :
                        log.level === 'warning' ? 'text-amber-300' :
                        'text-zinc-300'
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </Card>

              {/* File Changes */}
              {executionState.fileChanges.length > 0 && (
                <Card className="p-5">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    تغییرات فایل
                  </h3>
                  <div className="space-y-1.5">
                    {executionState.fileChanges.map((fc, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-zinc-800/20 text-xs">
                        <div className="flex items-center gap-2">
                          <Badge variant={fc.action === 'created' ? 'success' : fc.action === 'deleted' ? 'error' : 'warning'}>
                            {fc.action}
                          </Badge>
                          <span className="text-zinc-300 font-mono" dir="ltr">{fc.path}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400">+{fc.linesAdded}</span>
                          <span className="text-red-400">-{fc.linesRemoved}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <Terminal className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-400 mb-2">
                {selectedTask ? 'آماده اجرا' : 'یک Task انتخاب کنید'}
              </h3>
              <p className="text-sm text-zinc-500">
                {selectedTask
                  ? 'برای شروع اجرای Task، دکمه "شروع اجرا" را بزنید'
                  : 'از لیست سمت راست یک Task را انتخاب کنید'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
