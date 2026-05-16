import type { Message } from '../hooks/useMessages';

interface Props {
  message: Message | null;
  onClose: () => void;
  onStatusChange: (id: number, status: Message['status']) => void;
}

export default function MessagePanel({ message, onClose, onStatusChange }: Props) {
  if (!message) return null;

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    new:     { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    read:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    replied: { bg: '#fdf4ff', color: '#9333ea', border: '#e9d5ff' },
  };
  const sc = statusColors[message.status];

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200 }} onClick={onClose} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, maxWidth: '95vw',
        background: '#fff', zIndex: 201, boxShadow: '-4px 0 40px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Message Detail</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#6b7280' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>From</div>
            <div style={{ fontWeight: 700, color: '#111827' }}>{message.name}</div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{message.email}</div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Subject</div>
            <div style={{ fontWeight: 600, color: '#111827' }}>{message.subject}</div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Date</div>
            <div style={{ color: '#374151', fontSize: '0.875rem' }}>{new Date(message.created_at).toLocaleString()}</div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Message</div>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '1rem', color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
              {message.message}
            </div>
          </div>

          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Status:</span>
            <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '0.2rem 0.75rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 700 }}>
              {message.status}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => onStatusChange(message.id, 'read')}
            style={{ flex: 1, padding: '0.6rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
            Mark Read
          </button>
          <a href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
            onClick={() => onStatusChange(message.id, 'replied')}
            style={{ flex: 1, padding: '0.6rem', borderRadius: 8, border: 'none', background: '#00f5ff', color: '#050816', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
            Reply via Email
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
