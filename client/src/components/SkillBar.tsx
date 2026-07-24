import { useEffect, useRef } from 'react';
import { useIntersection } from '../hooks/useIntersection';
import type { Skill } from '../types';

interface Props { skill: Skill; index: number; }

export default function SkillBar({ skill, index }: Props) {
  const [ref, visible] = useIntersection(0.2);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !barRef.current) return;
    const el = barRef.current;
    el.style.transition = `width ${0.8 + index * 0.05}s cubic-bezier(0.16, 1, 0.3, 1)`;
    el.style.width = `${skill.level}%`;
  }, [visible, skill.level, index]);

  return (
    <div
      ref={ref}
      style={{
        padding: '0.85rem 1.1rem',
        borderRadius: '1rem',
        background: 'rgba(15, 23, 42, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            {skill.icon.startsWith('data:image') || skill.icon.startsWith('http') || skill.icon.endsWith('.svg') || skill.icon.endsWith('.png') ? (
              <img
                src={skill.icon}
                alt={skill.name}
                style={{
                  width: 20,
                  height: 20,
                  objectFit: 'contain',
                  filter: (skill.name.toLowerCase().includes('github') || skill.name.toLowerCase().includes('vercel'))
                    ? 'brightness(0) invert(1)'
                    : 'none',
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span style={{ fontSize: '1.1rem' }}>{skill.icon}</span>
            )}
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
            {skill.name}
          </span>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
          {skill.level}%
        </span>
      </div>
      <div style={{ height: 7, background: 'rgba(255, 255, 255, 0.06)', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: 0,
            borderRadius: 999,
            background: 'var(--gradient)',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)',
          }}
        />
      </div>
    </div>
  );
}
