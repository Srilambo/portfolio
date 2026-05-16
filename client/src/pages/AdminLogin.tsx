import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../utils/api';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Handle OAuth Callbacks
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
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

  const handleGoogleLogin = () => {
    window.location.href = getApiUrl('/api/auth/google');
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
        padding: '3.5rem 3rem', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ 
            width: 64, height: 64, background: 'linear-gradient(135deg, #38bdf8, #818cf8)', 
            borderRadius: 16, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.3)'
          }}>
            🔐
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>Admin Access</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: 8 }}>Authorized Entry Only</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, padding: '0.75rem 1rem', color: '#f87171', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={handleGoogleLogin} disabled={loading} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', 
            borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
            color: '#f8fafc', fontWeight: 700, fontSize: '1.05rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
            <svg height="24" width="24" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C40.483,35.58,44,30.222,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Sign in with Google
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
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
