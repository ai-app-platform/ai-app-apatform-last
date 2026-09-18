// ============================================
// Context Engine — جمع‌آوری و Assembly Context
// ============================================

export interface ContextSource {
  level: 1 | 2 | 3;
  name: string;
  description: string;
  data: string;
  relevance: number;
}

export interface AssembledContext {
  taskId: string;
  agentId: string;
  timestamp: string;
  tokenCount: number;
  sources: ContextSource[];
  finalPrompt: string;
}

export const contextEngine = {
  // Assemble context for an agent
  async assembleContext(
    taskId: string,
    agentId: string,
    projectId: string,
    taskDescription: string
  ): Promise<AssembledContext> {
    await delay(800);

    const sources: ContextSource[] = [
      // Level 1 — Canonical Local Context
      {
        level: 1,
        name: 'Project Knowledge',
        description: '.ai/knowledge/architecture.md',
        data: '## Project Architecture\nThis is a Spring Boot microservice using Java 21 with modular architecture...',
        relevance: 0.95,
      },
      {
        level: 1,
        name: 'Project Instructions',
        description: '.ai/instructions/coding-standards.md',
        data: '## Coding Standards\n- Use constructor injection\n- Follow SOLID principles\n- Write unit tests for all services',
        relevance: 0.92,
      },
      {
        level: 1,
        name: 'Platform Knowledge',
        description: 'Platform Java Standards v2.1',
        data: '## Java Standards\n- Java 21 features: records, sealed classes, pattern matching\n- Spring Boot 4 conventions',
        relevance: 0.88,
      },

      // Level 2 — Current Codebase
      {
        level: 2,
        name: 'Codebase Overview',
        description: '.ai/codebase/overview.md',
        data: '## Codebase Overview\n- 97 files, 314 symbols\n- 8 modules: core, service, controller, repository, config, dto, security, test',
        relevance: 0.85,
      },
      {
        level: 2,
        name: 'Relevant Code: PaymentService',
        description: 'src/main/java/com/app/service/PaymentService.java',
        data: 'public class PaymentService {\n    @Autowired private PaymentRepository repo;\n    public Payment process(PaymentRequest req) { ... }\n}',
        relevance: 0.90,
      },
      {
        level: 2,
        name: 'Relevant Code: SecurityConfig',
        description: 'src/main/java/com/app/config/SecurityConfig.java',
        data: '@Configuration\npublic class SecurityConfig {\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) { ... }\n}',
        relevance: 0.82,
      },

      // Level 3 — Deep / Historical Retrieval
      {
        level: 3,
        name: 'RAG: OAuth2 Implementation Pattern',
        description: 'Retrieved from vector index',
        data: 'OAuth2 implementation pattern: Use Spring Security OAuth2 Client with custom UserDetailsService...',
        relevance: 0.78,
      },
      {
        level: 3,
        name: 'Memory: Previous Security Decision',
        description: 'ADR-003: Authentication Approach',
        data: 'Decision: Use OAuth2 with JWT tokens. Session management disabled for API endpoints.',
        relevance: 0.75,
      },
    ];

    // Build final prompt
    const contextParts = sources
      .sort((a, b) => b.relevance - a.relevance)
      .map(s => `### ${s.name}\n${s.data}`)
      .join('\n\n');

    const finalPrompt = `You are an AI coding agent working on task: "${taskDescription}"

## Context
${contextParts}

## Your Task
${taskDescription}

## Instructions
- Analyze the provided context carefully
- Make changes that follow the project's coding standards
- Ensure backward compatibility
- Write tests for new functionality
- Consider security implications`;

    const tokenCount = Math.round(finalPrompt.length / 4); // Rough estimation

    return {
      taskId,
      agentId,
      timestamp: new Date().toISOString(),
      tokenCount,
      sources,
      finalPrompt,
    };
  },

  // Get context retrieval decision
  getRetrievalOrder(): { step: number; source: string; description: string }[] {
    return [
      { step: 1, source: 'Direct Task Context', description: 'Task description, requirements, constraints' },
      { step: 2, source: 'Project Knowledge / Instructions', description: '.ai/knowledge, .ai/instructions' },
      { step: 3, source: 'Codebase Intelligence', description: '.ai/codebase, current code understanding' },
      { step: 4, source: 'Workspace / Local Code', description: 'Actual files in workspace' },
      { step: 5, source: 'Relevant Memory', description: 'Runtime memory, past decisions' },
      { step: 6, source: 'RAG / Deep Retrieval', description: 'Vector search, graph traversal' },
      { step: 7, source: 'External Connector Data', description: 'External APIs, documentation' },
    ];
  },
};

// ============================================
// Memory Lifecycle Manager
// ============================================

export interface MemoryEvent {
  id: string;
  taskId: string;
  type: 'discovery' | 'decision' | 'error' | 'test_result' | 'code_change' | 'agent_output';
  content: string;
  timestamp: string;
  agentId?: string;
}

