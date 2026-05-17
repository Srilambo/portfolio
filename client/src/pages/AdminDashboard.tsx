import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#f8fafc', 
      fontFamily: "'Inter', sans-serif",
      color: '#1e293b'
    }}>
      {/* Slide-over backdrop overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 8, 22, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
      )}

      {/* Responsive Sidebar */}
      <AdminSidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0,
        background: '#f8fafc' 
      }}>
        {/* Top bar */}
        <header style={{ 
          background: 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0', 
          padding: isMobile ? '0 1.25rem' : '0 2.5rem', 
          height: 70, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.6rem',
                  color: '#0f172a',
                  cursor: 'pointer',
                  marginRight: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                ☰
              </button>
            )}
            <div>
              <h1 style={{ margin: 0, fontSize: isMobile ? '1.05rem' : '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Management Console
              </h1>
              <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Portfolio v2.0
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1.5rem' }}>
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>System Online</span>
              </div>
            )}
            
            <a href="/" target="_blank" rel="noopener noreferrer"
              style={{ 
                color: '#fff', 
                background: '#0f172a',
                fontWeight: 700, 
                fontSize: isMobile ? '0.75rem' : '0.875rem', 
                textDecoration: 'none', 
                padding: isMobile ? '0.5rem 0.9rem' : '0.6rem 1.25rem', 
                borderRadius: 10, 
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isMobile ? 'Live Site ↗' : 'View Live Site ↗'}
            </a>
          </div>
        </header>

        {/* Page content */}
        <main style={{ 
          flex: 1, 
          padding: isMobile ? '1.25rem' : '2.5rem', 
          overflowY: 'auto',
          background: 'radial-gradient(at top left, #f1f5f9, #f8fafc)'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
