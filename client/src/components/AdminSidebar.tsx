import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/admin/dashboard',   label: 'Dashboard',   icon: '📊' },
  { to: '/admin/projects',    label: 'Projects',    icon: '🗂️' },
  { to: '/admin/skills',      label: 'Skills',      icon: '⚡' },
  { to: '/admin/experience',  label: 'Experience',  icon: '💼' },
  { to: '/admin/messages',    label: 'Messages',    icon: '✉️' },
  { to: '/admin/settings',    label: 'Settings',    icon: '⚙️' },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login', { replace: true }); };

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: '#ffffff', borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111827' }}>&lt;Admin Panel /&gt;</div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>Portfolio CMS</div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 1.25rem',
              color: isActive ? '#00f5ff' : '#374151',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
              borderLeft: isActive ? '3px solid #00f5ff' : '3px solid transparent',
              background: isActive ? 'rgba(0,245,255,0.06)' : 'transparent',
              transition: 'all 0.15s',
            })}
          >
            <span style={{ fontSize: '1.1rem' }}>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* View portfolio + logout */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <a href="/" target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', textAlign: 'center', padding: '0.55rem', borderRadius: 8, border: '1px solid #e5e7eb', color: '#374151', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#00f5ff'; el.style.color = '#00f5ff'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e5e7eb'; el.style.color = '#374151'; }}
        >
          🌐 View Portfolio
        </a>
        <button onClick={handleLogout}
          style={{ padding: '0.55rem', borderRadius: 8, border: '1px solid #fecaca', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#fef2f2'; }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'transparent'; }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
