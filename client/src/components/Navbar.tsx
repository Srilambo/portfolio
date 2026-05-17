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
    <>
      {/* Top Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(2, 6, 23, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        padding: scrolled ? '1rem 0' : '1.5rem 0'
      }}>
        <div className="section-wrapper" style={{ padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Logo */}
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            SRILAM<span style={{ color: 'var(--accent)' }}>BO.</span>
          </div>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'none' }}>
            {navItems.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                color: 'var(--text-secondary)', textDecoration: 'none',
                fontSize: '0.95rem', fontWeight: 600, transition: 'color 0.2s'
              }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                 onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                {item}
              </a>
            ))}
            <a href="#contact" style={{
              background: 'white', color: 'black', padding: '0.6rem 1.5rem',
              borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem'
            }}>
              Let's Talk
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Bottom Nav */}
      <div className="mobile-floating-nav" style={{
        position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px',
        padding: '0.5rem 1.5rem', display: 'flex', gap: '1.5rem', zIndex: 1000,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(56, 189, 248, 0.15)',
        alignItems: 'center', justifyContent: 'center', width: 'max-content'
      }}>
        {navItems.map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} style={{
            color: 'var(--text-primary)', textDecoration: 'none',
            fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.2rem',
            letterSpacing: '0.02em', opacity: 0.8
          }}>
            {item}
          </a>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; gap: 3rem; alignItems: center; }
          .mobile-floating-nav { display: none !important; }
        }
      `}} />
    </>
  );
}
