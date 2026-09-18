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
import { TeamsPage, RolesPage, SkillsPage, KnowledgePage, MemoryPage, RAGPage } from './pages/OtherPages';
import ArchitecturePage from './pages/ArchitecturePage';

function AppContent() {
  const { fetchAll } = useStore();

  useEffect(() => {
    fetchAll();
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
        <Route path="/memory" element={<MemoryPage />} />
        <Route path="/rag" element={<RAGPage />} />
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
