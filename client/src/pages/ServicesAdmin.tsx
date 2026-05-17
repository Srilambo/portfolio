import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';

export interface Service {
  title: string;
  count: string;
  icon: string;
}

export default function ServicesAdmin() {
  const { request } = useAdminApi();
  const [list, setList] = useState<Service[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    request<Service[]>('/api/admin/services').then(setList).catch(() => setList([]));
  }, [request]);

  const update = async (index: number, changes: Partial<Service>) => {
    const updated = list.map((s, i) => i === index ? { ...s, ...changes } : s);
    setList(updated);
    setSaving(index.toString());
    await request('/api/admin/services', { method: 'POST', body: JSON.stringify(updated) }).catch(() => {});
    setSaving(null);
  };

  const remove = async (index: number) => {
    const updated = list.filter((_, i) => i !== index);
    await request('/api/admin/services', { method: 'POST', body: JSON.stringify(updated) }).catch(() => {});
    setList(updated);
  };

  const addNew = () => {
    const newService: Service = { title: 'New Service', count: '10+ Projects', icon: '🚀' };
    setList(l => [...l, newService]);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Services</h2>
        <button onClick={addNew} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: 'none', background: '#38bdf8', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          + Add Service
        </button>
      </div>

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
                    {saving === i.toString() && <span style={{ fontSize: '0.7rem', color: '#22c55e', marginLeft: 10 }}>Saved ✓</span>}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button onClick={() => remove(i)} style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            No services added yet. Click "+ Add Service" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
