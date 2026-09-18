import type { Project, Agent, Tool, Connector, Workflow, Task, Skill, Role, KnowledgeEntry, AgentTeam, DashboardStats } from '../types';

const now = new Date().toISOString();

export const mockProjects: Project[] = [
  { id: 'p1', name: 'Payment Service', description: 'میکروسرویس پرداخت با Spring Boot', repositoryUrl: 'https://github.com/org/payment-service', defaultBranch: 'main', status: 'active', createdAt: now, updatedAt: now, version: 3, agentTeamId: 't1' },
  { id: 'p2', name: 'User Dashboard', description: 'داشبورد کاربر با React و TypeScript', repositoryUrl: 'https://github.com/org/user-dashboard', defaultBranch: 'main', status: 'active', createdAt: now, updatedAt: now, version: 1 },
  { id: 'p3', name: 'API Gateway', description: 'گیت‌وی اصلی API با Spring Cloud', repositoryUrl: 'https://github.com/org/api-gateway', defaultBranch: 'main', status: 'active', createdAt: now, updatedAt: now, version: 5 },
  { id: 'p4', name: 'Notification Service', description: 'سرویس اعلان‌ها (Email, SMS, Push)', repositoryUrl: 'https://github.com/org/notification-service', defaultBranch: 'main', status: 'paused', createdAt: now, updatedAt: now, version: 2 },
];

export const mockAgents: Agent[] = [
  { id: 'a1', name: 'Architect Agent', type: 'architect', description: 'تحلیل معماری و طراحی سیستم', capabilities: ['architecture-analysis', 'design-patterns', 'system-design'], modelConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.3, maxTokens: 4096 }, allowedTools: ['t1', 't2', 't3'], skills: ['s1', 's2'], status: 'active', runtimeConfig: {}, createdAt: now, updatedAt: now, version: 2 },
  { id: 'a2', name: 'Backend Developer', type: 'developer', description: 'پیاده‌سازی بک‌اند Java/Spring', capabilities: ['code-generation', 'refactoring', 'debugging'], modelConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.2, maxTokens: 8192 }, allowedTools: ['t1', 't2', 't4', 't5'], skills: ['s1', 's3', 's4'], status: 'active', runtimeConfig: {}, createdAt: now, updatedAt: now, version: 1 },
  { id: 'a3', name: 'Frontend Developer', type: 'developer', description: 'پیاده‌سازی فرانت‌اند React', capabilities: ['ui-implementation', 'component-design', 'state-management'], modelConfig: { provider: 'anthropic', model: 'claude-3.5-sonnet', temperature: 0.2, maxTokens: 8192 }, allowedTools: ['t1', 't2', 't6'], skills: ['s5', 's6'], status: 'active', runtimeConfig: {}, createdAt: now, updatedAt: now, version: 1 },
  { id: 'a4', name: 'Code Reviewer', type: 'reviewer', description: 'بررسی کیفیت کد و best practices', capabilities: ['code-review', 'security-audit', 'performance-review'], modelConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.1, maxTokens: 4096 }, allowedTools: ['t1', 't2', 't3'], skills: ['s1', 's7'], status: 'active', runtimeConfig: {}, createdAt: now, updatedAt: now, version: 3 },
  { id: 'a5', name: 'Security Agent', type: 'security', description: 'بررسی امنیتی و آسیب‌پذیری‌ها', capabilities: ['vulnerability-scan', 'security-review', 'compliance-check'], modelConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.1, maxTokens: 4096 }, allowedTools: ['t1', 't2', 't7'], skills: ['s7', 's8'], status: 'active', runtimeConfig: {}, createdAt: now, updatedAt: now, version: 1 },
  { id: 'a6', name: 'QA Agent', type: 'qa', description: 'تست و اعتبارسنجی', capabilities: ['test-generation', 'test-execution', 'validation'], modelConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.2, maxTokens: 4096 }, allowedTools: ['t1', 't4', 't5', 't8'], skills: ['s9'], status: 'active', runtimeConfig: {}, createdAt: now, updatedAt: now, version: 1 },
  { id: 'a7', name: 'Planner Agent', type: 'planner', description: 'تحلیل Task و ایجاد Plan', capabilities: ['task-analysis', 'planning', 'capability-mapping'], modelConfig: { provider: 'openai', model: 'gpt-4o', temperature: 0.3, maxTokens: 4096 }, allowedTools: ['t1', 't3'], skills: ['s1', 's2'], status: 'active', runtimeConfig: {}, createdAt: now, updatedAt: now, version: 2 },
];

