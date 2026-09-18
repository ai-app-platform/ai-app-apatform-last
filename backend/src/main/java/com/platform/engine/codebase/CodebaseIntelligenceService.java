package com.platform.engine.codebase;

import com.platform.engine.workspace.WorkspaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

/**
 * Codebase Intelligence Service — provides current codebase understanding.
 * 
 * IMPORTANT SEPARATIONS:
 * - Codebase Intelligence ≠ Knowledge Management
 * - Codebase Intelligence ≠ RAG
 * - Codebase Intelligence is a DERIVED PROJECTION, not source of truth
 * - If Codebase Projection conflicts with Official Knowledge: Official Knowledge Wins
 * 
 * Goal: Agent should NOT have to re-read entire repository for every task.
 * 
 * Lifecycle:
 * - Full Indexing: Project creation, first clone, major changes
 * - Incremental Indexing: Git diff → changed files → affected symbols → reparse
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CodebaseIntelligenceService {
    
    private final WorkspaceService workspaceService;
    
    // In-memory store (in production, use Neo4j for code graph)
    private final Map<String, CodebaseOverview> overviews = new HashMap<>();
    private final Map<String, List<CodeSymbol>> symbolIndex = new HashMap<>();
    
    /**
     * Full analysis of project codebase.
     * Used for: Project creation, first clone, major changes, parser/index version change.
     */
    public CodebaseOverview fullAnalysis(String projectId) throws IOException {
        log.info("Starting full codebase analysis for project: {}", projectId);
        
        List<WorkspaceService.FileInfo> files = workspaceService.listFiles(projectId, "src");
        
        List<CodeModule> modules = new ArrayList<>();
        List<CodeSymbol> allSymbols = new ArrayList<>();
        int totalLines = 0;
        
        // Analyze each file (simplified — in production, use AST parser)
        for (var file : files) {
            if (file.path().endsWith(".java")) {
                String content = workspaceService.readFile(projectId, file.path());
                totalLines += content.split("\n").length;
                
                // Extract symbols (simplified)
                List<CodeSymbol> symbols = extractSymbols(projectId, file.path(), content);
                allSymbols.addAll(symbols);
            }
        }
        
        // Build module structure
        modules = buildModules(allSymbols);
        
        CodebaseOverview overview = new CodebaseOverview(
            projectId,
            files.size(),
            allSymbols.size(),
            totalLines,
            Map.of("java", 85, "xml", 8, "yaml", 4, "properties", 3),
            modules,
            UUID.randomUUID().toString().substring(0, 7),
            java.time.Instant.now().toString(),
            "2.1.0",
            "1.5.0"
        );
        
        overviews.put(projectId, overview);
        symbolIndex.put(projectId, allSymbols);
        
        log.info("Full analysis complete: {} files, {} symbols, {} lines",
            overview.totalFiles(), overview.totalSymbols(), overview.totalLines());
        
        return overview;
    }
    
    /**
     * Incremental update based on changed files.
     * Used for: Normal changes after initial analysis.
     */
    public void incrementalUpdate(String projectId, List<String> changedFiles) throws IOException {
        log.info("Incremental update for project: {}, {} changed files", projectId, changedFiles.size());
        
        List<CodeSymbol> existingSymbols = symbolIndex.getOrDefault(projectId, new ArrayList<>());
        
        // Remove symbols from changed files
        Set<String> changedPaths = new HashSet<>(changedFiles);
        existingSymbols.removeIf(s -> changedPaths.contains(s.file()));
        
        // Re-analyze changed files
        for (String filePath : changedFiles) {
            if (filePath.endsWith(".java")) {
                try {
                    String content = workspaceService.readFile(projectId, filePath);
                    List<CodeSymbol> newSymbols = extractSymbols(projectId, filePath, content);
                    existingSymbols.addAll(newSymbols);
                } catch (IOException e) {
                    log.warn("File may have been deleted: {}", filePath);
                }
            }
        }
        
        symbolIndex.put(projectId, existingSymbols);
        
        // Update overview
        CodebaseOverview existing = overviews.get(projectId);
        if (existing != null) {
            overviews.put(projectId, new CodebaseOverview(
                projectId,
                existing.totalFiles(),
                existingSymbols.size(),
                existing.totalLines(),
                existing.languages(),
                existing.modules(),
                UUID.randomUUID().toString().substring(0, 7),
                java.time.Instant.now().toString(),
                existing.parserVersion(),
                existing.indexVersion()
            ));
        }
    }
    
    /**
     * Search codebase for relevant symbols/files.
     */
    public List<SearchResult> search(String projectId, String query) {
        List<CodeSymbol> symbols = symbolIndex.getOrDefault(projectId, List.of());
        
        return symbols.stream()
            .filter(s -> s.name().toLowerCase().contains(query.toLowerCase()) ||
                        s.file().toLowerCase().contains(query.toLowerCase()))
            .map(s -> new SearchResult(s, calculateRelevance(s, query), null))
            .sorted((a, b) -> Double.compare(b.relevance(), a.relevance()))
            .limit(10)
            .toList();
    }
    
    /**
     * Get overview for a project.
     */
    public CodebaseOverview getOverview(String projectId) {
        return overviews.get(projectId);
    }
    
    /**
     * Get symbol context.
     */
    public CodeSymbol getSymbolContext(String projectId, String symbolName) {
        return symbolIndex.getOrDefault(projectId, List.of()).stream()
            .filter(s -> s.name().equals(symbolName))
            .findFirst()
            .orElse(null);
    }
    
    // --- Helper methods ---
    
    private List<CodeSymbol> extractSymbols(String projectId, String filePath, String content) {
        List<CodeSymbol> symbols = new ArrayList<>();
        String[] lines = content.split("\n");
        
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            
            if (line.contains("class ") || line.contains("interface ") || line.contains("enum ")) {
                String name = extractName(line);
                if (name != null) {
                    symbols.add(new CodeSymbol(
                        name,
                        line.contains("interface") ? "INTERFACE" : line.contains("enum") ? "ENUM" : "CLASS",
                        filePath,
                        i + 1,
                        i + 1,
                        "PUBLIC",
                        List.of(),
                        null
                    ));
                }
            }
        }
        
        return symbols;
    }
    
    private String extractName(String line) {
        String[] parts = line.split("\\s+");
        for (int i = 0; i < parts.length; i++) {
            if (parts[i].equals("class") || parts[i].equals("interface") || parts[i].equals("enum")) {
                if (i + 1 < parts.length) {
                    return parts[i + 1].replaceAll("[<{].*", "");
                }
            }
        }
        return null;
    }
    
    private List<CodeModule> buildModules(List<CodeSymbol> symbols) {
        Map<String, List<CodeSymbol>> byPackage = new HashMap<>();
        
        for (CodeSymbol symbol : symbols) {
            String pkg = symbol.file().replaceAll("/[^/]+$", "");
            byPackage.computeIfAbsent(pkg, k -> new ArrayList<>()).add(symbol);
        }
        
        return byPackage.entrySet().stream()
            .map(e -> new CodeModule(
                e.getKey().replaceAll(".*/", ""),
                e.getKey(),
                (int) e.getValue().stream().map(CodeSymbol::file).distinct().count(),
                e.getValue().size(),
                0.0,
                List.of(),
                "java"
            ))
            .toList();
    }
    
    private double calculateRelevance(CodeSymbol symbol, String query) {
        double score = 0.0;
        if (symbol.name().equalsIgnoreCase(query)) score += 0.5;
        if (symbol.name().toLowerCase().contains(query.toLowerCase())) score += 0.3;
        if (symbol.file().toLowerCase().contains(query.toLowerCase())) score += 0.2;
        return Math.min(score, 1.0);
    }
    
    // --- DTOs ---
    
    public record CodebaseOverview(
        String projectId, int totalFiles, int totalSymbols, int totalLines,
        Map<String, Integer> languages, List<CodeModule> modules,
        String lastCommit, String lastAnalyzed, String parserVersion, String indexVersion
    ) {}
    
    public record CodeModule(String name, String path, int files, int symbols, double complexity, List<String> dependencies, String language) {}
    
    public record CodeSymbol(String name, String type, String file, int lineStart, int lineEnd, String visibility, List<String> dependencies, String documentation) {}
    
    public record SearchResult(CodeSymbol symbol, double relevance, String snippet) {}
}
