import { useEffect, useRef, useState } from 'react';

export function useIntersection(
  options: number | { threshold?: number; once?: boolean } = 0.2,
  onceArg = true
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const threshold = typeof options === 'number' ? options : options.threshold ?? 0.2;
  const once = typeof options === 'number' ? onceArg : options.once ?? true;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, visible];
}