export const mockTools: Tool[] = [
  { id: 't1', name: 'read_file', description: 'خواندن محتوای فایل', category: 'file', schema: { input: { path: 'string' }, output: { content: 'string' } }, permissions: [{ action: 'read', scope: 'workspace' }], status: 'active', createdAt: now, updatedAt: now, version: 1 },
  { id: 't2', name: 'write_file', description: 'نوشتن/ویرایش فایل', category: 'file', schema: { input: { path: 'string', content: 'string' }, output: { success: 'boolean' } }, permissions: [{ action: 'write', scope: 'workspace' }], status: 'active', createdAt: now, updatedAt: now, version: 1 },
  { id: 't3', name: 'search_codebase', description: 'جستجو در کدبیس', category: 'search', schema: { input: { query: 'string', filters: 'object' }, output: { results: 'array' } }, permissions: [{ action: 'read', scope: 'workspace' }], status: 'active', createdAt: now, updatedAt: now, version: 2 },
  { id: 't4', name: 'run_build', description: 'اجرای build پروژه', category: 'build', schema: { input: { command: 'string' }, output: { success: 'boolean', output: 'string' } }, permissions: [{ action: 'execute', scope: 'workspace' }], status: 'active', createdAt: now, updatedAt: now, version: 1 },
  { id: 't5', name: 'run_tests', description: 'اجرای تست‌ها', category: 'test', schema: { input: { pattern: 'string' }, output: { results: 'object' } }, permissions: [{ action: 'execute', scope: 'workspace' }], status: 'active', createdAt: now, updatedAt: now, version: 1 },
  { id: 't6', name: 'git_commit', description: 'ایجاد commit', category: 'git', schema: { input: { message: 'string', files: 'array' }, output: { sha: 'string' } }, permissions: [{ action: 'execute', scope: 'git' }], status: 'active', createdAt: now, updatedAt: now, version: 1 },
  { id: 't7', name: 'security_scan', description: 'اسکن امنیتی', category: 'external', schema: { input: { scope: 'string' }, output: { vulnerabilities: 'array' } }, connectorId: 'c3', permissions: [{ action: 'execute', scope: 'external' }], status: 'active', createdAt: now, updatedAt: now, version: 1 },
  { id: 't8', name: 'get_project_overview', description: 'دریافت overview پروژه از Codebase Intelligence', category: 'context', schema: { input: {}, output: { overview: 'string' } }, permissions: [{ action: 'read', scope: 'codebase' }], status: 'active', createdAt: now, updatedAt: now, version: 1 },
];

export const mockConnectors: Connector[] = [
  { id: 'c1', name: 'GitHub', type: 'git', description: 'اتصال به GitHub', adapterType: 'rest', config: { baseUrl: 'https://api.github.com' }, credentialRef: 'vault://github-token', capabilities: ['clone', 'push', 'pull', 'pr'], status: 'active', createdAt: now, updatedAt: now, version: 1, lastHealthCheck: now },
  { id: 'c2', name: 'GitLab CI', type: 'ci_cd', description: 'اتصال به GitLab CI/CD', adapterType: 'rest', config: { baseUrl: 'https://gitlab.com/api/v4' }, credentialRef: 'vault://gitlab-token', capabilities: ['trigger-pipeline', 'get-status'], status: 'active', createdAt: now, updatedAt: now, version: 1, lastHealthCheck: now },
  { id: 'c3', name: 'Snyk', type: 'custom', description: 'اسکن امنیتی', adapterType: 'rest', config: { baseUrl: 'https://api.snyk.io' }, credentialRef: 'vault://snyk-token', capabilities: ['vulnerability-scan', 'license-check'], status: 'active', createdAt: now, updatedAt: now, version: 1, lastHealthCheck: now },
  { id: 'c4', name: 'Slack', type: 'notification', description: 'ارسال اعلان به Slack', adapterType: 'rest', config: { webhookUrl: '***' }, credentialRef: 'vault://slack-webhook', capabilities: ['send-message', 'create-channel'], status: 'inactive', createdAt: now, updatedAt: now, version: 1 },
  { id: 'c5', name: 'OpenAI', type: 'llm', description: 'LLM Provider', adapterType: 'sdk', config: { model: 'gpt-4o' }, credentialRef: 'vault://openai-key', capabilities: ['chat', 'embedding', 'function-calling'], status: 'active', createdAt: now, updatedAt: now, version: 1, lastHealthCheck: now },
];

