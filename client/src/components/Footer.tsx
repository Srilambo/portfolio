import React from 'react';

const SOCIAL_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string; shadow: string }> = {
  Facebook: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
      </svg>
    ),
    color: '#ffffff',
    bg: '#1877F2',
    shadow: '0 8px 24px rgba(24, 119, 242, 0.45)'
  },
  Instagram: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    color: '#ffffff',
    bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    shadow: '0 8px 24px rgba(225, 48, 108, 0.45)'
  },
  TikTok: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.03 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.95-1.72-.1-.09-.17-.14-.26-.24V14.3c.02 1.88-.45 3.8-1.68 5.24-1.64 2-4.22 3.01-6.73 2.74-2.73-.25-5.26-2.07-6.11-4.73-.97-2.91-.12-6.43 2.11-8.49 1.78-1.67 4.32-2.31 6.69-1.79v4.14c-1.41-.45-3.04-.15-4.14.88-1.25 1.14-1.57 3.07-.76 4.59.8 1.54 2.62 2.45 4.33 2.22 1.52-.16 2.83-1.37 3.03-2.89.04-1.46.02-2.93.02-4.4V.02z"/>
      </svg>
    ),
    color: '#ffffff',
    bg: '#010101',
    shadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
  },
  LinkedIn: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    color: '#ffffff',
    bg: '#0A66C2',
    shadow: '0 8px 24px rgba(10, 102, 194, 0.45)'
  },
  YouTube: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    color: '#ffffff',
    bg: '#FF0000',
    shadow: '0 8px 24px rgba(255, 0, 0, 0.45)'
  },
  Email: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    color: '#ffffff',
    bg: '#0284c7',
    shadow: '0 8px 24px rgba(2, 132, 199, 0.45)'
  },
  GitHub: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    color: '#ffffff',
    bg: '#24292e',
    shadow: '0 8px 24px rgba(36, 41, 46, 0.5)'
  },
  WhatsApp: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.249 8.477 3.517 2.266 2.268 3.512 5.279 3.512 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.023-5.116-2.887-6.98C16.584 1.897 14.1 8.72 11.464 8.72c-5.439 0-9.865 4.42-9.869 9.864-.001 1.702.463 3.361 1.34 4.8l-.997 3.637 3.737-.981c1.453.79 3.097 1.208 4.772 1.21h.003zM17.43 14.1c-.29-.14-.1.71-.87.41-.16-.06-.85-.31-1.63-1-1.06-.94-1.78-2.1-1.99-2.46-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63s-.78-1.88-1.07-2.58c-.28-.68-.56-.59-.77-.6h-.66c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85s1.22 3.31 1.39 3.54c.17.23 2.4 3.66 5.82 5.14.81.35 1.45.56 1.94.72.82.26 1.56.22 2.15.13.66-.1 1.36-.55 1.55-1.08.19-.53.19-.99.13-1.08-.06-.09-.23-.15-.52-.29z"/>
      </svg>
    ),
    color: '#ffffff',
    bg: '#25D366',
    shadow: '0 8px 24px rgba(37, 211, 102, 0.45)'
  }
};

export default function Footer({ settings }: { settings: any }) {
  const year = new Date().getFullYear();
  const name = settings?.name || 'Srilambo';

  const socials = [
    { name: 'Facebook', url: settings?.facebook },
    { name: 'Instagram', url: settings?.instagram },
    { name: 'TikTok', url: settings?.tiktok },
    { name: 'LinkedIn', url: settings?.linkedin },
    { name: 'YouTube', url: settings?.youtube },
    { name: 'Email', url: settings?.email ? `mailto:${settings.email}` : undefined },
    { name: 'GitHub', url: settings?.github },
    { name: 'WhatsApp', url: settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}` : undefined },
  ].filter(s => !!s.url);

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

        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', minHeight: 60, alignItems: 'center' }}>
          {socials.map(s => {
            const data = SOCIAL_ICONS[s.name];
            return (
              <a 
                key={s.name} 
                href={s.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                title={s.name}
                style={{ 
                  width: 48,
                  height: 48,
                  color: 'var(--text-secondary)', 
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: '#0d1326',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.15) translateY(-4px)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.background = data?.bg || 'var(--accent)';
                  e.currentTarget.style.boxShadow = data?.shadow || '0 8px 20px rgba(56, 189, 248, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = '#0d1326';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {data?.icon}
              </a>
            );
          })}
        </div>

        <div style={{ borderTop: '1px solid var(--border-glass)', width: '100%', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          © {year} {name}. All rights reserved. Designed with ❤️ in 3D.
        </div>
      </div>
    </footer>
  );
}
