// ============================================
// Task Execution Engine — شبیه‌سازی اجرای Task
// ============================================

import type { Task, TaskPlan, PlanStep, ExecutionNode, TaskResult, FileChange, TestResult } from '../types';

export type ExecutionPhase = 
  | 'idle' 
  | 'resolving_project' 
  | 'preparing_workspace' 
  | 'creating_branch'
  | 'resolving_knowledge'
  | 'resolving_team'
  | 'resolving_workflow'
  | 'loading_context'
  | 'planning'
  | 'selecting_agents'
  | 'building_graph'
  | 'executing'
  | 'validating'
  | 'reviewing'
  | 'committing'
  | 'pushing'
  | 'creating_pr'
  | 'updating_memory'
  | 'completed'
  | 'failed';

export interface ExecutionLog {
  timestamp: string;
  phase: ExecutionPhase;
  message: string;
  agentId?: string;
  agentName?: string;
  level: 'info' | 'success' | 'warning' | 'error' | 'debug';
  details?: Record<string, unknown>;
}

export interface ExecutionState {
  taskId: string;
  phase: ExecutionPhase;
  progress: number; // 0-100
  logs: ExecutionLog[];
  currentAgent?: string;
  startedAt?: string;
  completedAt?: string;
  fileChanges: FileChange[];
  testResults?: TestResult;
  error?: string;
}

// شبیه‌سازی مراحل اجرای Task
const executionPhases: { phase: ExecutionPhase; duration: number; message: string }[] = [
  { phase: 'resolving_project', duration: 500, message: 'در حال Resolve پروژه...' },
  { phase: 'preparing_workspace', duration: 800, message: 'آماده‌سازی Workspace...' },
  { phase: 'creating_branch', duration: 400, message: 'ایجاد Task Branch...' },
  { phase: 'resolving_knowledge', duration: 600, message: 'Resolve Knowledge و Instructions...' },
  { phase: 'resolving_team', duration: 300, message: 'Resolve Agent Team...' },
  { phase: 'resolving_workflow', duration: 300, message: 'Resolve Workflow...' },
  { phase: 'loading_context', duration: 700, message: 'بارگذاری Context (Codebase Intelligence + RAG)...' },
  { phase: 'planning', duration: 1200, message: 'Planner در حال تحلیل Task و ساخت Plan...' },
  { phase: 'selecting_agents', duration: 400, message: 'انتخاب Dynamic Agent Subset...' },
  { phase: 'building_graph', duration: 500, message: 'ساخت Execution Graph با LangGraph...' },
  { phase: 'executing', duration: 3000, message: 'اجرای Agentها...' },
  { phase: 'validating', duration: 1500, message: 'اجرای Build و Test...' },
  { phase: 'reviewing', duration: 1000, message: 'Code Review توسط Reviewer Agent...' },
  { phase: 'committing', duration: 400, message: 'ایجاد Git Commit...' },
  { phase: 'pushing', duration: 600, message: 'Push به Remote Repository...' },
  { phase: 'creating_pr', duration: 500, message: 'ایجاد Pull Request...' },
  { phase: 'updating_memory', duration: 300, message: 'بروزرسانی Runtime Memory...' },
  { phase: 'completed', duration: 0, message: '✅ Task با موفقیت تکمیل شد!' },
];

// شبیه‌سازی Agent Execution Steps
const agentSteps = [
  { agent: 'Planner Agent', action: 'تحلیل Task و شناسایی capabilities مورد نیاز', duration: 1200 },
  { agent: 'Architect Agent', action: 'تحلیل معماری فعلی و پیشنهاد طراحی', duration: 1500 },
  { agent: 'Backend Developer', action: 'پیاده‌سازی تغییرات کد', duration: 2500 },
  { agent: 'Security Agent', action: 'بررسی امنیتی تغییرات', duration: 1000 },
  { agent: 'Code Reviewer', action: 'بررسی کیفیت کد و best practices', duration: 1200 },
  { agent: 'QA Agent', action: 'اجرای تست‌ها و اعتبارسنجی', duration: 1500 },
];

// شبیه‌سازی تولید فایل‌های تغییر یافته
function generateFileChanges(): FileChange[] {
  const possibleFiles = [
    { path: 'src/main/java/com/app/service/PaymentService.java', action: 'modified' as const },
    { path: 'src/main/java/com/app/config/SecurityConfig.java', action: 'modified' as const },
    { path: 'src/main/java/com/app/controller/AuthController.java', action: 'created' as const },
    { path: 'src/test/java/com/app/service/PaymentServiceTest.java', action: 'modified' as const },
    { path: 'src/main/resources/application.yml', action: 'modified' as const },
    { path: 'pom.xml', action: 'modified' as const },
    { path: 'src/main/java/com/app/dto/AuthRequest.java', action: 'created' as const },
    { path: 'src/main/java/com/app/dto/AuthResponse.java', action: 'created' as const },
  ];
  
  const count = 3 + Math.floor(Math.random() * 4);
  const shuffled = possibleFiles.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(f => ({
    ...f,
    linesAdded: Math.floor(Math.random() * 150) + 10,
    linesRemoved: f.action === 'created' ? 0 : Math.floor(Math.random() * 30),
  }));
}

