// Core AIRA Types

export type NodeType = 'frontend' | 'backend' | 'database' | 'ai' | 'integration';

export interface Node {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
  description?: string;
  owner?: string;
  lastUpdated?: string;
  active?: boolean;
  connections: string[]; // IDs of connected nodes
  metrics?: {
    latency?: number;
    uptime?: number;
    activity?: number;
  };
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type?: 'data' | 'api' | 'event';
  active?: boolean;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  nodeId?: string;
  action?: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  nodeId: string;
  author: string;
  content: string;
  timestamp: string;
  x: number;
  y: number;
}

export interface User {
  id: string;
  name: string;
  role: 'founder' | 'engineer' | 'architect' | 'product' | 'designer';
  avatar?: string;
  color: string; // for presence indicators
}

export interface Product {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  connections: Connection[];
  healthScore?: number;
}

export type ViewMode = 'map' | 'evolution' | 'portfolio' | 'sandbox';

export type Theme = 'light' | 'dark' | 'focus';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  version?: string;
  description: string;
  changes: {
    added?: string[];
    removed?: string[];
    modified?: string[];
  };
}

export interface AppState {
  viewMode: ViewMode;
  theme: Theme;
  selectedNode?: string;
  zoomLevel: number;
  showGrid: boolean;
  showInsights: boolean;
  showComments: boolean;
  currentUser: User;
  activeUsers: User[];
}

export interface OnboardingState {
  step: number;
  completed: boolean;
  mapTarget?: 'product' | 'organization' | 'codebase';
  goals?: string[];
  userRole?: User['role'];
  connectedSources?: string[];
  selectedTheme?: Theme;
}
