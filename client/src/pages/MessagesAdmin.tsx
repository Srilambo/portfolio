import { useState, useRef } from 'react';
import { useMessages } from '../hooks/useMessages';
import MessagePanel from '../components/MessagePanel';
import ConfirmModal from '../components/ConfirmModal';
import type { Message } from '../hooks/useMessages';

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  new:     { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  read:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  replied: { bg: '#fdf4ff', color: '#9333ea', border: '#e9d5ff' },
};

export default function MessagesAdmin() {
  const { messages, loading, error, updateStatus, remove } = useMessages();
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleRowClick = (m: Message) => {
    setSelected(m);
    if (m.status === 'new') updateStatus(m.id, 'read');
  };

  if (loading) return <div style={{ color: '#6b7280', padding: '2rem' }}>Loading messages...</div>;
  if (error)   return <div style={{ color: '#ef4444', padding: '2rem' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>
          Messages
          {messages.filter(m => m.status === 'new').length > 0 && (
            <span style={{ marginLeft: 8, background: '#2563eb', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.1rem 0.55rem', borderRadius: 99 }}>
              {messages.filter(m => m.status === 'new').length} new
            </span>
          )}
        </h2>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {messages.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            No messages yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['From','Subject','Date','Status','Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.map((m, i) => {
                const sc = STATUS_STYLES[m.status] ?? STATUS_STYLES.read;
                return (
                  <tr key={m.id}
                    onClick={() => handleRowClick(m)}
                    style={{
                      borderBottom: i < messages.length - 1 ? '1px solid #f3f4f6' : 'none',
                      cursor: 'pointer', transition: 'background 0.15s',
                      background: m.status === 'new' ? '#f0f9ff' : 'transparent',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = m.status === 'new' ? '#f0f9ff' : 'transparent'; }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: m.status === 'new' ? 700 : 500, color: '#111827', fontSize: '0.875rem' }}>{m.name}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{m.email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#374151', fontSize: '0.875rem', maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 99, padding: '0.15rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 }}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => setDeleteId(m.id)} style={{ padding: '0.3rem 0.65rem', borderRadius: 6, border: '1px solid #fecaca', background: '#fff5f5', color: '#ef4444', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'Inter, sans-serif' }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <MessagePanel
        message={selected}
        onClose={() => setSelected(null)}
        onStatusChange={(id, status) => { updateStatus(id, status); if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null); }}
      />

      {deleteId !== null && (
        <ConfirmModal
          title="Delete Message"
          message="This will permanently delete the message. This cannot be undone."
          onConfirm={() => { remove(deleteId); setDeleteId(null); if (selected?.id === deleteId) setSelected(null); }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
