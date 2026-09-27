package com.platform.controller;

import com.platform.engine.codebase.CodebaseIntelligenceService;
import com.platform.engine.context.ContextEngineService;
import com.platform.engine.memory.MemoryManagerService;
import com.platform.engine.rag.RAGService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Engine Controllers — REST API for platform engines.
 */
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EngineControllers {
    
    // --- RAG Controller ---
    @RestController
    @RequestMapping("/rag")
    public static class RAGController {
        private final RAGService ragService;
        
        @GetMapping("/status")
        public List<RAGService.IndexStatus> getAllStatuses() {
            return ragService.getAllStatuses();
        }
        
        @GetMapping("/status/{projectId}")
        public ResponseEntity<RAGService.IndexStatus> getStatus(@PathVariable String projectId) {
            var status = ragService.getStatus(projectId);
            return status != null ? ResponseEntity.ok(status) : ResponseEntity.notFound().build();
        }
        
        @PostMapping("/index/{projectId}")
        public ResponseEntity<RAGService.IndexStatus> fullIndex(
            @PathVariable String projectId,
            @RequestBody List<RAGService.IndexableContent> contents
        ) {
            return ResponseEntity.ok(ragService.fullIndex(projectId, contents));
        }
        
        @PostMapping("/search/{projectId}")
        public ResponseEntity<List<RAGService.SearchResult>> search(
            @PathVariable String projectId,
            @RequestParam String query,
            @RequestParam(defaultValue = "5") int topK
        ) {
            return ResponseEntity.ok(ragService.hybridSearch(projectId, query, topK));
        }
    }
    
    // --- Codebase Intelligence Controller ---
    @RestController
    @RequestMapping("/codebase")
    public static class CodebaseController {
        private final CodebaseIntelligenceService codebaseService;
        
        @GetMapping("/overview/{projectId}")
        public ResponseEntity<CodebaseIntelligenceService.CodebaseOverview> getOverview(@PathVariable String projectId) {
            var overview = codebaseService.getOverview(projectId);
            return overview != null ? ResponseEntity.ok(overview) : ResponseEntity.notFound().build();
        }
        
        @PostMapping("/analyze/{projectId}")
        public ResponseEntity<CodebaseIntelligenceService.CodebaseOverview> analyze(@PathVariable String projectId) {
            try {
                return ResponseEntity.ok(codebaseService.fullAnalysis(projectId));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        }
        
        @PostMapping("/search/{projectId}")
        public ResponseEntity<List<CodebaseIntelligenceService.SearchResult>> search(
            @PathVariable String projectId,
            @RequestParam String query
        ) {
            return ResponseEntity.ok(codebaseService.search(projectId, query));
        }
        
        @GetMapping("/symbol/{projectId}/{symbolName}")
        public ResponseEntity<CodebaseIntelligenceService.CodeSymbol> getSymbol(
            @PathVariable String projectId,
            @PathVariable String symbolName
        ) {
            var symbol = codebaseService.getSymbolContext(projectId, symbolName);
            return symbol != null ? ResponseEntity.ok(symbol) : ResponseEntity.notFound().build();
        }
    }
    
    // --- Context Engine Controller ---
    @RestController
    @RequestMapping("/context")
    public static class ContextController {
        private final ContextEngineService contextEngine;
        
        @PostMapping("/assemble")
        public ResponseEntity<ContextEngineService.AssembledContext> assembleContext(
            @RequestBody ContextEngineService.ContextRequest request
        ) {
            return ResponseEntity.ok(contextEngine.assembleContext(request));
        }
        
        @GetMapping("/retrieval-order")
        public ResponseEntity<List<ContextEngineService.RetrievalStep>> getRetrievalOrder() {
            return ResponseEntity.ok(contextEngine.getRetrievalOrder());
        }
    }
    
    // --- Memory Controller ---
    @RestController
    @RequestMapping("/memory")
    public static class MemoryController {
        private final MemoryManagerService memoryManager;
        
        @GetMapping("/long-term")
        public List<MemoryManagerService.LongTermMemory> getLongTermMemories(
            @RequestParam(required = false) String projectId
        ) {
            return memoryManager.getLongTermMemories(projectId);
        }
        
        @GetMapping("/runtime/{taskId}")
        public ResponseEntity<MemoryManagerService.RuntimeMemory> getRuntimeMemory(@PathVariable String taskId) {
            var memory = memoryManager.getRuntimeMemory(taskId);
            return memory != null ? ResponseEntity.ok(memory) : ResponseEntity.notFound().build();
        }
        
        @GetMapping("/events")
        public List<MemoryManagerService.MemoryEvent> getEvents(
            @RequestParam(required = false) String taskId
        ) {
            return memoryManager.getEvents(taskId);
        }
        
        @PostMapping("/record")
        public ResponseEntity<MemoryManagerService.MemoryEvent> recordEvent(
            @RequestBody MemoryManagerService.MemoryEventRequest request
        ) {
            return ResponseEntity.ok(memoryManager.recordEvent(request));
        }
    }
}
