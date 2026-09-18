package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * AgentTeam entity — the pool of agents available for a project.
 * 
 * IMPORTANT:
 * - Team is at Project level (relatively static)
 * - Team is NOT created per task
 * - Task selects a DYNAMIC SUBSET of the team
 * - Team defines AVAILABILITY, not execution order
 */
@Entity
@Table(name = "agent_teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentTeam extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String projectId;
    
    // Members stored as JSON array
    @Column(columnDefinition = "TEXT", nullable = false)
    private String members;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TeamStatus status;
    
    public enum TeamStatus {
        ACTIVE, INACTIVE
    }
}
