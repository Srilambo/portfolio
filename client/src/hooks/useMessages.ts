import { useState, useCallback, useEffect } from 'react';
import { useAdminApi } from './useAdminApi';

export interface Message {
  id: string;          // MongoDB ObjectID string
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export function useMessages() {
  const { request } = useAdminApi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request<Message[]>('/api/admin/messages');
      setMessages(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [request]);

  const updateStatus = useCallback(async (id: string, status: Message['status']) => {
    await request(`/api/admin/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  }, [request]);

  const remove = useCallback(async (id: string) => {
    await request(`/api/admin/messages/${id}`, { method: 'DELETE' });
    setMessages(prev => prev.filter(m => m.id !== id));
  }, [request]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  return { messages, loading, error, refresh: fetchMessages, updateStatus, remove };
}