export interface RuntimeMemory {
  taskId: string;
  currentTask: string;
  currentPlan: string;
  discoveries: string[];
  decisions: string[];
  touchedFiles: string[];
  testResults: string;
  taskSummary: string;
}

export interface LongTermMemory {
  id: string;
  projectId: string;
  category: 'pattern' | 'decision' | 'lesson' | 'convention';
  content: string;
  source: string;
  validated: boolean;
  indexedInRAG: boolean;
  createdAt: string;
}

const runtimeMemories = new Map<string, RuntimeMemory>();
const longTermMemories: LongTermMemory[] = [];
const memoryEvents: MemoryEvent[] = [];

export const memoryManager = {
  // Record runtime event
  recordEvent(event: Omit<MemoryEvent, 'id' | 'timestamp'>) {
    const memEvent: MemoryEvent = {
      ...event,
      id: Math.random().toString(36).substring(2, 10),
      timestamp: new Date().toISOString(),
    };
    memoryEvents.push(memEvent);

    // Update runtime memory
    const runtime = runtimeMemories.get(event.taskId) || {
      taskId: event.taskId,
      currentTask: '',
      currentPlan: '',
      discoveries: [],
      decisions: [],
      touchedFiles: [],
      testResults: '',
      taskSummary: '',
    };

    switch (event.type) {
      case 'discovery':
        runtime.discoveries.push(event.content);
        break;
      case 'decision':
        runtime.decisions.push(event.content);
        break;
      case 'code_change':
        runtime.touchedFiles.push(event.content);
        break;
      case 'test_result':
        runtime.testResults = event.content;
        break;
    }

    runtimeMemories.set(event.taskId, runtime);
    return memEvent;
  },

  // Get runtime memory
  getRuntimeMemory(taskId: string): RuntimeMemory | undefined {
    return runtimeMemories.get(taskId);
  },

  // Promote to long-term memory
  async promoteToLongTerm(taskId: string, projectId: string): Promise<LongTermMemory[]> {
    await delay(500);
    const runtime = runtimeMemories.get(taskId);
    if (!runtime) return [];

    const promoted: LongTermMemory[] = [];

    // Promote decisions
    for (const decision of runtime.decisions) {
      const mem: LongTermMemory = {
        id: Math.random().toString(36).substring(2, 10),
        projectId,
        category: 'decision',
        content: decision,
        source: `task:${taskId}`,
        validated: true,
        indexedInRAG: false,
        createdAt: new Date().toISOString(),
      };
      promoted.push(mem);
      longTermMemories.push(mem);
    }

    // Promote discoveries as lessons
    for (const discovery of runtime.discoveries) {
      const mem: LongTermMemory = {
        id: Math.random().toString(36).substring(2, 10),
        projectId,
        category: 'lesson',
        content: discovery,
        source: `task:${taskId}`,
        validated: Math.random() > 0.3,
        indexedInRAG: false,
        createdAt: new Date().toISOString(),
      };
      promoted.push(mem);
      longTermMemories.push(mem);
    }

    return promoted;
  },

  // Index long-term memory in RAG
  async indexInRAG(memoryIds: string[]): Promise<{ indexed: number }> {
    await delay(300);
    let count = 0;
    for (const id of memoryIds) {
      const mem = longTermMemories.find(m => m.id === id);
      if (mem) {
        mem.indexedInRAG = true;
        count++;
      }
    }
    return { indexed: count };
  },

  // Get all long-term memories
  getLongTermMemories(projectId?: string): LongTermMemory[] {
    if (projectId) return longTermMemories.filter(m => m.projectId === projectId);
    return [...longTermMemories];
  },

  // Get memory events
  getEvents(taskId?: string): MemoryEvent[] {
    if (taskId) return memoryEvents.filter(e => e.taskId === taskId);
    return [...memoryEvents];
  },

  // Initialize mock data
  initMockData() {
    // Add some long-term memories
    const mockLTM: LongTermMemory[] = [
      { id: 'ltm1', projectId: 'p1', category: 'decision', content: 'Use PostgreSQL for payment data storage', source: 'task:tk1', validated: true, indexedInRAG: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'ltm2', projectId: 'p1', category: 'pattern', content: 'OAuth2 with JWT for API authentication', source: 'task:tk2', validated: true, indexedInRAG: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
      { id: 'ltm3', projectId: 'p1', category: 'lesson', content: 'Always validate payment amounts server-side', source: 'task:tk3', validated: true, indexedInRAG: false, createdAt: new Date(Date.now() - 259200000).toISOString() },
      { id: 'ltm4', projectId: 'p2', category: 'convention', content: 'Use React Query for data fetching in dashboard', source: 'task:tk4', validated: true, indexedInRAG: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
    ];
    longTermMemories.push(...mockLTM);
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
