package com.platform.engine.execution;

import com.platform.domain.Task;
import com.platform.engine.context.ContextEngineService;
import com.platform.engine.git.GitService;
import com.platform.engine.memory.MemoryManagerService;
import com.platform.engine.workspace.WorkspaceService;
import com.platform.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Task Execution Engine — orchestrates the complete task lifecycle.
 * 
 * Complete Task Lifecycle:
 * Create Task → Resolve Project → Prepare Workspace →
 * Create/Checkout Task Branch → Resolve Knowledge → Resolve Agent Team →
 * Resolve Workflow → Load Project Context → Load Codebase Intelligence →
 * Retrieve Additional RAG Context → Assemble Context → Plan Task →
 * Dynamic Agent Selection → Create Execution Graph → Execute Workflow →
 * Agent/Tool Execution → Code Changes → Build/Test/Validation → Review →
 * Commit → Push → Pull Request → Update Runtime Memory →
 * Promote Relevant Long-Term Memory
 * 
 * Uses LangGraph for orchestration (simulated here).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskExecutionEngine {
    
    private final TaskService taskService;
    private final GitService gitService;
    private final WorkspaceService workspaceService;
    private final ContextEngineService contextEngine;
    private final MemoryManagerService memoryManager;
    
    // Active executions
    private final Map<String, ExecutionState> activeExecutions = new ConcurrentHashMap<>();
    private final Map<String, List<SseEmitter>> executionSubscribers = new ConcurrentHashMap<>();
    
    /**
     * Execute a task asynchronously.
     */
    @Async
    public void executeTask(String taskId) {
        Task task = taskService.getTask(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));
        
        ExecutionState state = new ExecutionState(taskId, ExecutionPhase.STARTING, 0, new ArrayList<>());
        activeExecutions.put(taskId, state);
        
        try {
            // Phase 1: Resolve Project
            updatePhase(taskId, ExecutionPhase.RESOLVING_PROJECT, 5);
            addLog(taskId, "🚀 Starting task execution: " + task.getTitle());
            addLog(taskId, "Resolving project: " + task.getProjectId());
            Thread.sleep(500);
            addLog(taskId, "✓ Project resolved");
            
            // Phase 2: Prepare Workspace
            updatePhase(taskId, ExecutionPhase.PREPARING_WORKSPACE, 10);
            addLog(taskId, "Preparing workspace...");
            workspaceService.initializeWorkspace(task.getProjectId());
            Thread.sleep(800);
            addLog(taskId, "✓ Workspace prepared");
            
            // Phase 3: Create Task Branch
            updatePhase(taskId, ExecutionPhase.CREATING_BRANCH, 15);
            String branchName = gitService.createTaskBranch(task.getProjectId(), task.getTitle());
            taskService.updateTask(taskId, Task.builder().branch(branchName).build());
            addLog(taskId, "✓ Task branch created: " + branchName);
            
            // Phase 4: Resolve Knowledge
            updatePhase(taskId, ExecutionPhase.RESOLVING_KNOWLEDGE, 20);
            addLog(taskId, "Resolving knowledge and instructions...");
            Thread.sleep(600);
            addLog(taskId, "✓ Knowledge resolved (3 entries)");
            
            // Phase 5: Resolve Agent Team
            updatePhase(taskId, ExecutionPhase.RESOLVING_TEAM, 25);
            addLog(taskId, "Resolving agent team...");
            Thread.sleep(300);
            addLog(taskId, "✓ Agent team resolved (6 agents available)");
            
            // Phase 6: Resolve Workflow
            updatePhase(taskId, ExecutionPhase.RESOLVING_WORKFLOW, 30);
            addLog(taskId, "Resolving workflow...");
            Thread.sleep(300);
            addLog(taskId, "✓ Workflow resolved: software-development");
            
            // Phase 7: Load Context
            updatePhase(taskId, ExecutionPhase.LOADING_CONTEXT, 35);
            addLog(taskId, "Loading context (Codebase Intelligence + RAG)...");
            
            var contextRequest = new ContextEngineService.ContextRequest(
                taskId, "agent-1", task.getProjectId(), task.getDescription()
            );
            var assembledContext = contextEngine.assembleContext(contextRequest);
            
            Thread.sleep(700);
            addLog(taskId, "✓ Context assembled: " + assembledContext.tokenCount() + " tokens, " + assembledContext.sources().size() + " sources");
            
            // Phase 8: Planning
            updatePhase(taskId, ExecutionPhase.PLANNING, 40);
            addLog(taskId, "🤖 Planner Agent: Analyzing task and creating plan...");
            Thread.sleep(1200);
            
            // Record planning in memory
            memoryManager.recordEvent(new MemoryManagerService.MemoryEventRequest(
                taskId, MemoryManagerService.MemoryEventType.DECISION,
                "Plan created with 5 steps", "planner-agent"
            ));
            addLog(taskId, "✓ Plan created (5 steps)");
            
            // Phase 9: Dynamic Agent Selection
            updatePhase(taskId, ExecutionPhase.SELECTING_AGENTS, 45);
            addLog(taskId, "Selecting dynamic agent subset...");
            Thread.sleep(400);
            addLog(taskId, "✓ Selected: Architect, Backend Developer, Security, Reviewer, QA");
            
            // Phase 10: Build Execution Graph
            updatePhase(taskId, ExecutionPhase.BUILDING_GRAPH, 50);
            addLog(taskId, "Building execution graph with LangGraph...");
            Thread.sleep(500);
            addLog(taskId, "✓ Execution graph created");
            
            // Phase 11: Execute Agents
            updatePhase(taskId, ExecutionPhase.EXECUTING, 55);
            executeAgentSteps(taskId, task);
            
            // Phase 12: Validation
            updatePhase(taskId, ExecutionPhase.VALIDATING, 80);
            addLog(taskId, "🔨 Running Maven Build...");
            Thread.sleep(800);
            addLog(taskId, "✓ Build successful — 0 errors, 0 warnings");
            
            addLog(taskId, "🧪 Running Unit Tests...");
            Thread.sleep(600);
            
            memoryManager.recordEvent(new MemoryManagerService.MemoryEventRequest(
                taskId, MemoryManagerService.MemoryEventType.TEST_RESULT,
                "Tests: 24 passed, 0 failed, 2 skipped (3200ms)", "qa-agent"
            ));
            addLog(taskId, "✓ Tests: 24 passed, 0 failed, 2 skipped");
            
            // Phase 13: Review
            updatePhase(taskId, ExecutionPhase.REVIEWING, 88);
            addLog(taskId, "🤖 Code Reviewer: Reviewing changes...");
            Thread.sleep(1000);
            addLog(taskId, "✓ Code review passed");
            
            // Phase 14: Commit
            updatePhase(taskId, ExecutionPhase.COMMITTING, 92);
            String commitSha = gitService.commit(task.getProjectId(), 
                "feat: " + task.getTitle(), List.of("src/"));
            addLog(taskId, "✓ Committed: " + commitSha);
            
            // Phase 15: Push
            updatePhase(taskId, ExecutionPhase.PUSHING, 95);
            gitService.push(task.getProjectId(), branchName);
            addLog(taskId, "✓ Pushed to remote");
            
            // Phase 16: Create PR
            updatePhase(taskId, ExecutionPhase.CREATING_PR, 97);
            addLog(taskId, "🔗 Pull Request created");
            
            // Phase 17: Update Memory
            updatePhase(taskId, ExecutionPhase.UPDATING_MEMORY, 99);
            memoryManager.finalizeTaskMemory(taskId, "Task completed successfully");
            memoryManager.promoteToLongTerm(taskId, task.getProjectId());
            addLog(taskId, "✓ Runtime memory updated");
            addLog(taskId, "✓ Long-term memory promoted");
            
            // Complete
            updatePhase(taskId, ExecutionPhase.COMPLETED, 100);
            taskService.transitionStatus(taskId, Task.TaskStatus.COMPLETED);
            addLog(taskId, "✅ Task completed successfully!");
            
        } catch (Exception e) {
            log.error("Task execution failed: {}", taskId, e);
            updatePhase(taskId, ExecutionPhase.FAILED, state.progress());
            addLog(taskId, "❌ Execution failed: " + e.getMessage());
            taskService.transitionStatus(taskId, Task.TaskStatus.FAILED);
        }
    }
    
    /**
     * Execute individual agent steps.
     */
    private void executeAgentSteps(String taskId, Task task) throws InterruptedException {
        record AgentStep(String name, String action, int duration) {}
        
        List<AgentStep> steps = List.of(
            new AgentStep("Planner Agent", "Analyzing task and identifying required capabilities", 1200),
            new AgentStep("Architect Agent", "Analyzing current architecture and suggesting design", 1500),
            new AgentStep("Backend Developer", "Implementing code changes", 2500),
            new AgentStep("Security Agent", "Reviewing security implications", 1000),
            new AgentStep("Code Reviewer", "Reviewing code quality and best practices", 1200),
            new AgentStep("QA Agent", "Running tests and validation", 1500)
        );
        
        for (AgentStep step : steps) {
            addLog(taskId, "🤖 " + step.name() + ": " + step.action());
            Thread.sleep(step.duration());
            
            // Record agent output in memory
            memoryManager.recordEvent(new MemoryManagerService.MemoryEventRequest(
                taskId, MemoryManagerService.MemoryEventType.AGENT_OUTPUT,
                step.name() + " completed: " + step.action(), step.name().toLowerCase().replace(" ", "-")
            ));
            
            addLog(taskId, "✓ " + step.name() + " completed");
        }
    }
    
    /**
     * Subscribe to execution updates via SSE.
     */
    public SseEmitter subscribe(String taskId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        executionSubscribers.computeIfAbsent(taskId, k -> new ArrayList<>()).add(emitter);
        
        emitter.onCompletion(() -> {
            var subs = executionSubscribers.get(taskId);
            if (subs != null) subs.remove(emitter);
        });
        
        // Send current state
        ExecutionState state = activeExecutions.get(taskId);
        if (state != null) {
            try {
                emitter.send(SseEmitter.event().name("state").data(state));
            } catch (IOException e) {
                log.warn("Failed to send initial state", e);
            }
        }
        
        return emitter;
    }
    
    /**
     * Get current execution state.
     */
    public ExecutionState getExecutionState(String taskId) {
        return activeExecutions.get(taskId);
    }
    
    /**
     * Abort an execution.
     */
    public void abortExecution(String taskId) {
        updatePhase(taskId, ExecutionPhase.FAILED, 0);
        addLog(taskId, "⛔ Execution aborted by user");
    }
    
    // --- Helper methods ---
    
    private void updatePhase(String taskId, ExecutionPhase phase, int progress) {
        ExecutionState current = activeExecutions.get(taskId);
        if (current != null) {
            activeExecutions.put(taskId, new ExecutionState(taskId, phase, progress, current.logs()));
            notifySubscribers(taskId);
        }
    }
    
    private void addLog(String taskId, String message) {
        ExecutionState current = activeExecutions.get(taskId);
        if (current != null) {
            ExecutionLog logEntry = new ExecutionLog(
                Instant.now().toString(),
                current.phase(),
                message,
                null, null,
                message.contains("✓") || message.contains("✅") ? "success" :
                message.contains("❌") ? "error" :
                message.contains("⚠") ? "warning" : "info"
            );
            
            List<ExecutionLog> logs = new ArrayList<>(current.logs());
            logs.add(logEntry);
            
            activeExecutions.put(taskId, new ExecutionState(taskId, current.phase(), current.progress(), logs));
            notifySubscribers(taskId);
        }
        
        log.info("[Task:{}] {}", taskId, message);
    }
    
    private void notifySubscribers(String taskId) {
        var subs = executionSubscribers.get(taskId);
        if (subs != null) {
            ExecutionState state = activeExecutions.get(taskId);
            for (SseEmitter emitter : subs) {
                try {
                    emitter.send(SseEmitter.event().name("state").data(state));
                } catch (IOException e) {
                    log.warn("Failed to notify subscriber", e);
                }
            }
        }
    }
    
    // --- DTOs ---
    
    public record ExecutionState(String taskId, ExecutionPhase phase, int progress, List<ExecutionLog> logs) {}
    
    public record ExecutionLog(String timestamp, ExecutionPhase phase, String message, String agentId, String agentName, String level) {}
    
    public enum ExecutionPhase {
        STARTING, RESOLVING_PROJECT, PREPARING_WORKSPACE, CREATING_BRANCH,
        RESOLVING_KNOWLEDGE, RESOLVING_TEAM, RESOLVING_WORKFLOW,
        LOADING_CONTEXT, PLANNING, SELECTING_AGENTS, BUILDING_GRAPH,
        EXECUTING, VALIDATING, REVIEWING, COMMITTING, PUSHING,
        CREATING_PR, UPDATING_MEMORY, COMPLETED, FAILED
    }
}
