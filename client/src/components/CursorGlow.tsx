import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const current = useRef({ x: -200, y: -200 });
  const animRef = useRef(0);

  useEffect(() => {
    // Only enable on pointer-fine (desktop)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      if (!glowRef.current) return;
      current.current.x += (pos.current.x - current.current.x) * 0.1;
      current.current.y += (pos.current.y - current.current.y) * 0.1;
      
      glowRef.current.style.transform =
        `translate3d(${current.current.x - 200}px, ${current.current.y - 200}px, 0)`;
      
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen',
        willChange: 'transform',
      }}
    />
  );
}
