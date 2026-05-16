import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Admin Panel</h1>
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ color: '#00f5ff', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', border: '1px solid rgba(0,245,255,0.3)', padding: '0.4rem 1rem', borderRadius: 8, transition: 'all 0.2s' }}
          >
            🌐 View Portfolio ↗
          </a>
        </header>
        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
