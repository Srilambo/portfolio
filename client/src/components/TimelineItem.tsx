import { motion } from 'framer-motion';
import type { Experience } from '../types';

interface Props { exp: Experience; index: number; }

export default function TimelineItem({ exp, index }: Props) {
  const isLeft = index % 2 === 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 1fr', gap: '0 1rem', alignItems: 'start', marginBottom: '3rem' }}>
      {/* Left content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 0 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        style={{ gridColumn: isLeft ? '1' : '3' }}
      >
        {isLeft && <ExpCard exp={exp} />}
      </motion.div>

      {/* Center dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24 }}>
        <div style={{ position: 'relative', width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg,#00f5ff,#7928ca)', boxShadow: '0 0 12px rgba(0,245,255,0.6)', zIndex: 1 }}>
          <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2px solid rgba(0,245,255,0.3)', animation: 'pulse-ring 2s ease-out infinite' }} />
        </div>
      </div>

      {/* Right content */}
      <motion.div
        initial={{ opacity: 0, x: !isLeft ? 50 : 0 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        style={{ gridColumn: !isLeft ? '3' : '1' }}
      >
        {!isLeft && <ExpCard exp={exp} />}
      </motion.div>
    </div>
  );
}

function ExpCard({ exp }: { exp: Experience }) {
  if (!exp) return null;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(12px)', borderRadius: 12, padding: '1.5rem',
      transition: 'transform 0.3s, box-shadow 0.3s',
    }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 0 24px rgba(0,245,255,0.12)'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {exp.logo && (
            <img 
              src={exp.logo} 
              alt={exp.company} 
              style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }} 
            />
          )}
          <div>
            <h3 style={{ color: '#f0f0f0', fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>{exp.company || 'Company'}</h3>
            <p style={{ color: '#00f5ff', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{exp.role || 'Role'}</p>
          </div>
        </div>
        <span style={{
          background: 'rgba(121,40,202,0.2)', border: '1px solid rgba(121,40,202,0.4)',
          color: '#c084fc', fontSize: '0.75rem', fontWeight: 600,
          padding: '0.2rem 0.75rem', borderRadius: 99, whiteSpace: 'nowrap',
        }}>
          {exp.period || 'Present'}
        </span>
      </div>
      <ul style={{ margin: 0, padding: '0 0 0 1.2rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(exp.bullets || []).map((b, i) => (
          <li key={i} style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
