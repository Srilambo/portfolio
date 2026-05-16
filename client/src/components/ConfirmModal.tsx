interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
}

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Delete' }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)' }}
      onClick={onCancel}
    >
      <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>{title}</h3>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel}
            style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: '1px solid #e5e7eb', background: 'transparent', color: '#374151', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </button>
          <button onClick={onConfirm}
            style={{ padding: '0.6rem 1.25rem', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
