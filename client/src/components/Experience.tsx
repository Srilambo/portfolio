import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import type { Experience as ExperienceType } from '../types';
import TimelineItem from './TimelineItem';

export default function Experience({ experience }: { experience: ExperienceType[] }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });

  return (
    <section id="experience" ref={ref} className="section-wrapper">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '4rem' }}
      >
        <h2 className="section-heading">Career <span className="gradient-text">Timeline</span></h2>
      </motion.div>

      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Vertical Line */}
        <div style={{ 
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, 
          background: 'linear-gradient(to bottom, var(--accent), var(--secondary), transparent)' 
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {experience.map((item, i) => (
            <TimelineItem key={i} exp={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
