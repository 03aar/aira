import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { ViewMode, Theme, User, Node, Connection, Insight } from '../types';

interface AppContextType {
  // View & Display
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Selection
  selectedNode?: string;
  selectNode: (nodeId?: string) => void;

  // Canvas
  zoomLevel: number;
  setZoomLevel: (level: number) => void;

  // Panel States
  showGrid: boolean;
  toggleGrid: () => void;
  showInsights: boolean;
  toggleInsights: () => void;
  showComments: boolean;
  toggleComments: () => void;

  // User
  currentUser: User;
  activeUsers: User[];

  // Data
  nodes: Node[];
  connections: Connection[];
  insights: Insight[];
}

const defaultUser: User = {
  id: '1',
  name: 'User',
  role: 'engineer',
  color: '#4B9EFF',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [theme, setTheme] = useState<Theme>('light');
  const [selectedNode, selectNode] = useState<string | undefined>();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [currentUser] = useState<User>(defaultUser);
  const [activeUsers] = useState<User[]>([defaultUser]);

  // Sample data - comprehensive showcase
  const [nodes] = useState<Node[]>([
    {
      id: '1',
      name: 'User Auth',
      type: 'frontend',
      subType: 'web-app',
      x: -150,
      y: -100,
      connections: ['2'],
      status: 'healthy',
      description: 'Authentication service',
      metrics: { latency: 28, uptime: 100, activity: 78, requestsPerMin: 1247 },
    },
    {
      id: '2',
      name: 'API Gateway',
      type: 'backend',
      subType: 'api-server',
      x: 0,
      y: -100,
      connections: ['1', '3', '4', '6'],
      status: 'warning',
      description: 'Central API routing',
      metrics: { latency: 145, uptime: 88, activity: 92, requestsPerMin: 3421 },
    },
    {
      id: '3',
      name: 'Payment Service',
      type: 'backend',
      subType: 'microservice',
      x: 150,
      y: 0,
      connections: ['2', '4', '5'],
      status: 'warning',
      description: 'Payment processing',
      metrics: { latency: 289, uptime: 78, activity: 65, requestsPerMin: 845 },
    },
    {
      id: '4',
      name: 'Stripe Integration',
      type: 'integration',
      subType: 'third-party-api',
      x: 300,
      y: -100,
      connections: ['3'],
      status: 'healthy',
      description: 'Payment gateway',
      metrics: { latency: 145, uptime: 85, activity: 88, requestsPerMin: 623 },
    },
    {
      id: '5',
      name: 'User DB',
      type: 'data',
      subType: 'database',
      x: -150,
      y: 100,
      connections: ['2', '3'],
      status: 'healthy',
      description: 'User data store',
      metrics: { latency: 15, uptime: 92, activity: 95, requestsPerMin: 2341 },
    },
    {
      id: '6',
      name: 'AI Model',
      type: 'ai',
      subType: 'ml-model',
      x: 0,
      y: 100,
      connections: ['2'],
      status: 'healthy',
      description: 'ML recommendation engine',
      metrics: { latency: 120, uptime: 90, activity: 72, requestsPerMin: 456 },
    },
    {
      id: '7',
      name: 'Analytics DB',
      type: 'data',
      subType: 'database',
      x: 150,
      y: 100,
      connections: ['6'],
      status: 'healthy',
      description: 'Analytics data warehouse',
      metrics: { latency: 45, uptime: 94, activity: 88, requestsPerMin: 1123 },
    },
  ]);

  const [connections] = useState<Connection[]>([
    { id: 'c1', source: '1', target: '2', type: 'api-call', active: true },
    { id: 'c2', source: '2', target: '3', type: 'api-call', active: true },
    { id: 'c3', source: '3', target: '4', type: 'api-call', active: true },
    { id: 'c4', source: '3', target: '5', type: 'data-flow', active: true },
    { id: 'c5', source: '2', target: '6', type: 'api-call', active: true },
    { id: 'c6', source: '6', target: '7', type: 'data-flow', active: true },
    { id: 'c7', source: '2', target: '4', type: 'dependency', active: true },
  ]);

  const [insights] = useState<Insight[]>([
    {
      id: 'i1',
      title: 'Unused API endpoints detected',
      description: '3 endpoints haven\'t been called in 60 days',
      severity: 'warning',
      category: 'architecture',
      nodeId: '2',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'i2',
      title: 'High latency detected',
      description: 'ML Recommender showing increased response times',
      severity: 'critical',
      category: 'performance',
      nodeId: '5',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'i3',
      title: 'Optimization opportunity',
      description: 'Database queries can be cached for better performance',
      severity: 'suggestion',
      category: 'performance',
      nodeId: '4',
      timestamp: new Date().toISOString(),
    },
  ]);

  const toggleGrid = () => setShowGrid(!showGrid);
  const toggleInsights = () => setShowInsights(!showInsights);
  const toggleComments = () => setShowComments(!showComments);

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        theme,
        setTheme,
        selectedNode,
        selectNode,
        zoomLevel,
        setZoomLevel,
        showGrid,
        toggleGrid,
        showInsights,
        toggleInsights,
        showComments,
        toggleComments,
        currentUser,
        activeUsers,
        nodes,
        connections,
        insights,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
