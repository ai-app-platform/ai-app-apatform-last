import type { Project, Agent, Tool, Connector, Workflow, Task, Skill, Role, KnowledgeEntry, AgentTeam, DashboardStats } from '../types';
import { mockProjects, mockAgents, mockTools, mockConnectors, mockWorkflows, mockTasks, mockSkills, mockRoles, mockKnowledge, mockTeams, mockDashboardStats } from '../data/mockData';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store (simulates database)
let projects = [...mockProjects];
let agents = [...mockAgents];
let tools = [...mockTools];
let connectors = [...mockConnectors];
let workflows = [...mockWorkflows];
let tasks = [...mockTasks];
let skills = [...mockSkills];
let roles = [...mockRoles];
let knowledge = [...mockKnowledge];
let teams = [...mockTeams];

const genId = () => Math.random().toString(36).substring(2, 10);
const now = () => new Date().toISOString();

// ============================================
// API Service — simulates REST backend
// ============================================

export const api = {
  // --- Dashboard ---
  dashboard: {
    getStats: async (): Promise<DashboardStats> => {
      await delay(200);
      return { ...mockDashboardStats };
    },
  },

  // --- Projects ---
  projects: {
    list: async (): Promise<Project[]> => {
      await delay();
      return [...projects];
    },
    get: async (id: string): Promise<Project | undefined> => {
      await delay(200);
      return projects.find(p => p.id === id);
    },
    create: async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Project> => {
      await delay();
      const project: Project = { ...data, id: genId(), createdAt: now(), updatedAt: now(), version: 1 };
      projects.push(project);
      return project;
    },
    update: async (id: string, data: Partial<Project>): Promise<Project | undefined> => {
      await delay();
      const idx = projects.findIndex(p => p.id === id);
      if (idx === -1) return undefined;
      projects[idx] = { ...projects[idx], ...data, updatedAt: now(), version: projects[idx].version + 1 };
      return projects[idx];
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      const idx = projects.findIndex(p => p.id === id);
      if (idx === -1) return false;
      projects.splice(idx, 1);
      return true;
    },
  },

  // --- Agents ---
  agents: {
    list: async (): Promise<Agent[]> => {
      await delay();
      return [...agents];
    },
    get: async (id: string): Promise<Agent | undefined> => {
      await delay(200);
      return agents.find(a => a.id === id);
    },
    create: async (data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Agent> => {
      await delay();
      const agent: Agent = { ...data, id: genId(), createdAt: now(), updatedAt: now(), version: 1 };
      agents.push(agent);
      return agent;
    },
    update: async (id: string, data: Partial<Agent>): Promise<Agent | undefined> => {
      await delay();
      const idx = agents.findIndex(a => a.id === id);
      if (idx === -1) return undefined;
      agents[idx] = { ...agents[idx], ...data, updatedAt: now(), version: agents[idx].version + 1 };
      return agents[idx];
    },
    delete: async (id: string): Promise<boolean> => {
      await delay();
      const idx = agents.findIndex(a => a.id === id);
      if (idx === -1) return false;
      agents.splice(idx, 1);
      return true;
    },
  },

  // --- Tools ---
  tools: {
    list: async (): Promise<Tool[]> => {
      await delay();
      return [...tools];
    },
    get: async (id: string): Promise<Tool | undefined> => {
      await delay(200);
      return tools.find(t => t.id === id);
    },
    create: async (data: Omit<Tool, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Tool> => {
      await delay();
      const tool: Tool = { ...data, id: genId(), createdAt: now(), updatedAt: now(), version: 1 };
      tools.push(tool);
      return tool;
    },
    update: async (id: string, data: Partial<Tool>): Promise<Tool | undefined> => {
      await delay();
      const idx = tools.findIndex(t => t.id === id);
      if (idx === -1) return undefined;
      tools[idx] = { ...tools[idx], ...data, updatedAt: now(), version: tools[idx].version + 1 };
      return tools[idx];
    },
  },

  // --- Connectors ---
  connectors: {
    list: async (): Promise<Connector[]> => {
      await delay();
      return [...connectors];
    },
    get: async (id: string): Promise<Connector | undefined> => {
      await delay(200);
      return connectors.find(c => c.id === id);
    },
    create: async (data: Omit<Connector, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Connector> => {
      await delay();
      const connector: Connector = { ...data, id: genId(), createdAt: now(), updatedAt: now(), version: 1 };
      connectors.push(connector);
      return connector;
    },
    update: async (id: string, data: Partial<Connector>): Promise<Connector | undefined> => {
      await delay();
      const idx = connectors.findIndex(c => c.id === id);
      if (idx === -1) return undefined;
      connectors[idx] = { ...connectors[idx], ...data, updatedAt: now(), version: connectors[idx].version + 1 };
      return connectors[idx];
    },
  },

  // --- Workflows ---
  workflows: {
    list: async (): Promise<Workflow[]> => {
      await delay();
      return [...workflows];
    },
    get: async (id: string): Promise<Workflow | undefined> => {
      await delay(200);
      return workflows.find(w => w.id === id);
    },
    create: async (data: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Workflow> => {
      await delay();
      const workflow: Workflow = { ...data, id: genId(), createdAt: now(), updatedAt: now(), version: 1 };
      workflows.push(workflow);
      return workflow;
    },
    update: async (id: string, data: Partial<Workflow>): Promise<Workflow | undefined> => {
      await delay();
      const idx = workflows.findIndex(w => w.id === id);
      if (idx === -1) return undefined;
      workflows[idx] = { ...workflows[idx], ...data, updatedAt: now(), version: workflows[idx].version + 1 };
      return workflows[idx];
    },
  },

  // --- Tasks ---
  tasks: {
    list: async (projectId?: string): Promise<Task[]> => {
      await delay();
      if (projectId) return tasks.filter(t => t.projectId === projectId);
      return [...tasks];
    },
    get: async (id: string): Promise<Task | undefined> => {
      await delay(200);
      return tasks.find(t => t.id === id);
    },
    create: async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Task> => {
      await delay();
      const task: Task = { ...data, id: genId(), createdAt: now(), updatedAt: now(), version: 1 };
      tasks.push(task);
      return task;
    },
    update: async (id: string, data: Partial<Task>): Promise<Task | undefined> => {
      await delay();
      const idx = tasks.findIndex(t => t.id === id);
      if (idx === -1) return undefined;
      tasks[idx] = { ...tasks[idx], ...data, updatedAt: now(), version: tasks[idx].version + 1 };
      return tasks[idx];
    },
  },

  // --- Skills ---
  skills: {
    list: async (): Promise<Skill[]> => {
      await delay();
      return [...skills];
    },
  },

  // --- Roles ---
  roles: {
    list: async (): Promise<Role[]> => {
      await delay();
      return [...roles];
    },
  },

  // --- Knowledge ---
  knowledge: {
    list: async (scope?: 'platform' | 'project', projectId?: string): Promise<KnowledgeEntry[]> => {
      await delay();
      let result = [...knowledge];
      if (scope) result = result.filter(k => k.scope === scope);
      if (projectId) result = result.filter(k => k.projectId === projectId);
      return result;
    },
  },

  // --- Teams ---
  teams: {
    list: async (): Promise<AgentTeam[]> => {
      await delay();
      return [...teams];
    },
    getByProject: async (projectId: string): Promise<AgentTeam | undefined> => {
      await delay();
      return teams.find(t => t.projectId === projectId);
    },
  },
};
