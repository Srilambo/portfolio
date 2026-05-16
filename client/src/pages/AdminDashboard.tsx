import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#f8fafc', 
      fontFamily: "'Inter', sans-serif",
      color: '#1e293b'
    }}>
      <AdminSidebar />
      
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
          padding: '0 2.5rem', 
          height: 70, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Management Console
            </h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Portfolio v2.0
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>System Online</span>
            </div>
            
            <a href="/" target="_blank" rel="noopener noreferrer"
              style={{ 
                color: '#fff', 
                background: '#0f172a',
                fontWeight: 700, 
                fontSize: '0.875rem', 
                textDecoration: 'none', 
                padding: '0.6rem 1.25rem', 
                borderRadius: 10, 
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              View Live Site ↗
            </a>
          </div>
        </header>

        {/* Page content */}
        <main style={{ 
          flex: 1, 
          padding: '2.5rem', 
          overflowY: 'auto',
          background: 'radial-gradient(at top left, #f1f5f9, #f8fafc)'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
