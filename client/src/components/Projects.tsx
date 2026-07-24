import { motion, AnimatePresence } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import type { Project } from '../types';
import ProjectCard3D from './ProjectCard3D';
import { useState, useMemo } from 'react';

type CategoryFilter = 'All' | 'Frontend' | 'Backend' | 'Fullstack';

export default function Projects({ projects }: { projects: Project[] }) {
  const [ref, isVisible] = useIntersection(0.1);
  const [activeTab, setActiveTab] = useState<CategoryFilter>('All');

  const categories: CategoryFilter[] = ['All', 'Frontend', 'Backend', 'Fullstack'];

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      All: projects.length,
      Frontend: 0,
      Backend: 0,
      Fullstack: 0,
    };
    projects.forEach((p) => {
      if (p.category && counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [projects]);

  const filtered = useMemo(() => {
    return activeTab === 'All' ? projects : projects.filter((p) => p.category === activeTab);
  }, [projects, activeTab]);

  return (
    <section id="projects" ref={ref} className="section-wrapper" style={{ position: 'relative' }}>
      {/* Background Decorative Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '1rem' }}>⚡</span>
          <span
            style={{
              color: 'var(--accent)',
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            // FEATURED WORK & APPLICATIONS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-heading">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.9rem',
              borderRadius: 99,
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            Showing <strong style={{ color: '#f8fafc' }}>{filtered.length}</strong> of {projects.length} creations
          </div>
        </div>
      </motion.div>

      {/* Animated Category Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {categories.map((tab) => {
          const isActive = activeTab === tab;
          const count = categoryCounts[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                position: 'relative',
                padding: '0.55rem 1.35rem',
                borderRadius: 9999,
                border: isActive ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                  : 'rgba(15, 23, 42, 0.4)',
                color: isActive ? '#f8fafc' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25 ease',
                backdropFilter: 'blur(10px)',
                boxShadow: isActive ? '0 0 20px rgba(56, 189, 248, 0.25)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>{tab}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 99,
                  background: isActive ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#38bdf8' : 'var(--text-muted)',
                  fontWeight: 800,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid with Framer Motion Layout Animation */}
      <motion.div
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
          gap: '2.2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <ProjectCard3D project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: 20,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>No projects found</h3>
          <p style={{ fontSize: '0.9rem' }}>No projects available under the selected category: {activeTab}</p>
        </div>
      )}
    </section>
  );
}

