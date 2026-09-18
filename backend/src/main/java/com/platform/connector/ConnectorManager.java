package com.platform.connector;

import com.platform.domain.Connector;
import com.platform.repository.ConnectorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Connector Manager — manages external system connections.
 * 
 * IMPORTANT SEPARATIONS:
 * - Connector ≠ MCP (MCP is just one adapter type)
 * - Connector ≠ Tool (Connector provides access, Tool defines operations)
 * - Connector ≠ External System
 * - Credentials are NEVER stored in plaintext
 * 
 * Responsibilities:
 * - Connection lifecycle (create, configure, health check)
 * - Authentication management (via Secret Manager references)
 * - Capability discovery
 * - Adapter routing (REST, GraphQL, MCP, SDK)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectorManager {
    
    private final ConnectorRepository connectorRepository;
    
    /**
     * Get connector by ID.
     */
    public Optional<Connector> getConnector(String id) {
        return connectorRepository.findByIdAndDeletedFalse(id);
    }
    
    /**
     * Get all active connectors.
     */
    public List<Connector> getActiveConnectors() {
        return connectorRepository.findByDeletedFalse().stream()
            .filter(c -> c.getStatus() == Connector.ConnectorStatus.ACTIVE)
            .toList();
    }
    
    /**
     * Get connectors by type.
     */
    public List<Connector> getConnectorsByType(Connector.ConnectorType type) {
        return connectorRepository.findByTypeAndDeletedFalse(type);
    }
    
    /**
     * Register a new connector.
     * 
     * IMPORTANT: credentialRef must be a reference to Secret Manager,
     * NEVER a plaintext credential.
     */
    public Connector registerConnector(Connector connector) {
        log.info("Registering connector: {} (type: {}, adapter: {})", 
            connector.getName(), connector.getType(), connector.getAdapterType());
        
        // Validate credential reference
        if (connector.getCredentialRef() == null || connector.getCredentialRef().isBlank()) {
            throw new IllegalArgumentException("Credential reference is required");
        }
        
        if (!connector.getCredentialRef().startsWith("vault://") && 
            !connector.getCredentialRef().startsWith("secret://")) {
            throw new IllegalArgumentException("Credential must be a reference to Secret Manager (vault:// or secret://)");
        }
        
        connector.setStatus(Connector.ConnectorStatus.ACTIVE);
        return connectorRepository.save(connector);
    }
    
    /**
     * Perform health check on a connector.
     */
    public HealthCheckResult healthCheck(String connectorId) {
        Connector connector = connectorRepository.findByIdAndDeletedFalse(connectorId)
            .orElseThrow(() -> new IllegalArgumentException("Connector not found: " + connectorId));
        
        log.info("Health check for connector: {} ({})", connector.getName(), connector.getAdapterType());
        
        // Simulate health check based on adapter type
        boolean healthy = switch (connector.getAdapterType()) {
            case REST -> performRestHealthCheck(connector);
            case GRAPHQL -> performGraphQLHealthCheck(connector);
            case MCP -> performMCPHealthCheck(connector);
            case SDK -> performSDKHealthCheck(connector);
        };
        
        Connector.ConnectorStatus newStatus = healthy ? Connector.ConnectorStatus.ACTIVE : Connector.ConnectorStatus.ERROR;
        connector.setStatus(newStatus);
        connector.setLastHealthCheck(java.time.Instant.now());
        connector.setLastHealthResult(healthy ? "OK" : "Connection failed");
        connectorRepository.save(connector);
        
        return new HealthCheckResult(connectorId, healthy, healthy ? "OK" : "Connection failed");
    }
    
    /**
     * Execute an operation through a connector.
     */
    public ConnectorResponse execute(String connectorId, String operation, Map<String, Object> params) {
        Connector connector = connectorRepository.findByIdAndDeletedFalse(connectorId)
            .orElseThrow(() -> new IllegalArgumentException("Connector not found: " + connectorId));
        
        log.info("Executing operation '{}' on connector: {} ({})", operation, connector.getName(), connector.getAdapterType());
        
        // Route to appropriate adapter
        return switch (connector.getAdapterType()) {
            case REST -> executeRest(connector, operation, params);
            case GRAPHQL -> executeGraphQL(connector, operation, params);
            case MCP -> executeMCP(connector, operation, params);
            case SDK -> executeSDK(connector, operation, params);
        };
    }
    
    // --- Adapter implementations (simulated) ---
    
    private boolean performRestHealthCheck(Connector connector) {
        // In production: HTTP GET to health endpoint
        return Math.random() > 0.1; // 90% success rate
    }
    
    private boolean performGraphQLHealthCheck(Connector connector) {
        return Math.random() > 0.1;
    }
    
    private boolean performMCPHealthCheck(Connector connector) {
        return Math.random() > 0.05; // MCP is more reliable
    }
    
    private boolean performSDKHealthCheck(Connector connector) {
        return Math.random() > 0.1;
    }
    
    private ConnectorResponse executeRest(Connector connector, String operation, Map<String, Object> params) {
        // In production: Use RestTemplate/WebClient
        return new ConnectorResponse(true, Map.of("result", "REST operation executed", "operation", operation));
    }
    
    private ConnectorResponse executeGraphQL(Connector connector, String operation, Map<String, Object> params) {
        // In production: Use GraphQL client
        return new ConnectorResponse(true, Map.of("result", "GraphQL operation executed", "operation", operation));
    }
    
    private ConnectorResponse executeMCP(Connector connector, String operation, Map<String, Object> params) {
        // In production: Use MCP protocol client
        return new ConnectorResponse(true, Map.of("result", "MCP operation executed", "operation", operation));
    }
    
    private ConnectorResponse executeSDK(Connector connector, String operation, Map<String, Object> params) {
        // In production: Use specific SDK
        return new ConnectorResponse(true, Map.of("result", "SDK operation executed", "operation", operation));
    }
    
    // --- DTOs ---
    
    public record HealthCheckResult(String connectorId, boolean healthy, String message) {}
    public record ConnectorResponse(boolean success, Map<String, Object> data) {}
}
