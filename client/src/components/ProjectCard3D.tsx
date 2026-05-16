import { useTilt } from '../hooks/useTilt';
import type { Project } from '../types';

interface Props { project: Project; }

export default function ProjectCard3D({ project }: Props) {
  const { ref, tiltStyle, onMouseMove, onMouseEnter, onMouseLeave, isHovered } = useTilt(12);

  const GRADIENT_COLORS: Record<string, string> = {
    p1: 'linear-gradient(135deg,#00f5ff22,#7928ca22)',
    p2: 'linear-gradient(135deg,#7928ca22,#00f5ff22)',
    p3: 'linear-gradient(135deg,#00f5ff33,#0a0f2c)',
    p4: 'linear-gradient(135deg,#7928ca33,#0a0f2c)',
    p5: 'linear-gradient(135deg,#00f5ff22,#7928ca33)',
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        ...tiltStyle,
        background: 'rgba(255,255,255,0.05)',
        border: isHovered ? '1px solid rgba(0,245,255,0.4)' : '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(12px)',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 0 30px rgba(0,245,255,0.15), 0 20px 60px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.3)',
        transition: 'border 0.3s, box-shadow 0.3s',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Image / gradient area */}
      <div style={{ position: 'relative', height: 192, background: GRADIENT_COLORS[project.id] || GRADIENT_COLORS.p1, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', opacity: isHovered ? 0.9 : 0.6, transition: 'opacity 0.3s',
        }}>
          💻
        </div>
        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(5,8,22,0.9) 0%, transparent 60%)',
          opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s',
          display: 'flex', alignItems: 'flex-end', padding: '1rem',
        }}>
          <span style={{ color: '#00f5ff', fontSize: '0.8rem', fontWeight: 600 }}>
            {project.category}
          </span>
        </div>
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(0,245,255,0.15)', border: '1px solid rgba(0,245,255,0.3)',
          color: '#00f5ff', fontSize: '0.7rem', fontWeight: 700,
          padding: '0.2rem 0.6rem', borderRadius: 99,
        }}>
          {project.category}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
        <h3 style={{ color: '#f0f0f0', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{project.title}</h3>
        <p style={{
          color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {project.description}
        </p>

        {/* Tech pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {project.tech.slice(0, 5).map(t => (
            <span key={t} style={{
              border: '1px solid rgba(0,245,255,0.3)', color: '#00f5ff',
              fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.55rem', borderRadius: 99,
              background: 'rgba(0,245,255,0.06)',
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, textAlign: 'center', padding: '0.55rem',
              background: 'linear-gradient(135deg,#00f5ff,#7928ca)',
              color: '#050816', fontWeight: 700, fontSize: '0.8rem',
              borderRadius: 8, textDecoration: 'none', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            Live Demo ↗
          </a>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, textAlign: 'center', padding: '0.55rem',
              border: '1px solid rgba(255,255,255,0.2)', color: '#d1d5db',
              fontWeight: 600, fontSize: '0.8rem',
              borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#00f5ff'; el.style.color = '#00f5ff'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.2)'; el.style.color = '#d1d5db'; }}
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
