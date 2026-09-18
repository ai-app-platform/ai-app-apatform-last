package com.platform.service;

import com.platform.domain.Task;
import com.platform.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Task Service — manages task lifecycle.
 * 
 * Task lifecycle:
 * Created → Planning → Executing → Review → Testing → Completed/Failed
 * 
 * Responsibilities:
 * - Task CRUD
 * - Status transitions
 * - Plan management
 * - Result storage
 * 
 * NOT responsible for:
 * - Actual execution (ExecutionEngine)
 * - Agent selection (PlannerService)
 * - Git operations (GitService)
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskService {
    
    private final TaskRepository taskRepository;
    
    public List<Task> getAllTasks() {
        return taskRepository.findByDeletedFalse();
    }
    
    public List<Task> getTasksByProject(String projectId) {
        return taskRepository.findByProjectIdAndDeletedFalse(projectId);
    }
    
    public Optional<Task> getTask(String id) {
        return taskRepository.findByIdAndDeletedFalse(id);
    }
    
    public Task createTask(Task task) {
        log.info("Creating task: {} for project: {}", task.getTitle(), task.getProjectId());
        
        task.setStatus(Task.TaskStatus.CREATED);
        return taskRepository.save(task);
    }
    
    public Task updateTask(String id, Task updates) {
        log.info("Updating task: {}", id);
        
        Task task = taskRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new IllegalArgumentException("Task not found: " + id));
        
        if (updates.getTitle() != null) task.setTitle(updates.getTitle());
        if (updates.getDescription() != null) task.setDescription(updates.getDescription());
        if (updates.getStatus() != null) task.setStatus(updates.getStatus());
        if (updates.getPriority() != null) task.setPriority(updates.getPriority());
        if (updates.getBranch() != null) task.setBranch(updates.getBranch());
        if (updates.getWorkflowId() != null) task.setWorkflowId(updates.getWorkflowId());
        if (updates.getAssignedAgents() != null) task.setAssignedAgents(updates.getAssignedAgents());
        if (updates.getPlan() != null) task.setPlan(updates.getPlan());
        if (updates.getExecutionGraph() != null) task.setExecutionGraph(updates.getExecutionGraph());
        if (updates.getCurrentStep() != null) task.setCurrentStep(updates.getCurrentStep());
        if (updates.getResult() != null) task.setResult(updates.getResult());
        if (updates.getExecutionTrace() != null) task.setExecutionTrace(updates.getExecutionTrace());
        
        return taskRepository.save(task);
    }
    
    public Task transitionStatus(String id, Task.TaskStatus newStatus) {
        log.info("Transitioning task {} to status: {}", id, newStatus);
        
        Task task = taskRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new IllegalArgumentException("Task not found: " + id));
        
        validateStatusTransition(task.getStatus(), newStatus);
        task.setStatus(newStatus);
        
        return taskRepository.save(task);
    }
    
    private void validateStatusTransition(Task.TaskStatus current, Task.TaskStatus next) {
        // Define valid transitions
        boolean valid = switch (current) {
            case CREATED -> next == Task.TaskStatus.PLANNING || next == Task.TaskStatus.CANCELLED;
            case PLANNING -> next == Task.TaskStatus.EXECUTING || next == Task.TaskStatus.CANCELLED;
            case EXECUTING -> next == Task.TaskStatus.REVIEW || next == Task.TaskStatus.FAILED;
            case REVIEW -> next == Task.TaskStatus.TESTING || next == Task.TaskStatus.EXECUTING; // Can go back
            case TESTING -> next == Task.TaskStatus.COMPLETED || next == Task.TaskStatus.FAILED;
            case COMPLETED, FAILED, CANCELLED -> false; // Terminal states
        };
        
        if (!valid) {
            throw new IllegalStateException(
                String.format("Invalid status transition: %s -> %s", current, next)
            );
        }
    }
    
    public List<Task> getActiveTasksByProject(String projectId) {
        return taskRepository.findByProjectIdAndStatusInAndDeletedFalse(
            projectId,
            List.of(Task.TaskStatus.CREATED, Task.TaskStatus.PLANNING, 
                    Task.TaskStatus.EXECUTING, Task.TaskStatus.REVIEW, Task.TaskStatus.TESTING)
        );
    }
}
