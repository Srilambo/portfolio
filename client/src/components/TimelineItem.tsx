import { motion } from 'framer-motion';
import type { Experience } from '../types';

interface Props {
  exp: Experience;
  index: number;
  total?: number;
}

export default function TimelineItem({ exp, index }: Props) {
  if (!exp) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass-card"
      style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1.25rem',
        padding: '1.85rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        backdropFilter: 'blur(16px)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = '0 16px 35px rgba(0, 0, 0, 0.45), 0 0 25px rgba(56, 189, 248, 0.2)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Node Dot Ring over Spine Line */}
      <div
        style={{
          position: 'absolute',
          left: '-3.75rem',
          top: '2rem',
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'var(--bg)',
          border: '3px solid var(--accent)',
          boxShadow: '0 0 12px var(--accent)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f8fafc' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {exp.logo ? (
            <img
              src={exp.logo}
              alt={exp.company}
              style={{ width: 50, height: 50, borderRadius: 14, objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.12)' }}
            />
          ) : (
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                color: 'var(--accent)',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.15)',
              }}
            >
              💼
            </div>
          )}
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.25rem', margin: 0, letterSpacing: '-0.01em' }}>
              {exp.company || 'Company'}
            </h3>
            <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem', margin: '3px 0 0' }}>
              {exp.role || 'Role'}
            </p>
          </div>
        </div>

        <span
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: 'var(--accent)',
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '0.35rem 0.95rem',
            borderRadius: 9999,
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.1)',
          }}
        >
          {exp.period || 'Present'}
        </span>
      </div>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(exp.bullets || []).map((b, i) => (
          <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.65, display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 800, marginTop: 2, fontSize: '0.9rem' }}>▹</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

