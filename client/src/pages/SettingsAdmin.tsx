import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminApi } from '../hooks/useAdminApi';
import ImagePicker from '../components/ImagePicker';
import UnsavedChangesBar from '../components/UnsavedChangesBar';

interface Settings {
  name: string;
  nickname?: string;
  terminalFilename?: string;
  terminalVersion?: string;
  title: string;
  bio: string;
  avatarUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  youtube: string;
  github: string;
  metaTitle: string;
  metaDescription: string;
  cvUrl?: string;
  aboutImageUrl?: string;
  statsExperience?: string;
  statsProjects?: string;
  statsClients?: string;
  freelancePlatforms?: string;

  // About Me Section & Terminal Configuration
  aboutHeading?: string;
  aboutBio?: string;
  terminalName?: string;
  terminalRole?: string;
  terminalLocation?: string;
  terminalStack?: string;
  terminalStatus?: string;
  pillar1Icon?: string;
  pillar1Title?: string;
  pillar1Desc?: string;
  pillar2Icon?: string;
  pillar2Title?: string;
  pillar2Desc?: string;
  pillar3Icon?: string;
  pillar3Title?: string;
  pillar3Desc?: string;
  pillar4Icon?: string;
  pillar4Title?: string;
  pillar4Desc?: string;
}

const DEFAULT: Settings = {
  name: 'Ananthkumar Srilambotharasarma', 
  nickname: 'Srilambo',
  title: 'Fullstack Developer', 
  bio: 'Building scalable web apps from pixel to production.',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', 
  phone: '', 
  whatsapp: '', 
  email: 'srilambotharan@gmail.com',
  facebook: '', 
  instagram: '', 
  tiktok: '', 
  linkedin: 'https://linkedin.com/in/srilambo', 
  youtube: '', 
  github: 'https://github.com/srilambo', 
  metaTitle: 'Srilambo | Fullstack Developer Portfolio',
  metaDescription: 'React, Node.js, Three.js. Building scalable web apps from pixel to production.',
  cvUrl: '',
  statsExperience: '3+',
  statsProjects: '220+',
  statsClients: '60+',
  freelancePlatforms: 'Behance, Dribbble, Upwork, Fiverr',

  // About Me defaults matching client page
  aboutHeading: 'Architecting High-Performance Web Applications',
  aboutBio: "I'm a Fullstack Developer who builds fast, polished web and mobile apps, from smooth interactive frontends to secure, scalable backends. I care about clean code, great UX, and shipping products that actually work in the real world.",
  terminalName: 'Ananthkumar Srilambotharasarma',
  terminalRole: 'Fullstack Developer',
  terminalLocation: 'Global Remote',
  terminalStack: 'React, Node.js, TypeScript, MongoDB',
  terminalStatus: 'Building scalable web applications',
  pillar1Icon: '⚡',
  pillar1Title: 'Scalable Systems',
  pillar1Desc: 'Microservices, APIs & Cloud Deployments',
  pillar2Icon: '🎨',
  pillar2Title: 'Pixel-Perfect UI',
  pillar2Desc: 'Fluid animations & glassmorphism UX',
  pillar3Icon: '🚀',
  pillar3Title: 'High Performance',
  pillar3Desc: 'Sub-second page loads & optimized assets',
  pillar4Icon: '🛡️',
  pillar4Title: 'Security & Integrity',
  pillar4Desc: 'JWT Auth, CORS, and SQL/NoSQL safety',
};

