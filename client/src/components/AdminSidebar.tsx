import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  {
    to: '/admin', label: 'Dashboard', end: true,
    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  },
  {
    to: '/admin/projects', label: 'Projects',
    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  },
  {
    to: '/admin/skills', label: 'Skills',
    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
  {
    to: '/admin/experience', label: 'Experience',
    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  {
    to: '/admin/services', label: 'Services',
    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  },
  // {
  //   to: '/admin/blogs', label: 'Blogs',
  //   icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  // },
  {
    to: '/admin/messages', label: 'Messages', badge: 'NEW',
    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  {
    to: '/admin/reviews', label: 'Reviews',
    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  },
  {
    to: '/admin/whatsapp', label: 'WhatsApp', badge: 'NEW',
    icon: (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
  {
    to: '/admin/settings', label: 'Settings',
    icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

export type SidebarLayout = 'mobile' | 'tablet' | 'desktop';

interface SidebarProps {
  layout: SidebarLayout;
  isOpen?: boolean;        // used on mobile/tablet for the overlay
  onClose?: () => void;
}

/* ─── Desktop Full Sidebar ─────────────────────────────────── */
function DesktopSidebar({ onClose }: { onClose?: () => void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside style={{
      width: 280, height: '100vh',
      background: 'var(--adm-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      position: 'sticky', top: 0,
      borderRight: '1px solid var(--adm-border)',
      boxShadow: '4px 0 24px rgba(0,0,0,0.2)', zIndex: 100,
    }}>
      <Brand showClose={false} onClose={onClose} />
      <FullNavLinks onLinkClick={undefined} />
      <LogoutBtn onLogout={handleLogout} />
    </aside>
  );
}

/* ─── Tablet Icon-Only Strip ────────────────────────────────── */
function TabletStrip() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside style={{
      width: 64, height: '100vh',
      background: 'var(--adm-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      flexShrink: 0, position: 'sticky', top: 0,
      borderRight: '1px solid var(--adm-border)',
      boxShadow: '4px 0 24px rgba(0,0,0,0.2)', zIndex: 100,
      paddingTop: '1rem', paddingBottom: '1rem',
    }}>
      {/* Logo dot */}
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'var(--adm-gradient)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 900, color: '#020617', fontSize: '1rem',
        flexShrink: 0, marginBottom: '1.25rem',
        boxShadow: '0 0 12px rgba(56, 189, 248, 0.4)',
      }}>S</div>

      {/* Icon nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%', alignItems: 'center', overflowY: 'auto' }}>
        {LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            style={({ isActive }) => ({
              position: 'relative',
              width: 44, height: 44,
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isActive ? 'var(--adm-accent)' : 'var(--adm-text-2)',
              background: isActive ? 'rgba(56,189,248,0.12)' : 'transparent',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              textDecoration: 'none',
              boxShadow: isActive ? '0 0 12px rgba(56,189,248,0.15)' : 'none',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1)';
            }}
          >
            {() => (
              <>
                <l.icon style={{ width: 20, height: 20 }} />
                {/* Tooltip */}
                <span style={{
                  position: 'absolute',
                  left: 'calc(100% + 10px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--adm-bg-2)',
                  border: '1px solid var(--adm-border)',
                  color: 'var(--adm-text)',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  opacity: 0,
                  zIndex: 999,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  transition: 'opacity 0.15s',
                }} className="strip-tooltip">{l.label}</span>

                {l.badge && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--adm-accent)',
                    boxShadow: '0 0 6px var(--adm-accent)',
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout icon */}
      <button
        onClick={handleLogout}
        title="Sign Out"
        style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: 'var(--adm-danger)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.18s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
      >
        <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>

      {/* Tooltip hover CSS via style tag */}
      <style>{`
        aside a:hover .strip-tooltip { opacity: 1 !important; }
      `}</style>
    </aside>
  );
}

/* ─── Mobile Overlay Drawer ─────────────────────────────────── */
function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/admin/login', { replace: true });
  };

  return (
    <aside style={{
      width: 280, height: '100vh',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      position: 'fixed', top: 0, left: isOpen ? 0 : -300,
      borderRight: '1px solid var(--adm-border)',
      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isOpen ? '10px 0 40px rgba(0,0,0,0.5)' : 'none',
      zIndex: 1000,
    }}>
      <Brand showClose onClose={onClose} />
      <FullNavLinks onLinkClick={onClose} />
      <LogoutBtn onLogout={handleLogout} />
    </aside>
  );
}

/* ─── Shared Sub-components ─────────────────────────────────── */
function Brand({ showClose, onClose }: { showClose: boolean; onClose?: () => void }) {
  return (
    <div style={{
      padding: '1.75rem 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid var(--adm-border)', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--adm-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, color: '#020617', fontSize: '1rem',
          boxShadow: '0 0 12px rgba(56, 189, 248, 0.3)',
        }}>S</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--adm-text)', letterSpacing: '-0.02em' }}>SRILAMBO</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--adm-text-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Portfolio Admin</div>
        </div>
      </div>
      {showClose && onClose && (
        <button onClick={onClose} style={{
          background: 'none', border: 'none',
          color: 'var(--adm-text-2)', fontSize: '1.3rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', padding: 4,
          borderRadius: 8, transition: 'color 0.2s',
        }}>✕</button>
      )}
    </div>
  );
}

function FullNavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
      {LINKS.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={onLinkClick}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            padding: '0.8rem 1rem',
            color: isActive ? 'var(--adm-text)' : 'var(--adm-text-2)',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem',
            borderRadius: 12,
            background: isActive ? 'rgba(56,189,248,0.1)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--adm-accent)' : '3px solid transparent',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: '0.25rem',
          })}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            if (!el.classList.contains('active')) {
              el.style.background = 'rgba(255, 255, 255, 0.03)';
              el.style.color = 'var(--adm-text)';
            }
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            const isNavLinkActive = el.getAttribute('class')?.includes('active');
            el.style.background = isNavLinkActive ? 'rgba(56,189,248,0.1)' : 'transparent';
            el.style.color = isNavLinkActive ? 'var(--adm-text)' : 'var(--adm-text-2)';
          }}
        >
          {({ isActive }) => (
            <>
              <l.icon style={{ width: 19, height: 19, flexShrink: 0, color: isActive ? 'var(--adm-accent)' : 'currentColor' }} />
              {l.label}
              {l.badge && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--adm-accent)', color: '#020617',
                  padding: '0.1rem 0.45rem', borderRadius: 20,
                  fontSize: '0.6rem', fontWeight: 800,
                  boxShadow: '0 0 8px rgba(56, 189, 248, 0.4)',
                }}>{l.badge}</span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function LogoutBtn({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ padding: '1.25rem 1rem', borderTop: '1px solid var(--adm-border)', flexShrink: 0 }}>
      <button onClick={onLogout} style={{
        width: '100%', padding: '0.8rem',
        borderRadius: 12,
        border: '1px solid rgba(239,68,68,0.2)',
        background: 'rgba(239,68,68,0.05)',
        color: 'var(--adm-danger)', cursor: 'pointer',
        fontSize: '0.875rem', fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
      >
        <svg style={{ width: 17, height: 17 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function AdminSidebar({ layout, isOpen = false, onClose }: SidebarProps) {
  if (layout === 'desktop') return <DesktopSidebar />;
  if (layout === 'tablet')  return <TabletStrip />;
  // mobile
  return <MobileDrawer isOpen={isOpen} onClose={onClose ?? (() => {})} />;
}
