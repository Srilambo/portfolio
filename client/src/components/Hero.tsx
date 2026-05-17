import { motion } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';

export default function Hero({ settings }: { settings: any }) {
  const name = settings?.name || 'SriLambo';
  const bio  = settings?.bio || 'I build scalable web apps from pixel to production.';
  const role = settings?.title || settings?.role || 'Fullstack Developer';

  const stats = [
    { label: 'Experience', value: '3+' },
    { label: 'Projects', value: '220+' },
    { label: 'Clients', value: '60+' },
  ];

  return (
    <section id="hero" style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '5rem 1.5rem'
    }}>
      <ParticleCanvas />

      <div className="section-wrapper responsive-grid-3" style={{ 
        alignItems: 'center',
        zIndex: 1,
        width: '100%'
      }}>
        
        {/* Left Side: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ 
            color: 'var(--accent)', 
            fontWeight: 700, 
            fontSize: '1.1rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em' 
          }}>
            {role}
          </span>
          <h1 style={{ 
            fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', 
            fontWeight: 900, 
            margin: '1rem 0 0.25rem', 
            lineHeight: 1,
            color: 'var(--text-primary)',
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {settings?.nickname || name}
          </h1>
          {settings?.nickname && (
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              margin: '0 0 1.5rem',
              letterSpacing: '0.03em'
            }}>
              {name}
            </p>
          )}
          <div style={{ width: 80, height: 4, background: 'var(--gradient)', marginBottom: '2rem' }} />
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.1rem', 
            lineHeight: 1.8, 
            maxWidth: '500px',
            marginBottom: '3rem'
          }}>
            {bio}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ 
              background: 'var(--gradient)', 
              color: 'var(--bg)', 
              padding: '1rem 2.5rem', 
              borderRadius: 12, 
              border: 'none', 
              fontWeight: 800, 
              cursor: 'pointer' 
            }}>
              Hire Me
            </button>
            <button style={{ 
              background: 'transparent', 
              color: 'var(--text-primary)', 
              padding: '1rem 2rem', 
              borderRadius: 12, 
              border: '1px solid var(--border-glass)', 
              fontWeight: 700, 
              cursor: 'pointer' 
            }}>
              My Work
            </button>
          </div>
        </motion.div>

        {/* Center: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          <div style={{ 
            width: 'clamp(300px, 40vw, 450px)', 
            aspectRatio: '0.8', 
            background: 'var(--card-glass)', 
            borderRadius: 40,
            overflow: 'hidden',
            border: '1px solid var(--border-glass)',
            position: 'relative',
            zIndex: 2
          }}>
            <img 
              src={settings?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"} 
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {/* Back glow */}
          <div style={{ 
            position: 'absolute', 
            inset: -40, 
            background: 'var(--accent)', 
            opacity: 0.2, 
            filter: 'blur(80px)', 
            borderRadius: '50%',
            zIndex: 1
          }} />
        </motion.div>

        {/* Right Side: Stats */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-stats-wrapper"
        >
          {stats.map((s, i) => (
            <div key={i} className="hero-stat-item">
              <div style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
                fontWeight: 900, 
                color: 'var(--text-primary)',
                lineHeight: 1
              }}>
                {s.value}
              </div>
              <div style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                fontWeight: 600,
                marginTop: 8
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Social Links Bar */}
      <div style={{ 
        position: 'absolute', 
        bottom: '5rem', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        gap: '4rem',
        opacity: 0.5,
        filter: 'grayscale(1)',
        pointerEvents: 'none'
      }}>
        {['Behance', 'Dribbble', 'Upwork', 'Fiverr'].map(brand => (
          <span key={brand} style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{brand}</span>
        ))}
      </div>
    </section>
  );
}
