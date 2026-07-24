import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar, { type SidebarLayout } from '../components/AdminSidebar';
import '../styles/admin.css';

function getLayout(w: number): SidebarLayout {
  if (w >= 1024) return 'desktop';
  if (w >= 640)  return 'tablet';
  return 'mobile';
}

export default function AdminDashboard() {
  const [layout, setLayout] = useState<SidebarLayout>(() => getLayout(window.innerWidth));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleResize = () => {
      const next = getLayout(window.innerWidth);
      setLayout(next);
      if (next !== 'mobile') setDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isMobileLayout  = layout === 'mobile';
  const isDesktopLayout = layout === 'desktop';

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--adm-bg)',
      fontFamily: "'Inter', sans-serif",
      color: 'var(--adm-text)',
      position: 'relative',
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background:
          'radial-gradient(ellipse at 20% 20%, rgba(56,189,248,0.04) 0%, transparent 50%),' +
          'radial-gradient(ellipse at 80% 80%, rgba(129,140,248,0.04) 0%, transparent 50%)',
      }} />

      {/* Mobile overlay backdrop */}
      {isMobileLayout && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(2, 6, 23, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 999,
            animation: 'adminFadeIn 0.2s ease-out',
          }}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        layout={layout}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 1 }}>

        {/* Top Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

            {/* Hamburger on mobile/tablet */}
            {!isDesktopLayout && (
              <button
                id="admin-menu-toggle"
                onClick={() => setDrawerOpen(true)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--adm-border)',
                  color: 'var(--adm-text)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  padding: '8px', borderRadius: 10,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(56,189,248,0.1)';
                  e.currentTarget.style.borderColor = 'var(--adm-accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'var(--adm-border)';
                }}
                aria-label="Open sidebar"
              >
                <svg style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            <div>
              <h1 style={{
                margin: 0,
                fontSize: isMobileLayout ? '1rem' : '1.15rem',
                fontWeight: 800, color: 'var(--adm-text)', letterSpacing: '-0.02em',
              }}>
                Management Console
              </h1>
              {!isMobileLayout && (
                <p style={{ margin: 0, fontSize: '0.62rem', color: 'var(--adm-text-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Portfolio Admin v2.0
                </p>
              )}
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobileLayout ? '0.5rem' : '1rem' }}>

            {/* Live clock (desktop only) */}
            {isDesktopLayout && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                padding: '0.4rem 0.9rem',
                background: 'rgba(56,189,248,0.04)',
                border: '1px solid var(--adm-border)',
                borderRadius: 10,
              }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--adm-text)', fontVariantNumeric: 'tabular-nums' }}>{timeStr}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--adm-text-2)', fontWeight: 600 }}>{dateStr}</span>
              </div>
            )}

            {/* Online dot */}
            {isDesktopLayout ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.45rem 0.9rem',
                background: 'rgba(52,211,153,0.07)',
                borderRadius: 10,
                border: '1px solid rgba(52,211,153,0.2)',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 10px #34d399',
                  animation: 'adm-pulse-dot 2s ease infinite',
                }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}>Live</span>
              </div>
            ) : (
              <div style={{
                width: 9, height: 9, borderRadius: '50%',
                background: '#34d399', boxShadow: '0 0 10px #34d399',
              }} title="System Online" />
            )}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--adm-text)',
                background: 'var(--adm-glass)',
                fontWeight: 700,
                fontSize: isMobileLayout ? '0.72rem' : '0.82rem',
                textDecoration: 'none',
                padding: isMobileLayout ? '0.45rem 0.75rem' : '0.52rem 1.1rem',
                borderRadius: 10,
                transition: 'all 0.2s',
                border: '1px solid var(--adm-border)',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--adm-accent)';
                e.currentTarget.style.color = 'var(--adm-accent)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--adm-border)';
                e.currentTarget.style.color = 'var(--adm-text)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isMobileLayout ? '↗' : (
                <>
                  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Site
                </>
              )}
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-main">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
