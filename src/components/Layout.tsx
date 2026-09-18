import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderGit2, Bot, Wrench, Plug, GitBranch,
  BookOpen, ClipboardList, Brain, Database, Settings, Menu, X,
  ChevronDown, Sparkles, Shield, Layers
} from 'lucide-react';

const navGroups = [
  {
    label: 'عمومی',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'داشبورد' },
      { to: '/projects', icon: FolderGit2, label: 'پروژه‌ها' },
      { to: '/tasks', icon: ClipboardList, label: 'تسک‌ها' },
    ]
  },
  {
    label: 'مدیریت Agent',
    items: [
      { to: '/agents', icon: Bot, label: 'Agentها' },
      { to: '/teams', icon: Layers, label: 'Agent Teamها' },
      { to: '/roles', icon: Shield, label: 'Roleها' },
      { to: '/skills', icon: Sparkles, label: 'Skillها' },
    ]
  },
  {
    label: 'ابزارها و اتصال',
    items: [
      { to: '/tools', icon: Wrench, label: 'Toolها' },
      { to: '/connectors', icon: Plug, label: 'Connectorها' },
      { to: '/workflows', icon: GitBranch, label: 'Workflowها' },
    ]
  },
  {
    label: 'دانش و داده',
    items: [
      { to: '/knowledge', icon: BookOpen, label: 'Knowledge' },
      { to: '/memory', icon: Brain, label: 'Memory' },
      { to: '/rag', icon: Database, label: 'RAG Index' },
    ]
  },
  {
    label: 'سیستم',
    items: [
      { to: '/architecture', icon: Settings, label: 'مستندات معماری' },
    ]
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#0a0c14] overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-[#0f1219] border-l border-zinc-800/60
        flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="shrink-0 p-5 border-b border-zinc-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">AI App Platform</h1>
                <p className="text-[10px] text-zinc-500">Enterprise Edition v1.0</p>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <ChevronDown className="w-3 h-3" />
                {group.label}
              </div>
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                      ${isActive
                        ? 'bg-indigo-500/10 text-indigo-300 border-r-2 border-indigo-500'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
              ا
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-300 truncate">ادمین سیستم</p>
              <p className="text-[10px] text-zinc-500">admin@platform.ir</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 h-14 border-b border-zinc-800/60 bg-[#0f1219]/80 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-zinc-800 text-zinc-400">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <Breadcrumb path={location.pathname} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-300">سیستم فعال</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function Breadcrumb({ path }: { path: string }) {
  const segments = path.split('/').filter(Boolean);
  const labels: Record<string, string> = {
    '': 'داشبورد',
    'projects': 'پروژه‌ها',
    'agents': 'Agentها',
    'tools': 'Toolها',
    'connectors': 'Connectorها',
    'workflows': 'Workflowها',
    'tasks': 'تسک‌ها',
    'skills': 'Skillها',
    'roles': 'Roleها',
    'teams': 'Agent Teamها',
    'knowledge': 'Knowledge',
    'memory': 'Memory',
    'rag': 'RAG Index',
    'architecture': 'مستندات معماری',
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-zinc-500">پلتفرم</span>
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-zinc-700">/</span>
          <span className={i === segments.length - 1 ? 'text-zinc-200' : 'text-zinc-500'}>
            {labels[seg] || seg}
          </span>
        </span>
      ))}
    </div>
  );
}