export const mockWorkflows: Workflow[] = [
  { id: 'w1', name: 'Software Development', description: 'Workflow استاندارد توسعه نرم‌افزار', scope: 'platform', status: 'active', config: { allowParallel: true, validationRequired: true, approvalRequired: false, agentSelectionStrategy: 'dynamic' }, steps: [
    { id: 's1', name: 'Planning', type: 'agent', agentRole: 'planner', dependencies: [], retryPolicy: { maxRetries: 1, backoffMs: 5000 } },
    { id: 's2', name: 'Architecture', type: 'agent', agentRole: 'architect', dependencies: ['s1'] },
    { id: 's3', name: 'Implementation', type: 'parallel', dependencies: ['s2'] },
    { id: 's4', name: 'Testing', type: 'agent', agentRole: 'qa', dependencies: ['s3'] },
    { id: 's5', name: 'Review', type: 'agent', agentRole: 'reviewer', dependencies: ['s4'] },
    { id: 's6', name: 'Deploy', type: 'validation', dependencies: ['s5'], condition: 'review_passed' },
  ], createdAt: now, updatedAt: now, version: 3 },
  { id: 'w2', name: 'Security Review', description: 'Workflow بررسی امنیتی', scope: 'platform', status: 'active', config: { allowParallel: false, validationRequired: true, approvalRequired: true, agentSelectionStrategy: 'static' }, steps: [
    { id: 's1', name: 'Scan', type: 'agent', agentRole: 'security', dependencies: [] },
    { id: 's2', name: 'Analysis', type: 'agent', agentRole: 'security', dependencies: ['s1'] },
    { id: 's3', name: 'Approval', type: 'approval', dependencies: ['s2'] },
  ], createdAt: now, updatedAt: now, version: 1 },
  { id: 'w3', name: 'Bug Fix', description: 'Workflow رفع باگ سریع', scope: 'project', status: 'draft', config: { allowParallel: false, validationRequired: true, approvalRequired: false, agentSelectionStrategy: 'dynamic' }, steps: [
    { id: 's1', name: 'Analyze', type: 'agent', agentRole: 'developer', dependencies: [] },
    { id: 's2', name: 'Fix', type: 'agent', agentRole: 'developer', dependencies: ['s1'] },
    { id: 's3', name: 'Test', type: 'agent', agentRole: 'qa', dependencies: ['s2'] },
  ], createdAt: now, updatedAt: now, version: 1 },
];

export const mockTasks: Task[] = [
  { id: 'tk1', title: 'پیاده‌سازی OAuth2 Login', description: 'اضافه کردن OAuth2 login با Google و GitHub', projectId: 'p1', status: 'executing', priority: 'high', branch: 'feature/oauth2-login', workflowId: 'w1', assignedAgents: ['a1', 'a2', 'a4', 'a5'], currentStep: 's3', createdAt: now, updatedAt: now, version: 1,
    plan: { steps: [
      { id: 'ps1', title: 'تحلیل معماری OAuth2', agentId: 'a1', status: 'completed' },
      { id: 'ps2', title: 'پیاده‌سازی Security Config', agentId: 'a2', status: 'completed' },
      { id: 'ps3', title: 'پیاده‌سازی OAuth2 Controllers', agentId: 'a2', status: 'running' },
      { id: 'ps4', title: 'بررسی امنیتی', agentId: 'a5', status: 'pending' },
      { id: 'ps5', title: 'Code Review', agentId: 'a4', status: 'pending' },
    ], requiredCapabilities: ['security', 'spring-security', 'oauth2'], selectedAgents: ['a1', 'a2', 'a4', 'a5'] }
  },
  { id: 'tk2', title: 'طراحی Dashboard Analytics', description: 'ایجاد صفحه داشبورد با نمودارها و آمار', projectId: 'p2', status: 'completed', priority: 'medium', branch: 'feature/analytics-dashboard', workflowId: 'w1', assignedAgents: ['a3', 'a4', 'a6'], createdAt: now, updatedAt: now, version: 1,
    result: { summary: 'داشبورد analytics با موفقیت پیاده‌سازی شد', changes: [{ path: 'src/pages/Dashboard.tsx', action: 'created', linesAdded: 340, linesRemoved: 0 }, { path: 'src/components/Chart.tsx', action: 'created', linesAdded: 120, linesRemoved: 0 }], commitSha: 'abc123f', prUrl: 'https://github.com/org/user-dashboard/pull/15', testResults: { total: 24, passed: 24, failed: 0, skipped: 0, duration: 3200 } }
  },
  { id: 'tk3', title: 'بهینه‌سازی Query های Database', description: 'بهبود performance کوئری‌های کند', projectId: 'p3', status: 'review', priority: 'critical', branch: 'perf/db-optimization', workflowId: 'w1', assignedAgents: ['a2', 'a4'], currentStep: 's5', createdAt: now, updatedAt: now, version: 1 },
  { id: 'tk4', title: 'اضافه کردن Rate Limiting', description: 'پیاده‌سازی rate limiting در API Gateway', projectId: 'p3', status: 'planning', priority: 'high', workflowId: 'w1', assignedAgents: [], createdAt: now, updatedAt: now, version: 1 },
  { id: 'tk5', title: 'Refactor Notification Templates', description: 'بازنویسی قالب‌های اعلان', projectId: 'p4', status: 'failed', priority: 'low', branch: 'refactor/templates', workflowId: 'w1', assignedAgents: ['a2'], createdAt: now, updatedAt: now, version: 1 },
];

