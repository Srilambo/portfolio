import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';

export default function About({ settings }: { settings: any }) {
  const [ref, isVisible] = useIntersection(0.1);
  const bio = settings?.bio || 'I build scalable web apps from pixel to production with modern frameworks and robust backend architecture.';
  const name = settings?.name || 'SriLambo';

  const pillars = [
    { label: 'Scalable Systems', desc: 'Microservices, APIs & Cloud Deployments', icon: '⚡' },
    { label: 'Pixel-Perfect UI', desc: 'Fluid animations & glassmorphism UX', icon: '🎨' },
    { label: 'High Performance', desc: 'Sub-second page loads & optimized assets', icon: '🚀' },
    { label: 'Security & Integrity', desc: 'JWT Auth, CORS, and SQL/NoSQL safety', icon: '🛡️' },
  ];

  return (
    <section id="about" ref={ref} className="section-wrapper" style={{ position: 'relative' }}>
      <div className="responsive-grid-2" style={{ alignItems: 'center' }}>
        
        {/* Left Side: Photo + Interactive Code Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative' }}
        >
          <div
            className="glass-card"
            style={{
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Terminal Header Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.25rem',
                background: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                developer.config.ts
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>v2.5.0</span>
            </div>

            {/* Code Body */}
            <div style={{ padding: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.8 }}>
              <div>
                <span style={{ color: '#38bdf8' }}>const</span> <span style={{ color: '#34d399' }}>developer</span> = &#123;
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>name:</span> <span style={{ color: '#34d399' }}>'{name}'</span>,
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>role:</span> <span style={{ color: '#fbbf24' }}>'{settings?.title || 'Fullstack Engineer'}'</span>,
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>location:</span> <span style={{ color: '#34d399' }}>'{settings?.location || 'Global Remote'}'</span>,
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>stack:</span> [<span style={{ color: '#38bdf8' }}>'React'</span>, <span style={{ color: '#38bdf8' }}>'Node.js'</span>, <span style={{ color: '#38bdf8' }}>'TypeScript'</span>, <span style={{ color: '#38bdf8' }}>'MongoDB'</span>],
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>status:</span> <span style={{ color: '#10b981' }}>'Building scalable web applications'</span>
              </div>
              <div>&#125;;</div>
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              inset: -20,
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: -1,
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* Right Side: Text Description & Pillars */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>
              // ABOUT ME
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.15 }}>
            Architecting High-Performance <span className="gradient-text">Web Applications</span>
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            {bio}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {pillars.map((item) => (
              <div
                key={item.label}
                className="glass-card"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  borderRadius: '1rem',
                  background: 'rgba(15, 23, 42, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{item.icon}</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {item.label}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
