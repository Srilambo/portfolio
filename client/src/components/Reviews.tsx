import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import { getApiUrl } from '../utils/api';
import type { Review } from '../types';

export default function Reviews({ reviews = [] }: { reviews?: Review[] }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });
  const [form, setForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStarClick = (rating: number) => {
    setForm(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.comment.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(getApiUrl('/api/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit review.');
      }

      setSuccess(true);
      setForm({ name: '', email: '', rating: 5, comment: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive ? i <= (hoverRating ?? form.rating) : i <= rating;
      stars.push(
        <span
          key={i}
          onClick={() => interactive && handleStarClick(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(null)}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            color: isFilled ? '#fbbf24' : '#475569',
            fontSize: interactive ? '1.8rem' : '1rem',
            marginRight: 4,
            transition: 'color 0.15s, transform 0.1s',
            display: 'inline-block'
          }}
          onMouseDown={e => interactive && (e.currentTarget.style.transform = 'scale(0.8)')}
          onMouseUp={e => interactive && (e.currentTarget.style.transform = 'scale(1)')}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section id="reviews" ref={ref} className="section-wrapper">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="section-heading">Customer <span className="gradient-text">Reviews</span></h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Read experiences from clients or share your own review below.</p>
      </div>

      <div className="contact-grid">
        {/* Left Side: Reviews List */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            What People Say ({reviews.length})
          </h3>
          
          {reviews.length === 0 ? (
            <div style={{
              background: 'var(--card-glass)',
              border: '1px solid var(--border-glass)',
              borderRadius: 20,
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>✨</span>
              No reviews have been approved yet. Be the first to write one!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {reviews.map((r, idx) => (
                <div
                  key={r.id || idx}
                  style={{
                    background: 'var(--card-glass)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 20,
                    padding: '1.5rem',
                    transition: 'all 0.3s',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.04)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-glass)';
                    e.currentTarget.style.background = 'var(--card-glass)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{r.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 2 }}>
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                      </div>
                    </div>
                    <div>
                      {renderStars(r.rating)}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Side: Submission Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ background: 'var(--card-glass)', border: '1px solid var(--border-glass)', borderRadius: 24, padding: '2rem', backdropFilter: 'blur(12px)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Write a Review ✍️
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Rating
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {renderStars(form.rating, true)}
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 700, marginLeft: 8 }}>
                    ({hoverRating ?? form.rating} / 5)
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label htmlFor="review-name" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                  <input id="review-name" type="text" name="name" placeholder="John Doe" className="input-glass" required value={form.name} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="review-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                  <input id="review-email" type="email" name="email" placeholder="john@example.com" className="input-glass" required value={form.email} onChange={handleInputChange} />
                </div>
              </div>

              <div>
                <label htmlFor="review-comment" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comment</label>
                <textarea id="review-comment" name="comment" placeholder="Describe your experience working together..." className="input-glass" rows={4} required value={form.comment} onChange={handleInputChange} />
              </div>

              {success && (
                <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '1rem', borderRadius: 10, fontWeight: 600, fontSize: '0.875rem' }}>
                  Thank you! Your review has been submitted and is pending administrator approval.
                </div>
              )}
              {error && (
                <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '1rem', borderRadius: 10, fontWeight: 600, fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  borderRadius: 12,
                  border: 'none',
                  background: 'var(--gradient)',
                  color: '#050816',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: '0 8px 16px rgba(56, 189, 248, 0.2)'
                }}
                onMouseEnter={e => !submitting && (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={e => !submitting && (e.currentTarget.style.transform = 'scale(1)')}
              >
                {submitting ? 'Submitting...' : 'Submit Review 🌟'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
