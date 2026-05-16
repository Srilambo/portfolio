import type { Skill } from '../types';

export const skills: Skill[] = [
  // Frontend
  { name: 'React / Next.js', level: 95, category: 'Frontend', icon: '⚛️' },
  { name: 'TypeScript', level: 90, category: 'Frontend', icon: '🔷' },
  { name: 'Three.js / WebGL', level: 75, category: 'Frontend', icon: '🎮' },
  { name: 'CSS / Tailwind', level: 88, category: 'Frontend', icon: '🎨' },

  // Backend
  { name: 'Node.js / Express', level: 92, category: 'Backend', icon: '🟢' },
  { name: 'PostgreSQL', level: 85, category: 'Backend', icon: '🐘' },
  { name: 'Redis', level: 78, category: 'Backend', icon: '🔴' },
  { name: 'GraphQL', level: 80, category: 'Backend', icon: '🔺' },

  // DevOps
  { name: 'Docker / K8s', level: 82, category: 'DevOps', icon: '🐳' },
  { name: 'AWS / GCP', level: 76, category: 'DevOps', icon: '☁️' },
  { name: 'GitHub Actions', level: 85, category: 'DevOps', icon: '⚙️' },
  { name: 'Nginx / Linux', level: 78, category: 'DevOps', icon: '🐧' },
];
