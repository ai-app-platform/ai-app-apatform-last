package com.platform.service;

import com.platform.domain.Project;
import com.platform.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Project Service — manages project lifecycle.
 * 
 * Responsibilities:
 * - Project CRUD
 * - Repository configuration
 * - Workspace initialization
 * - Agent team binding
 * 
 * NOT responsible for:
 * - Git operations (GitService)
 * - Workspace file management (WorkspaceService)
 * - Agent execution (ExecutionService)
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    
    public List<Project> getAllProjects() {
        return projectRepository.findAllActive();
    }
    
    public Optional<Project> getProject(String id) {
        return projectRepository.findByIdAndDeletedFalse(id);
    }
    
    public Project createProject(Project project) {
        log.info("Creating project: {}", project.getName());
        
        if (projectRepository.existsByNameAndDeletedFalse(project.getName())) {
            throw new IllegalArgumentException("Project with name already exists: " + project.getName());
        }
        
        project.setStatus(Project.ProjectStatus.ACTIVE);
        return projectRepository.save(project);
    }
    
    public Project updateProject(String id, Project updates) {
        log.info("Updating project: {}", id);
        
        Project project = projectRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new IllegalArgumentException("Project not found: " + id));
        
        if (updates.getName() != null) project.setName(updates.getName());
        if (updates.getDescription() != null) project.setDescription(updates.getDescription());
        if (updates.getRepositoryUrl() != null) project.setRepositoryUrl(updates.getRepositoryUrl());
        if (updates.getDefaultBranch() != null) project.setDefaultBranch(updates.getDefaultBranch());
        if (updates.getStatus() != null) project.setStatus(updates.getStatus());
        
        return projectRepository.save(project);
    }
    
    public void deleteProject(String id) {
        log.info("Soft-deleting project: {}", id);
        
        Project project = projectRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new IllegalArgumentException("Project not found: " + id));
        
        project.setDeleted(true);
        projectRepository.save(project);
    }
    
    public List<Project> getProjectsByStatus(Project.ProjectStatus status) {
        return projectRepository.findByStatusAndDeletedFalse(status);
    }
}
