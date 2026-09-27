package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Agent entity — represents a reusable AI agent definition.
 * 
 * IMPORTANT: Agent definition is INDEPENDENT from any project.
 * Project context is injected at runtime, not stored in the definition.
 * 
 * Same Agent + Project A ≠ Same Agent + Project B (from runtime perspective)
 */
@Entity
@Table(name = "agents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agent extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentType type;
    
    @Column(length = 2000)
    private String description;
    
    // JSON array of capabilities
    @Column(columnDefinition = "TEXT")
    private String capabilities;
    
    // Model configuration stored as JSON
    @Column(columnDefinition = "TEXT", nullable = false)
    private String modelConfig;
    
    // JSON array of allowed tool IDs
    @Column(columnDefinition = "TEXT")
    private String allowedTools;
    
    // JSON array of skill IDs
    @Column(columnDefinition = "TEXT")
    private String skills;
    
    private String defaultPromptId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentStatus status;
    
    // Runtime configuration stored as JSON
    @Column(columnDefinition = "TEXT")
    private String runtimeConfig;
    
    // Execution policies stored as JSON
    @Column(columnDefinition = "TEXT")
    private String executionPolicies;
    
    public enum AgentType {
        PLANNER, ARCHITECT, DEVELOPER, REVIEWER, TESTER, SECURITY, QA, CUSTOM
    }
    
    public enum AgentStatus {
        ACTIVE, INACTIVE
    }
}
