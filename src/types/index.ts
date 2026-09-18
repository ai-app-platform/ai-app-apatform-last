// ============================================
// AI App Platform — Domain Types
// ============================================

// --- Base ---
export type ID = string;
export type Timestamp = string;

export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number;
}

// --- Project ---
export interface Project extends BaseEntity {
  name: string;
  description: string;
  repositoryUrl: string;
  defaultBranch: string;
  status: 'active' | 'archived' | 'paused';
  workspacePath?: string;
  lastIndexedCommit?: string;
  agentTeamId?: ID;
}

// --- Agent ---
export interface Agent extends BaseEntity {
  name: string;
  type: 'planner' | 'architect' | 'developer' | 'reviewer' | 'tester' | 'security' | 'qa' | 'custom';
  description: string;
  capabilities: string[];
  modelConfig: ModelConfig;
  allowedTools: ID[];
  skills: ID[];
  defaultPromptId?: ID;
  status: 'active' | 'inactive';
  runtimeConfig: Record<string, unknown>;
}

export interface ModelConfig {
  provider: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

// --- Role ---
export interface Role extends BaseEntity {
  name: string;
  description: string;
  responsibilities: string[];
  constraints: string[];
  referencedSkills: ID[];
  referencedPrompts: ID[];
}

// --- Skill ---
export interface Skill extends BaseEntity {
  name: string;
  domain: string;
  description: string;
  level: 'basic' | 'intermediate' | 'expert';
  tags: string[];
}

// --- Tool ---
export interface Tool extends BaseEntity {
  name: string;
  description: string;
  category: 'code' | 'git' | 'build' | 'test' | 'search' | 'file' | 'external' | 'context';
  schema: ToolSchema;
  connectorId?: ID;
  permissions: ToolPermission[];
  status: 'active' | 'deprecated';
}

export interface ToolSchema {
  input: Record<string, unknown>;
  output: Record<string, unknown>;
}

export interface ToolPermission {
  action: 'read' | 'write' | 'execute' | 'admin';
  scope: string;
}

// --- Connector ---
export interface Connector extends BaseEntity {
  name: string;
  type: 'git' | 'ci_cd' | 'issue_tracker' | 'notification' | 'storage' | 'llm' | 'custom';
  description: string;
  adapterType: 'rest' | 'graphql' | 'mcp' | 'sdk';
  config: Record<string, unknown>;
  credentialRef: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'error';
  lastHealthCheck?: Timestamp;
}

// --- Workflow ---
export interface Workflow extends BaseEntity {
  name: string;
  description: string;
  scope: 'platform' | 'project';
  steps: WorkflowStep[];
  config: WorkflowConfig;
  status: 'active' | 'draft' | 'archived';
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'agent' | 'validation' | 'approval' | 'parallel' | 'branch' | 'handoff';
  agentRole?: string;
  dependencies: string[];
  condition?: string;
  retryPolicy?: RetryPolicy;
}

export interface WorkflowConfig {
  allowParallel: boolean;
  validationRequired: boolean;
  approvalRequired: boolean;
  agentSelectionStrategy: 'dynamic' | 'static' | 'manual';
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
}

// --- Prompt ---
export interface Prompt extends BaseEntity {
  name: string;
  template: string;
  variables: string[];
  version: number;
  modelConfig?: ModelConfig;
  scope: 'platform' | 'project';
}

// --- Knowledge ---
export interface KnowledgeEntry extends BaseEntity {
  title: string;
  content: string;
  category: 'architecture' | 'standards' | 'conventions' | 'adr' | 'instructions';
  scope: 'platform' | 'project';
  projectId?: ID;
  filePath: string;
  tags: string[];
}

// --- Task ---
export interface Task extends BaseEntity {
  title: string;
  description: string;
  projectId: ID;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  branch?: string;
  workflowId?: ID;
  assignedAgents: ID[];
  plan?: TaskPlan;
  executionGraph?: ExecutionNode[];
  currentStep?: string;
  result?: TaskResult;
}

export type TaskStatus = 'created' | 'planning' | 'executing' | 'review' | 'testing' | 'completed' | 'failed' | 'cancelled';

export interface TaskPlan {
  steps: PlanStep[];
  requiredCapabilities: string[];
  selectedAgents: ID[];
  estimatedDuration?: number;
}

export interface PlanStep {
  id: string;
  title: string;
  agentId?: ID;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

export interface ExecutionNode {
  id: string;
  agentId: ID;
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: Timestamp;
  completedAt?: Timestamp;
}

export interface TaskResult {
  summary: string;
  changes: FileChange[];
  commitSha?: string;
  prUrl?: string;
  testResults?: TestResult;
}

export interface FileChange {
  path: string;
  action: 'created' | 'modified' | 'deleted';
  linesAdded: number;
  linesRemoved: number;
}

export interface TestResult {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

// --- Agent Team ---
export interface AgentTeam extends BaseEntity {
  name: string;
  projectId: ID;
  members: TeamMember[];
  status: 'active' | 'inactive';
}

export interface TeamMember {
  agentId: ID;
  role: string;
  enabled: boolean;
  projectConfig: Record<string, unknown>;
}

// --- Memory ---
export interface MemoryEntry {
  id: ID;
  projectId: ID;
  taskId?: ID;
  type: 'runtime' | 'long-term';
  category: 'task-state' | 'plan' | 'discovery' | 'decision' | 'test-result' | 'summary';
  content: string;
  filePath: string;
  createdAt: Timestamp;
}

// --- RAG Index ---
export interface RAGIndex {
  id: ID;
  projectId: ID;
  status: 'building' | 'ready' | 'updating' | 'error';
  totalChunks: number;
  lastIndexedCommit?: string;
  embeddingModel: string;
  parserVersion: string;
  indexVersion: string;
  updatedAt: Timestamp;
}

// --- Codebase Intelligence ---
export interface CodebaseIntelligence {
  projectId: ID;
  status: 'analyzing' | 'ready' | 'updating';
  totalFiles: number;
  totalSymbols: number;
  modules: CodeModule[];
  lastCommit: string;
  updatedAt: Timestamp;
}

export interface CodeModule {
  name: string;
  path: string;
  files: number;
  symbols: number;
  dependencies: string[];
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalProjects: number;
  activeTasks: number;
  completedTasks: number;
  totalAgents: number;
  totalTools: number;
  successRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: ID;
  type: 'task_completed' | 'task_started' | 'agent_executed' | 'pr_created' | 'build_passed' | 'build_failed';
  message: string;
  projectId: ID;
  projectName: string;
  timestamp: Timestamp;
}
