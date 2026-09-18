package com.platform.controller;

import com.platform.domain.*;
import com.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Generic CRUD controllers for platform entities.
 */
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EntityControllers {
    
    // --- Agent Controller ---
    @RestController
    @RequestMapping("/agents")
    public static class AgentController {
        private final AgentRepository repo;
        
        @GetMapping
        public List<Agent> list() { return repo.findByDeletedFalse(); }
        
        @GetMapping("/{id}")
        public ResponseEntity<Agent> get(@PathVariable String id) {
            return repo.findByIdAndDeletedFalse(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        }
        
        @PostMapping
        public ResponseEntity<Agent> create(@RequestBody Agent agent) {
            agent.setStatus(Agent.AgentStatus.ACTIVE);
            return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(agent));
        }
        
        @PutMapping("/{id}")
        public ResponseEntity<Agent> update(@PathVariable String id, @RequestBody Agent updates) {
            return repo.findByIdAndDeletedFalse(id).map(existing -> {
                if (updates.getName() != null) existing.setName(updates.getName());
                if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
                if (updates.getModelConfig() != null) existing.setModelConfig(updates.getModelConfig());
                if (updates.getAllowedTools() != null) existing.setAllowedTools(updates.getAllowedTools());
                if (updates.getSkills() != null) existing.setSkills(updates.getSkills());
                return ResponseEntity.ok(repo.save(existing));
            }).orElse(ResponseEntity.notFound().build());
        }
    }
    
    // --- Tool Controller ---
    @RestController
    @RequestMapping("/tools")
    public static class ToolController {
        private final ToolRepository repo;
        
        @GetMapping
        public List<Tool> list() { return repo.findByDeletedFalse(); }
        
        @GetMapping("/{id}")
        public ResponseEntity<Tool> get(@PathVariable String id) {
            return repo.findByIdAndDeletedFalse(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        }
        
        @PostMapping
        public ResponseEntity<Tool> create(@RequestBody Tool tool) {
            tool.setStatus(Tool.ToolStatus.ACTIVE);
            return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(tool));
        }
    }
    
    // --- Connector Controller ---
    @RestController
    @RequestMapping("/connectors")
    public static class ConnectorController {
        private final ConnectorRepository repo;
        
        @GetMapping
        public List<Connector> list() { return repo.findByDeletedFalse(); }
        
        @GetMapping("/{id}")
        public ResponseEntity<Connector> get(@PathVariable String id) {
            return repo.findByIdAndDeletedFalse(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        }
        
        @PostMapping
        public ResponseEntity<Connector> create(@RequestBody Connector connector) {
            connector.setStatus(Connector.ConnectorStatus.ACTIVE);
            return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(connector));
        }
    }
    
    // --- Workflow Controller ---
    @RestController
    @RequestMapping("/workflows")
    public static class WorkflowController {
        private final WorkflowRepository repo;
        
        @GetMapping
        public List<Workflow> list() { return repo.findByDeletedFalse(); }
        
        @GetMapping("/{id}")
        public ResponseEntity<Workflow> get(@PathVariable String id) {
            return repo.findByIdAndDeletedFalse(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        }
        
        @PostMapping
        public ResponseEntity<Workflow> create(@RequestBody Workflow workflow) {
            workflow.setStatus(Workflow.WorkflowStatus.ACTIVE);
            return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(workflow));
        }
    }
    
    // --- Knowledge Controller ---
    @RestController
    @RequestMapping("/knowledge")
    public static class KnowledgeController {
        private final KnowledgeRepository repo;
        
        @GetMapping
        public List<KnowledgeEntry> list() { return repo.findByDeletedFalse(); }
        
        @GetMapping("/platform")
        public List<KnowledgeEntry> listPlatform() { return repo.findByScopeAndDeletedFalse(KnowledgeEntry.KnowledgeScope.PLATFORM); }
        
        @GetMapping("/project/{projectId}")
        public List<KnowledgeEntry> listByProject(@PathVariable String projectId) { return repo.findByProjectIdAndDeletedFalse(projectId); }
    }
    
    // --- Agent Team Controller ---
    @RestController
    @RequestMapping("/teams")
    public static class TeamController {
        private final AgentTeamRepository repo;
        
        @GetMapping
        public List<AgentTeam> list() { return repo.findByDeletedFalse(); }
        
        @GetMapping("/project/{projectId}")
        public ResponseEntity<AgentTeam> getByProject(@PathVariable String projectId) {
            return repo.findByProjectIdAndDeletedFalse(projectId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        }
    }
    
    // --- Role Controller ---
    @RestController
    @RequestMapping("/roles")
    public static class RoleController {
        private final RoleRepository repo;
        
        @GetMapping
        public List<Role> list() { return repo.findByDeletedFalse(); }
    }
    
    // --- Skill Controller ---
    @RestController
    @RequestMapping("/skills")
    public static class SkillController {
        private final SkillRepository repo;
        
        @GetMapping
        public List<Skill> list() { return repo.findByDeletedFalse(); }
    }
    
    // --- Prompt Controller ---
    @RestController
    @RequestMapping("/prompts")
    public static class PromptController {
        private final PromptRepository repo;
        
        @GetMapping
        public List<Prompt> list() { return repo.findByDeletedFalse(); }
    }
}
