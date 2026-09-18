import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, StatusBadge, Badge, Modal, DataTable } from '../components/ui';
import { FolderGit2, Plus, ExternalLink, GitBranch, Clock, Users } from 'lucide-react';

export default function ProjectsPage() {
  const { projects, tasks, teams, fetchProjects, fetchTasks, fetchTeams, createProject } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchTeams();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createProject({
      name: form.get('name') as string,
      description: form.get('description') as string,
      repositoryUrl: form.get('repositoryUrl') as string,
      defaultBranch: form.get('defaultBranch') as string || 'main',
      status: 'active',
    });
    setShowCreate(false);
  };

  const selected = projects.find(p => p.id === selectedProject);

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="پروژه‌ها"
        description="مدیریت پروژه‌ها و Repositoryها"
        action={
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            پروژه جدید
          </button>
        }
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((project) => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const team = teams.find(t => t.projectId === project.id);
          return (
            <Card key={project.id} className="p-5 hover:border-indigo-500/30 transition-all cursor-pointer group" >
              <div onClick={() => setSelectedProject(project.id)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    <FolderGit2 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <h3 className="text-base font-bold text-white mb-1">{project.name}</h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="truncate" dir="ltr">{project.repositoryUrl}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5" />
                      {project.defaultBranch}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      v{project.version}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {team?.members.length || 0} agent
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{projectTasks.length} تسک</span>
                  <div className="flex gap-1">
                    {projectTasks.slice(0, 3).map(t => (
                      <Badge key={t.id} variant={t.status === 'completed' ? 'success' : t.status === 'failed' ? 'error' : 'warning'}>
                        {t.status === 'executing' ? '▶' : t.status === 'completed' ? '✓' : t.status === 'failed' ? '✗' : '○'}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelectedProject(null)} title={selected?.name || ''} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500">وضعیت</label>
                <div className="mt-1"><StatusBadge status={selected.status} /></div>
              </div>
              <div>
                <label className="text-xs text-zinc-500">Branch پیش‌فرض</label>
                <div className="mt-1 text-sm text-zinc-200">{selected.defaultBranch}</div>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-zinc-500">Repository</label>
                <div className="mt-1 text-sm text-zinc-200" dir="ltr">{selected.repositoryUrl}</div>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-zinc-500">توضیحات</label>
                <div className="mt-1 text-sm text-zinc-300">{selected.description}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">تسک‌های پروژه</h4>
              <DataTable headers={['عنوان', 'وضعیت', 'اولویت', 'Branch']}>
                {tasks.filter(t => t.projectId === selected.id).map(task => (
                  <tr key={task.id} className="hover:bg-zinc-800/20">
                    <td className="px-4 py-3 text-sm text-zinc-200">{task.title}</td>
                    <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                    <td className="px-4 py-3"><Badge variant={task.priority === 'critical' ? 'error' : task.priority === 'high' ? 'warning' : 'default'}>{task.priority}</Badge></td>
                    <td className="px-4 py-3 text-xs text-zinc-500" dir="ltr">{task.branch || '—'}</td>
                  </tr>
                ))}
              </DataTable>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Agent Team</h4>
              {(() => {
                const team = teams.find(t => t.projectId === selected.id);
                if (!team) return <p className="text-sm text-zinc-500">تیمی تعریف نشده</p>;
                return (
                  <div className="flex flex-wrap gap-2">
                    {team.members.map(m => (
                      <Badge key={m.agentId} variant={m.enabled ? 'success' : 'default'}>{m.role}</Badge>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </Modal>

      {/* Create Project Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="ایجاد پروژه جدید">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">نام پروژه</label>
            <input name="name" required className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">توضیحات</label>
            <textarea name="description" rows={3} className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">URL Repository</label>
            <input name="repositoryUrl" required dir="ltr" placeholder="https://github.com/org/repo" className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">Branch پیش‌فرض</label>
            <input name="defaultBranch" defaultValue="main" dir="ltr" className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg">ایجاد</button>
            <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg">انصراف</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
