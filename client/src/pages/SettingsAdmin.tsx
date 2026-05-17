import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import ImagePicker from '../components/ImagePicker';

interface Settings {
  name: string;
  nickname?: string;
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
    try {
      await request('/api/admin/settings', { method: 'PUT', body: JSON.stringify(settings) });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const inp = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const, outline: 'none' };

  const Field = ({ label, k, type = 'text' }: { label: string; k: keyof Settings; type?: string }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>{label}</label>
      {type === 'textarea'
        ? <textarea rows={3} value={settings[k] || ''} onChange={e => set(k, e.target.value)} style={{ ...inp, resize: 'vertical' }} />
        : <input type={type} value={settings[k] || ''} onChange={e => set(k, e.target.value)} style={inp} />}
    </div>
  );

  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ margin: '0 0 2rem', fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Settings</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Personal info */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#111827', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Personal Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Full Name" k="name" />
                <Field label="Nickname / Style Name" k="nickname" />
              </div>
              <Field label="Title / Role" k="title" />
              <Field label="Bio" k="bio" type="textarea" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <ImagePicker label="Avatar / Hero Image URL" value={settings.avatarUrl || ''} onChange={val => set('avatarUrl', val)} />
                <ImagePicker label="About Section Image URL" value={settings.aboutImageUrl || ''} onChange={val => set('aboutImageUrl', val)} />
              </div>
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
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
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

          <button onClick={save} disabled={saving}
            style={{ padding: '0.85rem', borderRadius: 8, border: 'none', background: saved ? '#22c55e' : '#00f5ff', color: '#050816', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.3s' }}>
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
          </button>
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
    </div>
  );
}
