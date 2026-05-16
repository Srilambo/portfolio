import { useRef, useState, useCallback } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
}

export function useTilt(maxDeg = 15) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Disable on touch devices
  const isPointerFine =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches;

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isPointerFine || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
      const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1
      setTilt({
        rotateX: -dy * maxDeg,
        rotateY:  dx * maxDeg,
      });
    },
    [isPointerFine, maxDeg]
  );

  const onMouseEnter = useCallback(() => setIsHovered(true), []);

  const onMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  }, []);

  const tiltStyle: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${isHovered ? 'translateZ(20px)' : ''}`,
    transition: isHovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
    willChange: 'transform',
  };

  return { ref, tiltStyle, onMouseMove, onMouseEnter, onMouseLeave, isHovered };
}
