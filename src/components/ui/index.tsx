import { type ReactNode } from 'react';
import { X } from 'lucide-react';

// --- Badge ---
export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' }) {
  const styles = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    error: 'bg-red-500/10 text-red-300 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
}

// --- Card ---
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-[#141722] border border-zinc-800/60 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

// --- Stat Card ---
export function StatCard({ label, value, icon, trend, color = 'indigo' }: { label: string; value: string | number; icon: ReactNode; trend?: string; color?: string }) {
  const colors: Record<string, string> = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
    pink: 'from-pink-500/20 to-pink-600/5 border-pink-500/20',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-400">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {trend && <div className="text-xs text-zinc-500 mt-1">{trend}</div>}
    </div>
  );
}

// --- Modal ---
export function Modal({ open, onClose, title, children, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-[#141722] border border-zinc-700/50 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col`}>
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- Status Badge ---
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' | 'purple' }> = {
    active: { label: 'فعال', variant: 'success' },
    inactive: { label: 'غیرفعال', variant: 'default' },
    paused: { label: 'متوقف', variant: 'warning' },
    archived: { label: 'آرشیو', variant: 'default' },
    error: { label: 'خطا', variant: 'error' },
    draft: { label: 'پیش‌نویس', variant: 'info' },
    created: { label: 'ایجاد شده', variant: 'info' },
    planning: { label: 'برنامه‌ریزی', variant: 'purple' },
    executing: { label: 'در حال اجرا', variant: 'warning' },
    review: { label: 'بررسی', variant: 'info' },
    testing: { label: 'تست', variant: 'purple' },
    completed: { label: 'تکمیل شده', variant: 'success' },
    failed: { label: 'ناموفق', variant: 'error' },
    cancelled: { label: 'لغو شده', variant: 'default' },
    building: { label: 'در حال ساخت', variant: 'warning' },
    ready: { label: 'آماده', variant: 'success' },
    updating: { label: 'در حال بروزرسانی', variant: 'info' },
    analyzing: { label: 'در حال تحلیل', variant: 'purple' },
    low: { label: 'کم', variant: 'default' },
    medium: { label: 'متوسط', variant: 'info' },
    high: { label: 'بالا', variant: 'warning' },
    critical: { label: 'بحرانی', variant: 'error' },
  };
  const config = map[status] || { label: status, variant: 'default' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// --- Empty State ---
export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-zinc-300 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-md">{description}</p>
    </div>
  );
}

// --- Page Header ---
export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// --- Loading ---
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );
}

// --- Table ---
export function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-800/30">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/40">
          {children}
        </tbody>
      </table>
    </div>
  );
}
