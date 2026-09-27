package com.platform.controller;

import com.platform.domain.Task;
import com.platform.service.TaskService;
import com.platform.engine.execution.TaskExecutionEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

/**
 * Task Controller — REST API for task management and execution.
 */
@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {
    
    private final TaskService taskService;
    private final TaskExecutionEngine executionEngine;
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable String id) {
        return taskService.getTask(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task created = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task task) {
        try {
            Task updated = taskService.updateTask(id, task);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{id}/execute")
    public ResponseEntity<String> executeTask(@PathVariable String id) {
        try {
            taskService.transitionStatus(id, Task.TaskStatus.PLANNING);
            executionEngine.executeTask(id);
            return ResponseEntity.accepted().body("Task execution started");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/{id}/abort")
    public ResponseEntity<String> abortTask(@PathVariable String id) {
        executionEngine.abortExecution(id);
        return ResponseEntity.ok("Task execution aborted");
    }
    
    @GetMapping(value = "/{id}/execution/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamExecution(@PathVariable String id) {
        return executionEngine.subscribe(id);
    }
    
    @GetMapping("/{id}/execution/state")
    public ResponseEntity<?> getExecutionState(@PathVariable String id) {
        var state = executionEngine.getExecutionState(id);
        if (state != null) {
            return ResponseEntity.ok(state);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/transition/{status}")
    public ResponseEntity<Task> transitionStatus(@PathVariable String id, @PathVariable Task.TaskStatus status) {
        try {
            Task updated = taskService.transitionStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
