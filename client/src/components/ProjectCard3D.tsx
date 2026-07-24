import { useState, useCallback } from 'react';
import { useTilt } from '../hooks/useTilt';
import type { Project } from '../types';

interface Props {
  project: Project;
}

export default function ProjectCard3D({ project }: Props) {
  const { ref, tiltStyle, onMouseMove: onTiltMove, onMouseEnter: onTiltEnter, onMouseLeave: onTiltLeave, isHovered } = useTilt(10);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onTiltMove(e);
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x, y });
  }, [onTiltMove, ref]);

  const handleMouseLeave = useCallback(() => {
    onTiltLeave();
    setCursorPos({ x: 50, y: 50 });
  }, [onTiltLeave]);

  // Category Theme Mapping
  const CATEGORY_THEMES: Record<string, { border: string; glow: string; text: string; bgGradient: string; badgeBg: string }> = {
    Fullstack: {
      border: 'rgba(56, 189, 248, 0.4)',
      glow: 'rgba(56, 189, 248, 0.25)',
      text: '#38bdf8',
      bgGradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)',
      badgeBg: 'rgba(56, 189, 248, 0.12)',
    },
    Frontend: {
      border: 'rgba(168, 85, 247, 0.4)',
      glow: 'rgba(168, 85, 247, 0.25)',
      text: '#c084fc',
      bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(56, 189, 248, 0.15) 100%)',
      badgeBg: 'rgba(168, 85, 247, 0.12)',
    },
    Backend: {
      border: 'rgba(16, 185, 129, 0.4)',
      glow: 'rgba(16, 185, 129, 0.25)',
      text: '#34d399',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
    },
  };

  const theme = CATEGORY_THEMES[project.category] || CATEGORY_THEMES.Fullstack;

  // Domain simulation for browser header bar
  const domainName = project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '') : `${project.id}.demo`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={onTiltEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...tiltStyle,
        position: 'relative',
        background: 'rgba(15, 23, 42, 0.65)',
        border: isHovered ? `1px solid ${theme.border}` : '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isHovered
          ? `0 20px 40px -15px ${theme.glow}, 0 0 25px rgba(0,0,0,0.5)`
          : '0 8px 30px rgba(0, 0, 0, 0.3)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.1s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovered
            ? `radial-gradient(400px circle at ${cursorPos.x}% ${cursorPos.y}%, ${theme.glow}, transparent 80%)`
            : 'none',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'background 0.15s ease',
        }}
      />

      {/* Browser Mockup Top Header Bar */}
      <div
        style={{
          height: 36,
          background: 'rgba(11, 15, 25, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          gap: '0.5rem',
          zIndex: 2,
        }}
      >
        {/* Window control traffic lights */}
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444', opacity: 0.8 }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#f59e0b', opacity: 0.8 }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981', opacity: 0.8 }} />
        </div>

        {/* Address bar simulation */}
        <div
          style={{
            flex: 1,
            marginLeft: '0.5rem',
            marginRight: '0.5rem',
            height: 22,
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 6,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 0.5rem',
            gap: '0.35rem',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            overflow: 'hidden',
          }}
        >
          <span style={{ color: '#10b981', fontSize: '0.65rem' }}>🔒</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            https://{domainName}
          </span>
        </div>

        {/* Live Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div
        style={{
          position: 'relative',
          height: 190,
          background: theme.bgGradient,
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 2,
        }}
      >
        {project.image && !imgError ? (
          /* Actual Project Image Preview */
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <img
              src={project.image}
              alt={project.title}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
            {/* Dark gradient contrast overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)',
              }}
            />
          </div>
        ) : (
          /* Fallback UI Mockup & Code Graphic */
          <>
            {/* Subtle grid pattern overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
                opacity: 0.7,
              }}
            />

            {/* Simulated Web Application UI Layout Preview */}
            <div
              style={{
                position: 'absolute',
                inset: 12,
                background: 'rgba(2, 6, 23, 0.75)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.85rem',
                overflow: 'hidden',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                transition: 'transform 0.4s ease, border-color 0.4s ease',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                borderColor: isHovered ? theme.border : 'rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Fake UI Header Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.text }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                    {project.title}
                  </span>
                </div>
                <span style={{ fontSize: '0.62rem', color: theme.text, fontFamily: 'var(--font-mono)', opacity: 0.9 }}>
                  v1.0
                </span>
              </div>

              {/* Code / Visual UI Representation */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', lineHeight: 1.5, color: 'rgba(248, 250, 252, 0.6)' }}>
                <div><span style={{ color: '#c084fc' }}>const</span> <span style={{ color: '#38bdf8' }}>app</span> = <span style={{ color: '#34d399' }}>buildProject</span>(&#123;</div>
                <div style={{ paddingLeft: '0.75rem' }}>category: <span style={{ color: '#fbbf24' }}>"{project.category}"</span>,</div>
                <div style={{ paddingLeft: '0.75rem' }}>tech: [<span style={{ color: '#38bdf8' }}>"{project.tech.slice(0, 3).join('", "')}"</span>]</div>
                <div>&#125;);</div>
              </div>
            </div>
          </>
        )}

        {/* Category Floating Badge */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: theme.badgeBg,
            border: `1px solid ${theme.border}`,
            color: theme.text,
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.25rem 0.65rem',
            borderRadius: 99,
            backdropFilter: 'blur(8px)',
            boxShadow: `0 4px 12px ${theme.glow}`,
            zIndex: 3,
          }}
        >
          {project.category}
        </div>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: '0.85rem',
          zIndex: 2,
          position: 'relative',
        }}
      >
        {/* Title */}
        <h3
          style={{
            color: isHovered ? theme.text : '#f8fafc',
            fontWeight: 800,
            fontSize: '1.2rem',
            margin: 0,
            letterSpacing: '-0.02em',
            transition: 'color 0.3s ease',
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
          {project.tech.map((t) => (
            <span
              key={t}
              style={{
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: 99,
                background: 'rgba(15, 23, 42, 0.6)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = theme.text;
                el.style.color = theme.text;
                el.style.background = theme.badgeBg;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                el.style.color = 'var(--text-secondary)';
                el.style.background = 'rgba(15, 23, 42, 0.6)';
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Action CTA Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.6rem' }}>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1.2,
              textAlign: 'center',
              padding: '0.65rem 0.8rem',
              background: `linear-gradient(135deg, ${theme.text}, #0284c7)`,
              color: '#020617',
              fontWeight: 800,
              fontSize: '0.82rem',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
              boxShadow: isHovered ? `0 4px 16px ${theme.glow}` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.opacity = '0.95';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.opacity = '1';
            }}
          >
            <span>Live Demo</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.65rem 0.8rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = theme.border;
              el.style.color = theme.text;
              el.style.background = 'rgba(255, 255, 255, 0.08)';
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              el.style.color = 'var(--text-primary)';
              el.style.background = 'rgba(255, 255, 255, 0.04)';
              el.style.transform = 'translateY(0)';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}

