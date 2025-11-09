/**
 * Authentication API Client
 * Handles all auth-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  avatar_url?: string;
  github_username?: string;
  theme: string;
  role: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

interface SignupData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthAPI {
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
        return { error: error.detail || error.error || 'Request failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Signup
  async signup(data: SignupData): Promise<ApiResponse<User>> {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Login
  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Logout
  async logout(refreshToken: string, accessToken: string): Promise<ApiResponse<any>> {
    return this.request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ access_token: string; token_type: string }>> {
    return this.request('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  // Get current user
  async getCurrentUser(accessToken: string): Promise<ApiResponse<User>> {
    return this.request('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Resend verification email
  async resendVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string,
    accessToken: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Update profile
  async updateProfile(
    data: Partial<{ full_name: string; avatar_url: string; theme: string }>,
    accessToken: string
  ): Promise<ApiResponse<User>> {
    return this.request('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}

export const authAPI = new AuthAPI();
export type { User, LoginResponse, SignupData, LoginData };
