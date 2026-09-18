import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import { useStore } from './store/useStore';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import AgentsPage from './pages/AgentsPage';
import TasksPage from './pages/TasksPage';
import ToolsPage from './pages/ToolsPage';
import ConnectorsPage from './pages/ConnectorsPage';
import WorkflowsPage from './pages/WorkflowsPage';
import { TeamsPage, RolesPage, SkillsPage, KnowledgePage } from './pages/OtherPages';
import { MemoryDetailPage, ExecutionTracePage } from './pages/MemoryTracePages';
import { WorkspacePage, CodebasePage, RAGIndexPage } from './pages/WorkspacePages';
import ExecutionPage from './pages/ExecutionPage';
import ContextEnginePage from './pages/ContextEnginePage';
import ArchitecturePage from './pages/ArchitecturePage';
import { codebaseIntelligence } from './engine/CodebaseIntelligence';
import { ragIndexer } from './engine/RAGIndexer';
import { memoryManager } from './engine/ContextEngine';

function AppContent() {
  const { fetchAll } = useStore();

  useEffect(() => {
    fetchAll();
    // Initialize simulation engines
    codebaseIntelligence.initMockData();
    ragIndexer.initMockData();
    memoryManager.initMockData();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/connectors" element={<ConnectorsPage />} />
        <Route path="/workflows" element={<WorkflowsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/memory" element={<MemoryDetailPage />} />
        <Route path="/rag" element={<RAGIndexPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/codebase" element={<CodebasePage />} />
        <Route path="/execution" element={<ExecutionPage />} />
        <Route path="/trace" element={<ExecutionTracePage />} />
        <Route path="/context" element={<ContextEnginePage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
