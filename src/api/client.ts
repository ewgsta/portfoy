const API_URL = '/api';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

class ApiClient {
  private token: string | null = null;
  private cache: Map<string, CacheItem<any>> = new Map();

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

  private getCached<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < CACHE_DURATION) {
      return item.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearCache(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
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
    this.clearCache();
  }

  // Projects (cached)
  async getProjects(forceRefresh = false) {
    const cacheKey = 'projects';
    if (!forceRefresh) {
      const cached = this.getCached<any[]>(cacheKey);
      if (cached) return cached;
    }
    const data = await this.request<any[]>('/projects');
    this.setCache(cacheKey, data);
    return data;
  }

  async createProject(data: any) {
    const result = await this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.clearCache('projects');
    return result;
  }

  async updateProject(id: string, data: any) {
    const result = await this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    this.clearCache('projects');
    return result;
  }

  async deleteProject(id: string) {
    await this.request<void>(`/projects/${id}`, { method: 'DELETE' });
    this.clearCache('projects');
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

  // Config (cached)
  async getConfig(forceRefresh = false) {
    const cacheKey = 'config';
    if (!forceRefresh) {
      const cached = this.getCached<any>(cacheKey);
      if (cached) return cached;
    }
    const data = await this.request<any>('/config');
    this.setCache(cacheKey, data);
    return data;
  }

  async updateConfig(data: any) {
    const result = await this.request<any>('/config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    this.setCache('config', result);
    return result;
  }
}

export const api = new ApiClient();
