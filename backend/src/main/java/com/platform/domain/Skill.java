package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Skill entity — a capability/expertise usable by agents.
 * 
 * Agent = WHO executes
 * Role  = In WHAT position
 * Skill = WHAT expertise
 */
@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String domain;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillLevel level;
    
    // Tags stored as JSON array
    @Column(columnDefinition = "TEXT")
    private String tags;
    
    public enum SkillLevel {
        BASIC, INTERMEDIATE, EXPERT
    }
}
