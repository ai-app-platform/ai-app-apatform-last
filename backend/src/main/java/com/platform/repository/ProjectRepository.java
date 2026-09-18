package com.platform.repository;

import com.platform.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    
    List<Project> findByDeletedFalse();
    
    Optional<Project> findByIdAndDeletedFalse(String id);
    
    List<Project> findByStatusAndDeletedFalse(Project.ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.deleted = false ORDER BY p.updatedAt DESC")
    List<Project> findAllActive();
    
    boolean existsByNameAndDeletedFalse(String name);
}
