import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import type { Skill } from '../types';
import { skills as defaultSkills } from '../data/skills';

export default function SkillsAdmin() {
  const { request } = useAdminApi();
  const [list, setList]   = useState<Skill[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    request<Skill[]>('/api/admin/skills').then(setList).catch(() => setList(defaultSkills));
  }, [request]);

  const update = async (name: string, changes: Partial<Skill>) => {
    const updated = list.map(s => s.name === name ? { ...s, ...changes } : s);
    setList(updated);
    setSaving(name);
    await request('/api/admin/skills', { method: 'POST', body: JSON.stringify(updated) }).catch(() => {});
    setSaving(null);
  };

  const remove = async (name: string) => {
    const updated = list.filter(s => s.name !== name);
    await request('/api/admin/skills', { method: 'POST', body: JSON.stringify(updated) }).catch(() => {});
    setList(updated);
  };

  const addNew = () => {
    const newSkill: Skill = { name: 'New Skill', level: 50, category: 'Frontend', icon: '⭐' };
    setList(l => [...l, newSkill]);
  };

  const catColors: Record<string, { bg: string; color: string }> = {
    Frontend: { bg: '#eff6ff', color: '#2563eb' },
    Backend:  { bg: '#f0fdf4', color: '#16a34a' },
    DevOps:   { bg: '#fdf4ff', color: '#9333ea' },
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Skills</h2>
        <button onClick={addNew} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          + Add Skill
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Icon','Name','Category','Level','Actions'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => {
              const cc = catColors[s.category] ?? { bg: '#f9fafb', color: '#374151' };
              return (
                <tr key={`${s.name}-${i}`} style={{ borderBottom: i < list.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '1.2rem' }}>
                    <input value={s.icon} onChange={e => update(s.name, { icon: e.target.value })}
                      style={{ width: 44, textAlign: 'center', border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.3rem', fontSize: '1.1rem' }} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <input value={s.name} onChange={e => update(s.name, { name: e.target.value })}
                      style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.4rem 0.6rem', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, width: 160 }} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <select value={s.category} onChange={e => update(s.name, { category: e.target.value as Skill['category'] })}
                      style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.4rem 0.6rem', fontSize: '0.8rem', background: cc.bg, color: cc.color, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                      {['Frontend','Backend','DevOps'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="range" min={0} max={100} value={s.level}
                        onChange={e => update(s.name, { level: Number(e.target.value) })}
                        style={{ width: 120, accentColor: '#00f5ff' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00f5ff', minWidth: 36 }}>{s.level}%</span>
                      {/* Mini bar preview */}
                      <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden', minWidth: 80 }}>
                        <div style={{ height: '100%', width: `${s.level}%`, background: 'linear-gradient(90deg,#00f5ff,#7928ca)', borderRadius: 3, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                    {saving === s.name && <span style={{ fontSize: '0.7rem', color: '#22c55e' }}>Saved ✓</span>}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button onClick={() => remove(s.name)} style={{ padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
