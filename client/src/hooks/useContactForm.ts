import { useState, useCallback } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

import { getApiUrl } from '../utils/api';

export function useContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', subject: '', message: '',
  });
  const [state, setState] = useState<FormState>({
    loading: false, success: false, error: null,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
      setState(prev => ({ ...prev, error: null }));
    },
    []
  );

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email.';
    if (!form.subject.trim()) return 'Subject is required.';
    if (!form.message.trim()) return 'Message is required.';
    return null;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const err = validate();
      if (err) { setState({ loading: false, success: false, error: err }); return; }

      setState({ loading: true, success: false, error: null });
      try {
        const res = await fetch(getApiUrl('/api/contact'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).message || 'Server error.');
        setState({ loading: false, success: true, error: null });
        setForm({ name: '', email: '', subject: '', message: '' });
      } catch (err: unknown) {
        setState({
          loading: false,
          success: false,
          error: err instanceof Error ? err.message : 'Something went wrong.',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form]
  );

  return { form, state, handleChange, handleSubmit };
}
