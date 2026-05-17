import { useRef, useCallback } from 'react';

export function useScrollAnimation() {
  const gsapRef = useRef<typeof import('gsap') | null>(null);

  const animateOnScroll = useCallback(
    async (selector: string, vars?: Record<string, unknown>) => {
      if (!gsapRef.current) {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        gsapRef.current = { gsap } as unknown as typeof import('gsap');

        gsap.fromTo(
          selector,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: selector,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            ...vars,
          }
        );
      }
    },
    []
  );

  return { animateOnScroll };
}
