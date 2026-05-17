import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/admin',             label: 'Dashboard',   icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { to: '/admin/projects',    label: 'Projects',    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { to: '/admin/skills',      label: 'Skills',      icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { to: '/admin/experience',  label: 'Experience',  icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { to: '/admin/messages',    label: 'Messages',    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { to: '/admin/settings',    label: 'Settings',    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function AdminSidebar({ isOpen = false, onClose, isMobile = false }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside style={{
      width: 280, 
      height: '100vh', 
      background: '#0f172a', 
      display: 'flex', 
      flexDirection: 'column', 
      flexShrink: 0,
      boxShadow: '10px 0 30px rgba(0,0,0,0.15)',
      zIndex: 999,
      
      // Responsive rules
      position: isMobile ? 'fixed' : 'sticky',
      top: 0,
      left: isMobile ? (isOpen ? 0 : -280) : 0,
      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Brand */}
      <div style={{ 
        padding: '2.5rem 2rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #38bdf8, #818cf8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#020617' }}>S</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>SRILAMBO</div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Portfolio Admin</div>
          </div>
        </div>
        
        {isMobile && (
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#64748b', 
              fontSize: '1.4rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >✕</button>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        {LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => isMobile && onClose && onClose()}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.875rem 1.25rem',
              color: isActive ? '#f8fafc' : '#94a3b8',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
              borderRadius: 12,
              background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              marginBottom: '0.5rem'
            })}
          >
            <l.icon style={{ width: 20, height: 20 }} />
            {l.label}
            {l.label === 'Messages' && (
              <span style={{ marginLeft: 'auto', background: '#38bdf8', color: '#020617', padding: '0.1rem 0.5rem', borderRadius: 20, fontSize: '0.65rem', fontWeight: 800 }}>NEW</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Account */}
      <div style={{ padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={handleLogout}
          style={{ 
            width: '100%',
            padding: '0.875rem', 
            borderRadius: 12, 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            background: 'rgba(239, 68, 68, 0.05)', 
            color: '#f87171', 
            cursor: 'pointer', 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            fontFamily: "'Inter', sans-serif", 
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
        >
          <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
