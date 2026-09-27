// ============================================
// RAG Indexer Simulator
// شبیه‌سازی سیستم RAG
// ============================================

export interface RAGChunk {
  id: string;
  projectId: string;
  filePath: string;
  symbol?: string;
  lineRange: [number, number];
  content: string;
  contentHash: string;
  embedding: number[]; // Simulated embedding vector
  metadata: {
    language: string;
    type: 'code' | 'documentation' | 'knowledge' | 'memory';
    commitSha: string;
    parserVersion: string;
    embeddingVersion: string;
    indexedAt: string;
  };
}

export interface RAGSearchResult {
  chunk: RAGChunk;
  score: number;
  highlight?: string;
}

export interface RAGIndexStatus {
  projectId: string;
  totalChunks: number;
  status: 'idle' | 'indexing' | 'ready' | 'updating' | 'error';
  lastIndexedCommit?: string;
  embeddingModel: string;
  parserVersion: string;
  indexVersion: string;
  updatedAt: string;
}

// Generate simulated embedding (32 dimensions for demo)
function generateEmbedding(): number[] {
  return Array.from({ length: 32 }, () => Math.random() * 2 - 1);
}

// Generate chunks from content
function generateChunks(projectId: string, filePath: string, content: string, commitSha: string): RAGChunk[] {
  const lines = content.split('\n');
  const chunks: RAGChunk[] = [];
  const chunkSize = 10;

  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunkLines = lines.slice(i, i + chunkSize);
    chunks.push({
      id: `chunk_${projectId}_${filePath}_${i}`.replace(/[^a-zA-Z0-9_]/g, '_'),
      projectId,
      filePath,
      lineRange: [i + 1, i + chunkLines.length],
      content: chunkLines.join('\n'),
      contentHash: Math.random().toString(36).substring(2, 10),
      embedding: generateEmbedding(),
      metadata: {
        language: 'java',
        type: 'code',
        commitSha,
        parserVersion: '2.1.0',
        embeddingVersion: '1.0.0',
        indexedAt: new Date().toISOString(),
      },
    });
  }

  return chunks;
}

// In-memory chunk store
const chunkStore = new Map<string, RAGChunk[]>();
const indexStatuses = new Map<string, RAGIndexStatus>();

export const ragIndexer = {
  // Full index
  async fullIndex(projectId: string, files: { path: string; content: string }[]): Promise<RAGIndexStatus> {
    // Set status to indexing
    indexStatuses.set(projectId, {
      projectId,
      totalChunks: 0,
      status: 'indexing',
      embeddingModel: 'text-embedding-3-small',
      parserVersion: '2.1.0',
      indexVersion: '1.5.0',
      updatedAt: new Date().toISOString(),
    });

    await delay(1500);

    const commitSha = Math.random().toString(36).substring(2, 10);
    const allChunks: RAGChunk[] = [];

    for (const file of files) {
      const chunks = generateChunks(projectId, file.path, file.content, commitSha);
      allChunks.push(...chunks);
    }

    chunkStore.set(projectId, allChunks);

    const status: RAGIndexStatus = {
      projectId,
      totalChunks: allChunks.length,
      status: 'ready',
      lastIndexedCommit: commitSha,
      embeddingModel: 'text-embedding-3-small',
      parserVersion: '2.1.0',
      indexVersion: '1.5.0',
      updatedAt: new Date().toISOString(),
    };

    indexStatuses.set(projectId, status);
    return status;
  },

  // Incremental update
  async incrementalUpdate(projectId: string, changedFiles: { path: string; content: string }[], commitSha: string): Promise<RAGIndexStatus> {
    const existing = chunkStore.get(projectId) || [];
    
    // Remove old chunks for changed files
    const changedPaths = new Set(changedFiles.map(f => f.path));
    const filtered = existing.filter(c => !changedPaths.has(c.filePath));

    // Add new chunks
    const newChunks: RAGChunk[] = [];
    for (const file of changedFiles) {
      const chunks = generateChunks(projectId, file.path, file.content, commitSha);
      newChunks.push(...chunks);
    }

    chunkStore.set(projectId, [...filtered, ...newChunks]);

    const status: RAGIndexStatus = {
      projectId,
      totalChunks: filtered.length + newChunks.length,
      status: 'ready',
      lastIndexedCommit: commitSha,
      embeddingModel: 'text-embedding-3-small',
      parserVersion: '2.1.0',
      indexVersion: '1.5.0',
      updatedAt: new Date().toISOString(),
    };

    indexStatuses.set(projectId, status);
    return status;
  },

  // Vector search (simulated)
  async search(projectId: string, query: string, topK: number = 5): Promise<RAGSearchResult[]> {
    await delay(300);
    const chunks = chunkStore.get(projectId) || [];
    
    // Simulate relevance scoring
    const scored = chunks.map(chunk => ({
      chunk,
      score: Math.random() * 0.5 + (chunk.content.toLowerCase().includes(query.toLowerCase()) ? 0.5 : 0),
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(r => ({
        ...r,
        highlight: r.chunk.content.substring(0, 100) + '...',
      }));
  },

  // Hybrid search (simulated)
  async hybridSearch(projectId: string, query: string, topK: number = 5): Promise<RAGSearchResult[]> {
    await delay(500);
    // Simulate combining vector + lexical + graph search
    const vectorResults = await this.search(projectId, query, topK * 2);
    return vectorResults.slice(0, topK).map(r => ({
      ...r,
      score: r.score * 0.9 + Math.random() * 0.1, // Add some variation
    }));
  },

  // Get index status
  getStatus(projectId: string): RAGIndexStatus | undefined {
    return indexStatuses.get(projectId);
  },

  // Get all statuses
  getAllStatuses(): RAGIndexStatus[] {
    return Array.from(indexStatuses.values());
  },

  // Initialize mock data
  initMockData() {
    const mockFiles = [
      { path: 'src/main/java/com/app/service/PaymentService.java', content: 'package com.app.service;\n\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class PaymentService {\n    public void processPayment() {}\n    public void validatePayment() {}\n}' },
      { path: 'src/main/java/com/app/controller/PaymentController.java', content: 'package com.app.controller;\n\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\npublic class PaymentController {\n    @PostMapping("/payments")\n    public void createPayment() {}\n}' },
      { path: 'src/main/java/com/app/config/SecurityConfig.java', content: 'package com.app.config;\n\nimport org.springframework.context.annotation.Configuration;\n\n@Configuration\npublic class SecurityConfig {\n    // Security configuration\n}' },
    ];

    ['p1', 'p2', 'p3'].forEach(pid => {
      this.fullIndex(pid, mockFiles);
    });
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