export default function SettingsAdmin() {
  const { request } = useAdminApi();
  const [settings, setSettings]                 = useState<Settings>(DEFAULT);
  const [originalSettings, setOriginalSettings] = useState<Settings>(DEFAULT);
  const [hasChanges, setHasChanges]             = useState(false);
  const [saving, setSaving]                     = useState(false);
  const [saved, setSaved]                       = useState(false);

  useEffect(() => {
    request<Record<string, string>>('/api/admin/settings')
      .then(data => {
        const merged = { ...DEFAULT, ...data };
        setSettings(merged);
        setOriginalSettings(merged);
      })
      .catch(() => {});
  }, [request]);

  const set = (k: keyof Settings, v: string) => {
    setSettings(s => ({ ...s, [k]: v }));
    setHasChanges(true);
  };

  const cancelChanges = () => {
    setSettings({ ...originalSettings });
    setHasChanges(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      await request('/api/admin/settings', { method: 'PUT', body: JSON.stringify(settings) });
      setOriginalSettings(settings);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, originalSettings]);

  const inp = {
    width: '100%',
    padding: '0.65rem 0.9rem',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box' as const,
    outline: 'none',
  };

  const Field = ({ label, k, type = 'text', placeholder }: { label: string; k: keyof Settings; type?: string; placeholder?: string }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>{label}</label>
      {type === 'textarea'
        ? <textarea rows={3} value={settings[k] || ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} style={{ ...inp, resize: 'vertical' }} />
        : <input type={type} value={settings[k] || ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} style={inp} />}
    </div>
  );

  return (
    <div style={{ maxWidth: 1080 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Settings</h2>
          <span style={{ fontSize: '0.75rem', color: hasChanges ? '#d97706' : '#6b7280', fontWeight: hasChanges ? 700 : 400 }}>
            {hasChanges ? '⚠️ Unsaved settings changes pending' : 'Configure portfolio, About section, social links & metadata • Press Ctrl+S to save'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {hasChanges && (
            <button
              onClick={cancelChanges}
              disabled={saving}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
              }}
            >
              ✕ Cancel
            </button>
          )}

          <button 
            onClick={save} 
            disabled={saving}
            style={{ 
              padding: '0.6rem 1.4rem', 
              borderRadius: 8, 
              border: hasChanges ? '1px solid #059669' : 'none', 
              background: saved ? '#22c55e' : hasChanges ? '#059669' : '#00f5ff', 
              color: (saved || hasChanges) ? '#fff' : '#050816', 
              fontWeight: 800, 
              fontSize: '0.9rem', 
              cursor: saving ? 'not-allowed' : 'pointer', 
              fontFamily: 'Inter, sans-serif', 
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: hasChanges ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 4px 14px rgba(0, 245, 255, 0.3)'
            }}
          >
            <span>{saving ? '⏳' : saved ? '✓' : '💾'}</span>
            <span>{saving ? 'Saving to MongoDB...' : saved ? '✓ Saved to MongoDB!' : hasChanges ? 'Save Settings *' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      <div className="admin-two-col-grid" style={{ alignItems: 'start' }}>
        {/* Left: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* 🖥️ About Me & Terminal Configuration Section */}
          <div style={{ background: '#fff', border: '2px solid #38bdf8', borderRadius: 14, padding: '1.5rem', boxShadow: '0 4px 20px rgba(56, 189, 248, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>🖥️</span> About Me & Terminal Window (`developer.config.ts`)
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Edit the code terminal, headings, and feature cards shown in your About section</span>
              </div>
              <Link
                to="/admin/about"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 8,
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#0284c7',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                }}
              >
                Open Live Card Editor ↗
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Code Terminal Box settings */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>
                  // Terminal Code Window: developer.config.ts
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="admin-form-two-col" style={{ gap: '0.75rem' }}>
                    <Field label="Card Tab Filename" k="terminalFilename" placeholder="developer.config.ts" />
                    <Field label="Card Version" k="terminalVersion" placeholder="v2.5.0" />
                  </div>
                  <div className="admin-form-two-col" style={{ gap: '0.75rem' }}>
                    <Field label="Terminal Name" k="terminalName" placeholder="Ananthkumar Srilambotharasarma" />
                    <Field label="Terminal Role" k="terminalRole" placeholder="Fullstack Developer" />
                  </div>
                  <div className="admin-form-two-col" style={{ gap: '0.75rem' }}>
                    <Field label="Terminal Location" k="terminalLocation" placeholder="Global Remote" />
                    <Field label="Terminal Status" k="terminalStatus" placeholder="Building scalable web applications" />
                  </div>
                  <Field label="Tech Stack (comma separated: React, Node.js, TypeScript...)" k="terminalStack" placeholder="React, Node.js, TypeScript, MongoDB" />
                </div>
              </div>

              {/* Main About Heading & Bio */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Field label="About Main Heading" k="aboutHeading" placeholder="Architecting High-Performance Web Applications" />
                <Field label="About Bio Description" k="aboutBio" type="textarea" placeholder="I'm a Fullstack Developer who builds fast, polished web and mobile apps..." />
              </div>

              {/* 4 Feature Pillars */}
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.75rem' }}>
                  4 Feature Highlight Cards (Pillars)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Pillar 1 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1.5fr', gap: '0.5rem', alignItems: 'center' }}>
                    <input value={settings.pillar1Icon || '⚡'} onChange={e => set('pillar1Icon', e.target.value)} style={{ ...inp, textAlign: 'center', fontSize: '1.2rem', padding: '0.4rem' }} title="Pillar 1 Icon" />
                    <input value={settings.pillar1Title || ''} onChange={e => set('pillar1Title', e.target.value)} placeholder="Scalable Systems" style={inp} />
                    <input value={settings.pillar1Desc || ''} onChange={e => set('pillar1Desc', e.target.value)} placeholder="Microservices, APIs & Cloud Deployments" style={inp} />
                  </div>

                  {/* Pillar 2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1.5fr', gap: '0.5rem', alignItems: 'center' }}>
                    <input value={settings.pillar2Icon || '🎨'} onChange={e => set('pillar2Icon', e.target.value)} style={{ ...inp, textAlign: 'center', fontSize: '1.2rem', padding: '0.4rem' }} title="Pillar 2 Icon" />
                    <input value={settings.pillar2Title || ''} onChange={e => set('pillar2Title', e.target.value)} placeholder="Pixel-Perfect UI" style={inp} />
                    <input value={settings.pillar2Desc || ''} onChange={e => set('pillar2Desc', e.target.value)} placeholder="Fluid animations & glassmorphism UX" style={inp} />
                  </div>

                  {/* Pillar 3 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1.5fr', gap: '0.5rem', alignItems: 'center' }}>
                    <input value={settings.pillar3Icon || '🚀'} onChange={e => set('pillar3Icon', e.target.value)} style={{ ...inp, textAlign: 'center', fontSize: '1.2rem', padding: '0.4rem' }} title="Pillar 3 Icon" />
                    <input value={settings.pillar3Title || ''} onChange={e => set('pillar3Title', e.target.value)} placeholder="High Performance" style={inp} />
                    <input value={settings.pillar3Desc || ''} onChange={e => set('pillar3Desc', e.target.value)} placeholder="Sub-second page loads & optimized assets" style={inp} />
                  </div>

                  {/* Pillar 4 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1.5fr', gap: '0.5rem', alignItems: 'center' }}>
                    <input value={settings.pillar4Icon || '🛡️'} onChange={e => set('pillar4Icon', e.target.value)} style={{ ...inp, textAlign: 'center', fontSize: '1.2rem', padding: '0.4rem' }} title="Pillar 4 Icon" />
                    <input value={settings.pillar4Title || ''} onChange={e => set('pillar4Title', e.target.value)} placeholder="Security & Integrity" style={inp} />
                    <input value={settings.pillar4Desc || ''} onChange={e => set('pillar4Desc', e.target.value)} placeholder="JWT Auth, CORS, and SQL/NoSQL safety" style={inp} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Personal Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Full Name" k="name" />
                <Field label="Nickname / Style Name" k="nickname" />
              </div>
              <Field label="Hero Title / Main Headline" k="title" />
              <Field label="Hero Bio" k="bio" type="textarea" />
              <div>
                <ImagePicker label="Avatar / Hero Profile Photo URL" value={settings.avatarUrl || ''} onChange={val => set('avatarUrl', val)} />
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Hero Stats & Brands</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <Field label="Experience (e.g. 3+)" k="statsExperience" />
                <Field label="Projects (e.g. 220+)" k="statsProjects" />
                <Field label="Clients (e.g. 60+)" k="statsClients" />
              </div>
              <Field label="Freelance Platforms (comma separated)" k="freelancePlatforms" />
            </div>
          </div>

          {/* Contact details */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Contact Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Mobile No" k="phone" type="tel" />
              <Field label="WhatsApp No / Link" k="whatsapp" />
              <Field label="Email Address" k="email" type="email" />
            </div>
          </div>

          {/* CV / Resume */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>CV / Resume</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="CV Document URL (Google Drive / Dropbox)" k="cvUrl" type="url" />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Or Upload Local CV (PDF / Document)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      const fileInput = document.getElementById('cv-file-input');
                      fileInput?.click();
                    }}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      background: '#fff',
                      color: '#374151',
                      fontWeight: 600,
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {settings.cvUrl && settings.cvUrl.startsWith('data:') ? 'Change PDF File' : 'Upload PDF File'}
                  </button>
                  
                  <input 
                    id="cv-file-input"
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const result = reader.result as string;
                          set('cvUrl', result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  {settings.cvUrl && settings.cvUrl.startsWith('data:') && (
                    <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>
                      ✓ Custom PDF Uploaded (~{(settings.cvUrl.length / 1024).toFixed(1)} KB)
                    </span>
                  )}

                  {settings.cvUrl && !settings.cvUrl.startsWith('data:') && (
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      🔗 Linked via URL
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Social Links</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <Field label="Facebook URL" k="facebook" type="url" />
              <Field label="Instagram URL" k="instagram" type="url" />
              <Field label="TikTok URL" k="tiktok" type="url" />
              <Field label="LinkedIn URL" k="linkedin" type="url" />
              <Field label="YouTube URL" k="youtube" type="url" />
              <Field label="GitHub URL" k="github" type="url" />
            </div>
          </div>

          {/* SEO */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>SEO</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Meta Title" k="metaTitle" />
              <Field label="Meta Description" k="metaDescription" type="textarea" />
            </div>
          </div>

          {/* Backup & Restore */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>💾 Backup & Restore Portfolio</h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.5 }}>
              Export all your profile settings, projects, skills, experience, and blogs to a secure JSON file, or restore them instantly if your database gets reset.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={async () => {
                  try {
                    const data = await request<any>('/api/admin/settings/backup');
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `srilambo_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch (err: any) {
                    alert('Backup failed: ' + err.message);
                  }
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 8,
                  border: '1px solid #00f5ff',
                  background: 'rgba(0, 245, 255, 0.05)',
                  color: '#00c3cc',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                📥 Export JSON Backup
              </button>

              <button 
                type="button" 
                onClick={() => {
                  const input = document.getElementById('restore-file-input');
                  input?.click();
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  background: '#f9fafb',
                  color: '#374151',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                📤 Import Backup File
              </button>

              <input 
                id="restore-file-input"
                type="file" 
                accept=".json"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (!window.confirm('Are you sure you want to restore this backup? This will overwrite your current settings, projects, skills, experience, and blogs.')) {
                    e.target.value = '';
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = async (event) => {
                    try {
                      const json = JSON.parse(event.target?.result as string);
                      await request('/api/admin/settings/restore', {
                        method: 'POST',
                        body: JSON.stringify(json)
                      });
                      alert('✓ Portfolio backup restored successfully! Reloading page...');
                      window.location.reload();
                    } catch (err: any) {
                      alert('Restore failed: ' + err.message);
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: live preview */}
        <div style={{ position: 'sticky', top: '1.5rem' }}>
          <div style={{ background: '#050816', borderRadius: 16, padding: '2rem', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <p style={{ color: '#00f5ff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Hi, I'm</p>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(135deg,#00f5ff,#7928ca)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {settings.name || 'Your Name'}
              </h2>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{settings.title || 'Your Title'}</p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.7 }}>{settings.bio || 'Your bio...'}</p>
            </div>

            {/* About preview card */}
            <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 10, padding: '1rem', fontSize: '0.8rem' }}>
              <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: 4 }}>// About Section Preview</div>
              <div style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 4 }}>{settings.aboutHeading || DEFAULT.aboutHeading}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.4 }}>
                Terminal: {settings.terminalName || DEFAULT.terminalName} • {settings.terminalRole || DEFAULT.terminalRole}
              </div>
            </div>

            {settings.avatarUrl && (
              <div style={{ width: '100%', aspectRatio: '1.5', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={settings.avatarUrl} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
              {settings.email && <div>✉️ {settings.email}</div>}
              {settings.phone && <div>📞 {settings.phone}</div>}
              {settings.whatsapp && <div>💬 {settings.whatsapp}</div>}
            </div>

            <div style={{ padding: '0.75rem', borderRadius: 8, background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', fontSize: '0.75rem', color: '#00f5ff' }}>
              🔍 SEO: {settings.metaTitle || settings.name}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Unsaved Changes Bar */}
      <UnsavedChangesBar
        hasChanges={hasChanges}
        saving={saving}
        saved={saved}
        onSave={save}
        onCancel={cancelChanges}
        message="You have unsaved settings changes"
        saveLabel="Save Settings"
        cancelLabel="Cancel / Undo"
      />
    </div>
  );
}
