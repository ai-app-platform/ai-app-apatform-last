import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, StatusBadge, Badge, Modal } from '../components/ui';
import { Plug, Plus, Globe, Lock, Activity, CheckCircle2, XCircle } from 'lucide-react';

const typeLabels: Record<string, string> = {
  git: 'Git', ci_cd: 'CI/CD', issue_tracker: 'Issue Tracker',
  notification: 'اعلان', storage: 'Storage', llm: 'LLM Provider', custom: 'سفارشی',
};

const adapterLabels: Record<string, string> = {
  rest: 'REST API', graphql: 'GraphQL', mcp: 'MCP Protocol', sdk: 'SDK',
};

export default function ConnectorsPage() {
  const { connectors, fetchConnectors } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const connector = connectors.find(c => c.id === selected);

  useEffect(() => { fetchConnectors(); }, []);

  const formatTime = (ts?: string) => {
    if (!ts) return '—';
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} دقیقه پیش`;
    return `${Math.floor(mins / 60)} ساعت پیش`;
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Connectorها"
        description="مدیریت اتصال به سیستم‌های خارجی"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Connector جدید
          </button>
        }
      />

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {connectors.map((c) => (
          <Card key={c.id} className="p-5 hover:border-indigo-500/30 transition-all cursor-pointer" >
            <div onClick={() => setSelected(c.id)}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center">
                  <Plug className="w-5 h-5 text-purple-400" />
                </div>
                <StatusBadge status={c.status} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{c.name}</h3>
              <p className="text-xs text-zinc-400 mb-3">{c.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="purple">{typeLabels[c.type]}</Badge>
                <Badge>{adapterLabels[c.adapterType]}</Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {c.capabilities.map(cap => (
                  <span key={cap} className="text-[10px] px-2 py-0.5 bg-zinc-800/50 text-zinc-400 rounded-full">{cap}</span>
                ))}
              </div>
              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {c.status === 'active' ? (
                    <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">سالم</span></>
                  ) : c.status === 'error' ? (
                    <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400">خطا</span></>
                  ) : (
                    <><Activity className="w-3.5 h-3.5 text-zinc-500" /><span className="text-zinc-500">غیرفعال</span></>
                  )}
                </div>
                <span className="text-zinc-600">آخرین بررسی: {formatTime(c.lastHealthCheck)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal open={!!connector} onClose={() => setSelected(null)} title={connector?.name || ''} size="lg">
        {connector && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center">
                <Plug className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{connector.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="purple">{typeLabels[connector.type]}</Badge>
                  <Badge>{adapterLabels[connector.adapterType]}</Badge>
                  <StatusBadge status={connector.status} />
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-300">{connector.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Configuration
                </h4>
                <pre className="text-xs text-zinc-300 bg-zinc-900/50 p-3 rounded-lg overflow-auto" dir="ltr">
                  {JSON.stringify(connector.config, null, 2)}
                </pre>
              </Card>
              <Card className="p-4">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Credential
                </h4>
                <div className="p-3 bg-zinc-900/50 rounded-lg">
                  <code className="text-xs text-amber-300" dir="ltr">{connector.credentialRef}</code>
                  <p className="text-[10px] text-zinc-500 mt-1">Secret در Vault نگهداری می‌شود</p>
                </div>
              </Card>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Capabilities</h4>
              <div className="flex flex-wrap gap-2">
                {connector.capabilities.map(cap => (
                  <Badge key={cap} variant="info">{cap}</Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">آخرین Health Check</span>
              </div>
              <span className="text-sm text-zinc-400">{formatTime(connector.lastHealthCheck)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
