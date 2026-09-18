package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Project entity — represents a software project managed by the platform.
 * 
 * Source of Truth: Git Repository
 * Workspace: Runtime working copy (NOT source of truth)
 * 
 * Each project has:
 * - A Git repository (canonical source)
 * - A workspace (runtime working copy)
 * - An agent team (available agents)
 * - Knowledge, instructions, and codebase intelligence
 */
@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false)
    private String repositoryUrl;
    
    @Column(nullable = false)
    private String defaultBranch;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;
    
    private String workspacePath;
    
    private String lastIndexedCommit;
    
    @Column(nullable = false)
    private String agentTeamId;
    
    // Project-level configuration stored as JSON
    @Column(columnDefinition = "TEXT")
    private String configuration;
    
    public enum ProjectStatus {
        ACTIVE, ARCHIVED, PAUSED
    }
}
