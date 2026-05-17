import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';

export default function About({ settings }: { settings: any }) {
  const [ref, isVisible] = useIntersection(0.1);
  const bio = settings?.bio || 'I build scalable web apps from pixel to production.';

  return (
    <section id="about" ref={ref} className="section-wrapper">
      <div className="responsive-grid-2" style={{ alignItems: 'center' }}>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ 
            width: 'clamp(280px, 35vw, 400px)', 
            aspectRatio: '1', 
            background: 'var(--gradient)', 
            borderRadius: 32,
            padding: 4,
            transform: 'rotate(-3deg)'
          }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: 28, 
              background: 'var(--bg)', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(3deg)'
            }}>
              <img 
                src={settings?.avatarUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"} 
                alt="About"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
          {/* Decorative background glow */}
          <div style={{ 
            position: 'absolute', 
            inset: -30, 
            background: 'var(--accent)', 
            opacity: 0.1, 
            filter: 'blur(60px)', 
            borderRadius: '50%',
            zIndex: -1 
          }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1.5rem' }}>
            Transforming Ideas into <span className="gradient-text">Reality</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            {bio}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {[
              { label: 'High Quality', icon: '✨' },
              { label: 'Fast Delivery', icon: '🚀' },
              { label: 'Modern Tech', icon: '🛡️' },
              { label: '24/7 Support', icon: '🎧' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
