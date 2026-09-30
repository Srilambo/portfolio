import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import UnsavedChangesBar from '../components/UnsavedChangesBar';

interface TerminalSettings {
  terminalFilename?: string;
  terminalVersion?: string;
  terminalName?: string;
  terminalRole?: string;
  terminalLocation?: string;
  terminalStack?: string;
  terminalStatus?: string;
  cvUrl?: string;
  aboutHeading?: string;
  aboutSubheading?: string;
  aboutBio?: string;
  [key: string]: any;
}

const DEFAULTS: TerminalSettings = {
  terminalFilename: 'developer.config.ts',
  terminalVersion: 'v2.5.0',
  terminalName: 'Ananthkumar Srilambotharasarma',
  terminalRole: 'Fullstack Developer',
  terminalLocation: 'Global Remote',
  terminalStack: 'React, Node.js, TypeScript, MongoDB',
  terminalStatus: 'Building scalable web applications',
  aboutHeading: 'Architecting High-Performance Web Applications',
  aboutSubheading: 'Fullstack Software Engineer',
  aboutBio: "I'm a Fullstack Developer who builds fast, polished web and mobile apps, from smooth interactive frontends to secure, scalable backends. I care about clean code, great UX, and shipping products that actually work in the real world.",
  cvUrl: '',
};

