package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Tool entity — represents a tool definition available to agents.
 * 
 * IMPORTANT: Tool Definition ≠ Tool Implementation
 * The definition describes WHAT the tool does (schema, permissions).
 * The implementation is handled by ToolExecutor + Connector.
 */
@Entity
@Table(name = "tools")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tool extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ToolCategory category;
    
    // Tool schema stored as JSON (input/output definitions)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String schema;
    
    // Optional connector reference
    private String connectorId;
    
    // Permissions stored as JSON array
    @Column(columnDefinition = "TEXT")
    private String permissions;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ToolStatus status;
    
    public enum ToolCategory {
        CODE, GIT, BUILD, TEST, SEARCH, FILE, EXTERNAL, CONTEXT
    }
    
    public enum ToolStatus {
        ACTIVE, DEPRECATED
    }
}
