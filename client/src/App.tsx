import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

function DashboardHome() {
  return (
    <div>
      <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Welcome back 👋</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem' }}>
        {[
          { icon: '🗂️', label: 'Projects',   to: '/admin/projects' },
          { icon: '⚡', label: 'Skills',     to: '/admin/skills' },
          { icon: '💼', label: 'Experience', to: '/admin/experience' },
          { icon: '📝', label: 'Blogs',      to: '/admin/blogs' },
          { icon: '✉️', label: 'Messages',   to: '/admin/messages' },
          { icon: '⚙️', label: 'Settings',   to: '/admin/settings' },
        ].map(card => (
          <Link key={card.label} to={card.to}
            style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem', textDecoration: 'none', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <span style={{ fontSize: '1.75rem' }}>{card.icon}</span>
            {card.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
              <Route path="/admin/settings"    element={<SettingsAdmin />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
