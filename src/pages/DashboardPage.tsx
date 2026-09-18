import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { StatCard, Card, Badge, StatusBadge } from '../components/ui';
import { FolderGit2, Bot, ClipboardCheck, Wrench, TrendingUp, Activity, AlertCircle, CheckCircle2, GitPullRequest, Play, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const { dashboardStats, tasks, projects, fetchDashboard, fetchTasks, fetchProjects } = useStore();

  useEffect(() => {
    fetchDashboard();
    fetchTasks();
    fetchProjects();
  }, []);

  const activityIcons: Record<string, React.ReactNode> = {
    task_completed: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    task_started: <Play className="w-4 h-4 text-blue-400" />,
    agent_executed: <Bot className="w-4 h-4 text-purple-400" />,
    pr_created: <GitPullRequest className="w-4 h-4 text-indigo-400" />,
    build_passed: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    build_failed: <XCircle className="w-4 h-4 text-red-400" />,
  };

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} دقیقه پیش`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ساعت پیش`;
    return `${Math.floor(hours / 24)} روز پیش`;
  };

  if (!dashboardStats) return null;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="پروژه‌ها" value={dashboardStats.totalProjects} icon={<FolderGit2 className="w-4 h-4 text-indigo-400" />} color="indigo" />
        <StatCard label="تسک‌های فعال" value={dashboardStats.activeTasks} icon={<Activity className="w-4 h-4 text-amber-400" />} color="amber" />
        <StatCard label="تسک‌های تکمیل‌شده" value={dashboardStats.completedTasks} icon={<ClipboardCheck className="w-4 h-4 text-emerald-400" />} color="emerald" />
        <StatCard label="Agentها" value={dashboardStats.totalAgents} icon={<Bot className="w-4 h-4 text-purple-400" />} color="purple" />
        <StatCard label="Toolها" value={dashboardStats.totalTools} icon={<Wrench className="w-4 h-4 text-blue-400" />} color="blue" />
        <StatCard label="نرخ موفقیت" value={`${dashboardStats.successRate}%`} icon={<TrendingUp className="w-4 h-4 text-pink-400" />} color="pink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            فعالیت‌های اخیر
          </h3>
          <div className="space-y-3">
            {dashboardStats.recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center shrink-0 mt-0.5">
                  {activityIcons[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200">{item.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500">{item.projectName}</span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-xs text-zinc-600">{formatTime(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Tasks */}
        <Card className="p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            تسک‌های فعال
          </h3>
          <div className="space-y-3">
            {tasks.filter(t => ['executing', 'planning', 'review'].includes(t.status)).slice(0, 5).map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <div key={task.id} className="p-3 rounded-lg bg-zinc-800/20 border border-zinc-800/40">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-zinc-200 font-medium">{task.title}</p>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-zinc-500">{project?.name}</span>
                    <Badge variant={task.priority === 'critical' ? 'error' : task.priority === 'high' ? 'warning' : 'default'}>
                      {task.priority}
                    </Badge>
                  </div>
                  {task.currentStep && (
                    <div className="mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-xs text-zinc-500">مرحله: {task.currentStep}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card className="p-5">
        <h3 className="text-base font-bold text-white mb-4">نمای کلی پروژه‌ها</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((project) => {
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            const completed = projectTasks.filter(t => t.status === 'completed').length;
            return (
              <div key={project.id} className="p-4 rounded-lg bg-zinc-800/20 border border-zinc-800/40 hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-zinc-200">{project.name}</h4>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{projectTasks.length} تسک</span>
                  <span className="text-emerald-400">{completed} تکمیل‌شده</span>
                </div>
                <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-indigo-500 to-purple-500 rounded-full transition-all"
                    style={{ width: projectTasks.length > 0 ? `${(completed / projectTasks.length) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
