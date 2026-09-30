import { useEffect } from 'react';

interface Props {
  hasChanges: boolean;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  onCancel: () => void;
  message?: string;
  saveLabel?: string;
  cancelLabel?: string;
}

export default function UnsavedChangesBar({
  hasChanges,
  saving,
  saved,
  onSave,
  onCancel,
  message = 'You have unsaved changes',
  saveLabel = 'Save Changes',
  cancelLabel = 'Cancel',
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasChanges && !saving) {
          onSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges, saving, onSave]);

  if (!hasChanges && !saved) return null;

  return (
    <div
      className="unsaved-changes-bar"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1.25rem',
        background: '#0f172a',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '14px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.2)',
        backdropFilter: 'blur(12px)',
        color: '#f8fafc',
        fontFamily: 'Inter, sans-serif',
        maxWidth: '92vw',
        animation: 'adm-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: saved ? '#10b981' : '#f59e0b',
            boxShadow: saved ? '0 0 10px #10b981' : '0 0 10px #f59e0b',
            animation: saved ? 'none' : 'adm-pulse-dot 1.5s infinite',
          }}
        />
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: saved ? '#34d399' : '#e2e8f0' }}>
          {saved ? '✓ Changes saved to MongoDB!' : message}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {!saved && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (!saving) {
                e.currentTarget.style.color = '#f1f5f9';
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            ✕ {cancelLabel}
          </button>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            background: saved ? '#10b981' : '#00f5ff',
            color: '#050816',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saved ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 0 15px rgba(0, 245, 255, 0.4)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span>{saving ? '⏳' : saved ? '✓' : '💾'}</span>
          <span>{saving ? 'Saving to MongoDB...' : saved ? 'Saved!' : saveLabel}</span>
        </button>
      </div>
    </div>
  );
}
