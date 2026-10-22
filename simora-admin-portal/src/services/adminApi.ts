// Standalone Admin API client connecting to SIMORA Backend with RBAC tokens

const API_BASE_URL = '';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface PlatformMetrics {
  totalStores: number;
  totalOrdersToday: number;
  grossRevenueToday: number;
  activeFleetOnline: number;
  avgDeliveryMins: number;
  orderSuccessRate: string;
  systemStatus: string;
}

export interface DarkStoreRecord {
  id: string;
  name: string;
  code: string;
  city: string;
  pincode: string;
  status: string;
  manager: string;
  phone: string;
  ordersToday: number;
  revenueToday: number;
}

export const adminApi = {
  getToken: (): string | null => {
    return localStorage.getItem('simora_admin_token');
  },

  setToken: (token: string) => {
    localStorage.setItem('simora_admin_token', token);
  },

  clearToken: () => {
    localStorage.removeItem('simora_admin_token');
    localStorage.removeItem('simora_admin_user');
  },

  getStoredAdminUser: (): AdminUser | null => {
    const raw = localStorage.getItem('simora_admin_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  login: async (email: string, password: string): Promise<{ success: boolean; token?: string; adminUser?: AdminUser; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      adminApi.setToken(data.token);
      localStorage.setItem('simora_admin_user', JSON.stringify(data.adminUser));
      return { success: true, token: data.token, adminUser: data.adminUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection failed' };
    }
  },

  getMetrics: async (): Promise<PlatformMetrics> => {
    const token = adminApi.getToken();
    const res = await fetch(`${API_BASE_URL}/api/admin/metrics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Unauthorized admin access');
    }

    const json = await res.json();
    return json.data;
  },

  getStores: async (): Promise<DarkStoreRecord[]> => {
    const token = adminApi.getToken();
    const res = await fetch(`${API_BASE_URL}/api/admin/stores`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to fetch dark stores');
    }

    const json = await res.json();
    return json.stores;
  },

  createStore: async (storeData: Partial<DarkStoreRecord>): Promise<DarkStoreRecord> => {
    const token = adminApi.getToken();
    const res = await fetch(`${API_BASE_URL}/api/admin/stores`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storeData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to register dark store');
    }

    const json = await res.json();
    return json.store;
  },
};
