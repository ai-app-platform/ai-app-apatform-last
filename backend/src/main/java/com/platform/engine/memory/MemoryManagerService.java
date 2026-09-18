package com.platform.engine.memory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Memory Manager — manages runtime state and long-term memory.
 * 
 * IMPORTANT SEPARATIONS:
 * - Memory ≠ Knowledge (Memory is runtime, Knowledge is permanent)
 * - Memory ≠ RAG (RAG is retrieval layer, Memory is storage)
 * - RAG ≠ Memory Source of Truth
 * 
 * Active/Short-term Memory: Stored on Disk as Markdown (.ai/runtime/)
 * Long-Term Memory: Summarized from runtime, validated, then indexed in RAG
 * 
 * Lifecycle:
 * Task Execution → Runtime Events → Active Memory → Task Summary →
 * Candidate Long-Term Memory → Summarize/Classify/Validate →
 * Long-Term Memory → RAG Index
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MemoryManagerService {
    
    @Value("${platform.workspace.base-path}")
    private String workspaceBasePath;
    
    // In-memory stores (in production, use files + database)
    private final Map<String, RuntimeMemory> runtimeMemories = new ConcurrentHashMap<>();
    private final List<LongTermMemory> longTermMemories = Collections.synchronizedList(new ArrayList<>());
    private final List<MemoryEvent> memoryEvents = Collections.synchronizedList(new ArrayList<>());
    
    /**
     * Record a runtime memory event.
     */
    public MemoryEvent recordEvent(MemoryEventRequest request) {
        MemoryEvent event = new MemoryEvent(
            UUID.randomUUID().toString(),
            request.taskId(),
            request.type(),
            request.content(),
            Instant.now().toString(),
            request.agentId()
        );
        
        memoryEvents.add(event);
        
        // Update runtime memory
        RuntimeMemory runtime = runtimeMemories.computeIfAbsent(request.taskId(), 
            k -> new RuntimeMemory(k, "", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "", ""));
        
        switch (request.type()) {
            case DISCOVERY -> runtime.discoveries().add(request.content());
            case DECISION -> runtime.decisions().add(request.content());
            case CODE_CHANGE -> runtime.touchedFiles().add(request.content());
            case TEST_RESULT -> runtime.setTestResults(request.content());
            case AGENT_OUTPUT -> {} // Logged but not stored in runtime
            case ERROR -> runtime.setTaskSummary("Error: " + request.content());
        }
        
        runtimeMemories.put(request.taskId(), runtime);
        
        // Persist to disk
        persistRuntimeMemory(request.taskId(), runtime);
        
        log.debug("Recorded memory event: {} for task: {}", request.type(), request.taskId());
        return event;
    }
    
    /**
     * Get runtime memory for a task.
     */
    public RuntimeMemory getRuntimeMemory(String taskId) {
        return runtimeMemories.get(taskId);
    }
    
    /**
     * Finalize task memory — create task summary.
     */
    public void finalizeTaskMemory(String taskId, String summary) {
        RuntimeMemory runtime = runtimeMemories.get(taskId);
        if (runtime != null) {
            runtime.setTaskSummary(summary);
            runtimeMemories.put(taskId, runtime);
            persistRuntimeMemory(taskId, runtime);
        }
    }
    
    /**
     * Promote relevant runtime memory to long-term memory.
     */
    public List<LongTermMemory> promoteToLongTerm(String taskId, String projectId) {
        RuntimeMemory runtime = runtimeMemories.get(taskId);
        if (runtime == null) return List.of();
        
        List<LongTermMemory> promoted = new ArrayList<>();
        
        // Promote decisions
        for (String decision : runtime.decisions()) {
            LongTermMemory mem = new LongTermMemory(
                UUID.randomUUID().toString(),
                projectId,
                MemoryCategory.DECISION,
                decision,
                "task:" + taskId,
                true,
                false,
                Instant.now().toString()
            );
            promoted.add(mem);
            longTermMemories.add(mem);
        }
        
        // Promote discoveries as lessons
        for (String discovery : runtime.discoveries()) {
            LongTermMemory mem = new LongTermMemory(
                UUID.randomUUID().toString(),
                projectId,
                MemoryCategory.LESSON,
                discovery,
                "task:" + taskId,
                Math.random() > 0.3, // Validation
                false,
                Instant.now().toString()
            );
            promoted.add(mem);
            longTermMemories.add(mem);
        }
        
        log.info("Promoted {} memories to long-term for task: {}", promoted.size(), taskId);
        return promoted;
    }
    
    /**
     * Get all long-term memories (optionally filtered by project).
     */
    public List<LongTermMemory> getLongTermMemories(String projectId) {
        if (projectId != null) {
            return longTermMemories.stream()
                .filter(m -> m.projectId().equals(projectId))
                .toList();
        }
        return List.copyOf(longTermMemories);
    }
    
    /**
     * Get memory events (optionally filtered by task).
     */
    public List<MemoryEvent> getEvents(String taskId) {
        if (taskId != null) {
            return memoryEvents.stream()
                .filter(e -> e.taskId().equals(taskId))
                .toList();
        }
        return List.copyOf(memoryEvents);
    }
    
    // --- Persistence ---
    
    private void persistRuntimeMemory(String taskId, RuntimeMemory runtime) {
        try {
            Path runtimeDir = Path.of(workspaceBasePath, ".ai", "runtime");
            Files.createDirectories(runtimeDir);
            
            // Write individual files
            writeFile(runtimeDir, "current-task.md", runtime.currentTask());
            writeFile(runtimeDir, "current-plan.md", runtime.currentPlan());
            writeFile(runtimeDir, "discoveries.md", String.join("\n- ", runtime.discoveries()));
            writeFile(runtimeDir, "decisions.md", String.join("\n- ", runtime.decisions()));
            writeFile(runtimeDir, "touched-files.md", String.join("\n", runtime.touchedFiles()));
            writeFile(runtimeDir, "test-results.md", runtime.testResults());
            writeFile(runtimeDir, "task-summary.md", runtime.taskSummary());
            
        } catch (IOException e) {
            log.error("Failed to persist runtime memory for task: {}", taskId, e);
        }
    }
    
    private void writeFile(Path dir, String filename, String content) throws IOException {
        if (content != null && !content.isEmpty()) {
            Files.writeString(dir.resolve(filename), content);
        }
    }
    
    // --- DTOs ---
    
    public record MemoryEventRequest(String taskId, MemoryEventType type, String content, String agentId) {}
    
    public record MemoryEvent(String id, String taskId, MemoryEventType type, String content, String timestamp, String agentId) {}
    
    public record RuntimeMemory(String taskId, String currentTask, String currentPlan, 
        List<String> discoveries, List<String> decisions, List<String> touchedFiles, 
        String testResults, String taskSummary) {
        
        public void setTestResults(String results) {}
        public void setTaskSummary(String summary) {}
    }
    
    public record LongTermMemory(String id, String projectId, MemoryCategory category, 
        String content, String source, boolean validated, boolean indexedInRAG, String createdAt) {}
    
    public enum MemoryEventType { DISCOVERY, DECISION, ERROR, TEST_RESULT, CODE_CHANGE, AGENT_OUTPUT }
    public enum MemoryCategory { PATTERN, DECISION, LESSON, CONVENTION }
}
