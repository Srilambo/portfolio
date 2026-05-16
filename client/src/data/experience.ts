import type { Experience } from '../types';

export const experiences: Experience[] = [
  {
    company: 'Stripe',
    role: 'Senior Fullstack Engineer',
    period: 'Jan 2023 – Present',
    bullets: [
      'Architected a real-time payment dashboard serving 2M+ merchants using React and WebSockets.',
      'Reduced API p99 latency by 40% by introducing Redis caching and query optimisation.',
      'Led a team of 6 engineers delivering the new merchant analytics platform on time.',
      'Implemented a CI/CD pipeline cutting deployment time from 45 min to under 8 min.',
    ],
  },
  {
    company: 'Vercel',
    role: 'Fullstack Developer',
    period: 'Mar 2021 – Dec 2022',
    bullets: [
      'Built the Edge Config UI, enabling zero-latency feature flags for 50k+ projects.',
      'Contributed to open-source Next.js, landing 12 merged PRs improving hydration performance.',
      'Collaborated with design to ship a dark-mode dashboard re-design with 97% user satisfaction.',
      'Mentored 3 junior developers through code reviews and weekly pairing sessions.',
    ],
  },
  {
    company: 'Accenture',
    role: 'Software Engineer',
    period: 'Jul 2019 – Feb 2021',
    bullets: [
      'Developed RESTful microservices in Node.js serving a Fortune 500 retail client.',
      'Migrated a legacy monolith to a Docker + Kubernetes architecture, improving uptime to 99.9%.',
      'Built automated test suites (Jest, Playwright) achieving 85% code coverage.',
      'Integrated third-party logistics APIs reducing order fulfillment errors by 30%.',
    ],
  },
];
