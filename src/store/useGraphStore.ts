import { create } from 'zustand';
import type { Node, Connection } from '../types';

interface GraphStore {
  // Graph Data
  nodes: Node[];
  connections: Connection[];

  // UI State
  selectedNodeIds: string[];
  hoveredNodeId: string | null;
  viewportScale: number;
  viewportX: number;
  viewportY: number;

  // Panels
  showSearch: boolean;
  showInsights: boolean;
  showComments: boolean;
  rightPanelOpen: boolean;

  // AI State
  aiChatOpen: boolean;
  aiMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isAiThinking: boolean;

  // GitHub Analysis
  isAnalyzing: boolean;
  analysisProgress: number;
  currentRepo: string | null;

  // Simulation Mode
  simulationActive: boolean;
  simulationTarget: string | null;
  simulationResults: any | null;

  // Actions - Graph Manipulation
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  addConnection: (connection: Connection) => void;
  deleteConnection: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  setConnections: (connections: Connection[]) => void;

  // Actions - Selection
  selectNode: (id: string) => void;
  selectMultipleNodes: (ids: string[]) => void;
  deselectAll: () => void;
  setHoveredNode: (id: string | null) => void;

  // Actions - Viewport
  setViewport: (scale: number, x: number, y: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetViewport: () => void;

  // Actions - Panels
  toggleSearch: () => void;
  toggleInsights: () => void;
  toggleComments: () => void;
  toggleRightPanel: () => void;

  // Actions - AI
  toggleAiChat: () => void;
  addAiMessage: (role: 'user' | 'assistant', content: string) => void;
  setAiThinking: (thinking: boolean) => void;
  clearAiMessages: () => void;

  // Actions - GitHub
  setAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;
  setCurrentRepo: (repo: string | null) => void;

  // Actions - Simulation
  startSimulation: (targetNodeId: string) => void;
  stopSimulation: () => void;
  setSimulationResults: (results: any) => void;

  // Actions - Bulk Operations
  importGraph: (nodes: Node[], connections: Connection[]) => void;
  clearGraph: () => void;
  duplicateNode: (id: string) => void;
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  // Initial State
  nodes: [],
  connections: [],
  selectedNodeIds: [],
  hoveredNodeId: null,
  viewportScale: 1,
  viewportX: 0,
  viewportY: 0,
  showSearch: true,
  showInsights: false,
  showComments: false,
  rightPanelOpen: false,
  aiChatOpen: false,
  aiMessages: [],
  isAiThinking: false,
  isAnalyzing: false,
  analysisProgress: 0,
  currentRepo: null,
  simulationActive: false,
  simulationTarget: null,
  simulationResults: null,

  // Graph Manipulation
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node]
  })),

  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map(node =>
      node.id === id ? { ...node, ...updates } : node
    )
  })),

  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter(node => node.id !== id),
    connections: state.connections.filter(
      conn => conn.source !== id && conn.target !== id
    ),
    selectedNodeIds: state.selectedNodeIds.filter(nodeId => nodeId !== id)
  })),

  addConnection: (connection) => set((state) => ({
    connections: [...state.connections, connection]
  })),

  deleteConnection: (id) => set((state) => ({
    connections: state.connections.filter(conn => conn.id !== id)
  })),

  setNodes: (nodes) => set({ nodes }),
  setConnections: (connections) => set({ connections }),

  // Selection
  selectNode: (id) => set((state) => ({
    selectedNodeIds: [id],
    rightPanelOpen: true
  })),

  selectMultipleNodes: (ids) => set({ selectedNodeIds: ids }),

  deselectAll: () => set({ selectedNodeIds: [], rightPanelOpen: false }),

  setHoveredNode: (id) => set({ hoveredNodeId: id }),

  // Viewport
  setViewport: (scale, x, y) => set({
    viewportScale: scale,
    viewportX: x,
    viewportY: y
  }),

  zoomIn: () => set((state) => ({
    viewportScale: Math.min(state.viewportScale * 1.2, 4)
  })),

  zoomOut: () => set((state) => ({
    viewportScale: Math.max(state.viewportScale / 1.2, 0.25)
  })),

  resetViewport: () => set({
    viewportScale: 1,
    viewportX: 0,
    viewportY: 0
  }),

  // Panels
  toggleSearch: () => set((state) => ({ showSearch: !state.showSearch })),
  toggleInsights: () => set((state) => ({ showInsights: !state.showInsights })),
  toggleComments: () => set((state) => ({ showComments: !state.showComments })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),

  // AI
  toggleAiChat: () => set((state) => ({ aiChatOpen: !state.aiChatOpen })),

  addAiMessage: (role, content) => set((state) => ({
    aiMessages: [...state.aiMessages, { role, content }]
  })),

  setAiThinking: (thinking) => set({ isAiThinking: thinking }),

  clearAiMessages: () => set({ aiMessages: [] }),

  // GitHub
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
  setCurrentRepo: (repo) => set({ currentRepo: repo }),

  // Simulation
  startSimulation: (targetNodeId) => set({
    simulationActive: true,
    simulationTarget: targetNodeId
  }),

  stopSimulation: () => set({
    simulationActive: false,
    simulationTarget: null,
    simulationResults: null
  }),

  setSimulationResults: (results) => set({ simulationResults: results }),

  // Bulk Operations
  importGraph: (nodes, connections) => set({
    nodes,
    connections,
    selectedNodeIds: [],
    rightPanelOpen: false
  }),

  clearGraph: () => set({
    nodes: [],
    connections: [],
    selectedNodeIds: [],
    rightPanelOpen: false
  }),

  duplicateNode: (id) => {
    const state = get();
    const node = state.nodes.find(n => n.id === id);
    if (!node) return;

    const newNode: Node = {
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      name: `${node.name} (Copy)`,
      x: node.x + 50,
      y: node.y + 50
    };

    set((state) => ({
      nodes: [...state.nodes, newNode]
    }));
  }
}));
