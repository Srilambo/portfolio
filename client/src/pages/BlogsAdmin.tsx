import { useState, useRef, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import type { Blog } from '../types';
import ConfirmModal from '../components/ConfirmModal';
import ImagePicker from '../components/ImagePicker';

export default function BlogsAdmin() {
  const { request } = useAdminApi();
  const [list, setList]       = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null); // null if not editing, -1 if adding, >=0 if editing
  const [saving, setSaving]   = useState(false);
  const [confirm, setConfirm] = useState<number | null>(null);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    request<Blog[]>('/api/admin/blogs')
      .then(setList)
      .catch(() => setList([]));
  }, [request]);

  const save = async (updated: Blog[]) => {
    await request('/api/admin/blogs', { method: 'POST', body: JSON.stringify(updated) }).catch(() => {});
  };

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

  const saveEditing = async () => {
    if (!editing) return;
    setSaving(true);
    let updated: Blog[];
    if (editingIdx === -1) {
      updated = [...list, editing];
    } else if (editingIdx !== null && editingIdx >= 0) {
      updated = list.map((b, idx) => idx === editingIdx ? editing : b);
    } else {
      setSaving(false);
      return;
    }
    setList(updated);
    await save(updated);
    setSaving(false);
    setEditing(null);
    setEditingIdx(null);
  };

  const remove = async (index: number) => {
    const updated = list.filter((_, idx) => idx !== index);
    setList(updated);
    await save(updated);
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
  };
  const onDragEnd = () => { dragIdx.current = null; save(list); };

  const inp = { width: '100%', padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Blogs & Shared Experiences <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.875rem' }}>(drag to reorder)</span></h2>
        <button onClick={openAdd} style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          + Write New Post
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {list.length === 0 ? (
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

      {/* Edit sliding drawer */}
      {editing && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200 }} onClick={() => { setEditing(null); setEditingIdx(null); }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 550, maxWidth: '95vw', background: '#fff', zIndex: 201, boxShadow: '-4px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#111827' }}>{editingIdx === -1 ? 'Write New Post' : 'Edit Post'}</h3>
              <button onClick={() => { setEditing(null); setEditingIdx(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>✕</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Post Title</label>
                <input value={editing.title} onChange={e => setEditing(ed => ed ? { ...ed, title: e.target.value } : ed)} style={inp} placeholder="e.g. Scaling Web Apps to 4K Displays" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Category</label>
                  <input value={editing.category} onChange={e => setEditing(ed => ed ? { ...ed, category: e.target.value } : ed)} style={inp} placeholder="e.g. DevOps, Frontend" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Publication Date</label>
                  <input value={editing.date} onChange={e => setEditing(ed => ed ? { ...ed, date: e.target.value } : ed)} style={inp} placeholder="e.g. May 17, 2026" />
                </div>
              </div>

              <ImagePicker 
                label="Post Feature Image" 
                value={editing.image || ''} 
                onChange={val => setEditing(ed => ed ? { ...ed, image: val } : ed)} 
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Post Content / Experience Narrative</label>
                <textarea
                  rows={14}
                  value={editing.content}
                  onChange={e => setEditing(ed => ed ? { ...ed, content: e.target.value } : ed)}
                  style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
                  placeholder="Share your story, technical details, or working experience..."
                />
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => { setEditing(null); setEditingIdx(null); }} style={{ flex: 1, padding: '0.65rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Cancel</button>
              <button onClick={saveEditing} disabled={saving} style={{ flex: 2, padding: '0.65rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                {saving ? 'Saving...' : editingIdx === -1 ? 'Publish Post' : 'Save Changes'}
              </button>
            </div>
          </div>
        </>
      )}
      
      {confirm !== null && (
        <ConfirmModal
          title="Delete Blog Post"
          message="Are you sure you want to permanently delete this blog post? This action cannot be undone."
          onConfirm={() => remove(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
