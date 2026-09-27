import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, StatusBadge, Badge, Modal, DataTable } from '../components/ui';
import { Bot, Plus, Cpu, Brain, Zap, Settings } from 'lucide-react';

const typeLabels: Record<string, string> = {
  planner: 'برنامه‌ریز', architect: 'معمار', developer: 'توسعه‌دهنده',
  reviewer: 'بررسی‌کننده', tester: 'تستر', security: 'امنیت', qa: 'QA', custom: 'سفارشی',
};

const typeColors: Record<string, string> = {
  planner: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
  architect: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
  developer: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20',
  reviewer: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
  tester: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
  security: 'from-red-500/20 to-red-600/5 border-red-500/20',
  qa: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
  custom: 'from-zinc-500/20 to-zinc-600/5 border-zinc-500/20',
};

export default function AgentsPage() {
  const { agents, skills, tools, fetchAgents, fetchSkills, fetchTools } = useStore();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchAgents();
    fetchSkills();
    fetchTools();
  }, []);

  const selected = agents.find(a => a.id === selectedAgent);

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Agentها"
        description="مدیریت و پیکربندی Agentهای Platform"
        action={
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Agent جدید
          </button>
        }
      />

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="p-5 hover:border-indigo-500/30 transition-all cursor-pointer group" >
            <div onClick={() => setSelectedAgent(agent.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[agent.type]} flex items-center justify-center`}>
                  <Bot className="w-6 h-6 text-white/80" />
                </div>
                <StatusBadge status={agent.status} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{agent.name}</h3>
              <p className="text-sm text-zinc-400 mb-3">{agent.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="purple">{typeLabels[agent.type]}</Badge>
                <Badge>{agent.capabilities.length} قابلیت</Badge>
              </div>
              <div className="pt-3 border-t border-zinc-800/60">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    {agent.modelConfig.model}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {agent.allowedTools.length} tool
                  </span>
                  <span className="flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5" />
                    {agent.skills.length} skill
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Agent Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelectedAgent(null)} title={selected?.name || ''} size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${typeColors[selected.type]} flex items-center justify-center`}>
                <Bot className="w-7 h-7 text-white/80" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="purple">{typeLabels[selected.type]}</Badge>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-300">{selected.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  Model Configuration
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-zinc-500">Provider</span><span className="text-zinc-200">{selected.modelConfig.provider}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Model</span><span className="text-zinc-200">{selected.modelConfig.model}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Temperature</span><span className="text-zinc-200">{selected.modelConfig.temperature}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Max Tokens</span><span className="text-zinc-200">{selected.modelConfig.maxTokens}</span></div>
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selected.capabilities.map(c => (
                    <Badge key={c} variant="info">{c}</Badge>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selected.skills.map(sId => {
                  const skill = skills.find(s => s.id === sId);
                  return skill ? <Badge key={sId} variant="success">{skill.name}</Badge> : null;
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Allowed Tools</h4>
              <DataTable headers={['نام', 'دسته‌بندی', 'توضیحات']}>
                {selected.allowedTools.map(tId => {
                  const tool = tools.find(t => t.id === tId);
                  if (!tool) return null;
                  return (
                    <tr key={tId} className="hover:bg-zinc-800/20">
                      <td className="px-4 py-2 text-sm text-zinc-200 font-mono" dir="ltr">{tool.name}</td>
                      <td className="px-4 py-2"><Badge>{tool.category}</Badge></td>
                      <td className="px-4 py-2 text-sm text-zinc-400">{tool.description}</td>
                    </tr>
                  );
                })}
              </DataTable>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Agent Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="ایجاد Agent جدید" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">نام</label>
              <input className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">نوع</label>
              <select className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">توضیحات</label>
            <textarea rows={3} className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">LLM Provider</label>
              <select className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                <option>openai</option>
                <option>anthropic</option>
                <option>google</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">Model</label>
              <input defaultValue="gpt-4o" dir="ltr" className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg">ایجاد</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg">انصراف</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