export const mockSkills: Skill[] = [
  { id: 's1', name: 'Java', domain: 'Programming Language', description: 'تسلط بر Java 21+', level: 'expert', tags: ['backend', 'jvm'], createdAt: now, updatedAt: now, version: 1 },
  { id: 's2', name: 'System Design', domain: 'Architecture', description: 'طراحی سیستم‌های مقیاس‌پذیر', level: 'expert', tags: ['architecture'], createdAt: now, updatedAt: now, version: 1 },
  { id: 's3', name: 'Spring Boot', domain: 'Framework', description: 'توسعه با Spring Boot 4', level: 'expert', tags: ['backend', 'framework'], createdAt: now, updatedAt: now, version: 1 },
  { id: 's4', name: 'Database Design', domain: 'Data', description: 'طراحی دیتابیس و بهینه‌سازی', level: 'intermediate', tags: ['database'], createdAt: now, updatedAt: now, version: 1 },
  { id: 's5', name: 'React', domain: 'Frontend', description: 'توسعه فرانت‌اند با React 19', level: 'expert', tags: ['frontend', 'ui'], createdAt: now, updatedAt: now, version: 1 },
  { id: 's6', name: 'TypeScript', domain: 'Programming Language', description: 'TypeScript پیشرفته', level: 'expert', tags: ['frontend', 'types'], createdAt: now, updatedAt: now, version: 1 },
  { id: 's7', name: 'Security', domain: 'Security', description: 'امنیت اپلیکیشن و OWASP', level: 'intermediate', tags: ['security'], createdAt: now, updatedAt: now, version: 1 },
  { id: 's8', name: 'Compliance', domain: 'Security', description: 'استانداردهای امنیتی و compliance', level: 'basic', tags: ['security', 'compliance'], createdAt: now, updatedAt: now, version: 1 },
  { id: 's9', name: 'Testing', domain: 'Quality', description: 'تست نویسی و اتوماسیون تست', level: 'expert', tags: ['testing', 'qa'], createdAt: now, updatedAt: now, version: 1 },
];

export const mockRoles: Role[] = [
  { id: 'r1', name: 'Architect', description: 'معمار سیستم', responsibilities: ['تحلیل معماری', 'طراحی سیستم', 'بررسی design patterns'], constraints: ['تغییر مستقیم کد ممنوع'], referencedSkills: ['s1', 's2'], referencedPrompts: [], createdAt: now, updatedAt: now, version: 1 },
  { id: 'r2', name: 'Backend Developer', description: 'توسعه‌دهنده بک‌اند', responsibilities: ['پیاده‌سازی API', 'نوشتن business logic', 'بهینه‌سازی performance'], constraints: ['تغییرات باید backward compatible باشد'], referencedSkills: ['s1', 's3', 's4'], referencedPrompts: [], createdAt: now, updatedAt: now, version: 1 },
  { id: 'r3', name: 'Frontend Developer', description: 'توسعه‌دهنده فرانت‌اند', responsibilities: ['پیاده‌سازی UI', 'مدیریت state', 'بهینه‌سازی UX'], constraints: ['RTL support الزامی است'], referencedSkills: ['s5', 's6'], referencedPrompts: [], createdAt: now, updatedAt: now, version: 1 },
  { id: 'r4', name: 'Reviewer', description: 'بررسی‌کننده کد', responsibilities: ['Code Review', 'بررسی best practices', 'تایید merge'], constraints: ['نباید خودش کد بنویسد'], referencedSkills: ['s1', 's7'], referencedPrompts: [], createdAt: now, updatedAt: now, version: 1 },
  { id: 'r5', name: 'Security Reviewer', description: 'بررسی‌کننده امنیتی', responsibilities: ['اسکن آسیب‌پذیری', 'بررسی OWASP', 'تایید امنیتی'], constraints: [], referencedSkills: ['s7', 's8'], referencedPrompts: [], createdAt: now, updatedAt: now, version: 1 },
];

