package com.platform.engine.workspace;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Workspace Service — manages the runtime working copy of a project.
 * 
 * IMPORTANT SEPARATIONS:
 * - Workspace ≠ Git Repository (Workspace is runtime, Git is canonical)
 * - Workspace is NOT source of truth
 * - Agent should NOT execute git commands directly; use Connector + ToolExecutor
 * 
 * Responsibilities:
 * - File read/write
 * - Command execution (build, test)
 * - Build artifacts management
 * - Temporary files
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WorkspaceService {
    
    @Value("${platform.workspace.base-path}")
    private String workspaceBasePath;
    
    /**
     * Read file content from workspace.
     */
    public String readFile(String projectId, String filePath) throws IOException {
        Path fullPath = getWorkspacePath(projectId).resolve(filePath);
        
        if (!Files.exists(fullPath)) {
            throw new IllegalArgumentException("File not found: " + filePath);
        }
        
        return Files.readString(fullPath);
    }
    
    /**
     * Write file content to workspace.
     */
    public void writeFile(String projectId, String filePath, String content) throws IOException {
        Path fullPath = getWorkspacePath(projectId).resolve(filePath);
        
        // Create parent directories if needed
        Files.createDirectories(fullPath.getParent());
        
        Files.writeString(fullPath, content);
        log.debug("Wrote file: {} in project: {}", filePath, projectId);
    }
    
    /**
     * Delete file from workspace.
     */
    public void deleteFile(String projectId, String filePath) throws IOException {
        Path fullPath = getWorkspacePath(projectId).resolve(filePath);
        Files.deleteIfExists(fullPath);
    }
    
    /**
     * List files in a directory.
     */
    public List<FileInfo> listFiles(String projectId, String directory) throws IOException {
        Path dirPath = getWorkspacePath(projectId).resolve(directory);
        
        if (!Files.exists(dirPath)) {
            return List.of();
        }
        
        List<FileInfo> files = new ArrayList<>();
        
        try (var stream = Files.walk(dirPath, 3)) {
            stream.filter(Files::isRegularFile)
                .forEach(path -> {
                    try {
                        var attrs = Files.readAttributes(path, BasicFileAttributes.class);
                        files.add(new FileInfo(
                            getWorkspacePath(projectId).relativize(path).toString(),
                            attrs.size(),
                            attrs.lastModifiedTime().toInstant()
                        ));
                    } catch (IOException e) {
                        log.warn("Failed to read file attributes: {}", path);
                    }
                });
        }
        
        return files;
    }
    
    /**
     * Execute a command in the workspace.
     */
    public CommandResult executeCommand(String projectId, String command, long timeoutSeconds) throws IOException, InterruptedException {
        Path workspacePath = getWorkspacePath(projectId);
        
        log.info("Executing command in project {}: {}", projectId, command);
        
        ProcessBuilder processBuilder = new ProcessBuilder("bash", "-c", command)
            .directory(workspacePath.toFile())
            .redirectErrorStream(true);
        
        Process process = processBuilder.start();
        
        String output = new String(process.getInputStream().readAllBytes());
        
        boolean completed = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
        
        if (!completed) {
            process.destroyForcibly();
            throw new RuntimeException("Command timed out after " + timeoutSeconds + " seconds");
        }
        
        int exitCode = process.exitValue();
        
        return new CommandResult(exitCode, output);
    }
    
    /**
     * Run build command.
     */
    public CommandResult runBuild(String projectId) throws IOException, InterruptedException {
        return executeCommand(projectId, "mvn clean compile -q", 300);
    }
    
    /**
     * Run tests.
     */
    public CommandResult runTests(String projectId, String testPattern) throws IOException, InterruptedException {
        String command = testPattern != null 
            ? "mvn test -Dtest=" + testPattern 
            : "mvn test";
        return executeCommand(projectId, command, 600);
    }
    
    /**
     * Clean workspace build artifacts.
     */
    public void cleanWorkspace(String projectId) throws IOException {
        Path targetPath = getWorkspacePath(projectId).resolve("target");
        
        if (Files.exists(targetPath)) {
            Files.walkFileTree(targetPath, new SimpleFileVisitor<>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                    Files.delete(file);
                    return FileVisitResult.CONTINUE;
                }
                
                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    Files.delete(dir);
                    return FileVisitResult.CONTINUE;
                }
            });
        }
        
        log.info("Cleaned workspace for project: {}", projectId);
    }
    
    /**
     * Check if workspace exists.
     */
    public boolean workspaceExists(String projectId) {
        return Files.exists(getWorkspacePath(projectId));
    }
    
    /**
     * Initialize workspace directory.
     */
    public void initializeWorkspace(String projectId) throws IOException {
        Path workspacePath = getWorkspacePath(projectId);
        Files.createDirectories(workspacePath);
        log.info("Initialized workspace for project: {}", projectId);
    }
    
    // --- Helper methods ---
    
    private Path getWorkspacePath(String projectId) {
        return Path.of(workspaceBasePath, projectId);
    }
    
    // --- DTOs ---
    
    public record FileInfo(String path, long size, java.time.Instant lastModified) {}
    public record CommandResult(int exitCode, String output) {
        public boolean isSuccess() {
            return exitCode == 0;
        }
    }
}
