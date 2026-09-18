package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Knowledge entity — permanent, stable, citable information.
 * 
 * IMPORTANT:
 * - Knowledge ≠ Memory (Knowledge is permanent, Memory is runtime)
 * - Knowledge ≠ Prompt (Knowledge is WHAT to know, Prompt is HOW to use it)
 * - Knowledge Source of Truth = Versioned Files/Git
 * - Database only stores metadata/index, NOT the canonical content
 */
@Entity
@Table(name = "knowledge_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeEntry extends BaseEntity {
    
    @Column(nullable = false)
    private String title;
    
    // Content reference (actual content lives in Git/files)
    @Column(nullable = false)
    private String filePath;
    
    // Content hash for change detection
    private String contentHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KnowledgeCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KnowledgeScope scope;
    
    private String projectId;
    
    // Tags stored as JSON array
    @Column(columnDefinition = "TEXT")
    private String tags;
    
    // Resolution priority (lower = higher priority)
    private Integer priority;
    
    public enum KnowledgeCategory {
        ARCHITECTURE, STANDARDS, CONVENTIONS, ADR, INSTRUCTIONS
    }
    
    public enum KnowledgeScope {
        PLATFORM, PROJECT
    }
}
