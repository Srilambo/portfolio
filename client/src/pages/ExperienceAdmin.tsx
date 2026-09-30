import { useState, useRef, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import type { Experience } from '../types';
import { experiences as defaultExp } from '../data/experience';
import ConfirmModal from '../components/ConfirmModal';
import ImagePicker from '../components/ImagePicker';
import UnsavedChangesBar from '../components/UnsavedChangesBar';

export default function ExperienceAdmin() {
  const { request } = useAdminApi();
  const [list, setList]                         = useState<Experience[]>([]);
  const [originalList, setOriginalList]         = useState<Experience[]>([]);
  const [hasChanges, setHasChanges]             = useState(false);
  const [changesMsg, setChangesMsg]             = useState('');

  const [editing, setEditing]                   = useState<Experience | null>(null);
  const [editingIdx, setEditingIdx]             = useState<number | null>(null); // null if not editing, -1 if adding, >=0 if editing
  const [saving, setSaving]                     = useState(false);
  const [saved, setSaved]                       = useState(false);
  const [confirm, setConfirm]                   = useState<number | null>(null);
  const [loading, setLoading]                   = useState(true);
  const dragIdx = useRef<number | null>(null);

  // Fast direct load - Never resurrect deleted experience
  useEffect(() => {
    request<Experience[]>('/api/admin/experience')
      .then(data => {
        const loaded = Array.isArray(data) ? data : defaultExp;
        setList(loaded);
        setOriginalList(loaded);
      })
      .catch(() => {
        setList(defaultExp);
        setOriginalList(defaultExp);
      })
      .finally(() => setLoading(false));
  }, [request]);

  const saveAll = async (updated: Experience[] = list) => {
    setSaving(true);
    try {
      await request('/api/admin/experience', { method: 'POST', body: JSON.stringify(updated) });
      setOriginalList(updated);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert('Failed to save experience: ' + (err.message || 'Unknown error'));
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
    setEditing({ company: '', role: '', period: '', bullets: [''], logo: '' });
    setEditingIdx(-1);
  };

  const openEdit = (exp: Experience, idx: number) => {
    setEditing({ company: exp.company || '', role: exp.role || '', period: exp.period || '', bullets: [...(exp.bullets || [])], logo: exp.logo || '' });
    setEditingIdx(idx);
  };

  const saveEditing = () => {
    if (!editing) return;
    let updated: Experience[];
    if (editingIdx === -1) {
      updated = [...list, editing];
      setChangesMsg(`Added "${editing.company}" (Click Save to persist)`);
    } else if (editingIdx !== null && editingIdx >= 0) {
      updated = list.map((e, idx) => idx === editingIdx ? editing : e);
      setChangesMsg(`Updated "${editing.company}" (Click Save to persist)`);
    } else {
      return;
    }
    setList(updated);
    setHasChanges(true);
    setEditing(null);
    setEditingIdx(null);
  };

  const remove = (index: number) => {
    const deletedItem = list[index];
    const updated = list.filter((_, idx) => idx !== index);
    setList(updated);
    setHasChanges(true);
    setChangesMsg(`Deleted "${deletedItem?.company || 'Experience'}" (Click Save to persist or Cancel to undo)`);
    setConfirm(null);
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
    setHasChanges(true);
  };
  const onDragEnd = () => { dragIdx.current = null; };

  const inp = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Experience <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.875rem' }}>(drag to reorder)</span></h2>
          <span style={{ fontSize: '0.75rem', color: hasChanges ? '#d97706' : '#6b7280', fontWeight: hasChanges ? 700 : 400 }}>
            {hasChanges ? '⚠️ Unsaved experience changes pending' : 'Edit work history • Press Ctrl+S to save changes anytime'}
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

          <button onClick={openAdd} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            + Add Experience
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

      {/* Experience List */}
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
              {exp.logo ? (
                <img src={exp.logo} alt={exp.company} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f3f4f6', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#9ca3af', fontSize: '0.9rem' }}>
                  {(exp.company || 'XP').substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, color: '#111827' }}>{exp.company}</div>
                <div style={{ color: '#00f5ff', fontSize: '0.875rem', fontWeight: 600 }}>{exp.role}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{exp.period} · {(exp.bullets || []).filter(Boolean).length} bullets</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(exp, i)}
                style={{ padding: '0.45rem 1rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
                Edit
              </button>
              <button onClick={() => setConfirm(i)}
                style={{ padding: '0.45rem 1rem', borderRadius: 8, border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            Loading experiences...
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            No experience records yet. Click "+ Add Experience" to create one.
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
        message={changesMsg || 'You have unsaved experience changes'}
        saveLabel="Save to MongoDB"
        cancelLabel="Cancel / Undo"
      />

      {/* Edit drawer */}
      {editing && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200 }} onClick={() => { setEditing(null); setEditingIdx(null); }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 500, maxWidth: '95vw', background: '#fff', zIndex: 201, boxShadow: '-4px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#111827' }}>{editingIdx === -1 ? 'Add Experience' : 'Edit Experience'}</h3>
              <button onClick={() => { setEditing(null); setEditingIdx(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {([['company','Company Name'],['role','Role / Title'],['period','Period (e.g. 2021 — Present)']] as [keyof Experience, string][]).map(([k, label]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>{label}</label>
                  <input value={String(editing[k] || '')} onChange={e => setEditing(ed => ed ? { ...ed, [k]: e.target.value } : ed)} style={inp} />
                </div>
              ))}
              <ImagePicker 
                label="Logo / Image URL" 
                value={editing.logo || ''} 
                onChange={val => setEditing(ed => ed ? { ...ed, logo: val } : ed)} 
              />
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Bullets (one per line)</label>
                <textarea
                  rows={8}
                  value={(editing.bullets || []).join('\n')}
                  onChange={e => setEditing(ed => ed ? { ...ed, bullets: e.target.value.split('\n') } : ed)}
                  style={{ ...inp, resize: 'vertical' }}
                />
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => { setEditing(null); setEditingIdx(null); }} style={{ flex: 1, padding: '0.65rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Cancel</button>
              <button onClick={saveEditing} style={{ flex: 2, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Apply
              </button>
            </div>
          </div>
        </>
      )}
      
      {confirm !== null && (
        <ConfirmModal
          title="Delete Experience"
          message={`Are you sure you want to delete "${list[confirm]?.company}"? You can review your changes and click Save to confirm or Cancel to restore it.`}
          onConfirm={() => remove(confirm)}
          onCancel={() => setConfirm(null)}
          confirmLabel="Delete"
        />
      )}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
