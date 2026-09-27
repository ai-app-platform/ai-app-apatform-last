package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Workflow entity — machine-readable process definition.
 * 
 * IMPORTANT SEPARATIONS:
 * - Workflow ≠ Agent (Workflow defines rules, Agent executes)
 * - Workflow ≠ LangGraph (Workflow is the definition, LangGraph is the engine)
 * - Workflow ≠ Team (Team defines availability, Workflow defines execution order)
 * 
 * Workflow is machine-readable so LangGraph can execute it.
 * Workflow should NOT be coupled to LangGraph implementation details.
 */
@Entity
@Table(name = "workflows")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workflow extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkflowScope scope;
    
    // Steps stored as JSON array (machine-readable)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String steps;
    
    // Configuration stored as JSON
    @Column(columnDefinition = "TEXT", nullable = false)
    private String config;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkflowStatus status;
    
    public enum WorkflowScope {
        PLATFORM, PROJECT
    }
    
    public enum WorkflowStatus {
        ACTIVE, DRAFT, ARCHIVED
    }
}
