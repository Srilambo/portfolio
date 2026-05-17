import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = ['About', 'Skills', 'Projects', 'Contact'];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(2, 6, 23, 0.8)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      padding: scrolled ? '1rem 0' : '2rem 0'
    }}>
      <div className="section-wrapper" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          SRILAM<span style={{ color: 'var(--accent)' }}>BO.</span>
        </div>

        <div style={{ display: 'flex', gap: '3rem' }}>
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'color 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              {item}
            </a>
          ))}
        </div>

        <a href="#contact" style={{
          background: 'white',
          color: 'black',
          padding: '0.6rem 1.5rem',
          borderRadius: 8,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          Let's Talk
        </a>
      </div>
    </nav>
  );
}
