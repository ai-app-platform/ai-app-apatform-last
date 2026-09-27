package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Role entity — defines responsibility, position, capability, constraints.
 * 
 * IMPORTANT: Role ≠ Agent
 * - Role defines WHAT position/responsibility
 * - Agent defines WHO executes
 * - One Agent can have different Roles in different workflows
 * - Role does NOT own Prompt/Skill/Tool; it REFERENCES them
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    // Responsibilities stored as JSON array
    @Column(columnDefinition = "TEXT")
    private String responsibilities;
    
    // Constraints stored as JSON array
    @Column(columnDefinition = "TEXT")
    private String constraints;
    
    // Referenced skill IDs stored as JSON array
    @Column(columnDefinition = "TEXT")
    private String referencedSkills;
    
    // Referenced prompt IDs stored as JSON array
    @Column(columnDefinition = "TEXT")
    private String referencedPrompts;
}
