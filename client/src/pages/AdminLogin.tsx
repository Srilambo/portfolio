import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { getApiUrl } from '../utils/api';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Handle GitHub Callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleGithubCallback(code);
    }
  }, []);

  const handleGithubCallback = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/api/auth/github/callback'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'GitHub Auth failed');
      }
      const { token } = await res.json();
      login(token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub Login failed');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
    window.location.href = getApiUrl('/api/auth/github');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Invalid credentials'); }
      const { token } = await res.json();
      login(token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: 8,
    border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: 400, background: '#fff', borderRadius: 16, padding: '2.5rem', boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔐</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: 0 }}>Admin Login</h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 4 }}>Portfolio CMS</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="admin@srilambo.com" style={inp}
              onFocus={e => { e.currentTarget.style.borderColor = '#00f5ff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,245,255,0.15)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••" style={inp}
              onFocus={e => { e.currentTarget.style.borderColor = '#00f5ff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,245,255,0.15)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.65rem 1rem', color: '#ef4444', fontSize: '0.875rem' }}>
              ❌ {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{
              padding: '0.8rem', borderRadius: 8, border: 'none',
              background: loading ? '#a5f3fc' : '#00f5ff',
              color: '#050816', fontWeight: 700, fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}></div>
            <span style={{ padding: '0 0.75rem', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}></div>
          </div>

          <button type="button" onClick={handleGithubLogin} disabled={loading}
            style={{
              padding: '0.8rem', borderRadius: 8, border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#111827', fontWeight: 600, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Continue with GitHub
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: '#9ca3af', fontSize: '0.8rem', textDecoration: 'none' }}>← Back to Portfolio</a>
        </div>
      </div>
    </div>
  );
}