function generateTestResults(): TestResult {
  const total = 15 + Math.floor(Math.random() * 20);
  const failed = Math.random() > 0.85 ? Math.floor(Math.random() * 3) : 0;
  const skipped = Math.floor(Math.random() * 3);
  return {
    total,
    passed: total - failed - skipped,
    failed,
    skipped,
    duration: 1500 + Math.floor(Math.random() * 3000),
  };
}

export class TaskExecutionEngine {
  private state: ExecutionState;
  private listeners: ((state: ExecutionState) => void)[] = [];
  private abortController: AbortController | null = null;

  constructor(taskId: string) {
    this.state = {
      taskId,
      phase: 'idle',
      progress: 0,
      logs: [],
      fileChanges: [],
    };
  }

  subscribe(listener: (state: ExecutionState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l({ ...this.state }));
  }

  private addLog(log: Omit<ExecutionLog, 'timestamp'>) {
    this.state.logs.push({ ...log, timestamp: new Date().toISOString() });
    this.notify();
  }

  getState(): ExecutionState {
    return { ...this.state };
  }

  async execute(): Promise<ExecutionState> {
    this.abortController = new AbortController();
    this.state.startedAt = new Date().toISOString();
    this.state.phase = 'resolving_project';
    this.notify();

    this.addLog({ phase: 'resolving_project', message: '🚀 شروع اجرای Task', level: 'info' });

    try {
      // Execute main phases
      const totalPhases = executionPhases.length;
      
      for (let i = 0; i < executionPhases.length; i++) {
        if (this.abortController.signal.aborted) throw new Error('Aborted');
        
        const ep = executionPhases[i];
        this.state.phase = ep.phase;
        this.state.progress = Math.round((i / totalPhases) * 100);
        
        this.addLog({
          phase: ep.phase,
          message: ep.message,
          level: 'info',
        });

        // Special handling for executing phase (agent steps)
        if (ep.phase === 'executing') {
          await this.executeAgentSteps();
        } else if (ep.phase === 'validating') {
          await this.executeValidation();
        } else if (ep.phase === 'committing') {
          this.state.fileChanges = generateFileChanges();
          this.addLog({
            phase: 'committing',
            message: `📝 ${this.state.fileChanges.length} فایل تغییر یافت`,
            level: 'info',
            details: { files: this.state.fileChanges.map(f => f.path) },
          });
        } else if (ep.phase === 'creating_pr') {
          const prNum = Math.floor(Math.random() * 100) + 1;
          this.addLog({
            phase: 'creating_pr',
            message: `🔗 Pull Request #${prNum} ایجاد شد`,
            level: 'success',
          });
        } else {
          await this.delay(ep.duration);
        }

        this.addLog({
          phase: ep.phase,
          message: `✓ ${ep.message.replace('در حال ', '').replace('...', '')} انجام شد`,
          level: 'success',
        });
      }

      this.state.phase = 'completed';
      this.state.progress = 100;
      this.state.completedAt = new Date().toISOString();
      this.notify();

      return this.getState();
    } catch (error: any) {
      this.state.phase = 'failed';
      this.state.error = error.message;
      this.state.completedAt = new Date().toISOString();
      this.addLog({
        phase: 'failed',
        message: `❌ خطا: ${error.message}`,
        level: 'error',
      });
      this.notify();
      return this.getState();
    }
  }

  private async executeAgentSteps() {
    for (const step of agentSteps) {
      if (this.abortController?.signal.aborted) throw new Error('Aborted');
      
      this.state.currentAgent = step.agent;
      this.addLog({
        phase: 'executing',
        message: `🤖 ${step.agent}: ${step.action}`,
        level: 'info',
        agentName: step.agent,
      });

      await this.delay(step.duration);

      this.addLog({
        phase: 'executing',
        message: `✓ ${step.agent} مرحله خود را تکمیل کرد`,
        level: 'success',
        agentName: step.agent,
      });
    }
    this.state.currentAgent = undefined;
  }

  private async executeValidation() {
    this.addLog({
      phase: 'validating',
      message: '🔨 اجرای Maven Build...',
      level: 'info',
    });
    await this.delay(800);
    
    this.addLog({
      phase: 'validating',
      message: '✓ Build موفق — 0 errors, 0 warnings',
      level: 'success',
    });

    await this.delay(300);
    
    this.addLog({
      phase: 'validating',
      message: '🧪 اجرای Unit Tests...',
      level: 'info',
    });
    await this.delay(600);

    this.state.testResults = generateTestResults();
    const tr = this.state.testResults;
    
    this.addLog({
      phase: 'validating',
      message: `✓ Tests: ${tr.passed} passed, ${tr.failed} failed, ${tr.skipped} skipped (${tr.duration}ms)`,
      level: tr.failed > 0 ? 'warning' : 'success',
      details: tr as any,
    });
  }

  abort() {
    this.abortController?.abort();
    this.state.phase = 'failed';
    this.state.error = 'Execution aborted by user';
    this.notify();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms);
      const signal = this.abortController?.signal;
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('Aborted'));
        });
      }
    });
  }
}

// Singleton manager
const engines = new Map<string, TaskExecutionEngine>();

export function getExecutionEngine(taskId: string): TaskExecutionEngine {
  if (!engines.has(taskId)) {
    engines.set(taskId, new TaskExecutionEngine(taskId));
  }
  return engines.get(taskId)!;
}

export function removeExecutionEngine(taskId: string) {
  engines.delete(taskId);
}
