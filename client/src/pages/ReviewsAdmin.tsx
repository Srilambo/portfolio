import { useState, useEffect } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import ConfirmModal from '../components/ConfirmModal';
import type { Review } from '../types';

export default function ReviewsAdmin() {
  const { request } = useAdminApi();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    request<Review[]>('/api/admin/reviews')
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load reviews.');
        setLoading(false);
      });
  }, [request]);

  const toggleApproval = async (review: Review) => {
    const nextApproved = !review.approved;
    try {
      await request(`/api/admin/reviews/${review.id}`, {
        method: 'PUT',
        body: JSON.stringify({ approved: nextApproved }),
      });
      setReviews(prev =>
        prev.map(r => (r.id === review.id ? { ...r, approved: nextApproved } : r))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update review status.');
    }
  };

  const removeReview = async (id: string) => {
    try {
      await request(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      setReviews(prev => prev.filter(r => r.id !== id));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete review.');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <span style={{ color: '#fbbf24', fontSize: '1rem', letterSpacing: '0.1em' }}>
        {'★'.repeat(rating)}
        {'☆'.repeat(5 - rating)}
      </span>
    );
  };

  if (loading) return <div style={{ color: '#6b7280', padding: '2rem' }}>Loading reviews...</div>;
  if (error) return <div style={{ color: '#ef4444', padding: '2rem' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>
          Customer Reviews
          {reviews.filter(r => !r.approved).length > 0 && (
            <span style={{ marginLeft: 8, background: '#fbbf24', color: '#000', fontSize: '0.75rem', fontWeight: 700, padding: '0.1rem 0.55rem', borderRadius: 99 }}>
              {reviews.filter(r => !r.approved).length} pending
            </span>
          )}
        </h2>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {reviews.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
            No reviews submitted yet.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {['Customer', 'Rating', 'Comment', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map((r, i) => {
                const statusStyle = r.approved
                  ? { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: 'Approved' }
                  : { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Pending' };
                return (
                  <tr key={r.id}
                    style={{
                      borderBottom: i < reviews.length - 1 ? '1px solid #f3f4f6' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{r.name}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{r.email}</div>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      {renderStars(r.rating)}
                    </td>
                    <td style={{ padding: '1rem', color: '#374151', fontSize: '0.875rem', maxWidth: 300 }}>
                      <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{r.comment}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`,
                        borderRadius: 99,
                        padding: '0.15rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => toggleApproval(r)}
                          style={{
                            padding: '0.3rem 0.65rem',
                            borderRadius: 6,
                            border: `1px solid ${r.approved ? '#d1d5db' : '#bbf7d0'}`,
                            background: r.approved ? '#f3f4f6' : '#f0fdf4',
                            color: r.approved ? '#4b5563' : '#16a34a',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {r.approved ? 'Hide' : 'Approve'}
                        </button>
                        <button
                          onClick={() => setDeleteId(r.id)}
                          style={{
                            padding: '0.3rem 0.65rem',
                            borderRadius: 6,
                            border: '1px solid #fecaca',
                            background: '#fff5f5',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif'
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
        )}
      </div>

      {deleteId !== null && (
        <ConfirmModal
          title="Delete Review"
          message="Are you sure you want to permanently delete this review? This action cannot be undone."
          onConfirm={() => removeReview(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
