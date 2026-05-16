import { useEffect, useRef } from 'react';
import { useIntersection } from '../hooks/useIntersection';
import type { Skill } from '../types';

interface Props { skill: Skill; index: number; }

export default function SkillBar({ skill, index }: Props) {
  const [ref, visible] = useIntersection(0.3);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !barRef.current) return;
    const el = barRef.current;
    el.style.transition = `width ${0.8 + index * 0.05}s cubic-bezier(0.4,0,0.2,1)`;
    el.style.width = `${skill.level}%`;
  }, [visible, skill.level, index]);

  return (
    <div ref={ref} style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{skill.icon}</span> {skill.name}
        </span>
        <span style={{ color: '#00f5ff', fontSize: '0.85rem', fontWeight: 700 }}>{skill.level}%</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        <div
          ref={barRef}
          style={{
            height: '100%', width: 0, borderRadius: 4,
            background: 'linear-gradient(90deg, #00f5ff, #7928ca)',
            boxShadow: '0 0 10px rgba(0,245,255,0.4)',
          }}
        />
      </div>
    </div>
  );
}
