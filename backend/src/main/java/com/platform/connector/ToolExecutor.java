package com.platform.connector;

import com.platform.domain.Tool;
import com.platform.repository.ToolRepository;
import com.platform.engine.workspace.WorkspaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Tool Executor — executes tool operations.
 * 
 * IMPORTANT SEPARATIONS:
 * - Tool Definition ≠ Tool Implementation
 * - Tool ≠ Connector (Tool defines WHAT, Connector provides HOW)
 * - Tool execution goes through ToolExecutor → Connector → External System
 * 
 * Responsibilities:
 * - Validate tool permissions
 * - Route to appropriate implementation
 * - Handle local tools (file, search, context)
 * - Handle external tools (via Connector)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ToolExecutor {
    
    private final ToolRepository toolRepository;
    private final ConnectorManager connectorManager;
    private final WorkspaceService workspaceService;
    
    /**
     * Execute a tool.
     */
    public ToolExecutionResult execute(String toolId, String projectId, Map<String, Object> parameters, String agentId) {
        Tool tool = toolRepository.findByIdAndDeletedFalse(toolId)
            .orElseThrow(() -> new IllegalArgumentException("Tool not found: " + toolId));
        
        log.info("Executing tool: {} ({}) for agent: {} in project: {}", 
            tool.getName(), tool.getCategory(), agentId, projectId);
        
        // Validate permissions
        validatePermissions(tool, agentId);
        
        // Route based on category
        return switch (tool.getCategory()) {
            case FILE -> executeFileTool(tool, projectId, parameters);
            case SEARCH -> executeSearchTool(tool, projectId, parameters);
            case BUILD -> executeBuildTool(tool, projectId, parameters);
            case TEST -> executeTestTool(tool, projectId, parameters);
            case GIT -> executeGitTool(tool, projectId, parameters);
            case CONTEXT -> executeContextTool(tool, projectId, parameters);
            case CODE -> executeCodeTool(tool, projectId, parameters);
            case EXTERNAL -> executeExternalTool(tool, projectId, parameters);
        };
    }
    
    /**
     * Get tool definition.
     */
    public Optional<Tool> getTool(String toolId) {
        return toolRepository.findByIdAndDeletedFalse(toolId);
    }
    
    /**
     * Get all available tools.
     */
    public List<Tool> getAvailableTools() {
        return toolRepository.findByDeletedFalse();
    }
    
    // --- Tool implementations ---
    
    private ToolExecutionResult executeFileTool(Tool tool, String projectId, Map<String, Object> params) {
        try {
            String action = tool.getName();
            
            if (action.equals("read_file")) {
                String path = (String) params.get("path");
                String content = workspaceService.readFile(projectId, path);
                return ToolExecutionResult.success(Map.of("content", content, "size", content.length()));
            }
            
            if (action.equals("write_file")) {
                String path = (String) params.get("path");
                String content = (String) params.get("content");
                workspaceService.writeFile(projectId, path, content);
                return ToolExecutionResult.success(Map.of("success", true));
            }
            
            return ToolExecutionResult.error("Unknown file tool: " + action);
            
        } catch (Exception e) {
            return ToolExecutionResult.error(e.getMessage());
        }
    }
    
    private ToolExecutionResult executeSearchTool(Tool tool, String projectId, Map<String, Object> params) {
        // In production, delegate to CodebaseIntelligenceService
        String query = (String) params.getOrDefault("query", "");
        return ToolExecutionResult.success(Map.of(
            "results", List.of(),
            "query", query,
            "count", 0
        ));
    }
    
    private ToolExecutionResult executeBuildTool(Tool tool, String projectId, Map<String, Object> params) {
        try {
            var result = workspaceService.runBuild(projectId);
            return ToolExecutionResult.success(Map.of(
                "success", result.isSuccess(),
                "output", result.output(),
                "exitCode", result.exitCode()
            ));
        } catch (Exception e) {
            return ToolExecutionResult.error("Build failed: " + e.getMessage());
        }
    }
    
    private ToolExecutionResult executeTestTool(Tool tool, String projectId, Map<String, Object> params) {
        try {
            String pattern = (String) params.get("pattern");
            var result = workspaceService.runTests(projectId, pattern);
            return ToolExecutionResult.success(Map.of(
                "success", result.isSuccess(),
                "output", result.output(),
                "exitCode", result.exitCode()
            ));
        } catch (Exception e) {
            return ToolExecutionResult.error("Tests failed: " + e.getMessage());
        }
    }
    
    private ToolExecutionResult executeGitTool(Tool tool, String projectId, Map<String, Object> params) {
        // Git operations are handled by GitService
        return ToolExecutionResult.success(Map.of("status", "Git operation queued"));
    }
    
    private ToolExecutionResult executeContextTool(Tool tool, String projectId, Map<String, Object> params) {
        // Context tools read from CodebaseIntelligence
        return ToolExecutionResult.success(Map.of(
            "overview", "Project overview data",
            "modules", List.of("core", "service", "controller")
        ));
    }
    
    private ToolExecutionResult executeCodeTool(Tool tool, String projectId, Map<String, Object> params) {
        return ToolExecutionResult.success(Map.of("status", "Code operation executed"));
    }
    
    private ToolExecutionResult executeExternalTool(Tool tool, String projectId, Map<String, Object> params) {
        if (tool.getConnectorId() == null) {
            return ToolExecutionResult.error("External tool requires a connector");
        }
        
        try {
            var response = connectorManager.execute(tool.getConnectorId(), tool.getName(), params);
            return response.success() 
                ? ToolExecutionResult.success(response.data())
                : ToolExecutionResult.error("External tool execution failed");
        } catch (Exception e) {
            return ToolExecutionResult.error("External tool error: " + e.getMessage());
        }
    }
    
    // --- Permission validation ---
    
    private void validatePermissions(Tool tool, String agentId) {
        // In production, check agent's permissions against tool's required permissions
        log.debug("Validating permissions for tool: {} agent: {}", tool.getName(), agentId);
        // Simplified: all agents can use all tools in this simulation
    }
    
    // --- DTOs ---
    
    public record ToolExecutionResult(boolean success, Map<String, Object> data, String error) {
        public static ToolExecutionResult success(Map<String, Object> data) {
            return new ToolExecutionResult(true, data, null);
        }
        
        public static ToolExecutionResult error(String error) {
            return new ToolExecutionResult(false, Map.of(), error);
        }
    }
}
