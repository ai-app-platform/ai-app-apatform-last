package com.platform.repository;

import com.platform.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByDeletedFalse();
    List<Task> findByProjectIdAndDeletedFalse(String projectId);
    List<Task> findByStatusAndDeletedFalse(Task.TaskStatus status);
    Optional<Task> findByIdAndDeletedFalse(String id);
    List<Task> findByProjectIdAndStatusInAndDeletedFalse(String projectId, List<Task.TaskStatus> statuses);
}

@Repository
public interface ToolRepository extends JpaRepository<Tool, String> {
    List<Tool> findByDeletedFalse();
    Optional<Tool> findByIdAndDeletedFalse(String id);
    Optional<Tool> findByNameAndDeletedFalse(String name);
    List<Tool> findByCategoryAndDeletedFalse(Tool.ToolCategory category);
}

@Repository
public interface ConnectorRepository extends JpaRepository<Connector, String> {
    List<Connector> findByDeletedFalse();
    Optional<Connector> findByIdAndDeletedFalse(String id);
    List<Connector> findByTypeAndDeletedFalse(Connector.ConnectorType type);
}

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, String> {
    List<Workflow> findByDeletedFalse();
    Optional<Workflow> findByIdAndDeletedFalse(String id);
    List<Workflow> findByScopeAndDeletedFalse(Workflow.WorkflowScope scope);
}

@Repository
public interface KnowledgeRepository extends JpaRepository<KnowledgeEntry, String> {
    List<KnowledgeEntry> findByDeletedFalse();
    List<KnowledgeEntry> findByScopeAndDeletedFalse(KnowledgeEntry.KnowledgeScope scope);
    List<KnowledgeEntry> findByProjectIdAndDeletedFalse(String projectId);
    Optional<KnowledgeEntry> findByIdAndDeletedFalse(String id);
}

@Repository
public interface AgentTeamRepository extends JpaRepository<AgentTeam, String> {
    List<AgentTeam> findByDeletedFalse();
    Optional<AgentTeam> findByProjectIdAndDeletedFalse(String projectId);
}

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    List<Role> findByDeletedFalse();
}

@Repository
public interface SkillRepository extends JpaRepository<Skill, String> {
    List<Skill> findByDeletedFalse();
}

@Repository
public interface PromptRepository extends JpaRepository<Prompt, String> {
    List<Prompt> findByDeletedFalse();
    List<Prompt> findByScopeAndDeletedFalse(Prompt.PromptScope scope);
}
