package com.platform.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

/**
 * Connector entity — manages external system connections.
 * 
 * IMPORTANT SEPARATIONS:
 * - Connector ≠ MCP (MCP is just one adapter type)
 * - Connector ≠ Tool (Connector provides access, Tool defines operations)
 * - Connector ≠ External System (Connector is the bridge, not the system)
 * - Credentials are NEVER stored in plaintext
 */
@Entity
@Table(name = "connectors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Connector extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectorType type;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdapterType adapterType;
    
    // Configuration stored as JSON
    @Column(columnDefinition = "TEXT", nullable = false)
    private String config;
    
    // Reference to secret in Vault (NEVER plaintext)
    @Column(nullable = false)
    private String credentialRef;
    
    // Capabilities stored as JSON array
    @Column(columnDefinition = "TEXT")
    private String capabilities;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectorStatus status;
    
    private Instant lastHealthCheck;
    
    // Health check result stored as JSON
    @Column(columnDefinition = "TEXT")
    private String lastHealthResult;
    
    public enum ConnectorType {
        GIT, CI_CD, ISSUE_TRACKER, NOTIFICATION, STORAGE, LLM, CUSTOM
    }
    
    public enum AdapterType {
        REST, GRAPHQL, MCP, SDK
    }
    
    public enum ConnectorStatus {
        ACTIVE, INACTIVE, ERROR
    }
}
