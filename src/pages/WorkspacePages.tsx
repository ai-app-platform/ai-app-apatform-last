import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Card, PageHeader, Badge, StatusBadge } from '../components/ui';
import { gitSimulator, type GitBranch, type GitCommit, type PullRequest } from '../engine/GitSimulator';
import { codebaseIntelligence, type CodebaseOverview, type CodeSearchResult } from '../engine/CodebaseIntelligence';
import { ragIndexer, type RAGIndexStatus } from '../engine/RAGIndexer';
import { FolderGit2, GitBranch as BranchIcon, GitCommit as CommitIcon, GitPullRequest, Search, Database, FileCode, Layers, RefreshCw } from 'lucide-react';

// ============================================
// Workspace & Git Page
// ============================================
export function WorkspacePage() {
  const { projects } = useStore();
  const [selectedProject, setSelectedProject] = useState<string>('p1');
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedProject]);

  const loadData = async () => {
    setLoading(true);
    const project = projects.find(p => p.id === selectedProject);
    if (project) {
      await gitSimulator.checkout(project.id, project.repositoryUrl, project.defaultBranch);
    }
    setBranches(gitSimulator.getBranches(selectedProject));
    setCommits(gitSimulator.getCommitHistory(selectedProject));
    setPullRequests(gitSimulator.getPullRequests(selectedProject));
    setLoading(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Workspace & Git" description="مدیریت Workspace و عملیات Git" />

      {/* Project Selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-zinc-400">پروژه:</span>
        <div className="flex gap-2">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedProject === p.id ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workspace Info */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            Workspace
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">مسیر</span>
              <span className="text-zinc-200 font-mono text-xs" dir="ltr">/workspace/{selectedProject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Branch فعلی</span>
              <span className="text-zinc-200">{branches.find(b => !b.isDefault)?.name || 'main'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">وضعیت</span>
              <Badge variant="success">Clean</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">تعداد Branch</span>
              <span className="text-zinc-200">{branches.length}</span>
            </div>
          </div>
        </Card>

        {/* Branches */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <BranchIcon className="w-4 h-4 text-emerald-400" />
            Branches
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {branches.map(branch => (
              <div key={branch.name} className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/20">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${branch.isDefault ? 'bg-emerald-400' : branch.isTaskBranch ? 'bg-indigo-400' : 'bg-zinc-400'}`} />
                  <span className="text-xs font-mono text-zinc-300" dir="ltr">{branch.name}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono" dir="ltr">{branch.sha.substring(0, 7)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pull Requests */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-purple-400" />
            Pull Requests
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {pullRequests.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">PR وجود ندارد</p>
            ) : (
              pullRequests.map(pr => (
                <div key={pr.id} className="p-2 rounded-lg bg-zinc-800/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">#{pr.id} {pr.title}</span>
                    <Badge variant={pr.status === 'open' ? 'success' : pr.status === 'merged' ? 'purple' : 'default'}>
                      {pr.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500">
                    <span dir="ltr">{pr.sourceBranch} → {pr.targetBranch}</span>
                    <span>+{pr.additions} -{pr.deletions}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Commit History */}
      <Card className="p-5 mt-6">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <CommitIcon className="w-4 h-4 text-amber-400" />
          Commit History
        </h3>
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {commits.slice(-10).reverse().map(commit => (
            <div key={commit.sha} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-indigo-300" dir="ltr">{commit.sha.substring(0, 7)}</span>
                <span className="text-xs text-zinc-300">{commit.message}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                <span>{commit.author}</span>
                <span dir="ltr">{commit.branch}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================
// Codebase Intelligence Page
// ============================================
export function CodebasePage() {
  const { projects } = useStore();
  const [selectedProject, setSelectedProject] = useState<string>('p1');
  const [overview, setOverview] = useState<CodebaseOverview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CodeSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    codebaseIntelligence.initMockData();
    loadOverview();
  }, [selectedProject]);

  const loadOverview = async () => {
    const ov = codebaseIntelligence.getOverview(selectedProject);
    if (ov) {
      setOverview(ov);
    } else {
      const result = await codebaseIntelligence.analyzeProject(selectedProject);
      setOverview(result);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const results = await codebaseIntelligence.search(selectedProject, searchQuery);
    setSearchResults(results);
    setSearching(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Codebase Intelligence" description="درک هوشمند از کدبیس پروژه" />

      {/* Project Selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-zinc-400">پروژه:</span>
        <div className="flex gap-2">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedProject(p.id); setOverview(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedProject === p.id ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <Card className="p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="جستجو در کدبیس... (مثلاً: Payment, Auth, Config)"
              className="w-full pr-10 pl-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {searching ? 'جستجو...' : 'جستجو'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((result, i) => (
              <div key={i} className="p-3 rounded-lg bg-zinc-800/20 border border-zinc-800/40">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-medium text-zinc-200">{result.symbol?.name}</span>
                    <Badge>{result.symbol?.type}</Badge>
                  </div>
                  <span className="text-xs text-zinc-500">Relevance: {(result.relevance * 100).toFixed(0)}%</span>
                </div>
                <p className="text-xs text-zinc-500 font-mono" dir="ltr">{result.symbol?.file}</p>
                {result.snippet && (
                  <pre className="mt-2 text-xs text-zinc-400 bg-[#0a0c14] p-2 rounded font-mono overflow-x-auto" dir="ltr">
                    {result.snippet}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overview Stats */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                <div className="text-xl font-bold text-white">{overview.totalFiles}</div>
                <div className="text-xs text-zinc-500">فایل</div>
              </div>
              <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                <div className="text-xl font-bold text-white">{overview.totalSymbols}</div>
                <div className="text-xs text-zinc-500">Symbol</div>
              </div>
              <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                <div className="text-xl font-bold text-white">{overview.totalLines.toLocaleString()}</div>
                <div className="text-xs text-zinc-500">خط کد</div>
              </div>
              <div className="p-3 bg-zinc-800/30 rounded-lg text-center">
                <div className="text-xl font-bold text-white">{overview.modules.length}</div>
                <div className="text-xs text-zinc-500">ماژول</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              <div>Parser: v{overview.parserVersion} | Index: v{overview.indexVersion}</div>
              <div dir="ltr">Last commit: {overview.lastCommit}</div>
            </div>
          </Card>

          {/* Modules */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Modules
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {overview.modules.map(mod => (
                <div key={mod.name} className="p-2.5 rounded-lg bg-zinc-800/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-zinc-200">{mod.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span>{mod.files} files</span>
                      <span>{mod.symbols} symbols</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono" dir="ltr">{mod.path}</p>
                  {mod.dependencies.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {mod.dependencies.map(dep => (
                        <span key={dep} className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 rounded">{dep}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ============================================
// RAG Index Page (Enhanced)
// ============================================
export function RAGIndexPage() {
  const [statuses, setStatuses] = useState<RAGIndexStatus[]>([]);
  const [reindexing, setReindexing] = useState<string | null>(null);

  useEffect(() => {
    ragIndexer.initMockData();
    setTimeout(() => {
      setStatuses(ragIndexer.getAllStatuses());
    }, 2000);
  }, []);

  const handleReindex = async (projectId: string) => {
    setReindexing(projectId);
    await ragIndexer.fullIndex(projectId, [
      { path: 'src/main/java/com/app/service/PaymentService.java', content: 'public class PaymentService { ... }' },
      { path: 'src/main/java/com/app/controller/PaymentController.java', content: 'public class PaymentController { ... }' },
    ]);
    setStatuses(ragIndexer.getAllStatuses());
    setReindexing(null);
  };

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="RAG Index" description="مدیریت Index و بازیابی اطلاعات" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {['p1', 'p2', 'p3', 'p4'].map(pid => {
          const status = statuses.find(s => s.projectId === pid);
          return (
            <Card key={pid} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Project {pid}</h3>
                {status && (
                  <Badge variant={status.status === 'ready' ? 'success' : status.status === 'indexing' ? 'warning' : 'default'}>
                    {status.status === 'ready' ? 'آماده' : status.status === 'indexing' ? 'در حال Index' : status.status}
                  </Badge>
                )}
              </div>
              {status ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Chunks</span>
                    <span className="text-zinc-200">{status.totalChunks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Embedding Model</span>
                    <span className="text-zinc-200 font-mono" dir="ltr">{status.embeddingModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Parser Version</span>
                    <span className="text-zinc-200">v{status.parserVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Index Version</span>
                    <span className="text-zinc-200">v{status.indexVersion}</span>
                  </div>
                  {status.lastIndexedCommit && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Last Commit</span>
                      <span className="text-zinc-200 font-mono" dir="ltr">{status.lastIndexedCommit}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-500">Index نشده</p>
              )}
              <button
                onClick={() => handleReindex(pid)}
                disabled={reindexing === pid}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${reindexing === pid ? 'animate-spin' : ''}`} />
                {reindexing === pid ? 'در حال Reindex...' : 'Reindex'}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Architecture */}
      <Card className="p-5 mt-6">
        <h3 className="text-sm font-bold text-white mb-3">RAG Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-800/20 rounded-lg">
            <h4 className="text-xs font-semibold text-indigo-300 mb-2">Vector Search</h4>
            <p className="text-xs text-zinc-400">Qdrant — Semantic similarity search with embeddings</p>
          </div>
          <div className="p-4 bg-zinc-800/20 rounded-lg">
            <h4 className="text-xs font-semibold text-purple-300 mb-2">Graph Traversal</h4>
            <p className="text-xs text-zinc-400">Neo4j — Relationship and dependency traversal</p>
          </div>
          <div className="p-4 bg-zinc-800/20 rounded-lg">
            <h4 className="text-xs font-semibold text-emerald-300 mb-2">Hybrid Retrieval</h4>
            <p className="text-xs text-zinc-400">Vector + Lexical + Metadata + Reranking</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
