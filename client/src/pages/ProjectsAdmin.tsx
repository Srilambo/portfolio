import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import ConfirmModal from '../components/ConfirmModal';
import UnsavedChangesBar from '../components/UnsavedChangesBar';
import type { Project } from '../types';
import { projects as defaultProjects } from '../data/projects';
import ImagePicker from '../components/ImagePicker';

const EMPTY: Omit<Project, 'id'> = { title: '', description: '', tech: [], liveUrl: '', githubUrl: '', image: '', category: 'Fullstack' };

export default function ProjectsAdmin() {
  const { request } = useAdminApi();
  const [list, setList]                 = useState<Project[]>([]);
  const [originalList, setOriginalList] = useState<Project[]>([]);
  const [hasChanges, setHasChanges]     = useState(false);
  const [changesMsg, setChangesMsg]     = useState('');
  
  const [modal, setModal]               = useState(false);
  const [editing, setEditing]           = useState<Project | null>(null);
  const [form, setForm]                 = useState<Omit<Project,'id'>>(EMPTY);
  const [confirm, setConfirm]           = useState<string | null>(null);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [techInput, setTechInput]       = useState('');
  const [loading, setLoading]           = useState(true);

  // Fast direct load - Never resurrect deleted projects
  useEffect(() => {
    request<Project[]>('/api/admin/projects')
      .then(data => {
        const loaded = Array.isArray(data) ? data : defaultProjects;
        setList(loaded);
        setOriginalList(loaded);
      })
      .catch(() => {
        setList(defaultProjects);
        setOriginalList(defaultProjects);
      })
      .finally(() => setLoading(false));
  }, [request]);

  const saveAll = async (projectsToSave = list) => {
    setSaving(true);
    try {
      await request('/api/admin/projects', {
        method: 'POST',
        body: JSON.stringify(projectsToSave),
      });
      setOriginalList(projectsToSave);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert('Failed to save projects: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const cancelChanges = () => {
    setList([...originalList]);
    setHasChanges(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [list, originalList]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setTechInput('');
    setModal(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title || '',
      description: p.description || '',
      tech: p.tech || [],
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      image: p.image || '',
      category: p.category || 'Fullstack',
    });
    setTechInput((p.tech || []).join(', '));
    setModal(true);
  };

  const saveModalItem = () => {
    const tech = techInput.split(',').map(t => t.trim()).filter(Boolean);
    let updated: Project[];
    if (editing) {
      updated = list.map(p => p.id === editing.id ? { ...form, tech, id: editing.id } : p);
      setChangesMsg(`Updated "${form.title || 'Project'}" (Click Save to persist)`);
    } else {
      updated = [...list, { ...form, tech, id: `p${Date.now()}` }];
      setChangesMsg(`Added "${form.title || 'Project'}" (Click Save to persist)`);
    }
    setList(updated);
    setHasChanges(true);
    setModal(false);
  };

  // Remove project and show Save & Cancel controls
  const remove = (id: string) => {
    const deletedItem = list.find(p => p.id === id);
    const updated = list.filter(p => p.id !== id);
    setList(updated);
    setHasChanges(true);
    setChangesMsg(`Deleted "${deletedItem?.title || 'Project'}" (Click Save to persist or Cancel to undo)`);
    setConfirm(null);
  };

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

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Projects</h2>
          <span style={{ fontSize: '0.75rem', color: hasChanges ? '#d97706' : '#6b7280', fontWeight: hasChanges ? 700 : 400 }}>
            {hasChanges ? '⚠️ Unsaved changes pending' : 'Manage your portfolio projects • Press Ctrl+S to save'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Cancel button if changes exist */}
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

          {/* Save button */}
          <button
            onClick={() => saveAll()}
            disabled={saving}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 8,
              border: hasChanges ? '1px solid #059669' : '1px solid #10b981',
              background: saved ? '#10b981' : hasChanges ? '#059669' : 'rgba(16, 185, 129, 0.1)',
              color: (saved || hasChanges) ? '#fff' : '#059669',
              fontWeight: 800,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: hasChanges ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
            }}
          >
            <span>{saving ? '⏳' : saved ? '✓' : '💾'}</span>
            <span>{saving ? 'Saving to MongoDB...' : saved ? '✓ Saved to MongoDB!' : hasChanges ? 'Save Changes *' : 'Save Changes'}</span>
          </button>

          <button
            onClick={openAdd}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 8,
              border: 'none',
              background: '#00f5ff',
              color: '#050816',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            + Add Project
          </button>
        </div>
      </div>

      {/* Changes Notification Banner */}
      {hasChanges && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: 8,
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid #f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#b45309',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}>
          <span>⚠️ {changesMsg || 'You have unsaved changes. Remember to click "Save Changes" to persist.'}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={cancelChanges}
              style={{
                background: 'transparent',
                border: '1px solid #b45309',
                color: '#b45309',
                borderRadius: 6,
                padding: '0.25rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => saveAll()}
              disabled={saving}
              style={{
                background: '#059669',
                border: 'none',
                color: '#fff',
                borderRadius: 6,
                padding: '0.25rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {saving ? 'Saving...' : 'Save to MongoDB'}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Title', 'Category', 'Tech', 'Links', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => {
              const techList = Array.isArray(p.tech) ? p.tech : [];
              return (
                <tr key={p.id || i} style={{ borderBottom: i < list.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{p.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 99, padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>{p.category}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {techList.slice(0, 3).map(t => <span key={t} style={{ background: '#f3f4f6', color: '#374151', borderRadius: 99, padding: '0.1rem 0.5rem', fontSize: '0.72rem', fontWeight: 600 }}>{t}</span>)}
                      {techList.length > 3 && <span style={{ color: '#9ca3af', fontSize: '0.72rem' }}>+{techList.length - 3}</span>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#00f5ff', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>Live ↗</a>}
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none' }}>GitHub</a>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Edit</button>
                      <button onClick={() => setConfirm(p.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            Loading projects...
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            No projects added yet. Click "+ Add Project" to create one.
          </div>
        ) : null}
      </div>

      {/* Floating Unsaved Changes Bar */}
      <UnsavedChangesBar
        hasChanges={hasChanges}
        saving={saving}
        saved={saved}
        onSave={() => saveAll()}
        onCancel={cancelChanges}
        message={changesMsg || 'You have unsaved changes'}
        saveLabel="Save to MongoDB"
        cancelLabel="Cancel / Undo"
      />

      {/* Add / Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem', fontWeight: 800, color: '#111827' }}>{editing ? 'Edit Project' : 'Add Project'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {([['title', 'Title', 'text'], ['description', 'Description', 'text'], ['liveUrl', 'Live URL', 'url'], ['githubUrl', 'GitHub URL', 'url']] as [keyof typeof form, string, string][]).map(([k, label, type]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>{label}</label>
                  <input type={type} value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={inp} />
                </div>
              ))}
              <ImagePicker 
                label="Image URL" 
                value={form.image || ''} 
                onChange={val => setForm(f => ({ ...f, image: val }))} 
              />
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Tech (comma separated)</label>
                <input value={techInput} onChange={e => setTechInput(e.target.value)} style={inp} placeholder="React, Node.js, PostgreSQL" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Project['category'] }))} style={{ ...inp }}>
                  {['Frontend', 'Backend', 'Fullstack'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button onClick={() => setModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Cancel</button>
                <button onClick={saveModalItem} style={{ padding: '0.65rem 1.5rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirm && (
        <ConfirmModal
          title="Delete Project"
          message="Are you sure you want to delete this project? You can review your changes and click Save to confirm or Cancel to restore it."
          onConfirm={() => remove(confirm)}
          onCancel={() => setConfirm(null)}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
