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

  // Handle OAuth Callbacks
  useEffect(() => {
    // For HashRouter, query params might be in the hash: #/admin/login?code=...
    const hash = window.location.hash;
    const searchPart = hash.includes('?') ? hash.split('?')[1] : window.location.search;
    const urlParams = new URLSearchParams(searchPart);
    
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code) {
      handleOAuthCallback(code, state);
    }
  }, []);

  const handleOAuthCallback = async (code: string, state: string | null) => {
    setLoading(true);
    setError('');
    try {
      const provider = state === 'google' ? 'google' : 'github';
      const res = await fetch(getApiUrl(`/api/auth/${provider}/callback`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || `${provider} Auth failed`);
      }
      
      const { token } = await res.json();
      login(token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      // Clean URL hash but keep the path
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash.split('?')[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    window.location.href = getApiUrl(`/api/auth/${provider}`);
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
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Invalid credentials');
      }
      const { token } = await res.json();
      login(token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#020617', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(56, 189, 248, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(129, 140, 248, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }} />

      <div style={{ 
        width: 420, 
        background: 'rgba(15, 23, 42, 0.6)', 
        backdropFilter: 'blur(20px)',
        borderRadius: 24, 
        padding: '3rem', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: 64, height: 64, background: 'linear-gradient(135deg, #38bdf8, #818cf8)', 
            borderRadius: 16, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.3)'
          }}>
            🔐
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>Welcome Back</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: 8 }}>Secure Administrative Access</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
            <input 
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="admin@raavanaa.lk" 
              style={{
                width: '100%', padding: '0.875rem 1rem', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(2, 6, 23, 0.4)', color: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(56, 189, 248, 0.1)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input 
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••" 
              style={{
                width: '100%', padding: '0.875rem 1rem', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(2, 6, 23, 0.4)', color: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(56, 189, 248, 0.1)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.875rem', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              padding: '1rem', borderRadius: 12, border: 'none',
              background: loading ? '#1e293b' : 'linear-gradient(135deg, #38bdf8, #818cf8)',
              color: loading ? '#94a3b8' : '#020617', fontWeight: 700, fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: loading ? 'none' : '0 10px 15px -3px rgba(56, 189, 248, 0.3)',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.75rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Third-Party Access</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button onClick={() => handleOAuthLogin('google')} disabled={loading} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.75rem', 
            borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
            color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <svg height="18" width="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C40.483,35.58,44,30.222,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Google
          </button>
          <button onClick={() => handleOAuthLogin('github')} disabled={loading} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.75rem', 
            borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
            color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a href="/" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}
             onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'}
             onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
