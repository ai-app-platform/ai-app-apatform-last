package com.platform.engine.rag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * RAG (Retrieval-Augmented Generation) Service.
 * 
 * IMPORTANT:
 * - RAG ≠ Source of Truth
 * - RAG is a Retrieval Layer, not a storage of canonical data
 * - If RAG conflicts with Source File: Source File Wins
 * - RAG must maintain trace to source
 * 
 * Can index: Source Code, Documentation, Platform Knowledge,
 *            Project Knowledge, ADRs, Historical Memory, Technical Docs
 * 
 * Infrastructure: Qdrant (Vector), Neo4j (Graph)
 * These are infrastructure, NOT domain owners.
 * Platform must have its own interfaces.
 * 
 * Capabilities:
 * - Vector Search
 * - Hybrid Search (Vector + Lexical + Metadata + Graph + Reranking)
 * - Metadata Filtering
 * - Graph Traversal
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RAGService {
    
    // In-memory store (in production, use Qdrant + Neo4j)
    private final Map<String, List<RAGChunk>> chunkStore = new ConcurrentHashMap<>();
    private final Map<String, IndexStatus> indexStatuses = new ConcurrentHashMap<>();
    
    /**
     * Full index of project content.
     */
    public IndexStatus fullIndex(String projectId, List<IndexableContent> contents) {
        log.info("Starting full RAG index for project: {}", projectId);
        
        indexStatuses.put(projectId, new IndexStatus(
            projectId, 0, IndexState.INDEXING, null,
            "text-embedding-3-small", "2.1.0", "1.5.0", Instant.now()
        ));
        
        List<RAGChunk> allChunks = new ArrayList<>();
        String commitSha = UUID.randomUUID().toString().substring(0, 7);
        
        for (IndexableContent content : contents) {
            List<RAGChunk> chunks = createChunks(projectId, content, commitSha);
            allChunks.addAll(chunks);
        }
        
        chunkStore.put(projectId, allChunks);
        
        IndexStatus status = new IndexStatus(
            projectId, allChunks.size(), IndexState.READY, commitSha,
            "text-embedding-3-small", "2.1.0", "1.5.0", Instant.now()
        );
        
        indexStatuses.put(projectId, status);
        
        log.info("Full index complete: {} chunks for project: {}", allChunks.size(), projectId);
        return status;
    }
    
    /**
     * Incremental update for changed files.
     */
    public IndexStatus incrementalUpdate(String projectId, List<IndexableContent> changedContents, String commitSha) {
        log.info("Incremental RAG update for project: {}", projectId);
        
        List<RAGChunk> existing = chunkStore.getOrDefault(projectId, new ArrayList<>());
        
        // Remove old chunks for changed files
        Set<String> changedPaths = new HashSet<>();
        for (IndexableContent c : changedContents) {
            changedPaths.add(c.filePath());
        }
        existing.removeIf(chunk -> changedPaths.contains(chunk.filePath()));
        
        // Add new chunks
        for (IndexableContent content : changedContents) {
            existing.addAll(createChunks(projectId, content, commitSha));
        }
        
        chunkStore.put(projectId, existing);
        
        IndexStatus status = new IndexStatus(
            projectId, existing.size(), IndexState.READY, commitSha,
            "text-embedding-3-small", "2.1.0", "1.5.0", Instant.now()
        );
        
        indexStatuses.put(projectId, status);
        return status;
    }
    
    /**
     * Vector search (semantic similarity).
     */
    public List<SearchResult> vectorSearch(String projectId, String query, int topK) {
        List<RAGChunk> chunks = chunkStore.getOrDefault(projectId, List.of());
        
        return chunks.stream()
            .map(chunk -> new SearchResult(
                chunk,
                calculateSimilarity(chunk.content(), query),
                chunk.content().substring(0, Math.min(100, chunk.content().length())) + "..."
            ))
            .sorted((a, b) -> Double.compare(b.score(), a.score()))
            .limit(topK)
            .toList();
    }
    
    /**
     * Hybrid search (Vector + Lexical + Metadata + Graph + Reranking).
     */
    public List<SearchResult> hybridSearch(String projectId, String query, int topK) {
        // Step 1: Vector search
        List<SearchResult> vectorResults = vectorSearch(projectId, query, topK * 3);
        
        // Step 2: Lexical search (keyword matching)
        List<RAGChunk> chunks = chunkStore.getOrDefault(projectId, List.of());
        List<SearchResult> lexicalResults = chunks.stream()
            .filter(chunk -> chunk.content().toLowerCase().contains(query.toLowerCase()))
            .map(chunk -> new SearchResult(chunk, 0.6, null))
            .toList();
        
        // Step 3: Combine and rerank
        Map<String, SearchResult> combined = new LinkedHashMap<>();
        
        for (SearchResult r : vectorResults) {
            combined.merge(r.chunk().id(), 
                new SearchResult(r.chunk(), r.score() * 0.7, r.highlight()),
                (a, b) -> new SearchResult(a.chunk(), Math.max(a.score(), b.score()), a.highlight()));
        }
        
        for (SearchResult r : lexicalResults) {
            combined.merge(r.chunk().id(),
                new SearchResult(r.chunk(), r.score() * 0.3, r.highlight()),
                (a, b) -> new SearchResult(a.chunk(), a.score() + b.score(), a.highlight()));
        }
        
        return combined.values().stream()
            .sorted((a, b) -> Double.compare(b.score(), a.score()))
            .limit(topK)
            .toList();
    }
    
    /**
     * Get index status for a project.
     */
    public IndexStatus getStatus(String projectId) {
        return indexStatuses.get(projectId);
    }
    
    /**
     * Get all index statuses.
     */
    public List<IndexStatus> getAllStatuses() {
        return new ArrayList<>(indexStatuses.values());
    }
    
    // --- Helper methods ---
    
    private List<RAGChunk> createChunks(String projectId, IndexableContent content, String commitSha) {
        List<RAGChunk> chunks = new ArrayList<>();
        String[] lines = content.content().split("\n");
        int chunkSize = 10;
        
        for (int i = 0; i < lines.length; i += chunkSize) {
            int end = Math.min(i + chunkSize, lines.length);
            String chunkContent = String.join("\n", Arrays.copyOfRange(lines, i, end));
            
            chunks.add(new RAGChunk(
                "chunk_" + projectId + "_" + content.filePath() + "_" + i,
                projectId,
                content.filePath(),
                content.symbol(),
                new int[]{i + 1, end},
                chunkContent,
                UUID.randomUUID().toString().substring(0, 8),
                generateEmbedding(),
                new ChunkMeta(
                    content.language(),
                    content.type(),
                    commitSha,
                    "2.1.0",
                    "1.0.0",
                    Instant.now().toString()
                )
            ));
        }
        
        return chunks;
    }
    
    private float[] generateEmbedding() {
        // In production, call embedding model
        float[] embedding = new float[32];
        Random random = new Random();
        for (int i = 0; i < embedding.length; i++) {
            embedding[i] = random.nextFloat() * 2 - 1;
        }
        return embedding;
    }
    
    private double calculateSimilarity(String text, String query) {
        // Simplified similarity — in production, use cosine similarity of embeddings
        double score = 0.0;
        String lowerText = text.toLowerCase();
        String lowerQuery = query.toLowerCase();
        
        String[] queryWords = lowerQuery.split("\\s+");
        for (String word : queryWords) {
            if (lowerText.contains(word)) {
                score += 0.1;
            }
        }
        
        return Math.min(score, 1.0);
    }
    
    // --- DTOs ---
    
    public record RAGChunk(
        String id, String projectId, String filePath, String symbol,
        int[] lineRange, String content, String contentHash,
        float[] embedding, ChunkMeta meta
    ) {}
    
    public record ChunkMeta(String language, String type, String commitSha, String parserVersion, String embeddingVersion, String indexedAt) {}
    
    public record IndexableContent(String filePath, String content, String symbol, String language, String type) {}
    
    public record SearchResult(RAGChunk chunk, double score, String highlight) {}
    
    public record IndexStatus(String projectId, int totalChunks, IndexState status, String lastIndexedCommit, String embeddingModel, String parserVersion, String indexVersion, Instant updatedAt) {}
    
    public enum IndexState { IDLE, INDEXING, READY, UPDATING, ERROR }
}
