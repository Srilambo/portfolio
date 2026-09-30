import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import UnsavedChangesBar from '../components/UnsavedChangesBar';

export interface Service {
  title: string;
  count: string;
  icon: string;
}

export default function ServicesAdmin() {
  const { request } = useAdminApi();
  const [list, setList]                 = useState<Service[]>([]);
  const [originalList, setOriginalList] = useState<Service[]>([]);
  const [hasChanges, setHasChanges]     = useState(false);
  const [changesMsg, setChangesMsg]     = useState('');
  const [saving, setSaving]             = useState<boolean>(false);
  const [saved, setSaved]               = useState<boolean>(false);
  const [loading, setLoading]           = useState<boolean>(true);

  useEffect(() => {
    request<Service[]>('/api/admin/services')
      .then(data => {
        const loaded = Array.isArray(data) ? data : [];
        setList(loaded);
        setOriginalList(loaded);
      })
      .catch(() => {
        setList([]);
        setOriginalList([]);
      })
      .finally(() => setLoading(false));
  }, [request]);

  const saveAll = async (updatedList = list) => {
    setSaving(true);
    try {
      await request('/api/admin/services', { method: 'POST', body: JSON.stringify(updatedList) });
      setOriginalList(updatedList);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert('Failed to save services: ' + (err.message || 'Unknown error'));
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

  const update = (index: number, changes: Partial<Service>) => {
    const updated = list.map((s, i) => i === index ? { ...s, ...changes } : s);
    setList(updated);
    setHasChanges(true);
  };

  const remove = (index: number) => {
    const deletedItem = list[index];
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    setHasChanges(true);
    setChangesMsg(`Deleted "${deletedItem?.title || 'Service'}" (Click Save to persist or Cancel to undo)`);
  };

  const addNew = () => {
    const newService: Service = { title: 'New Service', count: '10+ Projects', icon: '🚀' };
    setList(l => [...l, newService]);
    setHasChanges(true);
    setChangesMsg('Added new service (Click Save to persist)');
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Services</h2>
          <span style={{ fontSize: '0.75rem', color: hasChanges ? '#d97706' : '#6b7280', fontWeight: hasChanges ? 700 : 400 }}>
            {hasChanges ? '⚠️ Unsaved service changes pending' : 'Manage offered services • Press Ctrl+S to save changes anytime'}
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

          <button onClick={addNew} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: 'none', background: '#38bdf8', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            + Add Service
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
              {['Icon','Title','Project Count','Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => {
              return (
                <tr key={`${s.title}-${i}`} style={{ borderBottom: i < list.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '1.2rem' }}>
                    <input value={s.icon} onChange={e => update(i, { icon: e.target.value })}
                      style={{ width: 44, textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.3rem', fontSize: '1.1rem' }} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <input value={s.title} onChange={e => update(i, { title: e.target.value })}
                      style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.4rem 0.6rem', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, width: '100%', minWidth: 200 }} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <input value={s.count} onChange={e => update(i, { count: e.target.value })}
                      style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.4rem 0.6rem', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, width: 160 }} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button onClick={() => remove(i)} style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            Loading services...
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            No services added yet. Click "+ Add Service" to create one.
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
        message={changesMsg || 'You have unsaved service changes'}
        saveLabel="Save to MongoDB"
        cancelLabel="Cancel / Undo"
      />
    </div>
  );
}
