// ============================================
// Codebase Intelligence Simulator
// شبیه‌سازی تحلیل کدبیس
// ============================================

export interface CodeSymbol {
  name: string;
  type: 'class' | 'interface' | 'method' | 'field' | 'enum' | 'package';
  file: string;
  lineStart: number;
  lineEnd: number;
  visibility: 'public' | 'private' | 'protected';
  dependencies: string[];
  documentation?: string;
}

export interface CodeModule {
  name: string;
  path: string;
  files: number;
  symbols: number;
  complexity: number;
  dependencies: string[];
  language: string;
}

export interface CodebaseOverview {
  projectId: string;
  totalFiles: number;
  totalSymbols: number;
  totalLines: number;
  languages: Record<string, number>;
  modules: CodeModule[];
  lastCommit: string;
  lastAnalyzed: string;
  parserVersion: string;
  indexVersion: string;
}

export interface CodeSearchResult {
  symbol?: CodeSymbol;
  file?: string;
  relevance: number;
  snippet?: string;
}

// Mock codebase data
function generateCodebase(projectId: string): CodebaseOverview {
  const modules: CodeModule[] = [
    { name: 'core', path: 'src/main/java/com/app/core', files: 12, symbols: 45, complexity: 3.2, dependencies: [], language: 'java' },
    { name: 'service', path: 'src/main/java/com/app/service', files: 18, symbols: 72, complexity: 4.5, dependencies: ['core', 'repository'], language: 'java' },
    { name: 'controller', path: 'src/main/java/com/app/controller', files: 8, symbols: 32, complexity: 2.1, dependencies: ['service', 'dto'], language: 'java' },
    { name: 'repository', path: 'src/main/java/com/app/repository', files: 10, symbols: 28, complexity: 1.8, dependencies: ['core'], language: 'java' },
    { name: 'config', path: 'src/main/java/com/app/config', files: 6, symbols: 15, complexity: 2.5, dependencies: [], language: 'java' },
    { name: 'dto', path: 'src/main/java/com/app/dto', files: 14, symbols: 42, complexity: 1.2, dependencies: [], language: 'java' },
    { name: 'security', path: 'src/main/java/com/app/security', files: 7, symbols: 24, complexity: 3.8, dependencies: ['core', 'config'], language: 'java' },
    { name: 'test', path: 'src/test/java/com/app', files: 22, symbols: 56, complexity: 2.0, dependencies: ['service', 'controller'], language: 'java' },
  ];

  return {
    projectId,
    totalFiles: modules.reduce((sum, m) => sum + m.files, 0),
    totalSymbols: modules.reduce((sum, m) => sum + m.symbols, 0),
    totalLines: modules.reduce((sum, m) => sum + m.files * 120, 0),
    languages: { java: 85, xml: 8, yaml: 4, properties: 3 },
    modules,
    lastCommit: Math.random().toString(36).substring(2, 10),
    lastAnalyzed: new Date().toISOString(),
    parserVersion: '2.1.0',
    indexVersion: '1.5.0',
  };
}

// Mock symbols
function generateSymbols(query: string): CodeSearchResult[] {
  const symbolNames = [
    'PaymentService', 'PaymentController', 'PaymentRepository',
    'AuthService', 'SecurityConfig', 'OAuth2Config',
    'UserEntity', 'TransactionDTO', 'PaymentRequest',
    'PaymentValidator', 'TransactionManager', 'BillingService',
  ];

  const filtered = symbolNames.filter(s => 
    s.toLowerCase().includes(query.toLowerCase()) || query === ''
  );

  return filtered.slice(0, 5).map(name => ({
    symbol: {
      name,
      type: name.endsWith('Service') ? 'class' : name.endsWith('Config') ? 'class' : name.endsWith('DTO') || name.endsWith('Request') ? 'class' : 'class',
      file: `src/main/java/com/app/${name.includes('Payment') ? 'service' : name.includes('Auth') || name.includes('Security') ? 'security' : 'controller'}/${name}.java`,
      lineStart: Math.floor(Math.random() * 50) + 1,
      lineEnd: Math.floor(Math.random() * 200) + 100,
      visibility: 'public',
      dependencies: ['Logger', 'Repository', 'DTO'].slice(0, Math.floor(Math.random() * 3) + 1),
      documentation: `${name} handles ${name.includes('Payment') ? 'payment processing' : name.includes('Auth') ? 'authentication' : 'data management'}`,
    },
    relevance: 0.95 - Math.random() * 0.3,
    snippet: `public class ${name} {\n    // ${name} implementation\n    @Autowired\n    private Repository repository;\n}`,
  }));
}

const codebases = new Map<string, CodebaseOverview>();

export const codebaseIntelligence = {
  // Full analysis
  async analyzeProject(projectId: string): Promise<CodebaseOverview> {
    await delay(2000);
    const overview = generateCodebase(projectId);
    codebases.set(projectId, overview);
    return overview;
  },

  // Incremental update
  async incrementalUpdate(projectId: string, changedFiles: string[]): Promise<{ updated: boolean; affectedSymbols: number }> {
    await delay(800);
    return {
      updated: true,
      affectedSymbols: changedFiles.length * 3,
    };
  },

  // Get overview
  getOverview(projectId: string): CodebaseOverview | undefined {
    return codebases.get(projectId);
  },

  // Search codebase
  async search(projectId: string, query: string): Promise<CodeSearchResult[]> {
    await delay(400);
    return generateSymbols(query);
  },

  // Get symbol context
  async getSymbolContext(projectId: string, symbolName: string): Promise<CodeSymbol | null> {
    await delay(200);
    const results = generateSymbols(symbolName);
    return results[0]?.symbol || null;
  },

  // Get module dependencies
  async getModuleDependencies(projectId: string, moduleName: string): Promise<{ module: string; dependsOn: string[]; dependedBy: string[] }> {
    await delay(300);
    const overview = codebases.get(projectId);
    const mod = overview?.modules.find(m => m.name === moduleName);
    return {
      module: moduleName,
      dependsOn: mod?.dependencies || [],
      dependedBy: overview?.modules.filter(m => m.dependencies.includes(moduleName)).map(m => m.name) || [],
    };
  },

  // Get file context
  async getFileContext(projectId: string, filePath: string): Promise<{ content: string; symbols: string[]; imports: string[] }> {
    await delay(300);
    return {
      content: `// ${filePath}\npackage com.app;\n\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class ExampleService {\n    // Implementation\n}`,
      symbols: ['ExampleService', 'processData', 'validate'],
      imports: ['org.springframework.stereotype.Service', 'org.springframework.beans.factory.annotation.Autowired'],
    };
  },

  // Initialize with mock data
  initMockData() {
    ['p1', 'p2', 'p3', 'p4'].forEach(pid => {
      codebases.set(pid, generateCodebase(pid));
    });
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
