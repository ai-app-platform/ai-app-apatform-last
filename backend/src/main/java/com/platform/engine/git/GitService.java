package com.platform.engine.git;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.*;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.Ref;
import org.eclipse.jgit.revwalk.RevCommit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.*;

/**
 * Git Service — manages all Git operations.
 * 
 * IMPORTANT SEPARATIONS:
 * - Git Management ≠ Connector Management
 * - Git Repository ≠ Workspace (Repository is canonical, Workspace is runtime)
 * - Git is Source of Truth for Source Code
 * 
 * Responsibilities:
 * - Clone, Fetch, Pull
 * - Branch management (create, checkout, delete)
 * - Task branch creation
 * - Commit, Push
 * - Diff, History
 * - Pull Request info
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GitService {
    
    @Value("${platform.workspace.base-path}")
    private String workspaceBasePath;
    
    /**
     * Clone a repository to the workspace.
     */
    public Git cloneRepository(String projectId, String repositoryUrl, String branch) throws GitAPIException, IOException {
        Path workspacePath = getWorkspacePath(projectId);
        
        log.info("Cloning repository {} to {} (branch: {})", repositoryUrl, workspacePath, branch);
        
        return Git.cloneRepository()
            .setURI(repositoryUrl)
            .setDirectory(workspacePath.toFile())
            .setBranch(branch)
            .call();
    }
    
    /**
     * Create a task-specific branch.
     */
    public String createTaskBranch(String projectId, String taskTitle) throws IOException, GitAPIException {
        Path workspacePath = getWorkspacePath(projectId);
        
        try (Git git = Git.open(workspacePath.toFile())) {
            String branchName = "task/" + sanitizeBranchName(taskTitle);
            
            log.info("Creating task branch: {} for project: {}", branchName, projectId);
            
            git.branchCreate()
                .setName(branchName)
                .call();
            
            git.checkout()
                .setName(branchName)
                .call();
            
            return branchName;
        }
    }
    
    /**
     * Commit changes with a message.
     */
    public String commit(String projectId, String message, List<String> files) throws IOException, GitAPIException {
        Path workspacePath = getWorkspacePath(projectId);
        
        try (Git git = Git.open(workspacePath.toFile())) {
            // Stage files
            AddCommand addCommand = git.add();
            for (String file : files) {
                addCommand.addFilepattern(file);
            }
            addCommand.call();
            
            // Commit
            RevCommit commit = git.commit()
                .setMessage(message)
                .setAuthor("AI Agent", "agent@platform.ai")
                .call();
            
            String sha = commit.getName();
            log.info("Committed changes in project {}: {} ({})", projectId, message, sha);
            
            return sha;
        }
    }
    
    /**
     * Push to remote repository.
     */
    public void push(String projectId, String branch) throws IOException, GitAPIException {
        Path workspacePath = getWorkspacePath(projectId);
        
        try (Git git = Git.open(workspacePath.toFile())) {
            log.info("Pushing branch {} for project: {}", branch, projectId);
            
            git.push()
                .setRemote("origin")
                .add(branch)
                .call();
        }
    }
    
    /**
     * Get diff between two commits.
     */
    public List<DiffEntry> getDiff(String projectId, String fromCommit, String toCommit) throws IOException, GitAPIException {
        Path workspacePath = getWorkspacePath(projectId);
        
        try (Git git = Git.open(workspacePath.toFile())) {
            ObjectId fromId = git.getRepository().resolve(fromCommit);
            ObjectId toId = git.getRepository().resolve(toCommit);
            
            if (fromId == null || toId == null) {
                throw new IllegalArgumentException("Invalid commit SHA");
            }
            
            return git.diff()
                .setOldTree(prepareTreeParser(git, fromId))
                .setNewTree(prepareTreeParser(git, toId))
                .call();
        }
    }
    
    /**
     * Get commit history for a branch.
     */
    public List<CommitInfo> getCommitHistory(String projectId, String branch, int maxCount) throws IOException, GitAPIException {
        Path workspacePath = getWorkspacePath(projectId);
        
        try (Git git = Git.open(workspacePath.toFile())) {
            Iterable<RevCommit> commits = git.log()
                .add(git.getRepository().resolve(branch))
                .setMaxCount(maxCount)
                .call();
            
            List<CommitInfo> result = new ArrayList<>();
            for (RevCommit commit : commits) {
                result.add(new CommitInfo(
                    commit.getName(),
                    commit.getFullMessage(),
                    commit.getAuthorIdent().getName(),
                    commit.getAuthorIdent().getWhen().toInstant(),
                    branch
                ));
            }
            
            return result;
        }
    }
    
    /**
     * Get all branches.
     */
    public List<BranchInfo> getBranches(String projectId) throws IOException, GitAPIException {
        Path workspacePath = getWorkspacePath(projectId);
        
        try (Git git = Git.open(workspacePath.toFile())) {
            List<Ref> refs = git.branchList()
                .setListMode(ListBranchCommand.ListMode.ALL)
                .call();
            
            return refs.stream()
                .map(ref -> new BranchInfo(
                    ref.getName().replace("refs/heads/", ""),
                    ref.getObjectId().getName(),
                    ref.getName().equals("refs/heads/main") || ref.getName().equals("refs/heads/master")
                ))
                .toList();
        }
    }
    
    /**
     * Fetch from remote.
     */
    public void fetch(String projectId) throws IOException, GitAPIException {
        Path workspacePath = getWorkspacePath(projectId);
        
        try (Git git = Git.open(workspacePath.toFile())) {
            log.info("Fetching remote for project: {}", projectId);
            
            git.fetch()
                .setRemote("origin")
                .call();
        }
    }
    
    // --- Helper methods ---
    
    private Path getWorkspacePath(String projectId) {
        return Path.of(workspaceBasePath, projectId);
    }
    
    private String sanitizeBranchName(String name) {
        return name.toLowerCase()
            .replaceAll("[^a-z0-9-]", "-")
            .replaceAll("-+", "-")
            .substring(0, Math.min(name.length(), 50));
    }
    
    private org.eclipse.jgit.treewalk.AbstractTreeIterator prepareTreeParser(Git git, ObjectId objectId) throws IOException {
        try (var reader = git.getRepository().newObjectReader()) {
            var walk = new org.eclipse.jgit.revwalk.RevWalk(git.getRepository());
            var commit = walk.parseCommit(objectId);
            var tree = walk.parseTree(commit.getTree().getId());
            
            var treeParser = new org.eclipse.jgit.treewalk.CanonicalTreeParser();
            treeParser.reset(reader, tree.getId());
            
            walk.dispose();
            return treeParser;
        }
    }
    
    // --- DTOs ---
    
    public record CommitInfo(String sha, String message, String author, java.time.Instant timestamp, String branch) {}
    public record BranchInfo(String name, String sha, boolean isDefault) {}
    public record DiffEntry(String file, int additions, int deletions, String status) {}
}
