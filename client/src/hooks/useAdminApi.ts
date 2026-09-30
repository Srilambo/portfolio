import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

import { getApiUrl } from '../utils/api';

export function useAdminApi() {
  const { token } = useAuth();

  const request = useCallback(
    async <T>(path: string, options: RequestInit = {}): Promise<T> => {
      const method = options.method || 'GET';
      let url = getApiUrl(path);
      if (method.toUpperCase() === 'GET') {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}t=${Date.now()}`;
      }

      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(options.headers ?? {}),
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          sessionStorage.removeItem('admin_token');
          alert('Your admin session has expired. Please sign in again to save your changes.');
          window.location.href = '/admin/login';
          throw new Error('Admin session expired. Please log in again.');
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (['POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
        window.dispatchEvent(new Event('portfolio_data_updated'));
        try {
          localStorage.setItem('portfolio_last_updated', Date.now().toString());
        } catch (_) {}
      }
      return data;
    },
    [token]
  );

  return { request };
}
