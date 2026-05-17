import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import type { Blog } from '../types';

export default function Blogs({ blogs }: { blogs: Blog[] }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);

  if (!blogs || blogs.length === 0) return null;

  return (
    <section id="blogs" ref={ref} className="section-wrapper" style={{ position: 'relative' }}>
      {/* Background glowing blob */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-10%',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%)',
        filter: 'blur(50px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}
      >
        <h2 className="section-heading">Shared <span className="gradient-text">Experiences</span></h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: 600 }}>
          Narratives, research, and reflections on design, performance engineering, and fullstack solutions.
        </p>
      </motion.div>

      {/* Grid of blogs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {blogs.map((blog, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              background: 'var(--card-glass)',
              borderRadius: 24,
              border: '1px solid var(--border-glass)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s'
            }}
            onClick={() => setActiveBlog(blog)}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-6px)';
              el.style.borderColor = 'var(--accent)';
              el.style.boxShadow = '0 12px 30px rgba(0,245,255,0.08)';
              const img = el.querySelector('img');
              if (img) img.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(0)';
              el.style.borderColor = 'var(--border-glass)';
              el.style.boxShadow = 'none';
              const img = el.querySelector('img');
              if (img) img.style.transform = 'scale(1)';
            }}
          >
            {/* Image frame */}
            <div style={{ width: '100%', aspectRatio: '1.7', overflow: 'hidden', relative: 'relative' as any, background: 'var(--bg-glass)' }}>
              {blog.image ? (
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 700 }}>
                  📄 ARTICLE
                </div>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: 'rgba(0,245,255,0.08)',
                  border: '1px solid rgba(0,245,255,0.2)',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.65rem',
                  borderRadius: 6,
                  textTransform: 'uppercase' as any
                }}>
                  {blog.category}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{blog.date}</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text)', lineHeight: 1.4 }}>
                {blog.title}
              </h3>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {blog.content}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem' }}>
                Read Narrative <span style={{ transition: 'transform 0.2s' }} className="arrow">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Glassmorphic Post Reader Modal Overlay */}
      <AnimatePresence>
        {activeBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 8, 22, 0.65)',
              backdropFilter: 'blur(12px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setActiveBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                background: 'var(--card-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: 28,
                padding: '2.5rem',
                width: '100%',
                maxWidth: 700,
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0,245,255,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                color: 'var(--text)'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{
                      background: 'rgba(0,245,255,0.1)',
                      border: '1px solid rgba(0,245,255,0.3)',
                      color: 'var(--accent)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.75rem',
                      borderRadius: 6
                    }}>{activeBlog.category}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{activeBlog.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, lineHeight: 1.3 }}>{activeBlog.title}</h3>
                </div>
                <button 
                  onClick={() => setActiveBlog(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    lineHeight: 1
                  }}
                >✕</button>
              </div>

              {/* Cover image */}
              {activeBlog.image && (
                <div style={{ width: '100%', aspectRatio: '2', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                  <img src={activeBlog.image} alt={activeBlog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Narrative Content */}
              <div style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '1.05rem', 
                lineHeight: 1.8, 
                whiteSpace: 'pre-line',
                fontFamily: 'Inter, sans-serif'
              }}>
                {activeBlog.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