export const mockKnowledge: KnowledgeEntry[] = [
  { id: 'k1', title: 'Java Coding Standards', content: 'استانداردهای کدنویسی Java برای تمام پروژه‌ها...', category: 'standards', scope: 'platform', filePath: '.platform/knowledge/java-standards.md', tags: ['java', 'standards'], createdAt: now, updatedAt: now, version: 2 },
  { id: 'k2', title: 'Spring Boot Best Practices', content: 'بهترین روش‌های استفاده از Spring Boot 4...', category: 'conventions', scope: 'platform', filePath: '.platform/knowledge/spring-boot.md', tags: ['spring', 'backend'], createdAt: now, updatedAt: now, version: 1 },
  { id: 'k3', title: 'Payment Service Architecture', content: 'معماری میکروسرویس پرداخت...', category: 'architecture', scope: 'project', projectId: 'p1', filePath: '.ai/knowledge/architecture.md', tags: ['architecture', 'payment'], createdAt: now, updatedAt: now, version: 3 },
  { id: 'k4', title: 'ADR-001: Database Choice', content: 'تصمیم‌گیری برای استفاده از PostgreSQL...', category: 'adr', scope: 'project', projectId: 'p1', filePath: '.ai/decisions/adr-001.md', tags: ['database', 'adr'], createdAt: now, updatedAt: now, version: 1 },
  { id: 'k5', title: 'API Design Guidelines', content: 'راهنمای طراحی RESTful API...', category: 'instructions', scope: 'platform', filePath: '.platform/knowledge/api-guidelines.md', tags: ['api', 'rest'], createdAt: now, updatedAt: now, version: 2 },
];

export const mockTeams: AgentTeam[] = [
  { id: 't1', name: 'Payment Service Team', projectId: 'p1', status: 'active', members: [
    { agentId: 'a1', role: 'architect', enabled: true, projectConfig: {} },
    { agentId: 'a2', role: 'backend-developer', enabled: true, projectConfig: {} },
    { agentId: 'a4', role: 'reviewer', enabled: true, projectConfig: {} },
    { agentId: 'a5', role: 'security', enabled: true, projectConfig: {} },
    { agentId: 'a6', role: 'qa', enabled: true, projectConfig: {} },
    { agentId: 'a7', role: 'planner', enabled: true, projectConfig: {} },
  ], createdAt: now, updatedAt: now, version: 2 },
  { id: 't2', name: 'Dashboard Team', projectId: 'p2', status: 'active', members: [
    { agentId: 'a3', role: 'frontend-developer', enabled: true, projectConfig: {} },
    { agentId: 'a4', role: 'reviewer', enabled: true, projectConfig: {} },
    { agentId: 'a6', role: 'qa', enabled: true, projectConfig: {} },
  ], createdAt: now, updatedAt: now, version: 1 },
];

export const mockDashboardStats: DashboardStats = {
  totalProjects: 4,
  activeTasks: 3,
  completedTasks: 12,
  totalAgents: 7,
  totalTools: 8,
  successRate: 87,
  recentActivity: [
    { id: 'act1', type: 'task_completed', message: 'Task "طراحی Dashboard Analytics" تکمیل شد', projectId: 'p2', projectName: 'User Dashboard', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { id: 'act2', type: 'pr_created', message: 'Pull Request #15 ایجاد شد', projectId: 'p2', projectName: 'User Dashboard', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'act3', type: 'agent_executed', message: 'Backend Agent در حال پیاده‌سازی OAuth2', projectId: 'p1', projectName: 'Payment Service', timestamp: new Date(Date.now() - 5400000).toISOString() },
    { id: 'act4', type: 'build_passed', message: 'Build با موفقیت انجام شد', projectId: 'p3', projectName: 'API Gateway', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'act5', type: 'task_started', message: 'Task "بهینه‌سازی Query" شروع شد', projectId: 'p3', projectName: 'API Gateway', timestamp: new Date(Date.now() - 10800000).toISOString() },
    { id: 'act6', type: 'build_failed', message: 'Build ناموفق — خطای compilation', projectId: 'p4', projectName: 'Notification Service', timestamp: new Date(Date.now() - 14400000).toISOString() },
  ],
};
