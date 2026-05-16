export default function Footer({ settings }: { settings: any }) {
  const year = new Date().getFullYear();
  const name = settings?.name || 'Raavanaa';

  return (
    <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '4rem 1.5rem 2rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        
        <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.1em' }}>
          <span className="gradient-text">{name.toUpperCase()}</span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }}
               onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
              {item}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[
            { icon: 'github', url: settings?.github || '#' },
            { icon: 'linkedin', url: settings?.linkedin || '#' },
            { icon: 'twitter', url: settings?.twitter || '#' },
          ].map(s => (
            <a key={s.icon} href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
              {s.icon === 'github' && '🐙'}
              {s.icon === 'linkedin' && '🔗'}
              {s.icon === 'twitter' && '🐦'}
            </a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-glass)', width: '100%', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          © {year} {name}. All rights reserved. Designed with ❤️ in 3D.
        </div>
      </div>
    </footer>
  );
}
