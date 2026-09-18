package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Prompt entity — controls how context is converted to model input.
 * 
 * IMPORTANT SEPARATIONS:
 * - Prompt ≠ Knowledge (Prompt is HOW, Knowledge is WHAT)
 * - Prompt ≠ Workflow (Prompt is for LLM input, Workflow is for execution)
 * - Prompt Manager owns: Template, Variables, Composition, Rendering
 * - Knowledge Manager owns: Resolve Knowledge
 * - Context Engine owns: Assemble Context
 */
@Entity
@Table(name = "prompts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prompt extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    // Template with variable placeholders
    @Column(columnDefinition = "TEXT", nullable = false)
    private String template;
    
    // Variables stored as JSON array
    @Column(columnDefinition = "TEXT")
    private String variables;
    
    @Column(nullable = false)
    private Integer promptVersion;
    
    // Model configuration stored as JSON
    @Column(columnDefinition = "TEXT")
    private String modelConfig;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptScope scope;
    
    private String projectId;
    
    public enum PromptScope {
        PLATFORM, PROJECT
    }
}
