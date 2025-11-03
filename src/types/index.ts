// Core AIRA Types - Comprehensive Specification

// ============================================================================
// NODE TYPES & SUBTYPES
// ============================================================================

export type NodeType = 'frontend' | 'backend' | 'data' | 'ai' | 'infrastructure' | 'integration';

export type NodeSubType =
  // Frontend
  | 'web-app' | 'mobile-app' | 'desktop-app' | 'widget'
  // Backend
  | 'api-server' | 'microservice' | 'serverless' | 'worker'
  // Data
  | 'database' | 'cache' | 'queue' | 'data-lake'
  // AI/ML
  | 'ml-model' | 'vector-db' | 'training-pipeline' | 'inference-service'
  // Infrastructure
  | 'load-balancer' | 'cdn' | 'gateway' | 'service-mesh'
  // Integration
  | 'third-party-api' | 'webhook' | 'event-bus' | 'external-service';

export type NodeStatus = 'healthy' | 'warning' | 'error' | 'inactive' | 'deploying';

export type ConnectionType = 'api-call' | 'data-flow' | 'event-trigger' | 'dependency';

// ============================================================================
// CORE DATA STRUCTURES
// ============================================================================

export interface Node {
  id: string;
  name: string;
  type: NodeType;
  subType?: NodeSubType;
  x: number;
  y: number;
  description?: string;
  owner?: string;
  team?: string;
  repository?: string;
  lastUpdated?: string;
  status: NodeStatus;
  connections: string[]; // IDs of connected nodes
  techStack?: string[];
  endpoints?: Endpoint[];
  metrics?: NodeMetrics;
  metadata?: Record<string, any>;
}

export interface NodeMetrics {
  latency?: number; // in ms
  uptime?: number; // percentage
  activity?: number; // percentage
  requestsPerMin?: number;
  errorRate?: number;
  responseTime?: number[];
  lastDeployed?: string;
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  avgLatency: number;
  requests: number;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
  active?: boolean;
  bidirectional?: boolean;
  protocol?: string;
  metadata?: Record<string, any>;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'suggestion' | 'discovery';
  category: 'security' | 'performance' | 'architecture' | 'cost' | 'quality';
  nodeId?: string;
  affectedNodes?: string[];
  action?: string;
  timestamp: string;
  resolved?: boolean;
  impact?: 'high' | 'medium' | 'low';
}

export interface Comment {
  id: string;
  nodeId?: string;
  areaId?: string;
  author: User;
  content: string;
  timestamp: string;
  x?: number;
  y?: number;
  replies?: Comment[];
  resolved?: boolean;
  mentions?: string[];
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'founder' | 'engineer' | 'architect' | 'product' | 'designer' | 'admin';
  avatar?: string;
  color: string;
  team?: string;
  permissions?: Permission[];
}

export type Permission = 'view' | 'comment' | 'edit' | 'admin';

export interface Product {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  connections: Connection[];
  healthScore?: number;
  complexity?: number;
  lastUpdated?: string;
  owner?: string;
  team?: string;
}

// ============================================================================
// VIEW MODES & TOOLS
// ============================================================================

export type ViewMode =
  | 'map'          // Default architecture view
  | 'portfolio'    // Multi-product galaxy view
  | 'data-flow'    // Data movement visualization
  | 'team'         // Team ownership view
  | 'health'       // Health heatmap
  | 'timeline'     // Time-based evolution
  | 'focus'        // Selected node focus
  | 'sandbox';     // Experimental mode

export type Tool =
  | 'pointer'      // Select/move
  | 'hand'         // Pan canvas
  | 'add-node'     // Create nodes
  | 'connect'      // Draw connections
  | 'comment'      // Add comments
  | 'snapshot'     // Save state
  | 'insights'     // AI insights
  | 'layers'       // Toggle layers
  | 'sandbox'      // Sandbox mode
  | 'analytics'    // Metrics dashboard
  | 'settings';    // Preferences

export type Theme = 'light' | 'dark' | 'focus';

// ============================================================================
// TIMELINE & HISTORY
// ============================================================================

export interface TimelineEvent {
  id: string;
  timestamp: string;
  version?: string;
  description: string;
  type: 'release' | 'incident' | 'service-added' | 'service-removed' | 'deployment';
  changes: {
    added?: string[];
    removed?: string[];
    modified?: string[];
  };
  author?: string;
  icon?: string;
}

