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
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '2.5rem',
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto'
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
              position: 'relative',
              minHeight: 420,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              cursor: 'pointer',
              transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
            onClick={() => setActiveBlog(blog)}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-6px) translateZ(0)';
              el.style.borderColor = 'rgba(56, 189, 248, 0.5)';
              el.style.boxShadow = '0 15px 35px rgba(56, 189, 248, 0.15)';
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
            {/* Full Background Image */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              {blog.image ? (
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #0f172a, #1e293b)' }} />
              )}
              {/* Gradient overlay so glassmorphism stands out */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0) 70%)' }} />
            </div>

            {/* Glassmorphic Content Body */}
            <div style={{ 
              position: 'relative', 
              zIndex: 1, 
              padding: '1.5rem', 
              background: 'rgba(5, 8, 22, 0.5)', 
              backdropFilter: 'blur(12px)', 
              WebkitBackdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.8rem' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.65rem',
                  borderRadius: 6,
                  textTransform: 'uppercase'
                }}>
                  {blog.category}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600 }}>{blog.date}</span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.3rem 0 0', color: '#fff', lineHeight: 1.3 }}>
                {blog.title}
              </h3>

              <p style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {blog.content}
              </p>

              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
                Read Narrative <span style={{ transition: 'transform 0.2s' }}>→</span>
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
                <div style={{ width: '100%', aspectRatio: '4/3', maxHeight: 600, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
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
