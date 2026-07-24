import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import type { Experience as ExperienceType } from '../types';
import TimelineItem from './TimelineItem';

export default function Experience({ experience }: { experience: ExperienceType[] }) {
  const [ref, isVisible] = useIntersection(0.1);

  return (
    <section id="experience" ref={ref} className="section-wrapper" style={{ position: 'relative' }}>
      {/* Background Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '-5%',
          width: 380,
          height: 380,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '4rem', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '1rem' }}>💼</span>
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
            // CAREER & JOURNEY
          </span>
        </div>
        <h2 className="section-heading">
          Professional <span className="gradient-text">Experience</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1.05rem', maxWidth: 640, marginIn: 'auto' }}>
          Proven track record of architecting scalable systems, leading engineering solutions, and shipping high-impact products.
        </p>
      </motion.div>

      {/* Vertical Timeline Tree Container */}
      <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', zIndex: 1 }}>
        {/* Central Vertical Glowing Spine Line */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            bottom: 20,
            left: 24,
            width: 3,
            background: 'linear-gradient(180deg, var(--accent) 0%, #10b981 50%, rgba(56, 189, 248, 0.1) 100%)',
            borderRadius: 99,
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.3)',
            zIndex: 1,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingLeft: '4.5rem' }}>
          {experience.map((item, i) => (
            <TimelineItem key={i} exp={item} index={i} total={experience.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

