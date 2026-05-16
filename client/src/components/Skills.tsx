import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import type { Skill } from '../types';
import SkillBar from './SkillBar';
import SkillSphere from './SkillSphere';
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
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <h2 className="section-heading">My <span className="gradient-text">Skills</span></h2>
        <div style={{ width: 60, h: 4, background: 'var(--gradient)', margin: '1rem auto' }} />
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {['All', 'Frontend', 'Backend', 'DevOps'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '0.6rem 1.5rem', borderRadius: 99,
              border: activeTab === tab ? '1px solid var(--accent)' : '1px solid var(--border-glass)',
              background: activeTab === tab ? 'rgba(0,245,255,0.1)' : 'transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', lg: '1fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} index={i} />
          ))}
          {filtered.length === 0 && <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No skills found in this category.</div>}
        </div>
        
        <div style={{ position: 'relative', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SkillSphere skills={skills.slice(0, 15)} />
        </div>
      </div>
    </section>
  );
}