export default function AboutAdmin() {
  const { request } = useAdminApi();
  const [settings, setSettings] = useState<TerminalSettings>(DEFAULTS);
  const [originalSettings, setOriginalSettings] = useState<TerminalSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Fetch settings from MongoDB
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request<Record<string, string>>('/api/admin/settings');
      if (data && typeof data === 'object') {
        const merged: TerminalSettings = {
          ...DEFAULTS,
          ...data,
          terminalName: data.terminalName || data.name || DEFAULTS.terminalName,
          terminalRole: data.terminalRole || data.title || DEFAULTS.terminalRole,
          terminalFilename: data.terminalFilename || DEFAULTS.terminalFilename,
          terminalVersion: data.terminalVersion || DEFAULTS.terminalVersion,
          terminalLocation: data.terminalLocation || DEFAULTS.terminalLocation,
          terminalStack: data.terminalStack || DEFAULTS.terminalStack,
          terminalStatus: data.terminalStatus || DEFAULTS.terminalStatus,
          aboutHeading: data.aboutHeading || DEFAULTS.aboutHeading,
          aboutSubheading: data.aboutSubheading || DEFAULTS.aboutSubheading,
          aboutBio: data.aboutBio || data.bio || DEFAULTS.aboutBio,
          cvUrl: data.cvUrl || '',
        };
        setSettings(merged);
        setOriginalSettings(merged);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateField = (k: keyof TerminalSettings, val: string) => {
    setSettings(prev => {
      const next = { ...prev, [k]: val };
      checkHasChanges(next);
      return next;
    });
  };

  const checkHasChanges = (current: TerminalSettings) => {
    const isDifferent = Object.keys(DEFAULTS).some(k => current[k] !== originalSettings[k]);
    setHasChanges(isDifferent);
  };

  // Tag helper
  const stackArray = (settings.terminalStack || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const addTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (!stackArray.includes(trimmed)) {
      const updated = [...stackArray, trimmed].join(', ');
      updateField('terminalStack', updated);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    const updated = stackArray.filter(t => t !== tagToRemove).join(', ');
    updateField('terminalStack', updated);
  };

  // CV File Upload
  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('PDF file must be smaller than 8MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField('cvUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save to MongoDB
  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await request('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      setOriginalSettings(settings);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('Failed to save to MongoDB: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const cancelChanges = () => {
    setSettings(originalSettings);
    setHasChanges(false);
  };

  // Ctrl+S shortcut
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
    padding: '0.75rem 1rem',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    fontSize: '0.9rem',
    color: '#0f172a',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>💻</span>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>
              Developer Card & About Section
            </h2>
          </div>
          <span
            style={{
              fontSize: '0.78rem',
              color: hasChanges ? '#d97706' : '#6b7280',
              fontWeight: hasChanges ? 700 : 400,
            }}
          >
            {hasChanges
              ? '⚠️ Unsaved terminal card changes pending'
              : 'Customize the developer.config.ts code window, bio, and CV download • Press Ctrl+S to save'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {hasChanges && (
            <button
              onClick={cancelChanges}
              disabled={saving}
              style={{
                padding: '0.65rem 1.2rem',
                borderRadius: 10,
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
              padding: '0.65rem 1.4rem',
              borderRadius: 10,
              border: hasChanges ? '1px solid #059669' : 'none',
              background: saved ? '#10b981' : hasChanges ? '#059669' : '#00f5ff',
              color: saved || hasChanges ? '#fff' : '#050816',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: hasChanges
                ? '0 0 16px rgba(16, 185, 129, 0.4)'
                : '0 4px 14px rgba(0, 245, 255, 0.3)',
            }}
          >
            <span>{saving ? '⏳' : saved ? '✓' : '💾'}</span>
            <span>
              {saving
                ? 'Saving to MongoDB...'
                : saved
                ? '✓ Saved to MongoDB!'
                : hasChanges
                ? 'Save Changes *'
                : 'Save Changes'}
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          Loading developer card settings...
        </div>
      ) : (
        <div className="admin-two-col-grid" style={{ gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Column: Form Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Terminal Window Card Fields */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>⚡</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Code Terminal Card Properties
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Controls the code card shown in your portfolio's About section
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {/* File tab & Version badge */}
                <div className="admin-form-two-col" style={{ gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Card Tab Filename
                    </label>
                    <input
                      type="text"
                      value={settings.terminalFilename || ''}
                      onChange={e => updateField('terminalFilename', e.target.value)}
                      placeholder="developer.config.ts"
                      style={inp}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Version Badge
                    </label>
                    <input
                      type="text"
                      value={settings.terminalVersion || ''}
                      onChange={e => updateField('terminalVersion', e.target.value)}
                      placeholder="v2.5.0"
                      style={inp}
                    />
                  </div>
                </div>

                {/* Developer Name & Role */}
                <div className="admin-form-two-col" style={{ gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Name (<code>name: '...'</code>)
                    </label>
                    <input
                      type="text"
                      value={settings.terminalName || ''}
                      onChange={e => updateField('terminalName', e.target.value)}
                      placeholder="Ananthkumar Srilambotharasarma"
                      style={inp}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Role (<code>role: '...'</code>)
                    </label>
                    <input
                      type="text"
                      value={settings.terminalRole || ''}
                      onChange={e => updateField('terminalRole', e.target.value)}
                      placeholder="Fullstack Developer"
                      style={inp}
                    />
                  </div>
                </div>

                {/* Location & Status */}
                <div className="admin-form-two-col" style={{ gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Location (<code>location: '...'</code>)
                    </label>
                    <input
                      type="text"
                      value={settings.terminalLocation || ''}
                      onChange={e => updateField('terminalLocation', e.target.value)}
                      placeholder="Global Remote"
                      style={inp}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      Status Quote (<code>status: '...'</code>)
                    </label>
                    <input
                      type="text"
                      value={settings.terminalStatus || ''}
                      onChange={e => updateField('terminalStatus', e.target.value)}
                      placeholder="Building scalable web applications"
                      style={inp}
                    />
                  </div>
                </div>

                {/* Tech Stack interactive Chips Editor */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Stack Technologies (<code>stack: [...]</code>)
                  </label>
                  
                  {/* Current chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {stackArray.map(tech => (
                      <span
                        key={tech}
                        style={{
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: '#0284c7',
                          padding: '0.3rem 0.75rem',
                          borderRadius: 99,
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTag(tech)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title={`Remove ${tech}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add chip input */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                      placeholder="Type a tech (e.g. Next.js, Docker, Python) and press Enter or Add"
                      style={{ ...inp, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => addTag(tagInput)}
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: 10,
                        border: 'none',
                        background: '#38bdf8',
                        color: '#020617',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      + Add Tag
                    </button>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, display: 'block' }}>
                    Or edit as raw comma-separated text below:
                  </span>
                  <input
                    type="text"
                    value={settings.terminalStack || ''}
                    onChange={e => updateField('terminalStack', e.target.value)}
                    style={{ ...inp, marginTop: 4, fontSize: '0.82rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>

            {/* CV / Resume Upload & Link Section */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>📄</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Download CV Action Button
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Shown directly underneath the terminal card on the portfolio
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    CV / Resume URL or Cloud Link
                  </label>
                  <input
                    type="text"
                    value={settings.cvUrl || ''}
                    onChange={e => updateField('cvUrl', e.target.value)}
                    placeholder="https://drive.google.com/... or https://yourdomain.com/cv.pdf"
                    style={inp}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Or Upload PDF Directly (Max 8MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCvUpload}
                    style={{
                      fontSize: '0.85rem',
                      color: '#475569',
                      padding: '0.5rem 0',
                    }}
                  />
                  {settings.cvUrl && settings.cvUrl.startsWith('data:application/pdf') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 4 }}>
                      <span style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>✓ PDF File Uploaded in Memory</span>
                      <button
                        type="button"
                        onClick={() => updateField('cvUrl', '')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Remove file
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About Section Headings & Bio */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>📝</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    About Section Text & Story
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Controls the right-hand headline and bio paragraph
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Main Heading
                  </label>
                  <input
                    type="text"
                    value={settings.aboutHeading || ''}
                    onChange={e => updateField('aboutHeading', e.target.value)}
                    placeholder="Architecting High-Performance Web Applications"
                    style={inp}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Subheading / Category
                  </label>
                  <input
                    type="text"
                    value={settings.aboutSubheading || ''}
                    onChange={e => updateField('aboutSubheading', e.target.value)}
                    placeholder="Fullstack Software Engineer"
                    style={inp}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                    Bio Paragraph
                  </label>
                  <textarea
                    rows={4}
                    value={settings.aboutBio || ''}
                    onChange={e => updateField('aboutBio', e.target.value)}
                    placeholder="Describe your background, technical philosophy, and experience..."
                    style={{ ...inp, resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Exact Live Preview Twin */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                👁️ Live Client Preview
              </span>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                ● Real-time Sync
              </span>
            </div>

            {/* The Terminal Window Card */}
            <div
              style={{
                borderRadius: 18,
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.15)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Terminal Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  background: 'rgba(15, 23, 42, 0.98)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#10b981' }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                  {settings.terminalFilename || 'developer.config.ts'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>
                  {settings.terminalVersion || 'v2.5.0'}
                </span>
              </div>

              {/* Code Body */}
              <div
                style={{
                  padding: '1.75rem',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '0.88rem',
                  lineHeight: 1.85,
                  color: '#f8fafc',
                  background: 'rgba(2, 6, 23, 0.7)',
                }}
              >
                <div>
                  <span style={{ color: '#38bdf8' }}>const</span> <span style={{ color: '#34d399' }}>developer</span> = &#123;
                </div>
                <div style={{ paddingLeft: '1.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>name:</span>{' '}
                  <span style={{ color: '#34d399' }}>'{settings.terminalName || 'Ananthkumar Srilambotharasarma'}'</span>,
                </div>
                <div style={{ paddingLeft: '1.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>role:</span>{' '}
                  <span style={{ color: '#fbbf24' }}>'{settings.terminalRole || 'Fullstack Developer'}'</span>,
                </div>
                <div style={{ paddingLeft: '1.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>location:</span>{' '}
                  <span style={{ color: '#34d399' }}>'{settings.terminalLocation || 'Global Remote'}'</span>,
                </div>
                <div style={{ paddingLeft: '1.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>stack:</span> [
                  {stackArray.map((item, idx) => (
                    <span key={item + idx}>
                      <span style={{ color: '#38bdf8' }}>'{item}'</span>
                      {idx < stackArray.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  ],
                </div>
                <div style={{ paddingLeft: '1.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>status:</span>{' '}
                  <span style={{ color: '#10b981' }}>'{settings.terminalStatus || 'Building scalable web applications'}'</span>
                </div>
                <div>&#125;;</div>
              </div>
            </div>

            {/* Download CV Action Button Preview */}
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #00f5ff, #818cf8)',
                  color: '#050816',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  boxShadow: '0 8px 25px rgba(0, 245, 255, 0.35)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <span>📄</span>
                <span>Download CV</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {settings.cvUrl ? '✓ Ready' : '(No link set)'}
                </span>
              </div>
            </div>

            {/* Preview Info card */}
            <div
              style={{
                marginTop: '1.5rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '1rem',
                fontSize: '0.8rem',
                color: '#64748b',
                lineHeight: 1.5,
              }}
            >
              💡 <strong>Instant Sync:</strong> Changes saved here directly update the terminal code window on your live portfolio homepage without requiring any redeployment.
            </div>

          </div>

        </div>
      )}

      {/* Floating Unsaved Changes Bar */}
      <UnsavedChangesBar
        hasChanges={hasChanges}
        saving={saving}
        saved={saved}
        onSave={save}
        onCancel={cancelChanges}
        message="You have unsaved developer card changes"
        saveLabel="Save to MongoDB"
        cancelLabel="Cancel / Undo"
      />
    </div>
  );
}
