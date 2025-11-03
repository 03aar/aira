import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { AppState, ViewMode, Theme, User, Node, Connection, Insight } from '../types';

interface AppContextType extends AppState {
  setViewMode: (mode: ViewMode) => void;
  setTheme: (theme: Theme) => void;
  selectNode: (nodeId?: string) => void;
  setZoomLevel: (level: number) => void;
  toggleGrid: () => void;
  toggleInsights: () => void;
  toggleComments: () => void;
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

  // Sample data - will be replaced with real data
  const [nodes] = useState<Node[]>([
    {
      id: '1',
      name: 'UI Core',
      type: 'frontend',
      x: 100,
      y: 100,
      connections: ['2', '3'],
      active: true,
      description: 'Main user interface service',
      metrics: { latency: 45, uptime: 99.9, activity: 85 },
    },
    {
      id: '2',
      name: 'API Gateway',
      type: 'backend',
      x: 300,
      y: 100,
      connections: ['1', '4', '5'],
      active: true,
      description: 'Central API routing service',
      metrics: { latency: 32, uptime: 99.95, activity: 92 },
    },
    {
      id: '3',
      name: 'Auth Service',
      type: 'backend',
      x: 100,
      y: 250,
      connections: ['1', '4'],
      active: true,
      description: 'Authentication and authorization',
      metrics: { latency: 28, uptime: 100, activity: 78 },
    },
    {
      id: '4',
      name: 'User Database',
      type: 'database',
      x: 300,
      y: 250,
      connections: ['2', '3'],
      active: true,
      description: 'Primary user data store',
      metrics: { latency: 15, uptime: 99.99, activity: 95 },
    },
    {
      id: '5',
      name: 'ML Recommender',
      type: 'ai',
      x: 500,
      y: 100,
      connections: ['2'],
      active: true,
      description: 'AI-powered recommendation engine',
      metrics: { latency: 120, uptime: 98.5, activity: 65 },
    },
  ]);

  const [connections] = useState<Connection[]>([
    { id: 'c1', source: '1', target: '2', type: 'api', active: true },
    { id: 'c2', source: '1', target: '3', type: 'api', active: true },
    { id: 'c3', source: '2', target: '4', type: 'data', active: true },
    { id: 'c4', source: '2', target: '5', type: 'api', active: true },
    { id: 'c5', source: '3', target: '4', type: 'data', active: true },
  ]);

  const [insights] = useState<Insight[]>([
    {
      id: 'i1',
      title: 'Unused API endpoints detected',
      description: '3 endpoints haven\'t been called in 60 days',
      severity: 'warning',
      nodeId: '2',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'i2',
      title: 'High latency detected',
      description: 'ML Recommender showing increased response times',
      severity: 'critical',
      nodeId: '5',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'i3',
      title: 'Optimization opportunity',
      description: 'Database queries can be cached for better performance',
      severity: 'info',
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
