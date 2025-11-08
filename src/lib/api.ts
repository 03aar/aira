/**
 * AIRA API Client
 * Connects frontend to FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return { error: error.detail || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // GitHub Analysis
  async analyzeRepository(githubUrl: string, options?: {
    depth?: 'shallow' | 'deep';
    includeTests?: boolean;
  }) {
    return this.request('/api/analyze/', {
      method: 'POST',
      body: JSON.stringify({
        github_url: githubUrl,
        depth: options?.depth || 'shallow',
        include_tests: options?.includeTests || false,
      }),
    });
  }

  async analyzeRepositoryAsync(githubUrl: string) {
    return this.request<{ job_id: string; status: string }>('/api/analyze/async', {
      method: 'POST',
      body: JSON.stringify({
        github_url: githubUrl,
        depth: 'shallow',
      }),
    });
  }

  async getAnalysisStatus(jobId: string) {
    return this.request(`/api/analyze/status/${jobId}`, {
      method: 'GET',
    });
  }

  // AI Chat
  async chatWithAI(message: string, graph?: any, history?: any[]) {
    return this.request('/api/chat/', {
      method: 'POST',
      body: JSON.stringify({
        message,
        graph,
        conversation_history: history || [],
      }),
    });
  }

  async getSuggestions(graph: any) {
    return this.request('/api/chat/suggestions', {
      method: 'POST',
      body: JSON.stringify(graph),
    });
  }

  async explainArchitecture(graph: any) {
    return this.request('/api/chat/explain', {
      method: 'POST',
      body: JSON.stringify(graph),
    });
  }

  // Simulation
  async runSimulation(
    graph: any,
    simulationType: 'removal' | 'scaling' | 'failure' | 'latency',
    targetNode?: string,
    parameters?: any
  ) {
    return this.request('/api/simulate/', {
      method: 'POST',
      body: JSON.stringify({
        graph,
        simulation_type: simulationType,
        target_node: targetNode,
        parameters: parameters || {},
      }),
    });
  }

  async runBatchSimulations(graph: any, simulations: string[]) {
    return this.request('/api/simulate/batch', {
      method: 'POST',
      body: JSON.stringify({
        graph,
        simulations,
      }),
    });
  }

  // Export
  async exportGraph(
    graph: any,
    format: 'png' | 'svg' | 'pdf' | 'markdown' | 'json',
    options?: any
  ) {
    return this.request('/api/export/', {
      method: 'POST',
      body: JSON.stringify({
        graph,
        format,
        options: options || {},
      }),
    });
  }

  // Share
  async createShareLink(
    graphId: string,
    accessLevel: 'view' | 'edit',
    expiresIn?: number
  ) {
    return this.request('/api/share/', {
      method: 'POST',
      body: JSON.stringify({
        graph_id: graphId,
        access_level: accessLevel,
        expires_in: expiresIn,
      }),
    });
  }

  async getSharedGraph(token: string) {
    return this.request(`/api/share/${token}`, {
      method: 'GET',
    });
  }

  async revokeShareLink(token: string) {
    return this.request(`/api/share/${token}`, {
      method: 'DELETE',
    });
  }

  // Health Check
  async healthCheck() {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

export const api = new APIClient();
export default api;
