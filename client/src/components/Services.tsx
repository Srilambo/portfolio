import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';

export default function Services() {
  const [ref, isVisible] = useIntersection(0.1);

  const services = [
    { title: 'Website Design', count: '50+ Projects', icon: '🎨' },
    { title: 'Mobile Apps Design', count: '20+ Projects', icon: '📱' },
    { title: 'Brand Identity', count: '15+ Projects', icon: '💎' },
  ];

  return (
    <section id="services" ref={ref} className="section-wrapper">
      <div className="responsive-grid-2" style={{ alignItems: 'center' }}>
        
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1.5rem' }}>
            My Awesome <span className="gradient-text">Service</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 500 }}>
            I provide high-quality design and development services tailored to your business needs, ensuring a premium user experience.
          </p>
          <button style={{ 
            background: 'var(--accent)', 
            color: 'var(--bg)', 
            padding: '1rem 2rem', 
            borderRadius: 12, 
            border: 'none', 
            fontWeight: 800, 
            cursor: 'pointer' 
          }}>
            Download CV
          </button>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ 
                background: 'var(--card-glass)', 
                padding: '1.5rem 2rem', 
                borderRadius: 24, 
                border: '1px solid var(--border-glass)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--accent)';
                el.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border-glass)';
                el.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{s.title}</h4>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>{s.count}</div>
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', opacity: 0.5 }}>→</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
