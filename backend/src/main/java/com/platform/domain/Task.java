package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Task entity — represents a unit of work to be executed by agents.
 * 
 * Task lifecycle:
 * Created → Planning → Executing → Review → Testing → Completed/Failed
 * 
 * Each task:
 * - Belongs to a project
 * - Runs on a dedicated branch
 * - Uses a subset of the project's agent team (dynamic selection)
 * - Follows a workflow
 * - Produces code changes, test results, and a PR
 */
@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task extends BaseEntity {
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 4000)
    private String description;
    
    @Column(nullable = false)
    private String projectId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;
    
    private String branch;
    
    private String workflowId;
    
    // JSON array of assigned agent IDs
    @Column(columnDefinition = "TEXT")
    private String assignedAgents;
    
    // Plan stored as JSON
    @Column(columnDefinition = "TEXT")
    private String plan;
    
    // Execution graph stored as JSON
    @Column(columnDefinition = "TEXT")
    private String executionGraph;
    
    private String currentStep;
    
    // Result stored as JSON
    @Column(columnDefinition = "TEXT")
    private String result;
    
    // Execution trace for reproducibility
    @Column(columnDefinition = "TEXT")
    private String executionTrace;
    
    public enum TaskStatus {
        CREATED, PLANNING, EXECUTING, REVIEW, TESTING, COMPLETED, FAILED, CANCELLED
    }
    
    public enum TaskPriority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
