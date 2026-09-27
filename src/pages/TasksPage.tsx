import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, StatusBadge, Badge, Modal, DataTable } from '../components/ui';
import { ClipboardList, Plus, GitBranch, Bot, CheckCircle2, Clock, AlertTriangle, XCircle, ChevronLeft } from 'lucide-react';

export default function TasksPage() {
  const { tasks, projects, agents, fetchTasks, fetchProjects, fetchAgents, createTask } = useStore();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchAgents();
  }, []);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const selected = tasks.find(t => t.id === selectedTask);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createTask({
      title: form.get('title') as string,
      description: form.get('description') as string,
      projectId: form.get('projectId') as string,
      status: 'created',
      priority: (form.get('priority') as string) as 'low' | 'medium' | 'high' | 'critical',
      assignedAgents: [],
    });
    setShowCreate(false);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'executing': return <Clock className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'review': return <AlertTriangle className="w-4 h-4 text-blue-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="تسک‌ها"
        description="مدیریت و اجرای Taskها"
        action={
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            تسک جدید
          </button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {['all', 'created', 'planning', 'executing', 'review', 'completed', 'failed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50'
            }`}
          >
            {s === 'all' ? 'همه' : s === 'created' ? 'ایجاد شده' : s === 'planning' ? 'برنامه‌ریزی' : s === 'executing' ? 'در حال اجرا' : s === 'review' ? 'بررسی' : s === 'completed' ? 'تکمیل شده' : 'ناموفق'}
            <span className="mr-1.5 text-zinc-500">
              ({s === 'all' ? tasks.length : tasks.filter(t => t.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const project = projects.find(p => p.id === task.projectId);
          return (
            <Card key={task.id} className="p-4 hover:border-indigo-500/30 transition-all cursor-pointer" >
              <div onClick={() => setSelectedTask(task.id)} className="flex items-start gap-4">
                <div className="mt-1 shrink-0">{statusIcon(task.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                    <StatusBadge status={task.status} />
                    <Badge variant={task.priority === 'critical' ? 'error' : task.priority === 'high' ? 'warning' : task.priority === 'medium' ? 'info' : 'default'}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <ClipboardList className="w-3.5 h-3.5" />
                      {project?.name}
                    </span>
                    {task.branch && (
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span dir="ltr">{task.branch}</span>
                      </span>
                    )}
                    {task.assignedAgents.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" />
                        {task.assignedAgents.length} agent
                      </span>
                    )}
                  </div>

                  {/* Plan Progress */}
                  {task.plan && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-zinc-500">Plan Progress</span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-l from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${(task.plan.steps.filter(s => s.status === 'completed').length / task.plan.steps.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500">
                          {task.plan.steps.filter(s => s.status === 'completed').length}/{task.plan.steps.length}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {task.plan.steps.map(step => (
                          <div key={step.id} className={`w-6 h-1.5 rounded-full ${
                            step.status === 'completed' ? 'bg-emerald-500' :
                            step.status === 'running' ? 'bg-amber-500 animate-pulse' :
                            step.status === 'failed' ? 'bg-red-500' : 'bg-zinc-700'
                          }`} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <ChevronLeft className="w-5 h-5 text-zinc-600 shrink-0 mt-1" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelectedTask(null)} title={selected?.title || ''} size="xl">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={selected.status} />
              <Badge variant={selected.priority === 'critical' ? 'error' : selected.priority === 'high' ? 'warning' : 'info'}>
                اولویت: {selected.priority}
              </Badge>
              {selected.branch && <Badge><span dir="ltr">{selected.branch}</span></Badge>}
              <Badge variant="purple">v{selected.version}</Badge>
            </div>

            <p className="text-sm text-zinc-300">{selected.description}</p>

            {/* Plan */}
            {selected.plan && (
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-white mb-3">Plan</h4>
                <div className="space-y-2">
                  {selected.plan.steps.map((step, i) => {
                    const agent = agents.find(a => a.id === step.agentId);
                    return (
                      <div key={step.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/30">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          step.status === 'running' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                          step.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-zinc-700/50 text-zinc-500'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-200">{step.title}</p>
                          {agent && <p className="text-xs text-zinc-500">{agent.name}</p>}
                        </div>
                        <StatusBadge status={step.status} />
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Result */}
            {selected.result && (
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-white mb-3">نتیجه</h4>
                <p className="text-sm text-zinc-300 mb-3">{selected.result.summary}</p>
                {selected.result.commitSha && (
                  <div className="text-xs text-zinc-500 mb-2" dir="ltr">Commit: {selected.result.commitSha}</div>
                )}
                {selected.result.prUrl && (
                  <div className="text-xs text-indigo-400 mb-3" dir="ltr">PR: {selected.result.prUrl}</div>
                )}
                {selected.result.testResults && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
                      <div className="text-lg font-bold text-white">{selected.result.testResults.total}</div>
                      <div className="text-xs text-zinc-500">کل</div>
                    </div>
                    <div className="text-center p-2 bg-emerald-500/10 rounded-lg">
                      <div className="text-lg font-bold text-emerald-400">{selected.result.testResults.passed}</div>
                      <div className="text-xs text-zinc-500">موفق</div>
                    </div>
                    <div className="text-center p-2 bg-red-500/10 rounded-lg">
                      <div className="text-lg font-bold text-red-400">{selected.result.testResults.failed}</div>
                      <div className="text-xs text-zinc-500">ناموفق</div>
                    </div>
                    <div className="text-center p-2 bg-zinc-800/30 rounded-lg">
                      <div className="text-lg font-bold text-white">{selected.result.testResults.duration}ms</div>
                      <div className="text-xs text-zinc-500">مدت</div>
                    </div>
                  </div>
                )}
                {selected.result.changes.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-xs font-semibold text-zinc-400 mb-2">تغییرات فایل</h5>
                    <DataTable headers={['فایل', 'عملیات', '+Lines', '-Lines']}>
                      {selected.result.changes.map((c, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-xs font-mono text-zinc-200" dir="ltr">{c.path}</td>
                          <td className="px-4 py-2"><Badge variant={c.action === 'created' ? 'success' : c.action === 'deleted' ? 'error' : 'warning'}>{c.action}</Badge></td>
                          <td className="px-4 py-2 text-xs text-emerald-400">+{c.linesAdded}</td>
                          <td className="px-4 py-2 text-xs text-red-400">-{c.linesRemoved}</td>
                        </tr>
                      ))}
                    </DataTable>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* Create Task Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="ایجاد تسک جدید">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">عنوان</label>
            <input name="title" required className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">توضیحات</label>
            <textarea name="description" rows={3} className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">پروژه</label>
              <select name="projectId" required className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">اولویت</label>
              <select name="priority" className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">بالا</option>
                <option value="critical">بحرانی</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg">ایجاد تسک</button>
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg">انصراف</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
