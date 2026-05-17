import mongoose from 'mongoose';
import 'dotenv/config';
import { Setting, DataStore } from './schema.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

const DEMO_SETTINGS = [
  { key: 'name', value: 'Ananthkumar Srilambotharasarma' },
  { key: 'role', value: 'Fullstack Developer & 3D Web Enthusiast' },
  { key: 'bio', value: 'I specialize in building high-performance, visually stunning web applications. From interactive 3D interfaces to robust backend architectures, I turn complex ideas into seamless digital experiences.' },
  { key: 'avatarUrl', value: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
  { key: 'phone', value: '' },
  { key: 'whatsapp', value: '' },
  { key: 'email', value: 'srilambotharan@gmail.com' },
  { key: 'facebook', value: '' },
  { key: 'instagram', value: '' },
  { key: 'tiktok', value: '' },
  { key: 'linkedin', value: 'https://linkedin.com/in/srilambo' },
  { key: 'youtube', value: '' },
  { key: 'github', value: 'https://github.com/srilambo' },
  { key: 'metaTitle', value: 'Srilambo | Fullstack Developer Portfolio' },
  { key: 'metaDescription', value: 'React, Node.js, Three.js. Building scalable web apps from pixel to production.' },
];

const DEMO_PROJECTS = [
  {
    id: '1',
    title: 'AI Analytics Dashboard',
    description: 'A real-time data visualization platform with AI-powered insights and predictive modeling.',
    tech: ['React', 'Node.js', 'Python', 'D3.js'],
    liveUrl: '#',
    githubUrl: '#',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    category: 'Fullstack'
  },
  {
    id: '2',
    title: '3D Product Configurator',
    description: 'An interactive 3D commerce experience allowing users to customize products in real-time.',
    tech: ['Three.js', 'React Three Fiber', 'WebGL'],
    liveUrl: '#',
    githubUrl: '#',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    category: 'Frontend'
  },
  {
    id: '3',
    title: 'Secure Fintech API',
    description: 'A high-throughput payment gateway API with multi-layered encryption and fraud detection.',
    tech: ['Node.js', 'MongoDB', 'Redis', 'Docker'],
    liveUrl: '#',
    githubUrl: '#',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    category: 'Backend'
  }
];

const DEMO_SKILLS = [
  { name: 'React', level: 95, category: 'Frontend', icon: '⚛️' },
  { name: 'TypeScript', level: 90, category: 'Frontend', icon: '🟦' },
  { name: 'Three.js', level: 85, category: 'Frontend', icon: '📐' },
  { name: 'Node.js', level: 92, category: 'Backend', icon: '🟢' },
  { name: 'MongoDB', level: 88, category: 'Backend', icon: '🍃' },
  { name: 'Docker', level: 80, category: 'DevOps', icon: '🐳' },
  { name: 'AWS', level: 75, category: 'DevOps', icon: '☁️' }
];

const DEMO_EXPERIENCE = [
  {
    company: 'Tech Innovations Inc.',
    role: 'Senior Fullstack Developer',
    period: '2021 — Present',
    bullets: [
      'Led the transition from monolithic to microservices architecture.',
      'Reduced average page load time by 40% through advanced caching strategies.',
      'Mentored a team of 5 junior developers and established CI/CD best practices.'
    ]
  },
  {
    company: 'Digital Solutions Agency',
    role: 'Web Developer',
    period: '2019 — 2021',
    bullets: [
      'Developed 20+ responsive web applications for global clients.',
      'Integrated complex third-party APIs and payment gateways.',
      'Optimized database queries leading to a 30% performance boost.'
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🌱 Seeding database...');

    // Settings
    for (const s of DEMO_SETTINGS) {
      await Setting.findOneAndUpdate({ key: s.key }, s, { upsert: true });
    }

    // DataStore
    await DataStore.findOneAndUpdate({ key: 'projects' }, { key: 'projects', value: JSON.stringify(DEMO_PROJECTS) }, { upsert: true });
    await DataStore.findOneAndUpdate({ key: 'skills' }, { key: 'skills', value: JSON.stringify(DEMO_SKILLS) }, { upsert: true });
    await DataStore.findOneAndUpdate({ key: 'experience' }, { key: 'experience', value: JSON.stringify(DEMO_EXPERIENCE) }, { upsert: true });

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
