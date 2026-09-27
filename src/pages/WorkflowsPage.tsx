import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, StatusBadge, Badge, Modal } from '../components/ui';
import { GitBranch, Plus, ArrowDown, ArrowLeft, GitMerge, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function WorkflowsPage() {
  const { workflows, fetchWorkflows } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const workflow = workflows.find(w => w.id === selected);

  useEffect(() => { fetchWorkflows(); }, []);

  const stepTypeIcon = (type: string) => {
    switch (type) {
      case 'agent': return <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center"><GitBranch className="w-4 h-4 text-indigo-400" /></div>;
      case 'validation': return <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div>;
      case 'approval': return <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-amber-400" /></div>;
      case 'parallel': return <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><GitMerge className="w-4 h-4 text-purple-400" /></div>;
      default: return <div className="w-8 h-8 rounded-full bg-zinc-700/50 flex items-center justify-center"><ArrowDown className="w-4 h-4 text-zinc-400" /></div>;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Workflowها"
        description="تعریف و مدیریت Workflowهای اجرا"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Workflow جدید
          </button>
        }
      />

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {workflows.map((w) => (
          <Card key={w.id} className="p-5 hover:border-indigo-500/30 transition-all cursor-pointer" >
            <div onClick={() => setSelected(w.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{w.name}</h3>
                    <Badge variant={w.scope === 'platform' ? 'purple' : 'info'}>{w.scope}</Badge>
                  </div>
                </div>
                <StatusBadge status={w.status} />
              </div>
              <p className="text-xs text-zinc-400 mb-4">{w.description}</p>

              {/* Steps Preview */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {w.steps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-1 shrink-0">
                    <div className="px-2.5 py-1 rounded-md bg-zinc-800/50 text-[10px] text-zinc-300 border border-zinc-700/50">
                      {step.name}
                    </div>
                    {i < w.steps.length - 1 && <ArrowLeft className="w-3 h-3 text-zinc-600 rotate-180" />}
                  </div>
                ))}
              </div>

              {/* Config */}
              <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center gap-4 text-xs text-zinc-500">
                <span>{w.steps.length} مرحله</span>
                <span>Parallel: {w.config.allowParallel ? '✓' : '✗'}</span>
                <span>Validation: {w.config.validationRequired ? '✓' : '✗'}</span>
                <span>Strategy: {w.config.agentSelectionStrategy}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Workflow Detail Modal */}
      <Modal open={!!workflow} onClose={() => setSelected(null)} title={workflow?.name || ''} size="xl">
        {workflow && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{workflow.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={workflow.scope === 'platform' ? 'purple' : 'info'}>{workflow.scope}</Badge>
                  <StatusBadge status={workflow.status} />
                  <Badge>v{workflow.version}</Badge>
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-300">{workflow.description}</p>

            {/* Config */}
            <Card className="p-4">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-3">Configuration</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">{workflow.config.allowParallel ? '✓' : '✗'}</div>
                  <div className="text-xs text-zinc-500">Parallel</div>
                </div>
                <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">{workflow.config.validationRequired ? '✓' : '✗'}</div>
                  <div className="text-xs text-zinc-500">Validation</div>
                </div>
                <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">{workflow.config.approvalRequired ? '✓' : '✗'}</div>
                  <div className="text-xs text-zinc-500">Approval</div>
                </div>
                <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                  <div className="text-sm font-bold text-indigo-300">{workflow.config.agentSelectionStrategy}</div>
                  <div className="text-xs text-zinc-500">Strategy</div>
                </div>
              </div>
            </Card>

            {/* Steps Graph */}
            <Card className="p-4">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-4">Execution Graph</h4>
              <div className="space-y-0">
                {workflow.steps.map((step, i) => (
                  <div key={step.id}>
                    <div className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors">
                      {stepTypeIcon(step.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-semibold text-white">{step.name}</h5>
                          <Badge variant="default">{step.type}</Badge>
                          {step.agentRole && <Badge variant="purple">{step.agentRole}</Badge>}
                        </div>
                        {step.dependencies.length > 0 && (
                          <p className="text-xs text-zinc-500 mt-1">
                            وابستگی: {step.dependencies.join(', ')}
                          </p>
                        )}
                        {step.condition && (
                          <p className="text-xs text-amber-400 mt-1">
                            شرط: {step.condition}
                          </p>
                        )}
                        {step.retryPolicy && (
                          <p className="text-xs text-zinc-500 mt-1">
                            Retry: max {step.retryPolicy.maxRetries}x, backoff {step.retryPolicy.backoffMs}ms
                          </p>
                        )}
                      </div>
                    </div>
                    {i < workflow.steps.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowDown className="w-4 h-4 text-zinc-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
