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

const ORIGINAL_PROJECTS = [
  {
    id: 'p1',
    title: 'NexaCommerce',
    description: 'A high-performance e-commerce platform with real-time inventory, Stripe payments, and an AI-powered product recommendation engine built with React and Node.js.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'Docker'],
    liveUrl: 'https://nexacommerce.demo',
    githubUrl: 'https://github.com/srilambo/nexacommerce',
    image: '/images/project-1.jpg',
    category: 'Fullstack'
  },
  {
    id: 'p2',
    title: 'CloudSync Dashboard',
    description: 'A real-time analytics dashboard for monitoring cloud infrastructure metrics across AWS, GCP, and Azure with customizable widgets and alerting.',
    tech: ['React', 'TypeScript', 'D3.js', 'WebSockets', 'GraphQL'],
    liveUrl: 'https://cloudsync.demo',
    githubUrl: 'https://github.com/srilambo/cloudsync',
    image: '/images/project-2.jpg',
    category: 'Frontend'
  },
  {
    id: 'p3',
    title: 'AuthForge API',
    description: 'A production-grade authentication microservice supporting OAuth2, JWT, SAML, and MFA. Built for scale with rate-limiting, audit logs, and Kubernetes deployment.',
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'K8s'],
    liveUrl: 'https://authforge.demo',
    githubUrl: 'https://github.com/srilambo/authforge',
    image: '/images/project-3.jpg',
    category: 'Backend'
  },
  {
    id: 'p4',
    title: 'Collab Board',
    description: 'A real-time collaborative whiteboard application with WebRTC video chat, infinite canvas drawing, and multiplayer cursor tracking powered by Socket.io.',
    tech: ['React', 'Socket.io', 'WebRTC', 'Canvas API', 'Node.js'],
    liveUrl: 'https://collabboard.demo',
    githubUrl: 'https://github.com/srilambo/collabboard',
    image: '/images/project-4.jpg',
    category: 'Fullstack'
  },
  {
    id: 'p5',
    title: 'DevPulse CLI',
    description: 'A developer productivity CLI tool that aggregates GitHub activity, PR reviews, and JIRA tickets into a unified terminal dashboard with AI summaries.',
    tech: ['Node.js', 'TypeScript', 'GitHub API', 'OpenAI', 'Ink'],
    liveUrl: 'https://devpulse.demo',
    githubUrl: 'https://github.com/srilambo/devpulse',
    image: '/images/project-5.jpg',
    category: 'Backend'
  }
];

const ORIGINAL_SKILLS = [
  { name: 'React', level: 95, category: 'Frontend', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' },
  { name: 'TypeScript', level: 90, category: 'Frontend', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' },
  { name: 'Three.js', level: 85, category: 'Frontend', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg' },
  { name: 'Node.js', level: 92, category: 'Backend', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg' },
  { name: 'MongoDB', level: 88, category: 'Backend', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg' },
  { name: 'Docker', level: 80, category: 'DevOps', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg' },
  { name: 'AWS', level: 75, category: 'DevOps', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' }
];

const ORIGINAL_EXPERIENCE = [
  {
    company: 'Stripe',
    role: 'Senior Fullstack Engineer',
    period: 'Jan 2023 – Present',
    bullets: [
      'Architected a real-time payment dashboard serving 2M+ merchants using React and WebSockets.',
      'Reduced API p99 latency by 40% by introducing Redis caching and query optimisation.',
      'Led a team of 6 engineers delivering the new merchant analytics platform on time.',
      'Implemented a CI/CD pipeline cutting deployment time from 45 min to under 8 min.'
    ]
  },
  {
    company: 'Vercel',
    role: 'Fullstack Developer',
    period: 'Mar 2021 – Dec 2022',
    bullets: [
      'Built the Edge Config UI, enabling zero-latency feature flags for 50k+ projects.',
      'Contributed to open-source Next.js, landing 12 merged PRs improving hydration performance.',
      'Collaborated with design to ship a dark-mode dashboard re-design with 97% user satisfaction.',
      'Mentored 3 junior developers through code reviews and weekly pairing sessions.'
    ]
  },
  {
    company: 'Accenture',
    role: 'Software Engineer',
    period: 'Jul 2019 – Feb 2021',
    bullets: [
      'Developed RESTful microservices in Node.js serving a Fortune 500 retail client.',
      'Migrated a legacy monolith to a Docker + Kubernetes architecture, improving uptime to 99.9%.',
      'Built automated test suites (Jest, Playwright) achieving 85% code coverage.',
      'Integrated third-party logistics APIs reducing order fulfillment errors by 30%.'
    ]
  }
];

const DEMO_BLOGS = [
  {
    title: 'Designing Ultra HD 4K Portfolios',
    content: 'In this article, I share my experience optimizing web canvas scaling algorithms to make user avatars, portfolio backgrounds, and work assets render at razor-sharp 4K quality with absolute smooth pixel interpolation. We discuss context image smoothing, memory limits on mobile Safari, and dynamic upscaling tricks using offscreen canvas contexts.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    date: 'May 17, 2026',
    category: 'Design'
  },
  {
    title: 'Building Premium Glassmorphic Layouts',
    content: 'A detailed walkthrough of CSS backdrop filter performance, border gradients, and interactive hover effects. Learn how to combine CSS custom variables, framer-motion micro-animations, and dynamic brand colored SVGs to create state-of-the-art landing pages that wow visitors instantly.',
    image: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&q=80&w=800',
    date: 'May 15, 2026',
    category: 'Frontend'
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
    await DataStore.findOneAndUpdate({ key: 'projects' }, { key: 'projects', value: JSON.stringify(ORIGINAL_PROJECTS) }, { upsert: true });
    await DataStore.findOneAndUpdate({ key: 'skills' }, { key: 'skills', value: JSON.stringify(ORIGINAL_SKILLS) }, { upsert: true });
    await DataStore.findOneAndUpdate({ key: 'experience' }, { key: 'experience', value: JSON.stringify(ORIGINAL_EXPERIENCE) }, { upsert: true });
    await DataStore.findOneAndUpdate({ key: 'blogs' }, { key: 'blogs', value: JSON.stringify(DEMO_BLOGS) }, { upsert: true });

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();

