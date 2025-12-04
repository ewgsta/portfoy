const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Bir hata oluştu' }));
      throw new Error(error.error || 'Bir hata oluştu');
    }

    return response.json();
  }

  // Auth
  async verifyTotp(code: string) {
    const result = await this.request<{ token: string }>('/auth/verify-totp', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    this.setToken(result.token);
    return result;
  }

  async verifyToken() {
    try {
      const result = await this.request<{ valid: boolean }>('/auth/verify-token');
      return result.valid;
    } catch {
      this.setToken(null);
      return false;
    }
  }

  logout() {
    this.setToken(null);
  }

  // Projects
  async getProjects() {
    return this.request<any[]>('/projects');
  }

  async createProject(data: any) {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request<void>(`/projects/${id}`, { method: 'DELETE' });
  }

  // Messages
  async getMessages() {
    return this.request<any[]>('/messages');
  }

  async sendMessage(data: { name: string; email: string; message: string }) {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleMessageRead(id: string, isRead: boolean) {
    return this.request<any>(`/messages/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead }),
    });
  }

  async deleteMessage(id: string) {
    return this.request<void>(`/messages/${id}`, { method: 'DELETE' });
  }

  // Config
  async getConfig() {
    return this.request<any>('/config');
  }

  async updateConfig(data: any) {
    return this.request<any>('/config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
