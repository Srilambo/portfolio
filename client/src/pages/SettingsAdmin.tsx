import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';

interface Settings {
  name: string; title: string; bio: string; avatarUrl: string;
  github: string; linkedin: string; twitter: string;
  metaTitle: string; metaDescription: string;
}

const DEFAULT: Settings = {
  name: 'Raavanaa', title: 'Fullstack Developer', bio: 'Building scalable web apps from pixel to production.',
  avatarUrl: '', github: 'https://github.com/raavanaa', linkedin: 'https://linkedin.com/in/raavanaa',
  twitter: 'https://twitter.com/raavanaa', metaTitle: 'Raavanaa | Fullstack Developer Portfolio',
  metaDescription: 'React, Node.js, Three.js. Building scalable web apps from pixel to production.',
};

export default function SettingsAdmin() {
  const { request } = useAdminApi();
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    request<Record<string, string>>('/api/admin/settings')
      .then(data => setSettings({ ...DEFAULT, ...data }))
      .catch(() => {});
  }, [request]);

  const set = (k: keyof Settings, v: string) => setSettings(s => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    await request('/api/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }).catch(() => {});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const, outline: 'none' };

  const Field = ({ label, k, type = 'text' }: { label: string; k: keyof Settings; type?: string }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>{label}</label>
      {type === 'textarea'
        ? <textarea rows={3} value={settings[k]} onChange={e => set(k, e.target.value)} style={{ ...inp, resize: 'vertical' }} />
        : <input type={type} value={settings[k]} onChange={e => set(k, e.target.value)} style={inp} />}
    </div>
  );

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ margin: '0 0 2rem', fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Settings</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Personal info */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Personal Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Full Name" k="name" />
              <Field label="Title / Role" k="title" />
              <Field label="Bio" k="bio" type="textarea" />
              <Field label="Avatar URL" k="avatarUrl" type="url" />
            </div>
          </div>

          {/* Social links */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Social Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="GitHub URL" k="github" type="url" />
              <Field label="LinkedIn URL" k="linkedin" type="url" />
              <Field label="Twitter URL" k="twitter" type="url" />
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

          <button onClick={save} disabled={saving}
            style={{ padding: '0.85rem', borderRadius: 8, border: 'none', background: saved ? '#22c55e' : '#00f5ff', color: '#050816', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.3s' }}>
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>

        {/* Right: live preview */}
        <div style={{ position: 'sticky', top: '1.5rem' }}>
          <div style={{ background: '#050816', borderRadius: 16, padding: '2rem', color: '#f0f0f0' }}>
            <p style={{ color: '#00f5ff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Hi, I'm</p>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(135deg,#00f5ff,#7928ca)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {settings.name || 'Your Name'}
            </h2>
            <p style={{ color: '#d1d5db', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{settings.title || 'Your Title'}</p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.7 }}>{settings.bio || 'Your bio...'}</p>
            <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: 8, background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)', fontSize: '0.75rem', color: '#00f5ff' }}>
              🔍 SEO: {settings.metaTitle || settings.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
