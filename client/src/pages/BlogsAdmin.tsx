import { useState, useRef, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import type { Blog } from '../types';
import ConfirmModal from '../components/ConfirmModal';
import ImagePicker from '../components/ImagePicker';
import UnsavedChangesBar from '../components/UnsavedChangesBar';

export default function BlogsAdmin() {
  const { request } = useAdminApi();
  const [list, setList]                 = useState<Blog[]>([]);
  const [originalList, setOriginalList] = useState<Blog[]>([]);
  const [hasChanges, setHasChanges]     = useState(false);
  const [changesMsg, setChangesMsg]     = useState('');

  const [editing, setEditing]           = useState<Blog | null>(null);
  const [editingIdx, setEditingIdx]     = useState<number | null>(null); // null if not editing, -1 if adding, >=0 if editing
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [confirm, setConfirm]           = useState<number | null>(null);
  const [loading, setLoading]           = useState(true);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    request<Blog[]>('/api/admin/blogs')
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

  const saveAll = async (updated: Blog[] = list) => {
    setSaving(true);
    try {
      await request('/api/admin/blogs', { method: 'POST', body: JSON.stringify(updated) });
      setOriginalList(updated);
      setHasChanges(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert('Failed to save blogs: ' + (err.message || 'Unknown error'));
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
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    setEditing({ title: '', content: '', image: '', date: today, category: 'General' });
    setEditingIdx(-1);
  };

  const openEdit = (blog: Blog, idx: number) => {
    setEditing({ 
      title: blog.title || '', 
      content: blog.content || '', 
      image: blog.image || '', 
      date: blog.date || '', 
      category: blog.category || 'General' 
    });
    setEditingIdx(idx);
  };

  const saveEditing = () => {
    if (!editing) return;
    let updated: Blog[];
    if (editingIdx === -1) {
      updated = [...list, editing];
      setChangesMsg(`Added "${editing.title}" (Click Save to persist)`);
    } else if (editingIdx !== null && editingIdx >= 0) {
      updated = list.map((b, idx) => idx === editingIdx ? editing : b);
      setChangesMsg(`Updated "${editing.title}" (Click Save to persist)`);
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
    setChangesMsg(`Deleted "${deletedItem?.title || 'Blog'}" (Click Save to persist or Cancel to undo)`);
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
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Blogs & Shared Experiences <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.875rem' }}>(drag to reorder)</span></h2>
          <span style={{ fontSize: '0.75rem', color: hasChanges ? '#d97706' : '#6b7280', fontWeight: hasChanges ? 700 : 400 }}>
            {hasChanges ? '⚠️ Unsaved blog changes pending' : 'Manage your articles • Press Ctrl+S to save changes anytime'}
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
            + Write New Post
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

      {/* Blog list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', color: '#6b7280' }}>
            Loading blog posts...
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', color: '#6b7280' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>📝</span>
            No blog posts published yet. Click "+ Write New Post" to share your first experience!
          </div>
        ) : (
          list.map((blog, i) => (
            <div key={`${blog.title}-${i}`}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={e => onDragOver(e, i)}
              onDragEnd={onDragEnd}
              style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'grab', gap: '1rem', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                <span style={{ color: '#d1d5db', fontSize: '1.25rem', userSelect: 'none' }}>⣿</span>
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} style={{ width: 60, height: 44, borderRadius: 6, objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                ) : (
                  <div style={{ width: 60, height: 44, borderRadius: 6, background: '#f3f4f6', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#9ca3af', fontSize: '0.8rem' }}>
                    BLOG
                  </div>
                )}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, color: '#111827', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{blog.title}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                    <span style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff', fontSize: '0.75rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: 4 }}>{blog.category}</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{blog.date}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => openEdit(blog, i)}
                  style={{ padding: '0.45rem 1rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
                  Edit
                </button>
                <button onClick={() => setConfirm(i)}
                  style={{ padding: '0.45rem 1rem', borderRadius: 8, border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Unsaved Changes Bar */}
      <UnsavedChangesBar
        hasChanges={hasChanges}
        saving={saving}
        saved={saved}
        onSave={() => saveAll()}
        onCancel={cancelChanges}
        message={changesMsg || 'You have unsaved blog changes'}
        saveLabel="Save to MongoDB"
        cancelLabel="Cancel / Undo"
      />

      {/* Write / Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => { setEditing(null); setEditingIdx(null); }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem', fontWeight: 800, color: '#111827' }}>{editingIdx === -1 ? 'Write New Post' : 'Edit Post'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Post Title</label>
                <input value={editing.title} onChange={e => setEditing(ed => ed ? { ...ed, title: e.target.value } : ed)} style={inp} placeholder="e.g. Scaling Next.js to 100k Users" />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Category</label>
                  <input value={editing.category} onChange={e => setEditing(ed => ed ? { ...ed, category: e.target.value } : ed)} style={inp} placeholder="Web Dev, Architecture..." />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Date</label>
                  <input value={editing.date} onChange={e => setEditing(ed => ed ? { ...ed, date: e.target.value } : ed)} style={inp} />
                </div>
              </div>

              <ImagePicker 
                label="Cover Image URL" 
                value={editing.image || ''} 
                onChange={val => setEditing(ed => ed ? { ...ed, image: val } : ed)} 
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Content / Article Body (Markdown supported)</label>
                <textarea rows={10} value={editing.content} onChange={e => setEditing(ed => ed ? { ...ed, content: e.target.value } : ed)} style={{ ...inp, resize: 'vertical' }} placeholder="Write your full story or thoughts here..." />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button onClick={() => { setEditing(null); setEditingIdx(null); }} style={{ padding: '0.65rem 1.25rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Cancel</button>
                <button onClick={saveEditing} style={{ padding: '0.65rem 1.5rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirm !== null && (
        <ConfirmModal
          title="Delete Post"
          message={`Are you sure you want to delete "${list[confirm]?.title}"? You can review your changes and click Save to confirm or Cancel to restore it.`}
          onConfirm={() => remove(confirm)}
          onCancel={() => setConfirm(null)}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
