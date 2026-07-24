import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import type { Skill } from '../types';
import SolarSystemSkills from './SolarSystemSkills';
import SkillBar from './SkillBar';
import { useState } from 'react';

export default function Skills({ skills }: { skills: Skill[] }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState<'All' | 'Frontend' | 'Backend' | 'DevOps'>('All');

  const filtered = activeTab === 'All' ? skills : skills.filter(s => s.category === activeTab);

  return (
    <section id="skills" ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <div style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>
            // TECH ARCHITECTURE
          </span>
        </div>
        <h2 className="section-heading">Skills & <span className="gradient-text">Proficiency</span></h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
          Languages, frameworks, and modern developer tools I use daily.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {['All', 'Frontend', 'Backend', 'DevOps'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                padding: '0.55rem 1.35rem',
                borderRadius: 9999,
                border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isActive ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2))' : 'rgba(15, 23, 42, 0.5)',
                color: isActive ? '#f8fafc' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(8px)',
                boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="skills-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          {filtered.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} index={i} />
          ))}
          {filtered.length === 0 && <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No skills found in this category.</div>}
        </div>
        
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
          <SolarSystemSkills skills={filtered} />
        </div>
      </div>
    </section>
  );
}
