import { create } from 'zustand';
import type { Project, Agent, Tool, Connector, Workflow, Task, Skill, Role, KnowledgeEntry, AgentTeam, DashboardStats } from '../types';
import { api } from '../services/api';

interface AppState {
  // Data
  projects: Project[];
  agents: Agent[];
  tools: Tool[];
  connectors: Connector[];
  workflows: Workflow[];
  tasks: Task[];
  skills: Skill[];
  roles: Role[];
  knowledge: KnowledgeEntry[];
  teams: AgentTeam[];
  dashboardStats: DashboardStats | null;

  // UI State
  loading: boolean;
  sidebarCollapsed: boolean;
  selectedProjectId: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setSelectedProject: (id: string | null) => void;

  // Data fetchers
  fetchDashboard: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchAgents: () => Promise<void>;
  fetchTools: () => Promise<void>;
  fetchConnectors: () => Promise<void>;
  fetchWorkflows: () => Promise<void>;
  fetchTasks: (projectId?: string) => Promise<void>;
  fetchSkills: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchKnowledge: (scope?: 'platform' | 'project') => Promise<void>;
  fetchTeams: () => Promise<void>;
  fetchAll: () => Promise<void>;

  // Mutations
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<Project>;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  projects: [],
  agents: [],
  tools: [],
  connectors: [],
  workflows: [],
  tasks: [],
  skills: [],
  roles: [],
  knowledge: [],
  teams: [],
  dashboardStats: null,
  loading: false,
  sidebarCollapsed: false,
  selectedProjectId: null,

  // UI Actions
  setLoading: (loading) => set({ loading }),
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedProject: (id) => set({ selectedProjectId: id }),

  // Fetchers
  fetchDashboard: async () => {
    const stats = await api.dashboard.getStats();
    set({ dashboardStats: stats });
  },

  fetchProjects: async () => {
    const projects = await api.projects.list();
    set({ projects });
  },

  fetchAgents: async () => {
    const agents = await api.agents.list();
    set({ agents });
  },

  fetchTools: async () => {
    const tools = await api.tools.list();
    set({ tools });
  },

  fetchConnectors: async () => {
    const connectors = await api.connectors.list();
    set({ connectors });
  },

  fetchWorkflows: async () => {
    const workflows = await api.workflows.list();
    set({ workflows });
  },

  fetchTasks: async (projectId) => {
    const tasks = await api.tasks.list(projectId);
    set({ tasks });
  },

  fetchSkills: async () => {
    const skills = await api.skills.list();
    set({ skills });
  },

  fetchRoles: async () => {
    const roles = await api.roles.list();
    set({ roles });
  },

  fetchKnowledge: async (scope) => {
    const knowledge = await api.knowledge.list(scope);
    set({ knowledge });
  },

  fetchTeams: async () => {
    const teams = await api.teams.list();
    set({ teams });
  },

  fetchAll: async () => {
    set({ loading: true });
    const state = get();
    await Promise.all([
      state.fetchDashboard(),
      state.fetchProjects(),
      state.fetchAgents(),
      state.fetchTools(),
      state.fetchConnectors(),
      state.fetchWorkflows(),
      state.fetchTasks(),
      state.fetchSkills(),
      state.fetchRoles(),
      state.fetchKnowledge(),
      state.fetchTeams(),
    ]);
    set({ loading: false });
  },

  // Mutations
  createTask: async (data) => {
    const task = await api.tasks.create(data);
    set(state => ({ tasks: [...state.tasks, task] }));
    return task;
  },

  updateTask: async (id, data) => {
    const updated = await api.tasks.update(id, data);
    if (updated) {
      set(state => ({ tasks: state.tasks.map(t => t.id === id ? updated : t) }));
    }
  },

  createProject: async (data) => {
    const project = await api.projects.create(data);
    set(state => ({ projects: [...state.projects, project] }));
    return project;
  },
}));
