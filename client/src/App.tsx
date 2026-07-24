import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles/admin.css';

import PrivateRoute from './components/PrivateRoute';
import PortfolioPage from './pages/PortfolioPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProjectsAdmin from './pages/ProjectsAdmin';
import SkillsAdmin from './pages/SkillsAdmin';
import ExperienceAdmin from './pages/ExperienceAdmin';
import ServicesAdmin from './pages/ServicesAdmin';
import MessagesAdmin from './pages/MessagesAdmin';
import SettingsAdmin from './pages/SettingsAdmin';
import BlogsAdmin from './pages/BlogsAdmin';
import ReviewsAdmin from './pages/ReviewsAdmin';
import WhatsAppClicksAdmin from './pages/WhatsAppClicksAdmin';

const DASH_CARDS = [
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    label: 'Projects', to: '/admin/projects',
    desc: 'Manage portfolio projects',
    color: '#38bdf8', glow: 'rgba(56,189,248,0.15)',
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: 'Skills', to: '/admin/skills',
    desc: 'Update skill set & levels',
    color: '#818cf8', glow: 'rgba(129,140,248,0.15)',
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Experience', to: '/admin/experience',
    desc: 'Edit work experience',
    color: '#34d399', glow: 'rgba(52,211,153,0.15)',
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    label: 'Services', to: '/admin/services',
    desc: 'Manage offered services',
    color: '#fbbf24', glow: 'rgba(251,191,36,0.15)',
  },
  // {
  //   icon: (
  //     <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  //     </svg>
  //   ),
  //   label: 'Blogs', to: '/admin/blogs',
  //   desc: 'Write & publish blog posts',
  //   color: '#f472b6', glow: 'rgba(244,114,182,0.15)',
  // },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Messages', to: '/admin/messages',
    desc: 'View contact messages',
    color: '#38bdf8', glow: 'rgba(56,189,248,0.15)',
    badge: 'NEW',
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    label: 'Reviews', to: '/admin/reviews',
    desc: 'Approve client reviews',
    color: '#fbbf24', glow: 'rgba(251,191,36,0.15)',
  },
  {
    icon: (
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Settings', to: '/admin/settings',
    desc: 'Configure site settings',
    color: '#94a3b8', glow: 'rgba(148,163,184,0.12)',
  },
];

function DashboardHome() {
  return (
    <div style={{ animation: 'adm-fade-in 0.5s ease forwards' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(129,140,248,0.08) 100%)',
        border: '1px solid rgba(56,189,248,0.15)',
        borderRadius: 20,
        padding: '2rem 2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', left: -20, bottom: -20,
          width: 150, height: 150,
          background: 'radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: '#34d399', boxShadow: '0 0 12px #34d399',
              animation: 'adm-pulse-dot 2s ease infinite',
            }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              All Systems Online
            </span>
          </div>
          <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.6rem', fontWeight: 900, color: 'var(--adm-text)', letterSpacing: '-0.03em' }}>
            Welcome back 👋
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--adm-text-2)', fontWeight: 500 }}>
            Manage your portfolio content from one place. What would you like to update today?
          </p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-home-grid">
        {DASH_CARDS.map((card, i) => (
          <DashCard key={card.label} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}

function DashCard({ card, index }: { card: typeof DASH_CARDS[0]; index: number }) {
  return (
    <Link
      to={card.to}
      style={{
        background: 'var(--adm-glass)',
        border: '1px solid var(--adm-border)',
        borderRadius: 18,
        padding: '1.5rem',
        textDecoration: 'none',
        color: 'var(--adm-text)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        animation: `adm-fade-in ${0.3 + index * 0.07}s ease forwards`,
        opacity: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-5px)';
        el.style.boxShadow = `0 16px 40px ${card.glow}`;
        el.style.borderColor = card.color + '40';
        const glow = el.querySelector('.card-glow') as HTMLElement;
        if (glow) glow.style.opacity = '1';
        const icon = el.querySelector('.card-icon') as HTMLElement;
        if (icon) { icon.style.background = card.glow; icon.style.color = card.color; }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
        el.style.borderColor = 'var(--adm-border)';
        const glow = el.querySelector('.card-glow') as HTMLElement;
        if (glow) glow.style.opacity = '0';
        const icon = el.querySelector('.card-icon') as HTMLElement;
        if (icon) { icon.style.background = 'rgba(255,255,255,0.04)'; icon.style.color = 'var(--adm-text-2)'; }
      }}
    >
      {/* Background glow effect */}
      <div className="card-glow" style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120,
        background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)`,
        borderRadius: '50%',
        opacity: 0,
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="card-icon" style={{
          width: 48, height: 48,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--adm-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--adm-text-2)',
          transition: 'all 0.3s',
        }}>
          {card.icon}
        </div>
        {card.badge && (
          <span style={{
            background: 'rgba(56,189,248,0.1)',
            border: '1px solid rgba(56,189,248,0.3)',
            color: 'var(--adm-accent)',
            fontSize: '0.6rem', fontWeight: 800,
            padding: '0.15rem 0.55rem',
            borderRadius: 99,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            animation: 'adm-pulse-dot 2s ease infinite',
          }}>
            {card.badge}
          </span>
        )}
      </div>

      {/* Label + desc */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--adm-text)', letterSpacing: '-0.01em' }}>
          {card.label}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--adm-text-2)', marginTop: 4, fontWeight: 500 }}>
          {card.desc}
        </div>
      </div>

      {/* Arrow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        fontSize: '0.75rem', fontWeight: 700, color: card.color,
        position: 'relative', zIndex: 1,
      }}>
        Open <span style={{ transition: 'transform 0.2s' }}>→</span>
      </div>
    </Link>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<PrivateRoute />}>
            <Route element={<AdminDashboard />}>
              <Route path="/admin"             element={<DashboardHome />} />
              <Route path="/admin/projects"    element={<ProjectsAdmin />} />
              <Route path="/admin/skills"      element={<SkillsAdmin />} />
              <Route path="/admin/experience"  element={<ExperienceAdmin />} />
              <Route path="/admin/services"    element={<ServicesAdmin />} />
              <Route path="/admin/blogs"       element={<BlogsAdmin />} />
              <Route path="/admin/messages"    element={<MessagesAdmin />} />
              <Route path="/admin/reviews"     element={<ReviewsAdmin />} />
              <Route path="/admin/whatsapp"    element={<WhatsAppClicksAdmin />} />
              <Route path="/admin/settings"    element={<SettingsAdmin />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
