package com.platform.repository;

import com.platform.domain.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, String> {
    List<Agent> findByDeletedFalse();
    Optional<Agent> findByIdAndDeletedFalse(String id);
    List<Agent> findByTypeAndDeletedFalse(Agent.AgentType type);
    List<Agent> findByStatusAndDeletedFalse(Agent.AgentStatus status);
}
