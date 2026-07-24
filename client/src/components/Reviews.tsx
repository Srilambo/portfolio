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
    setForm((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
            fontSize: interactive ? '1.8rem' : '1.05rem',
            marginRight: 3,
            transition: 'color 0.15s, transform 0.1s',
            display: 'inline-block',
          }}
          onMouseDown={(e) => interactive && (e.currentTarget.style.transform = 'scale(0.8)')}
          onMouseUp={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <section id="reviews" ref={ref} className="section-wrapper" style={{ position: 'relative' }}>
      {/* Background Decorative Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-5%',
          width: 380,
          height: 380,
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '1rem' }}>💬</span>
          <span
            style={{
              color: 'var(--accent)',
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            // COMMUNITY & TESTIMONIALS
          </span>
        </div>
        <h2 className="section-heading">
          Shared <span className="gradient-text">Experiences</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1.05rem', maxWidth: 640, marginIn: 'auto' }}>
          Read feedback from engineering partners and clients, or leave your own review below.
        </p>
      </div>

      <div className="contact-grid" style={{ position: 'relative', zIndex: 1 }}>
        {/* Left Side: Reviews List */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Client Feedback ({reviews.length})
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 99, fontWeight: 700 }}>
              Verified Reviews
            </span>
          </div>

          {reviews.length === 0 ? (
            <div
              style={{
                background: 'var(--card-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: 20,
                padding: '3rem 2rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>✨</span>
              No reviews have been published yet. Be the first to share your experience working together!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {reviews.map((r, idx) => (
                <div
                  key={r.id || idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 20,
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    backdropFilter: 'blur(16px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(56, 189, 248, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)',
                          color: '#020617',
                          fontWeight: 900,
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)',
                        }}
                      >
                        {getInitial(r.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{r.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 2 }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Verified Client'}
                        </div>
                      </div>
                    </div>
                    <div>{renderStars(r.rating)}</div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
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
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 24,
              padding: '2rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Share Your Experience ✍️
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Rating
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {renderStars(form.rating, true)}
                  <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 800, marginLeft: 8 }}>
                    ({hoverRating ?? form.rating} / 5 Stars)
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label
                    htmlFor="review-name"
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      marginBottom: 6,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Name
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    name="name"
                    placeholder="Jane Doe"
                    className="input-glass"
                    required
                    value={form.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="review-email"
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      marginBottom: 6,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Email
                  </label>
                  <input
                    id="review-email"
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    className="input-glass"
                    required
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Your Review / Experience
                </label>
                <textarea
                  id="review-comment"
                  name="comment"
                  placeholder="Describe your experience working together..."
                  className="input-glass"
                  rows={4}
                  required
                  value={form.comment}
                  onChange={handleInputChange}
                />
              </div>

              {success && (
                <div
                  style={{
                    color: '#10b981',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    padding: '1rem',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  Thank you! Your experience review has been submitted for verification.
                </div>
              )}
              {error && (
                <div
                  style={{
                    color: '#ef4444',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    padding: '1rem',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
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
                  transition: 'all 0.2s ease',
                  opacity: submitting ? 0.7 : 1,
                  boxShadow: '0 8px 16px rgba(56, 189, 248, 0.2)',
                }}
                onMouseEnter={(e) => !submitting && (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => !submitting && (e.currentTarget.style.transform = 'scale(1)')}
              >
                {submitting ? 'Submitting...' : 'Submit Experience 🌟'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

