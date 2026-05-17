import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* Mobile Floating Action Button & Menu */}
      <div className="mobile-floating-nav" style={{
        position: 'fixed', bottom: '2rem', right: '1.5rem', zIndex: 1000,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem'
      }}>
        {/* The Menu Items (Hidden when closed) */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '0.8rem',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transform: menuOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          transformOrigin: 'bottom right',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '1.2rem',
          padding: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{
              color: 'var(--text-primary)', textDecoration: 'none',
              fontSize: '1.1rem', fontWeight: 600, textAlign: 'right'
            }}>
              {item}
            </a>
          ))}
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
          <a href="#contact" onClick={() => setMenuOpen(false)} style={{
            color: 'var(--accent)', textDecoration: 'none',
            fontSize: '1.1rem', fontWeight: 700, textAlign: 'right'
          }}>
            Hire Me
          </a>
        </div>

        {/* The Toggle Button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'var(--gradient)', border: 'none',
            color: 'var(--bg)', fontSize: '1.5rem', display: 'flex', 
            justifyContent: 'center', alignItems: 'center',
            cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(56, 189, 248, 0.3)',
            transition: 'transform 0.3s ease',
            transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
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
