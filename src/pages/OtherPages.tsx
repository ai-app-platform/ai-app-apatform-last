import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, StatusBadge, Badge } from '../components/ui';
import { Users, Bot, Shield, Sparkles, BookOpen, Brain, Database } from 'lucide-react';

// =================== Teams ===================
export function TeamsPage() {
  const { teams, agents, projects, fetchTeams, fetchAgents, fetchProjects } = useStore();
  useEffect(() => { fetchTeams(); fetchAgents(); fetchProjects(); }, []);

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Agent Teamها" description="تیم‌های Agent هر پروژه" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {teams.map(team => {
          const project = projects.find(p => p.id === team.projectId);
          return (
            <Card key={team.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{team.name}</h3>
                    <span className="text-xs text-zinc-500">{project?.name}</span>
                  </div>
                </div>
                <StatusBadge status={team.status} />
              </div>
              <div className="space-y-2">
                {team.members.map(m => {
                  const agent = agents.find(a => a.id === m.agentId);
                  return (
                    <div key={m.agentId} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/20">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-zinc-200">{agent?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="purple">{m.role}</Badge>
                        <Badge variant={m.enabled ? 'success' : 'default'}>{m.enabled ? 'فعال' : 'غیرفعال'}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-800/60 text-xs text-zinc-500">
                v{team.version} • {team.members.filter(m => m.enabled).length} agent فعال
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// =================== Roles ===================
export function RolesPage() {
  const { roles, skills, fetchRoles, fetchSkills } = useStore();
  useEffect(() => { fetchRoles(); fetchSkills(); }, []);

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Roleها" description="تعریف نقش‌ها و مسئولیت‌ها" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map(role => (
          <Card key={role.id} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{role.name}</h3>
                <p className="text-xs text-zinc-500">{role.description}</p>
              </div>
            </div>
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-zinc-400 mb-1.5">مسئولیت‌ها</h4>
              <ul className="space-y-1">
                {role.responsibilities.map((r, i) => (
                  <li key={i} className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            {role.constraints.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-red-400/70 mb-1.5">محدودیت‌ها</h4>
                {role.constraints.map((c, i) => (
                  <p key={i} className="text-xs text-zinc-400">⚠ {c}</p>
                ))}
              </div>
            )}
            <div className="pt-3 border-t border-zinc-800/60">
              <div className="flex flex-wrap gap-1">
                {role.referencedSkills.map(sId => {
                  const skill = skills.find(s => s.id === sId);
                  return skill ? <Badge key={sId} variant="success">{skill.name}</Badge> : null;
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// =================== Skills ===================
export function SkillsPage() {
  const { skills, fetchSkills } = useStore();
  useEffect(() => { fetchSkills(); }, []);

  const levelColors: Record<string, string> = {
    basic: 'default', intermediate: 'info', expert: 'success',
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Skillها" description="تخصص‌ها و قابلیت‌های قابل انتساب به Agent" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {skills.map(skill => (
          <Card key={skill.id} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{skill.name}</h3>
                <p className="text-xs text-zinc-500">{skill.domain}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-300 mb-3">{skill.description}</p>
            <div className="flex items-center gap-2">
              <Badge variant={levelColors[skill.level] as 'default' | 'info' | 'success'}>{skill.level}</Badge>
              {skill.tags.map(tag => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// =================== Knowledge ===================
export function KnowledgePage() {
  const { knowledge, fetchKnowledge } = useStore();
  useEffect(() => { fetchKnowledge(); }, []);

  const categoryLabels: Record<string, string> = {
    architecture: 'معماری', standards: 'استاندارد', conventions: 'قرارداد', adr: 'ADR', instructions: 'دستورالعمل',
  };
  const categoryColors: Record<string, string> = {
    architecture: 'purple', standards: 'info', conventions: 'success', adr: 'warning', instructions: 'default',
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Knowledge" description="دانش و دستورالعمل‌های پایدار" />
      <div className="space-y-3">
        {knowledge.map(k => (
          <Card key={k.id} className="p-5 hover:border-indigo-500/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{k.title}</h3>
                  <p className="text-xs text-zinc-400 mb-2 line-clamp-2">{k.content}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={categoryColors[k.category] as 'default' | 'info' | 'success' | 'warning' | 'purple'}>
                      {categoryLabels[k.category]}
                    </Badge>
                    <Badge variant={k.scope === 'platform' ? 'purple' : 'info'}>{k.scope}</Badge>
                    <span className="text-xs text-zinc-500 font-mono" dir="ltr">{k.filePath}</span>
                  </div>
                </div>
              </div>
              <Badge>v{k.version}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// =================== Memory ===================
export function MemoryPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Memory" description="حافظه Runtime و Long-Term" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Active / Short-term Memory</h3>
              <p className="text-xs text-zinc-500">.ai/runtime/ — روی Disk و Markdown</p>
            </div>
          </div>
          <div className="space-y-2">
            {['current-task.md', 'current-plan.md', 'discoveries.md', 'decisions.md', 'touched-files.md', 'test-results.md', 'task-summary.md'].map(f => (
              <div key={f} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/20">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm text-zinc-300 font-mono" dir="ltr">{f}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Long-Term Memory</h3>
              <p className="text-xs text-zinc-500">Summarize → Validate → RAG Index</p>
            </div>
          </div>
          <div className="p-4 bg-zinc-800/20 rounded-lg">
            <div className="code-block text-xs">
{`Task Execution → Runtime Events → Active Memory
→ Task Summary → Candidate Long-Term Memory
→ Summarize/Classify/Validate
→ Long-Term Memory → RAG Index`}
            </div>
          </div>
          <div className="mt-4 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
            <p className="text-xs text-indigo-300">◆ RAG ≠ Memory Source of Truth</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// =================== RAG ===================
export function RAGPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="RAG Index" description="لایه بازیابی و Index اطلاعات" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-base font-bold text-white mb-4">Index Status</h3>
          <div className="space-y-3">
            {[
              { name: 'Payment Service', status: 'ready', chunks: 1247, commit: 'abc123f' },
              { name: 'User Dashboard', status: 'ready', chunks: 834, commit: 'def456a' },
              { name: 'API Gateway', status: 'updating', chunks: 2103, commit: 'ghi789b' },
              { name: 'Notification Service', status: 'building', chunks: 0, commit: '' },
            ].map(idx => (
              <div key={idx.name} className="p-3 rounded-lg bg-zinc-800/20 border border-zinc-800/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-zinc-200">{idx.name}</span>
                  <Badge variant={idx.status === 'ready' ? 'success' : idx.status === 'updating' ? 'info' : 'warning'}>
                    {idx.status === 'ready' ? 'آماده' : idx.status === 'updating' ? 'بروزرسانی' : 'در حال ساخت'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>{idx.chunks} chunks</span>
                  {idx.commit && <span className="font-mono" dir="ltr">{idx.commit}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-base font-bold text-white mb-4">Architecture</h3>
          <div className="code-block text-xs mb-4">
{`Source → Indexer → RAG Index → Retriever

Capabilities:
- Vector Search (Qdrant)
- Graph Traversal (Neo4j)
- Hybrid Search
- Metadata Filtering
- Reranking
- Embeddings`}
          </div>
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-300">◆ RAG Source of Truth نیست. اگر RAG با Source File تضاد داشت، Source File Wins.</p>
          </div>
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Index Metadata</h4>
            <div className="flex flex-wrap gap-1">
              {['projectId', 'repository', 'branch', 'commitSha', 'filePath', 'symbol', 'lineRange', 'contentHash', 'parserVersion', 'embeddingVersion', 'indexVersion', 'indexedAt'].map(m => (
                <span key={m} className="text-[10px] px-2 py-0.5 bg-zinc-800/50 text-zinc-400 rounded-full font-mono" dir="ltr">{m}</span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
