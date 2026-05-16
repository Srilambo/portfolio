import { useEffect, useState } from 'react';

interface ScrollProgress {
  progress: number; // 0–100
  scrollY: number;
}

export function useScrollProgress(): ScrollProgress {
  const [data, setData] = useState<ScrollProgress>({ progress: 0, scrollY: 0 });

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.round((scrollY / total) * 100) : 0;
      setData({ progress, scrollY });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return data;
}
