import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';

export default function Services({ settings, services = [] }: { settings: any; services?: any[] }) {
  const [ref, isVisible] = useIntersection(0.1);

  const defaultServices = [
    { title: 'Fullstack Web Development', count: 'React, Node.js, Express & MongoDB / SQL', icon: '💻' },
    { title: 'API & Backend Engineering', count: 'RESTful APIs, Authentication & Microservices', icon: '⚙️' },
    { title: 'UI/UX & Frontend Architecture', count: 'Responsive Design, Animations & Performance', icon: '🎨' },
    { title: 'Cloud & DevOps Deployment', count: 'Vercel, AWS, Docker & CI/CD Pipelines', icon: '☁️' },
  ];

  const list = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" ref={ref} className="section-wrapper" style={{ position: 'relative' }}>
      <div className="responsive-grid-2" style={{ alignItems: 'center' }}>
        
        {/* Left Side Info & CV Button */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>
              // SERVICES & SOLUTIONS
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.15 }}>
            Specialized Tech <span className="gradient-text">Services</span>
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.25rem', maxWidth: 500 }}>
            I offer end-to-end web engineering, clean architecture, and modern UX design to elevate your business and digital products.
          </p>
          
          {settings?.cvUrl ? (
            <a 
              href={settings.cvUrl} 
              download={settings.cvUrl.startsWith('data:') ? `${settings.name || 'Srilambo'}_CV.pdf` : undefined}
              target={settings.cvUrl.startsWith('data:') ? undefined : '_blank'}
              rel={settings.cvUrl.startsWith('data:') ? undefined : 'noopener noreferrer'}
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              <button
                style={{ 
                  background: 'var(--gradient)', 
                  color: '#020617', 
                  padding: '0.95rem 2rem', 
                  borderRadius: '9999px', 
                  border: 'none', 
                  fontWeight: 800, 
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(56, 189, 248, 0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(56, 189, 248, 0.4)';
                }}
              >
                <span>Download CV</span>
                <span>📄</span>
              </button>
            </a>
          ) : (
            <button 
              onClick={() => alert("CV will be uploaded soon by the admin!")}
              style={{ 
                background: 'var(--gradient)', 
                color: '#020617', 
                padding: '0.95rem 2rem', 
                borderRadius: '9999px', 
                border: 'none', 
                fontWeight: 800, 
                fontSize: '0.95rem',
                cursor: 'pointer',
                opacity: 0.9,
                boxShadow: '0 8px 25px rgba(56, 189, 248, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <span>Download CV</span>
              <span>📄</span>
            </button>
          )}
        </motion.div>

        {/* Right Side Service Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {list.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card"
              style={{ 
                padding: '1.25rem 1.75rem', 
                borderRadius: '1.25rem', 
                background: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                el.style.transform = 'translateX(8px)';
                el.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.2)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                el.style.transform = 'translateX(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{s.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>{s.count}</div>
                </div>
              </div>
              <a
                href="#contact"
                aria-label={`Get details on ${s.title}`}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                →
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
