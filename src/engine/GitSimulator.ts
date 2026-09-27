// ============================================
// Git Operations Simulator
// شبیه‌سازی عملیات Git
// ============================================

export interface GitCommit {
  sha: string;
  message: string;
  author: string;
  timestamp: string;
  files: string[];
  branch: string;
}

export interface GitBranch {
  name: string;
  sha: string;
  isDefault: boolean;
  isTaskBranch: boolean;
  taskId?: string;
  createdAt: string;
}

export interface GitDiff {
  file: string;
  additions: number;
  deletions: number;
  status: 'added' | 'modified' | 'deleted';
}

export interface PullRequest {
  id: number;
  title: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'merged' | 'closed';
  commits: number;
  filesChanged: number;
  additions: number;
  deletions: number;
  createdAt: string;
  taskId: string;
}

export interface GitRepository {
  projectId: string;
  url: string;
  defaultBranch: string;
  branches: GitBranch[];
  commits: GitCommit[];
  pullRequests: PullRequest[];
}

// Generate random SHA
function generateSHA(): string {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

// Simulated repositories
const repositories: Map<string, GitRepository> = new Map();

function getOrCreateRepo(projectId: string, url: string, defaultBranch: string): GitRepository {
  if (!repositories.has(projectId)) {
    const initialSha = generateSHA();
    repositories.set(projectId, {
      projectId,
      url,
      defaultBranch,
      branches: [
        { name: defaultBranch, sha: initialSha, isDefault: true, isTaskBranch: false, createdAt: new Date().toISOString() },
      ],
      commits: [
        { sha: initialSha, message: 'Initial commit', author: 'system', timestamp: new Date().toISOString(), files: [], branch: defaultBranch },
      ],
      pullRequests: [],
    });
  }
  return repositories.get(projectId)!;
}

export const gitSimulator = {
  // Clone/Checkout
  async checkout(projectId: string, url: string, defaultBranch: string): Promise<{ success: boolean; workspace: string }> {
    await delay(500);
    getOrCreateRepo(projectId, url, defaultBranch);
    return { success: true, workspace: `/workspace/${projectId}` };
  },

  // Create task branch
  async createTaskBranch(projectId: string, taskTitle: string): Promise<GitBranch> {
    await delay(300);
    const repo = repositories.get(projectId);
    if (!repo) throw new Error('Repository not found');
    
    const branchName = `task/${taskTitle.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}`;
    const sha = repo.commits[repo.commits.length - 1]?.sha || generateSHA();
    
    const branch: GitBranch = {
      name: branchName,
      sha,
      isDefault: false,
      isTaskBranch: true,
      taskId: taskTitle,
      createdAt: new Date().toISOString(),
    };
    
    repo.branches.push(branch);
    return branch;
  },

  // Commit changes
  async commit(projectId: string, branch: string, message: string, files: string[]): Promise<GitCommit> {
    await delay(400);
    const repo = repositories.get(projectId);
    if (!repo) throw new Error('Repository not found');
    
    const commit: GitCommit = {
      sha: generateSHA(),
      message,
      author: 'AI Agent',
      timestamp: new Date().toISOString(),
      files,
      branch,
    };
    
    repo.commits.push(commit);
    
    // Update branch SHA
    const branchObj = repo.branches.find(b => b.name === branch);
    if (branchObj) branchObj.sha = commit.sha;
    
    return commit;
  },

  // Push to remote
  async push(projectId: string, branch: string): Promise<{ success: boolean; remoteUrl: string }> {
    await delay(600);
    const repo = repositories.get(projectId);
    if (!repo) throw new Error('Repository not found');
    return { success: true, remoteUrl: `${repo.url}/tree/${branch}` };
  },

  // Create Pull Request
  async createPullRequest(projectId: string, title: string, sourceBranch: string, targetBranch: string, taskId: string, filesChanged: number): Promise<PullRequest> {
    await delay(500);
    const repo = repositories.get(projectId);
    if (!repo) throw new Error('Repository not found');
    
    const pr: PullRequest = {
      id: repo.pullRequests.length + 1,
      title,
      sourceBranch,
      targetBranch,
      status: 'open',
      commits: Math.floor(Math.random() * 5) + 1,
      filesChanged,
      additions: Math.floor(Math.random() * 300) + 50,
      deletions: Math.floor(Math.random() * 50),
      createdAt: new Date().toISOString(),
      taskId,
    };
    
    repo.pullRequests.push(pr);
    return pr;
  },

  // Get diff between commits
  async getDiff(projectId: string, fromSha: string, toSha: string): Promise<GitDiff[]> {
    await delay(200);
    const count = Math.floor(Math.random() * 5) + 2;
    return Array.from({ length: count }, () => ({
      file: `src/main/java/com/app/${['service', 'controller', 'config', 'dto'][Math.floor(Math.random() * 4)]}/Example.java`,
      additions: Math.floor(Math.random() * 100) + 5,
      deletions: Math.floor(Math.random() * 20),
      status: (['added', 'modified', 'modified', 'modified'] as const)[Math.floor(Math.random() * 4)],
    }));
  },

  // Get repository info
  getRepository(projectId: string): GitRepository | undefined {
    return repositories.get(projectId);
  },

  // Get all branches
  getBranches(projectId: string): GitBranch[] {
    return repositories.get(projectId)?.branches || [];
  },

  // Get commit history
  getCommitHistory(projectId: string, branch?: string): GitCommit[] {
    const repo = repositories.get(projectId);
    if (!repo) return [];
    if (branch) return repo.commits.filter(c => c.branch === branch);
    return repo.commits;
  },

  // Get pull requests
  getPullRequests(projectId: string): PullRequest[] {
    return repositories.get(projectId)?.pullRequests || [];
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
