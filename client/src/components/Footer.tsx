export default function Footer({ settings }: { settings: any }) {
  const year = new Date().getFullYear();
  const name = settings?.name || 'Srilambo';

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

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { name: 'Facebook', url: settings?.facebook, emoji: '📘' },
            { name: 'Instagram', url: settings?.instagram, emoji: '📸' },
            { name: 'TikTok', url: settings?.tiktok, emoji: '🎵' },
            { name: 'LinkedIn', url: settings?.linkedin, emoji: '🔗' },
            { name: 'YouTube', url: settings?.youtube, emoji: '📺' },
            { name: 'Email', url: settings?.email ? `mailto:${settings.email}` : undefined, emoji: '✉️' },
            { name: 'GitHub', url: settings?.github, emoji: '🐙' },
            { name: 'WhatsApp', url: settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : undefined, emoji: '💬' },
          ]
            .filter(s => !!s.url)
            .map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" 
                 title={s.name}
                 style={{ 
                   fontSize: '1.4rem', 
                   color: 'var(--text-secondary)', 
                   textDecoration: 'none',
                   transition: 'all 0.2s',
                   display: 'inline-block'
                 }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                {s.emoji}
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
