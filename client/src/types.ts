export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
  category: 'Frontend' | 'Backend' | 'Fullstack';
}

export interface Skill {
  name: string;
  level: number;
  category: 'Frontend' | 'Backend' | 'DevOps';
  icon: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  logo?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export interface Blog {
  title: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

export interface Review {
  id?: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  approved?: boolean;
  createdAt?: string;
}

