import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';

interface WAClick {
  id: string;
  source: 'contact' | 'footer' | 'other';
  page: string;
  ip: string;
  created_at: string;
}

const SOURCE_STYLE: Record<string, { bg: string; color: string; border: string; label: string }> = {
  contact: { bg: 'rgba(37,211,102,0.1)', color: '#25D366', border: 'rgba(37,211,102,0.25)', label: 'Contact Section' },
  footer:  { bg: 'rgba(56,189,248,0.1)', color: '#38bdf8',  border: 'rgba(56,189,248,0.25)',  label: 'Footer Icon'     },
  other:   { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.25)', label: 'Other'           },
};

export default function WhatsAppClicksAdmin() {
  const { request } = useAdminApi();
  const [clicks, setClicks]   = useState<WAClick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request<WAClick[]>('/api/admin/whatsapp-clicks');
      setClicks(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => { load(); }, [load]);

  const deleteOne = async (id: string) => {
    await request(`/api/admin/whatsapp-clicks/${id}`, { method: 'DELETE' });
    setClicks(prev => prev.filter(c => c.id !== id));
  };

  const clearAll = async () => {
    if (!window.confirm('Clear all WhatsApp click records? This cannot be undone.')) return;
    setClearing(true);
    try {
      await request('/api/admin/whatsapp-clicks', { method: 'DELETE' });
      setClicks([]);
    } finally {
      setClearing(false);
    }
  };

  // Stats
  const total    = clicks.length;
  const today    = clicks.filter(c => new Date(c.created_at).toDateString() === new Date().toDateString()).length;
  const fromContact = clicks.filter(c => c.source === 'contact').length;
  const fromFooter  = clicks.filter(c => c.source === 'footer').length;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '2rem', color: '#6b7280' }}>
      <div style={{ width: 20, height: 20, border: '2px solid #25D366', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading WhatsApp activity...
    </div>
  );
  if (error) return <div style={{ color: '#ef4444', padding: '2rem' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>📲</span> WhatsApp Clicks
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
            Every time a visitor clicks your WhatsApp button — you get notified on your phone + recorded here.
          </p>
        </div>
        {clicks.length > 0 && (
          <button
            onClick={clearAll}
            disabled={clearing}
            style={{
              padding: '0.5rem 1rem', borderRadius: 8,
              border: '1px solid #fecaca', background: '#fff5f5',
              color: '#ef4444', fontWeight: 700, fontSize: '0.8rem',
              cursor: clearing ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            {clearing ? 'Clearing...' : '🗑 Clear All'}
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Clicks',     value: total,        color: '#25D366', icon: '📲' },
          { label: 'Today',            value: today,        color: '#38bdf8', icon: '📅' },
          { label: 'Contact Section',  value: fromContact,  color: '#818cf8', icon: '💬' },
          { label: 'Footer Icon',      value: fromFooter,   color: '#fbbf24', icon: '🔗' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
            padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ fontSize: '1.4rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Security note */}
      <div style={{
        background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.2)',
        borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: '#15803d',
      }}>
        <span>🔒</span>
        <span>
          <strong>Secure:</strong> Your WhatsApp number is stored only in <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 4px', borderRadius: 4 }}>.env</code> on the server — never in the database, never visible to visitors.
        </span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        {clicks.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📭</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>No clicks yet</div>
            <div style={{ fontSize: '0.85rem' }}>When visitors click your WhatsApp button, it'll show up here.</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['Source', 'Page', 'IP (masked)', 'Date & Time', ''].map(h => (
                  <th key={h} style={{
                    padding: '0.75rem 1rem', textAlign: 'left',
                    fontSize: '0.72rem', fontWeight: 700, color: '#6b7280',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clicks.map((c, i) => {
                const sc = SOURCE_STYLE[c.source] ?? SOURCE_STYLE.other;
                return (
                  <tr key={c.id} style={{
                    borderBottom: i < clicks.length - 1 ? '1px solid #f3f4f6' : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f9fafb'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    {/* Source badge */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{
                        background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                        borderRadius: 99, padding: '0.2rem 0.75rem',
                        fontSize: '0.73rem', fontWeight: 700,
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {sc.label}
                      </span>
                    </td>

                    {/* Page */}
                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', color: '#374151', fontFamily: 'monospace' }}>
                      {c.page || '/'}
                    </td>

                    {/* IP masked */}
                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                      {c.ip || '—'}
                    </td>

                    {/* Time */}
                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.78rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {new Date(c.created_at).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>

                    {/* Delete */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <button
                        onClick={() => deleteOne(c.id)}
                        style={{
                          padding: '0.25rem 0.6rem', borderRadius: 6,
                          border: '1px solid #fecaca', background: '#fff5f5',
                          color: '#ef4444', cursor: 'pointer',
                          fontSize: '0.72rem', fontFamily: 'Inter, sans-serif',
                        }}
                      >✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Setup guide */}
      <div style={{ marginTop: '2rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
          ⚙️ WhatsApp Notification Setup (CallMeBot)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: '#374151' }}>
          {[
            { step: '1', text: 'Open WhatsApp on your phone' },
            { step: '2', text: 'Send a message to +34 623 78 64 49 saying: I allow callmebot to send me messages' },
            { step: '3', text: 'You will receive an API key back (e.g. 1234567)' },
            { step: '4', text: 'Add to server/.env: WHATSAPP_ADMIN_NUMBER=+94771234567' },
            { step: '5', text: 'Add to server/.env: WHATSAPP_API_KEY=your_api_key_here' },
            { step: '6', text: 'Restart the server — done! You will now receive WhatsApp alerts.' },
          ].map(s => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{
                minWidth: 22, height: 22, borderRadius: '50%',
                background: '#25D366', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 800, flexShrink: 0,
              }}>{s.step}</span>
              <span style={{ lineHeight: 1.5 }}>{s.text}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: '#f0fdf4', borderRadius: 8, fontSize: '0.78rem', color: '#15803d', border: '1px solid #bbf7d0' }}>
          ✅ Works with both <strong>personal WhatsApp</strong> and <strong>WhatsApp Business</strong>. Free, no credit card needed.
        </div>
      </div>
    </div>
  );
}
