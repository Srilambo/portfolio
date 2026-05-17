import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'NexaCommerce',
    description:
      'A high-performance e-commerce platform with real-time inventory, Stripe payments, and an AI-powered product recommendation engine built with React and Node.js.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'Docker'],
    liveUrl: 'https://nexacommerce.demo',
    githubUrl: 'https://github.com/srilambo/nexacommerce',
    image: '/images/project-1.jpg',
    category: 'Fullstack',
  },
  {
    id: 'p2',
    title: 'CloudSync Dashboard',
    description:
      'A real-time analytics dashboard for monitoring cloud infrastructure metrics across AWS, GCP, and Azure with customizable widgets and alerting.',
    tech: ['React', 'TypeScript', 'D3.js', 'WebSockets', 'GraphQL'],
    liveUrl: 'https://cloudsync.demo',
    githubUrl: 'https://github.com/srilambo/cloudsync',
    image: '/images/project-2.jpg',
    category: 'Frontend',
  },
  {
    id: 'p3',
    title: 'AuthForge API',
    description:
      'A production-grade authentication microservice supporting OAuth2, JWT, SAML, and MFA. Built for scale with rate-limiting, audit logs, and Kubernetes deployment.',
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'K8s'],
    liveUrl: 'https://authforge.demo',
    githubUrl: 'https://github.com/srilambo/authforge',
    image: '/images/project-3.jpg',
    category: 'Backend',
  },
  {
    id: 'p4',
    title: 'Collab Board',
    description:
      'A real-time collaborative whiteboard application with WebRTC video chat, infinite canvas drawing, and multiplayer cursor tracking powered by Socket.io.',
    tech: ['React', 'Socket.io', 'WebRTC', 'Canvas API', 'Node.js'],
    liveUrl: 'https://collabboard.demo',
    githubUrl: 'https://github.com/srilambo/collabboard',
    image: '/images/project-4.jpg',
    category: 'Fullstack',
  },
  {
    id: 'p5',
    title: 'DevPulse CLI',
    description:
      'A developer productivity CLI tool that aggregates GitHub activity, PR reviews, and JIRA tickets into a unified terminal dashboard with AI summaries.',
    tech: ['Node.js', 'TypeScript', 'GitHub API', 'OpenAI', 'Ink'],
    liveUrl: 'https://devpulse.demo',
    githubUrl: 'https://github.com/srilambo/devpulse',
    image: '/images/project-5.jpg',
    category: 'Backend',
  },
];