export interface Snapshot {
  id: string;
  name: string;
  timestamp: string;
  nodes: Node[];
  connections: Connection[];
  description?: string;
  author?: string;
  auto?: boolean;
}

// ============================================================================
// LAYERS & FILTERS
// ============================================================================

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  type: 'services' | 'data-flow' | 'api-calls' | 'infrastructure'
       | 'dependencies' | 'teams' | 'status' | 'metrics' | 'comments' | 'grid';
  opacity?: number;
}

// ============================================================================
// ANALYTICS & METRICS
// ============================================================================

export interface SystemAnalytics {
  healthScore: number; // 0-100
  complexityIndex: number;
  nodeCount: number;
  connectionCount: number;
  avgLatency: number;
  totalErrorRate: number;
  topBottlenecks: BottleneckInfo[];
  unusedServices: string[];
  growthMetrics: GrowthMetrics;
}

export interface BottleneckInfo {
  nodeId: string;
  nodeName: string;
  issue: string;
  impact: 'high' | 'medium' | 'low';
  metric: number;
}

export interface GrowthMetrics {
  nodesAdded30d: number;
  connectionsAdded30d: number;
  deploymentsLast7d: number;
  activeContributors: number;
}

// ============================================================================
// APP STATE
// ============================================================================

export interface AppState {
  // View & Display
  viewMode: ViewMode;
  theme: Theme;
  activeTool: Tool;

  // Selection & Focus
  selectedNode?: string;
  selectedNodes: string[];
  focusedNode?: string;

  // Canvas State
  zoomLevel: number;
  panX: number;
  panY: number;

  // Panel States
  showGrid: boolean;
  showInsights: boolean;
  showComments: boolean;
  showLayers: boolean;
  showAnalytics: boolean;
  showSettings: boolean;
  showCommandPalette: boolean;
  rightPanelOpen: boolean;

  // Layers
  layers: Layer[];

  // Timeline
  timelinePosition: number; // 0-100
  timelinePlaying: boolean;
  timelineSpeed: number;

  // Users & Collaboration
  currentUser: User;
  activeUsers: User[];

  // Data
  nodes: Node[];
  connections: Connection[];
  insights: Insight[];
  comments: Comment[];
  snapshots: Snapshot[];
  analytics?: SystemAnalytics;
}

// ============================================================================
// ONBOARDING
// ============================================================================

export interface OnboardingState {
  step: number;
  completed: boolean;
  mapTarget?: 'product' | 'organization' | 'codebase';
  goals?: string[];
  userRole?: User['role'];
  connectedSources?: string[];
  selectedTheme?: Theme;
}

// ============================================================================
// COMMANDS & SHORTCUTS
// ============================================================================

export interface Command {
  id: string;
  name: string;
  description: string;
  category: 'navigation' | 'tools' | 'actions' | 'view';
  shortcut?: string;
  action: () => void;
  icon?: string;
}

// ============================================================================
// INTEGRATIONS
// ============================================================================

export interface Integration {
  id: string;
  type: 'github' | 'gitlab' | 'bitbucket' | 'aws' | 'gcp' | 'azure'
       | 'datadog' | 'newrelic' | 'slack' | 'teams' | 'notion' | 'jira';
  name: string;
  connected: boolean;
  config?: Record<string, any>;
  lastSync?: string;
}

// ============================================================================
// EXPORT & SHARING
// ============================================================================

export type ExportFormat = 'png' | 'svg' | 'pdf' | 'json' | 'mp4' | 'html';

export interface ShareSettings {
  url: string;
  permission: Permission;
  expiresAt?: string;
  password?: string;
  allowComments?: boolean;
}

// ============================================================================
// SETTINGS
// ============================================================================

export interface Settings {
  appearance: AppearanceSettings;
  behavior: BehaviorSettings;
  integrations: Integration[];
  notifications: NotificationSettings;
  team: TeamSettings;
}

export interface AppearanceSettings {
  theme: Theme;
  accentColor?: string;
  animationsEnabled: boolean;
  gridVisible: boolean;
  compactMode: boolean;
}

export interface BehaviorSettings {
  autoSave: boolean;
  autoSaveInterval: number;
  snapToGrid: boolean;
  gridSize: number;
  doubleClickToEdit: boolean;
}

export interface NotificationSettings {
  email: boolean;
  inApp: boolean;
  insights: boolean;
  comments: boolean;
  mentions: boolean;
  deployments: boolean;
}

export interface TeamSettings {
  members: User[];
  defaultPermission: Permission;
  inviteLink?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
