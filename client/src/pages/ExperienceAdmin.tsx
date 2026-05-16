import { useState, useRef, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import type { Experience } from '../types';
import { experiences as defaultExp } from '../data/experience';

export default function ExperienceAdmin() {
  const { request } = useAdminApi();
  const [list, setList]       = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [saving, setSaving]   = useState(false);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    request<Experience[]>('/api/admin/experience').then(setList).catch(() => setList(defaultExp));
  }, [request]);

  const save = async (updated: Experience[]) => {
    await request('/api/admin/experience', { method: 'POST', body: JSON.stringify(updated) }).catch(() => {});
  };

  const saveEditing = async () => {
    if (!editing) return;
    setSaving(true);
    const updated = list.map(e => e.company === editing.company ? editing : e);
    setList(updated);
    await save(updated);
    setSaving(false);
    setEditing(null);
  };

  // Drag-and-drop reorder
  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragOver  = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === i) return;
    const arr = [...list];
    const [moved] = arr.splice(dragIdx.current, 1);
    arr.splice(i, 0, moved);
    dragIdx.current = i;
    setList(arr);
  };
  const onDragEnd = () => { dragIdx.current = null; save(list); };

  const inp = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Experience <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.875rem' }}>(drag to reorder)</span></h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {list.map((exp, i) => (
          <div key={`${exp.company}-${i}`}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => onDragOver(e, i)}
            onDragEnd={onDragEnd}
            style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'grab', gap: '1rem', transition: 'box-shadow 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#d1d5db', fontSize: '1.25rem', userSelect: 'none' }}>⣿</span>
              <div>
                <div style={{ fontWeight: 700, color: '#111827' }}>{exp.company}</div>
                <div style={{ color: '#00f5ff', fontSize: '0.875rem', fontWeight: 600 }}>{exp.role}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{exp.period} · {exp.bullets.length} bullets</div>
              </div>
            </div>
            <button onClick={() => setEditing({ ...exp, bullets: [...exp.bullets] })}
              style={{ padding: '0.45rem 1rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit drawer */}
      {editing && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200 }} onClick={() => setEditing(null)} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 500, maxWidth: '95vw', background: '#fff', zIndex: 201, boxShadow: '-4px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#111827' }}>Edit Experience</h3>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {([['company','Company'],['role','Role'],['period','Period']] as [keyof Experience, string][]).map(([k, label]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>{label}</label>
                  <input value={String(editing[k])} onChange={e => setEditing(ed => ed ? { ...ed, [k]: e.target.value } : ed)} style={inp} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Bullets (one per line)</label>
                <textarea
                  rows={8}
                  value={editing.bullets.join('\n')}
                  onChange={e => setEditing(ed => ed ? { ...ed, bullets: e.target.value.split('\n') } : ed)}
                  style={{ ...inp, resize: 'vertical' }}
                />
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '0.65rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Cancel</button>
              <button onClick={saveEditing} disabled={saving} style={{ flex: 2, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
