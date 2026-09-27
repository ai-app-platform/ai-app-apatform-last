# AI App Platform — Backend

## 🏗️ Architecture

```
backend/
├── pom.xml                                    # Maven build (Java 21, Spring Boot 4)
├── src/main/java/com/platform/
│   ├── PlatformApplication.java               # Entry point
│   ├── config/
│   │   ├── SecurityConfig.java                # Security + CORS
│   │   └── AsyncConfig.java                   # Async task execution
│   ├── domain/                                # JPA Entities
│   │   ├── BaseEntity.java                    # Base with versioning
│   │   ├── Project.java                       # Project management
│   │   ├── Agent.java                         # Agent definitions
│   │   ├── Task.java                          # Task lifecycle
│   │   ├── Tool.java                          # Tool definitions
│   │   ├── Connector.java                     # External connections
│   │   ├── Workflow.java                      # Workflow definitions
│   │   ├── KnowledgeEntry.java                # Knowledge management
│   │   ├── AgentTeam.java                     # Agent teams
│   │   ├── Role.java                          # Role definitions
│   │   ├── Skill.java                         # Skill definitions
│   │   └── Prompt.java                        # Prompt templates
│   ├── repository/                            # Spring Data JPA
│   │   ├── ProjectRepository.java
│   │   ├── AgentRepository.java
│   │   ├── TaskRepository.java
│   │   └── Repositories.java                  # All other repos
│   ├── service/                               # Business logic
│   │   ├── ProjectService.java
│   │   └── TaskService.java
│   ├── engine/                                # Core engines
│   │   ├── git/
│   │   │   └── GitService.java                # JGit operations
│   │   ├── workspace/
│   │   │   └── WorkspaceService.java          # File/command management
│   │   ├── codebase/
│   │   │   └── CodebaseIntelligenceService.java # AST analysis
│   │   ├── rag/
│   │   │   └── RAGService.java                # Vector + Hybrid search
│   │   ├── context/
│   │   │   └── ContextEngineService.java      # Context assembly
│   │   ├── memory/
│   │   │   └── MemoryManagerService.java      # Runtime + Long-term
│   │   └── execution/
│   │       └── TaskExecutionEngine.java       # Full lifecycle orchestration
│   ├── connector/
│   │   ├── ConnectorManager.java              # External system access
│   │   └── ToolExecutor.java                  # Tool execution routing
│   └── controller/                            # REST API
│       ├── ProjectController.java
│       ├── TaskController.java                # + SSE streaming
│       ├── EntityControllers.java             # CRUD for all entities
│       └── EngineControllers.java             # Engine APIs
└── src/main/resources/
    ├── application.yml                        # Configuration
    └── data.sql                               # Seed data
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.9+
- PostgreSQL 15+
- (Optional) Qdrant, Neo4j

### Run

```bash
cd backend
mvn spring-boot:run
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create task |
| POST | `/api/tasks/{id}/execute` | Execute task |
| GET | `/api/tasks/{id}/execution/stream` | SSE execution stream |
| GET | `/api/agents` | List agents |
| GET | `/api/tools` | List tools |
| GET | `/api/connectors` | List connectors |
| GET | `/api/workflows` | List workflows |
| POST | `/api/rag/search/{projectId}` | RAG search |
| POST | `/api/codebase/search/{projectId}` | Codebase search |
| POST | `/api/context/assemble` | Assemble context |
| GET | `/api/memory/long-term` | Get long-term memory |

## 🏛️ Architectural Principles

### Source of Truth
```
Source Code            → Git
Permanent Knowledge    → Versioned Files / Git
Runtime State          → Disk (.ai/runtime)
Database               → Metadata / Index
RAG                    → Retrieval Layer (NOT source of truth)
```

### Domain Separations
```
Knowledge ≠ Memory
Knowledge ≠ Prompt
Memory ≠ RAG
Workflow ≠ Agent
Agent ≠ Tool
Connector ≠ MCP
Connector ≠ Tool
Git ≠ Workspace
```

### Key Invariants
1. Knowledge always has a specific Source of Truth
2. RAG is NEVER the Source of Truth
3. Memory ≠ Knowledge (runtime vs permanent)
4. Agent Definition is independent from Project
5. Team is at Project level, not per-task
6. Planner can only select from Project Team
7. Tool Definition ≠ Tool Implementation
8. Connector ≠ MCP (MCP is just one adapter)
9. Credentials are NEVER stored in plaintext
10. All critical definitions must be versioned

## 🔧 Technology Stack

| Component | Technology |
|-----------|-----------|
| Language | Java 21 |
| Framework | Spring Boot 4 |
| LLM Integration | Spring AI + LangChain4j |
| Git Operations | JGit |
| Database | PostgreSQL + JPA/Hibernate |
| Vector DB | Qdrant |
| Graph DB | Neo4j |
| API | REST + SSE (WebSocket) |
| Security | Spring Security + Vault |

## 📋 Task Execution Lifecycle

```
Create Task → Resolve Project → Prepare Workspace →
Create Task Branch → Resolve Knowledge → Resolve Agent Team →
Resolve Workflow → Load Context → Assemble Context →
Plan Task → Dynamic Agent Selection → Build Execution Graph →
Execute Agents → Code Changes → Build/Test → Review →
Commit → Push → Pull Request → Update Memory →
Promote Long-Term Memory
```
