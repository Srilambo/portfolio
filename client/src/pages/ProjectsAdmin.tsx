import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import ConfirmModal from '../components/ConfirmModal';
import type { Project } from '../types';
import { projects as defaultProjects } from '../data/projects';
import ImagePicker from '../components/ImagePicker';

const EMPTY: Omit<Project, 'id'> = { title: '', description: '', tech: [], liveUrl: '', githubUrl: '', image: '', category: 'Fullstack' };

export default function ProjectsAdmin() {
  const { request } = useAdminApi();
  const [list, setList]         = useState<Project[]>([]);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState<Project | null>(null);
  const [form, setForm]         = useState<Omit<Project,'id'>>(EMPTY);
  const [confirm, setConfirm]   = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    request<Project[]>('/api/admin/projects')
      .then(setList)
      .catch(() => setList(defaultProjects));
  }, [request]);

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setTechInput(''); setModal(true); };
  const openEdit = (p: Project) => { setEditing(p); setForm({ title: p.title, description: p.description, tech: p.tech, liveUrl: p.liveUrl, githubUrl: p.githubUrl, image: p.image, category: p.category }); setTechInput(p.tech.join(', ')); setModal(true); };

  const save = async () => {
    setSaving(true);
    const tech = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const data: Project[] = editing
      ? list.map(p => p.id === editing.id ? { ...form, tech, id: editing.id } : p)
      : [...list, { ...form, tech, id: `p${Date.now()}` }];
    await request('/api/admin/projects', { method: 'POST', body: JSON.stringify(data) }).catch(() => {});
    setList(data);
    setSaving(false);
    setModal(false);
  };

  const remove = async (id: string) => {
    const data = list.filter(p => p.id !== id);
    await request('/api/admin/projects', { method: 'POST', body: JSON.stringify(data) }).catch(() => {});
    setList(data);
    setConfirm(null);
  };

  const inp = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const, outline: 'none' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Projects</h2>
        <button onClick={openAdd} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          + Add Project
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Title','Category','Tech','Links','Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < list.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{p.title}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 99, padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>{p.category}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {p.tech.slice(0, 3).map(t => <span key={t} style={{ background: '#f3f4f6', color: '#374151', borderRadius: 99, padding: '0.1rem 0.5rem', fontSize: '0.72rem', fontWeight: 600 }}>{t}</span>)}
                    {p.tech.length > 3 && <span style={{ color: '#9ca3af', fontSize: '0.72rem' }}>+{p.tech.length - 3}</span>}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#00f5ff', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>Live ↗</a>
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none' }}>GitHub</a>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(p)} style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Edit</button>
                    <button onClick={() => setConfirm(p.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem', fontWeight: 800, color: '#111827' }}>{editing ? 'Edit Project' : 'Add Project'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {([['title','Title','text'],['description','Description','text'],['liveUrl','Live URL','url'],['githubUrl','GitHub URL','url']] as [keyof typeof form, string, string][]).map(([k, label, type]) => (
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
                  {['Frontend','Backend','Fullstack'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button onClick={() => setModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Cancel</button>
                <button onClick={save} disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          title="Delete Project"
          message="This action cannot be undone. The project will be permanently removed."
          onConfirm={() => remove(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
