import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import type { Project } from '../types';
import ProjectCard3D from './ProjectCard3D';
import { useState } from 'react';

export default function Projects({ projects }: { projects: Project[] }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState<'All' | 'Frontend' | 'Backend' | 'Fullstack'>('All');

  const filtered = activeTab === 'All' ? projects : projects.filter(p => p.category === activeTab);

  return (
    <section id="projects" ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '3rem' }}
      >
        <h2 className="section-heading">Featured <span className="gradient-text">Projects</span></h2>
        <span style={{ fontSize: '1rem', color: 'var(--accent)', fontWeight: 800 }}>({projects.length})</span>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {['All', 'Frontend', 'Backend', 'Fullstack'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              padding: '0.5rem 1rem', borderRadius: 8,
              border: 'none', background: 'transparent',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filtered.map((project, i) => (
          <ProjectCard3D key={project.id || i} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
