package com.platform.engine.context;

import com.platform.engine.codebase.CodebaseIntelligenceService;
import com.platform.engine.rag.RAGService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

/**
 * Context Engine — responsible for collecting and assembling context for agents.
 * 
 * IMPORTANT:
 * - Context Engine does NOT own the sources
 * - Context Engine only ASSEMBLES context
 * - Agent should NOT read entire project for every task
 * 
 * Sources:
 * - Platform Knowledge
 * - Project Knowledge / Instructions
 * - Workflow context
 * - Agent / Role / Skill definitions
 * - Project Memory / Chat Memory
 * - Task State
 * - Codebase Intelligence
 * - Workspace / Source Code
 * - RAG
 * - Tools
 * - Current Task
 * 
 * Local-First / Layered Retrieval:
 * Level 1: Canonical Local Context (.ai/knowledge, .ai/instructions, .ai/decisions)
 * Level 2: Current Codebase (.ai/codebase, Workspace, Local Code Search)
 * Level 3: Deep / Historical Retrieval (RAG, Vector Search, Graph Search, Long-Term Memory)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContextEngineService {
    
    private final CodebaseIntelligenceService codebaseService;
    private final RAGService ragService;
    
    /**
     * Assemble context for an agent execution.
     */
    public AssembledContext assembleContext(ContextRequest request) {
        log.info("Assembling context for task: {}, agent: {}", request.taskId(), request.agentId());
        
        List<ContextSource> sources = new ArrayList<>();
        
        // Level 1: Canonical Local Context
        sources.addAll(resolveProjectKnowledge(request.projectId()));
        sources.addAll(resolveProjectInstructions(request.projectId()));
        sources.addAll(resolvePlatformKnowledge());
        
        // Level 2: Current Codebase
        sources.addAll(resolveCodebaseContext(request.projectId(), request.taskDescription()));
        
        // Level 3: Deep / Historical Retrieval
        sources.addAll(resolveRAGContext(request.projectId(), request.taskDescription()));
        sources.addAll(resolveMemoryContext(request.projectId(), request.taskId()));
        
        // Sort by relevance
        sources.sort((a, b) -> Double.compare(b.relevance(), a.relevance()));
        
        // Build final prompt
        String finalPrompt = buildFinalPrompt(request, sources);
        
        int tokenCount = estimateTokens(finalPrompt);
        
        return new AssembledContext(
            request.taskId(),
            request.agentId(),
            Instant.now().toString(),
            tokenCount,
            sources,
            finalPrompt
        );
    }
    
    /**
     * Get the recommended retrieval order.
     */
    public List<RetrievalStep> getRetrievalOrder() {
        return List.of(
            new RetrievalStep(1, "Direct Task Context", "Task description, requirements, constraints"),
            new RetrievalStep(2, "Project Knowledge / Instructions", ".ai/knowledge, .ai/instructions"),
            new RetrievalStep(3, "Current Project Codebase Intelligence", ".ai/codebase, current code understanding"),
            new RetrievalStep(4, "Workspace / Local Code", "Actual files in workspace"),
            new RetrievalStep(5, "Relevant Memory", "Runtime memory, past decisions"),
            new RetrievalStep(6, "RAG / Deep Retrieval", "Vector search, graph traversal"),
            new RetrievalStep(7, "External Connector Data", "External APIs, documentation")
        );
    }
    
    // --- Level 1: Canonical Local Context ---
    
    private List<ContextSource> resolveProjectKnowledge(String projectId) {
        // In production, read from .ai/knowledge/ files
        return List.of(
            new ContextSource(1, "Project Knowledge", ".ai/knowledge/architecture.md",
                "## Project Architecture\nThis is a Spring Boot microservice using Java 21 with modular architecture.\nKey patterns: Service layer, Repository pattern, DTO pattern.",
                0.95),
            new ContextSource(1, "Project Decisions", ".ai/decisions/adr-001.md",
                "## ADR-001: Database Choice\nDecision: Use PostgreSQL for data storage.\nRationale: ACID compliance, JSON support, mature ecosystem.",
                0.88)
        );
    }
    
    private List<ContextSource> resolveProjectInstructions(String projectId) {
        return List.of(
            new ContextSource(1, "Coding Standards", ".ai/instructions/coding-standards.md",
                "## Coding Standards\n- Use constructor injection\n- Follow SOLID principles\n- Write unit tests for all services\n- Use records for DTOs",
                0.92)
        );
    }
    
    private List<ContextSource> resolvePlatformKnowledge() {
        return List.of(
            new ContextSource(1, "Platform Java Standards", "Platform Knowledge v2.1",
                "## Java Standards\n- Java 21 features: records, sealed classes, pattern matching\n- Spring Boot 4 conventions\n- Reactive programming where appropriate",
                0.85)
        );
    }
    
    // --- Level 2: Current Codebase ---
    
    private List<ContextSource> resolveCodebaseContext(String projectId, String taskDescription) {
        List<ContextSource> sources = new ArrayList<>();
        
        var overview = codebaseService.getOverview(projectId);
        if (overview != null) {
            sources.add(new ContextSource(2, "Codebase Overview", ".ai/codebase/overview.md",
                String.format("## Codebase Overview\n- %d files, %d symbols\n- %d modules",
                    overview.totalFiles(), overview.totalSymbols(), overview.modules().size()),
                0.85));
        }
        
        // Search for relevant code
        var searchResults = codebaseService.search(projectId, extractKeywords(taskDescription));
        for (var result : searchResults.stream().limit(3).toList()) {
            sources.add(new ContextSource(2, "Relevant Code: " + result.symbol().name(),
                result.symbol().file(),
                String.format("Symbol: %s (%s)\nFile: %s",
                    result.symbol().name(), result.symbol().type(), result.symbol().file()),
                result.relevance()));
        }
        
        return sources;
    }
    
    // --- Level 3: Deep / Historical Retrieval ---
    
    private List<ContextSource> resolveRAGContext(String projectId, String taskDescription) {
        var results = ragService.hybridSearch(projectId, taskDescription, 3);
        
        return results.stream()
            .map(r -> new ContextSource(3, "RAG: " + r.chunk().filePath(),
                "Retrieved from vector index",
                r.chunk().content().substring(0, Math.min(200, r.chunk().content().length())),
                r.score() * 0.8))
            .toList();
    }
    
    private List<ContextSource> resolveMemoryContext(String projectId, String taskId) {
        // In production, read from .ai/runtime/ and long-term memory
        return List.of(
            new ContextSource(3, "Memory: Previous Decisions", "Long-term memory",
                "Decision: Use OAuth2 with JWT tokens for API authentication.\nSession management disabled for API endpoints.",
                0.72)
        );
    }
    
    // --- Prompt Building ---
    
    private String buildFinalPrompt(ContextRequest request, List<ContextSource> sources) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("You are an AI coding agent working on task: \"")
              .append(request.taskDescription())
              .append("\"\n\n");
        
        prompt.append("## Context\n");
        for (ContextSource source : sources) {
            prompt.append("\n### ").append(source.name()).append("\n");
            prompt.append(source.data()).append("\n");
        }
        
        prompt.append("\n## Your Task\n");
        prompt.append(request.taskDescription()).append("\n\n");
        
        prompt.append("## Instructions\n");
        prompt.append("- Analyze the provided context carefully\n");
        prompt.append("- Make changes that follow the project's coding standards\n");
        prompt.append("- Ensure backward compatibility\n");
        prompt.append("- Write tests for new functionality\n");
        prompt.append("- Consider security implications\n");
        
        return prompt.toString();
    }
    
    // --- Helpers ---
    
    private String extractKeywords(String text) {
        // Simplified keyword extraction
        return text.replaceAll("[^a-zA-Z\\s]", "")
                   .toLowerCase()
                   .split("\\s+")[0];
    }
    
    private int estimateTokens(String text) {
        // Rough estimation: ~4 characters per token
        return text.length() / 4;
    }
    
    // --- DTOs ---
    
    public record ContextRequest(String taskId, String agentId, String projectId, String taskDescription) {}
    
    public record ContextSource(int level, String name, String description, String data, double relevance) {}
    
    public record AssembledContext(String taskId, String agentId, String timestamp, int tokenCount, List<ContextSource> sources, String finalPrompt) {}
    
    public record RetrievalStep(int step, String source, String description) {}
}
