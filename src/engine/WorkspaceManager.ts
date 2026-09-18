// ============================================
// Workspace Manager Simulator
// شبیه‌سازی مدیریت Workspace
// ============================================

export interface WorkspaceFile {
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified: string;
  children?: WorkspaceFile[];
}

export interface WorkspaceState {
  projectId: string;
  rootPath: string;
  files: WorkspaceFile[];
  buildArtifacts: string[];
  testOutputs: string[];
  gitStatus: {
    branch: string;
    staged: string[];
    modified: string[];
    untracked: string[];
  };
}

// Generate mock workspace structure
function generateWorkspace(projectId: string): WorkspaceState {
  return {
    projectId,
    rootPath: `/workspace/${projectId}`,
    files: [
      {
        path: 'src', type: 'directory', lastModified: new Date().toISOString(),
        children: [
          {
            path: 'src/main', type: 'directory', lastModified: new Date().toISOString(),
            children: [
              {
                path: 'src/main/java', type: 'directory', lastModified: new Date().toISOString(),
                children: [
                  {
                    path: 'src/main/java/com/app', type: 'directory', lastModified: new Date().toISOString(),
                    children: [
                      { path: 'src/main/java/com/app/Application.java', type: 'file', size: 420, lastModified: new Date().toISOString() },
                      {
                        path: 'src/main/java/com/app/service', type: 'directory', lastModified: new Date().toISOString(),
                        children: [
                          { path: 'src/main/java/com/app/service/PaymentService.java', type: 'file', size: 2340, lastModified: new Date().toISOString() },
                          { path: 'src/main/java/com/app/service/AuthService.java', type: 'file', size: 1890, lastModified: new Date().toISOString() },
                          { path: 'src/main/java/com/app/service/UserService.java', type: 'file', size: 1560, lastModified: new Date().toISOString() },
                        ]
                      },
                      {
                        path: 'src/main/java/com/app/controller', type: 'directory', lastModified: new Date().toISOString(),
                        children: [
                          { path: 'src/main/java/com/app/controller/PaymentController.java', type: 'file', size: 1230, lastModified: new Date().toISOString() },
                          { path: 'src/main/java/com/app/controller/AuthController.java', type: 'file', size: 980, lastModified: new Date().toISOString() },
                        ]
                      },
                      {
                        path: 'src/main/java/com/app/config', type: 'directory', lastModified: new Date().toISOString(),
                        children: [
                          { path: 'src/main/java/com/app/config/SecurityConfig.java', type: 'file', size: 1450, lastModified: new Date().toISOString() },
                          { path: 'src/main/java/com/app/config/AppConfig.java', type: 'file', size: 670, lastModified: new Date().toISOString() },
                        ]
                      },
                      {
                        path: 'src/main/java/com/app/dto', type: 'directory', lastModified: new Date().toISOString(),
                        children: [
                          { path: 'src/main/java/com/app/dto/PaymentRequest.java', type: 'file', size: 540, lastModified: new Date().toISOString() },
                          { path: 'src/main/java/com/app/dto/PaymentResponse.java', type: 'file', size: 480, lastModified: new Date().toISOString() },
                        ]
                      },
                    ]
                  }
                ]
              },
              {
                path: 'src/main/resources', type: 'directory', lastModified: new Date().toISOString(),
                children: [
                  { path: 'src/main/resources/application.yml', type: 'file', size: 890, lastModified: new Date().toISOString() },
                  { path: 'src/main/resources/application-dev.yml', type: 'file', size: 450, lastModified: new Date().toISOString() },
                ]
              }
            ]
          },
          {
            path: 'src/test', type: 'directory', lastModified: new Date().toISOString(),
            children: [
              {
                path: 'src/test/java/com/app', type: 'directory', lastModified: new Date().toISOString(),
                children: [
                  { path: 'src/test/java/com/app/service/PaymentServiceTest.java', type: 'file', size: 3200, lastModified: new Date().toISOString() },
                  { path: 'src/test/java/com/app/service/AuthServiceTest.java', type: 'file', size: 2100, lastModified: new Date().toISOString() },
                ]
              }
            ]
          }
        ]
      },
      { path: 'pom.xml', type: 'file', size: 4500, lastModified: new Date().toISOString() },
      { path: 'README.md', type: 'file', size: 1200, lastModified: new Date().toISOString() },
      { path: '.gitignore', type: 'file', size: 340, lastModified: new Date().toISOString() },
      {
        path: '.ai', type: 'directory', lastModified: new Date().toISOString(),
        children: [
          {
            path: '.ai/knowledge', type: 'directory', lastModified: new Date().toISOString(),
            children: [
              { path: '.ai/knowledge/architecture.md', type: 'file', size: 2400, lastModified: new Date().toISOString() },
              { path: '.ai/knowledge/conventions.md', type: 'file', size: 1800, lastModified: new Date().toISOString() },
            ]
          },
          {
            path: '.ai/instructions', type: 'directory', lastModified: new Date().toISOString(),
            children: [
              { path: '.ai/instructions/coding-standards.md', type: 'file', size: 1500, lastModified: new Date().toISOString() },
            ]
          },
          {
            path: '.ai/codebase', type: 'directory', lastModified: new Date().toISOString(),
            children: [
              { path: '.ai/codebase/overview.md', type: 'file', size: 3200, lastModified: new Date().toISOString() },
              { path: '.ai/codebase/architecture.md', type: 'file', size: 2800, lastModified: new Date().toISOString() },
              { path: '.ai/codebase/modules.md', type: 'file', size: 1900, lastModified: new Date().toISOString() },
            ]
          },
          {
            path: '.ai/runtime', type: 'directory', lastModified: new Date().toISOString(),
            children: [
              { path: '.ai/runtime/current-task.md', type: 'file', size: 450, lastModified: new Date().toISOString() },
              { path: '.ai/runtime/current-plan.md', type: 'file', size: 890, lastModified: new Date().toISOString() },
              { path: '.ai/runtime/discoveries.md', type: 'file', size: 340, lastModified: new Date().toISOString() },
              { path: '.ai/runtime/decisions.md', type: 'file', size: 560, lastModified: new Date().toISOString() },
            ]
          },
        ]
      },
    ],
    buildArtifacts: ['target/classes', 'target/test-classes', 'target/surefire-reports'],
    testOutputs: ['target/surefire-reports/TEST-com.app.service.PaymentServiceTest.xml'],
    gitStatus: {
      branch: 'main',
      staged: [],
      modified: [],
      untracked: [],
    },
  };
}

