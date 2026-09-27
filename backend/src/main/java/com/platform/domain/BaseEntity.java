package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

/**
 * Base entity with common fields for all domain entities.
 * Provides versioning, audit timestamps, and soft-delete support.
 */
@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(nullable = false)
    private Instant updatedAt;
    
    @Version
    private Integer version;
    
    @Column(nullable = false)
    private Boolean deleted = false;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
