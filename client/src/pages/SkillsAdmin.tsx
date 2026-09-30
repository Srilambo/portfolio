import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import ConfirmModal from '../components/ConfirmModal';
import ImagePicker from '../components/ImagePicker';
import UnsavedChangesBar from '../components/UnsavedChangesBar';
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
  const [list, setList]                         = useState<Skill[]>([]);
  const [originalList, setOriginalList]         = useState<Skill[]>([]);
  const [hasChanges, setHasChanges]             = useState(false);
  const [changesMsg, setChangesMsg]             = useState('');

  const [modalOpen, setModalOpen]               = useState(false);
  const [editingIndex, setEditingIndex]         = useState<number | null>(null); // null = closed, -1 = adding, >=0 = editing
  const [form, setForm]                         = useState<Skill>(EMPTY_SKILL);
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);
  const [saving, setSaving]                     = useState(false);
  const [saved, setSaved]                       = useState(false);
  const [loading, setLoading]                   = useState(true);

  // Fast direct load - Never resurrect deleted skills
  useEffect(() => {
    request<Skill[]>('/api/admin/skills')
      .then(data => {
        const loaded = Array.isArray(data) ? data : defaultSkills;
        setList(loaded);
        setOriginalList(loaded);
      })
      .catch(() => {
        setList(defaultSkills);
        setOriginalList(defaultSkills);
      })
      .finally(() => setLoading(false));
  }, [request]);

  const saveList = async (updated: Skill[] = list) => {
    setSaving(true);
    try {
      await request('/api/admin/skills', {
        method: 'POST',
        body: JSON.stringify(updated),
      });
      setOriginalList(updated);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert('Failed to save skills: ' + (err.message || 'Unknown error'));
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
        saveList();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [list, originalList]);

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

  const handleSaveModal = () => {
    if (!form.name.trim()) return;
    let updated: Skill[];
    if (editingIndex === -1) {
      updated = [...list, form];
      setChangesMsg(`Added "${form.name}" (Click Save to persist)`);
    } else if (editingIndex !== null && editingIndex >= 0) {
      updated = list.map((s, i) => (i === editingIndex ? form : s));
      setChangesMsg(`Updated "${form.name}" (Click Save to persist)`);
    } else {
      return;
    }
    setList(updated);
    setHasChanges(true);
    setModalOpen(false);
    setEditingIndex(null);
  };

  // Remove skill and show Save & Cancel controls
  const handleDelete = (index: number) => {
    const deletedItem = list[index];
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    setHasChanges(true);
    setChangesMsg(`Deleted "${deletedItem?.name || 'Skill'}" (Click Save to persist or Cancel to undo)`);
    setConfirmDeleteIdx(null);
  };

  const markRowChanged = (updatedList: Skill[]) => {
    setList(updatedList);
    setHasChanges(true);
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Skills</h2>
          <span style={{ fontSize: '0.75rem', color: hasChanges ? '#d97706' : '#6b7280', fontWeight: hasChanges ? 700 : 400 }}>
            {hasChanges ? '⚠️ Unsaved skill changes pending' : 'Edit inline or press Ctrl+S to save changes anytime'}
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
            onClick={() => saveList()}
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
            + Add Skill
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
              onClick={() => saveList()}
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
              const isImage = s.icon && (s.icon.startsWith('http') || s.icon.startsWith('/') || s.icon.startsWith('data:image'));
              const cc = catColors[s.category] || { bg: '#f3f4f6', color: '#4b5563' };

              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: i < list.length - 1 ? '1px solid #f3f4f6' : 'none',
                    transition: 'background 0.2s',
                  }}
                >
                  {/* Icon with live preview + quick edit */}
                  <td style={{ padding: '0.85rem 1rem', width: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #e5e7eb',
                          borderRadius: 6,
                          background: '#f9fafb',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        {isImage ? (
                          <img src={s.icon} alt={s.name} style={{ width: 22, height: 22, objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: '1.2rem' }}>{s.icon || '⭐'}</span>
                        )}
                      </div>
                      <input
                        value={s.icon}
                        onChange={(e) => markRowChanged(list.map((item, idx) => idx === i ? { ...item, icon: e.target.value } : item))}
                        style={{ ...inputStyle, fontSize: '0.78rem', padding: '0.4rem 0.6rem', color: '#4b5563', maxWidth: 160 }}
                        placeholder="Icon URL or Emoji"
                      />
                    </div>
                  </td>

                  {/* Name input */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <input
                      value={s.name}
                      onChange={(e) => markRowChanged(list.map((item, idx) => idx === i ? { ...item, name: e.target.value } : item))}
                      style={{ ...inputStyle, fontWeight: 700, color: '#111827', padding: '0.4rem 0.6rem' }}
                    />
                  </td>

                  {/* Category select */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <select
                      value={s.category}
                      onChange={(e) => markRowChanged(list.map((item, idx) => idx === i ? { ...item, category: e.target.value as Skill['category'] } : item))}
                      style={{
                        ...inputStyle,
                        padding: '0.4rem 0.6rem',
                        fontWeight: 700,
                        color: cc.color,
                        background: cc.bg,
                        border: `1px solid ${cc.color}44`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        width: 120,
                      }}
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </td>

                  {/* Level range slider & percentage */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 220 }}>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={s.level}
                        onChange={(e) => markRowChanged(list.map((item, idx) => idx === i ? { ...item, level: Number(e.target.value) } : item))}
                        style={{ flex: 1, accentColor: '#00f5ff', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#00f5ff', minWidth: 36 }}>{s.level}%</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => openEdit(s, i)}
                        title="Advanced Edit / Picker"
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: 6,
                          border: '1px solid #e5e7eb',
                          background: '#f9fafb',
                          color: '#374151',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteIdx(i)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: 6,
                          border: '1px solid #fecaca',
                          background: '#fff5f5',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
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

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            Loading skills...
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            No skills found. Click "+ Add Skill" to create one.
          </div>
        ) : null}
      </div>

      {/* Floating Unsaved Changes Bar */}
      <UnsavedChangesBar
        hasChanges={hasChanges}
        saving={saving}
        saved={saved}
        onSave={() => saveList()}
        onCancel={cancelChanges}
        message={changesMsg || 'You have unsaved skill changes'}
        saveLabel="Save to MongoDB"
        cancelLabel="Cancel / Undo"
      />

      {/* Add / Edit Skill Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
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
              maxWidth: 480,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1.5rem', fontWeight: 800, color: '#111827' }}>
              {editingIndex === -1 ? 'Add Skill' : 'Edit Skill'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Docker"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Proficiency Level</label>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#00f5ff' }}>{form.level}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.level}
                  onChange={(e) => setForm((f) => ({ ...f, level: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#00f5ff', cursor: 'pointer' }}
                />
              </div>

              <div>
                <ImagePicker
                  label="Skill Icon (Upload image or use emoji/SVG url)"
                  value={form.icon}
                  onChange={(val) => setForm((f) => ({ ...f, icon: val }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button
                  type="button"
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
                  type="button"
                  onClick={handleSaveModal}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: 8,
                    border: 'none',
                    background: '#00f5ff',
                    color: '#050816',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Apply
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
          message={`Are you sure you want to delete "${list[confirmDeleteIdx]?.name}"? You can review your changes and click Save to confirm or Cancel to restore it.`}
          onConfirm={() => handleDelete(confirmDeleteIdx)}
          onCancel={() => setConfirmDeleteIdx(null)}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