const workspaces = new Map<string, WorkspaceState>();

export const workspaceManager = {
  // Initialize workspace for a project
  async initialize(projectId: string): Promise<WorkspaceState> {
    await delay(500);
    const ws = generateWorkspace(projectId);
    workspaces.set(projectId, ws);
    return ws;
  },

  // Get workspace state
  getWorkspace(projectId: string): WorkspaceState | undefined {
    return workspaces.get(projectId);
  },

  // Read file content (simulated)
  async readFile(projectId: string, filePath: string): Promise<{ content: string; size: number }> {
    await delay(200);
    return {
      content: `// ${filePath}\n// Auto-generated content for simulation\n\npackage com.app;\n\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class ExampleService {\n    // Implementation here\n}`,
      size: Math.floor(Math.random() * 5000) + 500,
    };
  },

  // Write file (simulated)
  async writeFile(projectId: string, filePath: string, content: string): Promise<{ success: boolean }> {
    await delay(300);
    return { success: true };
  },

  // Execute command (simulated)
  async executeCommand(projectId: string, command: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    await delay(1000);
    
    if (command.includes('mvn build') || command.includes('mvn compile')) {
      return {
        exitCode: 0,
        stdout: '[INFO] Scanning for projects...\n[INFO] Building app 1.0.0\n[INFO] Compiling 42 source files\n[INFO] BUILD SUCCESS\n[INFO] Total time: 3.2s',
        stderr: '',
      };
    }
    
    if (command.includes('mvn test')) {
      return {
        exitCode: 0,
        stdout: '[INFO] Running tests...\n[INFO] Tests run: 24, Failures: 0, Errors: 0, Skipped: 2\n[INFO] BUILD SUCCESS',
        stderr: '',
      };
    }

    if (command.includes('git status')) {
      const ws = workspaces.get(projectId);
      return {
        exitCode: 0,
        stdout: `On branch ${ws?.gitStatus.branch || 'main'}\nnothing to commit, working tree clean`,
        stderr: '',
      };
    }

    return { exitCode: 0, stdout: 'Command executed successfully', stderr: '' };
  },

  // Clean workspace
  async clean(projectId: string): Promise<{ success: boolean }> {
    await delay(500);
    const ws = workspaces.get(projectId);
    if (ws) {
      ws.buildArtifacts = [];
      ws.testOutputs = [];
    }
    return { success: true };
  },

  // Initialize mock data
  initMockData() {
    ['p1', 'p2', 'p3', 'p4'].forEach(pid => {
      workspaces.set(pid, generateWorkspace(pid));
    });
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
