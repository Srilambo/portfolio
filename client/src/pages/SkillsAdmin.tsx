import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import ConfirmModal from '../components/ConfirmModal';
import ImagePicker from '../components/ImagePicker';
import type { Skill } from '../types';
import { skills as defaultSkills } from '../data/skills';

const EMPTY_SKILL: Skill = {
  name: '',
  level: 80,
  category: 'Frontend',
  icon: '⚡',
};

export default function SkillsAdmin() {
  const { request } = useAdminApi();
  const [list, setList] = useState<Skill[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // null = closed, -1 = adding, >=0 = editing
  const [form, setForm] = useState<Skill>(EMPTY_SKILL);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    request<Skill[]>('/api/admin/skills')
      .then(data => setList(data && data.length > 0 ? data : defaultSkills))
      .catch(() => setList(defaultSkills));
  }, [request]);

  const saveList = async (updated: Skill[]) => {
    setSaving(true);
    setList(updated);
    await request('/api/admin/skills', {
      method: 'POST',
      body: JSON.stringify(updated),
    }).catch(() => {});
    setSaving(false);
  };

  const openAdd = () => {
    setForm({ name: '', level: 80, category: 'Frontend', icon: '⚡' });
    setEditingIndex(-1);
    setModalOpen(true);
  };

  const openEdit = (skill: Skill, index: number) => {
    setForm({ ...skill });
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!form.name.trim()) return;
    let updated: Skill[];
    if (editingIndex === -1) {
      updated = [...list, form];
    } else if (editingIndex !== null && editingIndex >= 0) {
      updated = list.map((s, i) => (i === editingIndex ? form : s));
    } else {
      return;
    }
    await saveList(updated);
    setModalOpen(false);
    setEditingIndex(null);
  };

  const handleDelete = async (index: number) => {
    const updated = list.filter((_, i) => i !== index);
    await saveList(updated);
    setConfirmDeleteIdx(null);
  };

  const catColors: Record<string, { bg: string; color: string }> = {
    Frontend: { bg: '#eff6ff', color: '#2563eb' },
    Backend: { bg: '#f0fdf4', color: '#16a34a' },
    DevOps: { bg: '#fdf4ff', color: '#9333ea' },
  };

  const inputStyle = {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Skills</h2>
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
          + Add Skill
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Icon', 'Name', 'Category', 'Level', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => {
              const cc = catColors[s.category] ?? { bg: '#f9fafb', color: '#374151' };
              const isImage =
                s.icon.startsWith('data:image') ||
                s.icon.startsWith('http') ||
                s.icon.endsWith('.svg') ||
                s.icon.endsWith('.png');

              return (
                <tr key={`${s.name}-${i}`} style={{ borderBottom: i < list.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed #d1d5db',
                        borderRadius: 6,
                        background: '#f9fafb',
                        overflow: 'hidden',
                      }}
                    >
                      {isImage ? (
                        <img src={s.icon} alt={s.name} style={{ width: 28, height: 28, objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: '1.4rem' }}>{s.icon || '⭐'}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>
                    {s.name}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        background: cc.bg,
                        color: cc.color,
                        border: `1px solid ${cc.color}33`,
                        borderRadius: 99,
                        padding: '0.2rem 0.7rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {s.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 260 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00f5ff', minWidth: 36 }}>{s.level}%</span>
                      <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${s.level}%`,
                            background: 'linear-gradient(90deg,#00f5ff,#7928ca)',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => openEdit(s, i)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 6,
                          border: '1px solid #e5e7eb',
                          background: '#f9fafb',
                          color: '#374151',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteIdx(i)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 6,
                          border: '1px solid #fecaca',
                          background: '#fff5f5',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            No skills added yet. Click "+ Add Skill" to create one.
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '2rem',
              width: '100%',
              maxWidth: 520,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1.5rem', fontWeight: 800, color: '#111827', fontSize: '1.2rem' }}>
              {editingIndex === -1 ? 'Add Skill' : 'Edit Skill'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Docker"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Skill['category'] }))}
                  style={inputStyle}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
                    Proficiency Level ({form.level}%)
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.level}
                    onChange={(e) => setForm((f) => ({ ...f, level: Number(e.target.value) }))}
                    style={{ flex: 1, accentColor: '#00f5ff' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00f5ff', minWidth: 40 }}>
                    {form.level}%
                  </span>
                </div>
                <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${form.level}%`,
                      background: 'linear-gradient(90deg,#00f5ff,#7928ca)',
                      borderRadius: 4,
                      transition: 'width 0.2s',
                    }}
                  />
                </div>
              </div>

              <ImagePicker
                label="Skill Icon (Image or Photo)"
                value={form.icon || ''}
                onChange={(val) => setForm((f) => ({ ...f, icon: val }))}
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Or Paste Emoji / Image URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. ⚡ or https://cdn.example.com/icon.svg"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    background: '#f9fafb',
                    color: '#374151',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModal}
                  disabled={saving || !form.name.trim()}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: 8,
                    border: 'none',
                    background: '#00f5ff',
                    color: '#050816',
                    fontWeight: 700,
                    cursor: saving || !form.name.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    opacity: saving || !form.name.trim() ? 0.6 : 1,
                  }}
                >
                  {saving ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteIdx !== null && (
        <ConfirmModal
          title="Delete Skill"
          message={`Are you sure you want to delete "${list[confirmDeleteIdx]?.name}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(confirmDeleteIdx)}
          onCancel={() => setConfirmDeleteIdx(null)}
        />
      )}
    </div>
  );
}

