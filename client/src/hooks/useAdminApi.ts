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
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      return res.json();
    },
    [token]
  );

  return { request };
}
