import { useRef, useEffect, useState, useMemo } from 'react';
import type { Skill } from '../types';

// ── helpers ──────────────────────────────────────────────────────────────────
function isImageIcon(icon: string) {
  return icon.startsWith('data:image') || icon.startsWith('http') ||
    icon.endsWith('.svg') || icon.endsWith('.png') || icon.endsWith('.jpg');
}

const CAT_COLOR: Record<string, string> = {
  Frontend: '#38bdf8',
  Backend:  '#34d399',
  DevOps:   '#a78bfa',
};

// Fibonacci sphere – evenly distribute N points on a unit sphere
function fibonacciSphere(n: number) {
  const pts: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  return pts;
}

// 3-D rotation matrices
function rotateXY(x: number, y: number, z: number, ax: number, ay: number) {
  // rotate around X
  const cosX = Math.cos(ax), sinX = Math.sin(ax);
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;
  // rotate around Y
  const cosY = Math.cos(ay), sinY = Math.sin(ay);
  const x2 = x * cosY + z1 * sinY;
  const z2 = -x * sinY + z1 * cosY;
  return [x2, y1, z2] as [number, number, number];
}

// ── component ─────────────────────────────────────────────────────────────────
export default function SolarSystemSkills({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const angleRef     = useRef({ x: 0.35, y: 0 });
  const targetRef    = useRef({ x: 0.35, y: 0 });
  const rafRef       = useRef<number>(0);
  const isDragging   = useRef(false);
  const lastMouse    = useRef({ x: 0, y: 0 });

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // sphere radius in px – responsive
  const R = 210;

  // evenly-spaced sphere points
  const basePoints = useMemo(() => fibonacciSphere(skills.length), [skills.length]);

  // ── canvas: glowing globe + particles ────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let t = 0;

    const resize = () => {
      const parent = canvas.parentElement!;
      canvas.width  = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const draw = () => {
      const ctx   = canvas.getContext('2d')!;
      const W     = canvas.width;
      const H     = canvas.height;
      const cx    = W / 2;
      const cy    = H / 2;
      t += 0.012;

      ctx.clearRect(0, 0, W, H);

      // ── outer glow rings ──────────────────────────────────────────────
      for (let ring = 0; ring < 3; ring++) {
        const alpha = 0.06 - ring * 0.018;
        const rad   = R + 28 + ring * 22 + Math.sin(t + ring) * 4;
        const g = ctx.createRadialGradient(cx, cy, rad * 0.6, cx, cy, rad);
        g.addColorStop(0, `rgba(56,189,248,${alpha})`);
        g.addColorStop(1, 'rgba(56,189,248,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56,189,248,${alpha * 2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = g;
        ctx.fill();
      }

      // ── globe sphere gradient ─────────────────────────────────────────
      const globeG = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.05, cx, cy, R);
      globeG.addColorStop(0,   'rgba(56,189,248,0.07)');
      globeG.addColorStop(0.5, 'rgba(56,189,248,0.03)');
      globeG.addColorStop(1,   'rgba(10,20,40,0.45)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = globeG;
      ctx.fill();

      // globe edge ring
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56,189,248,0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── latitude / longitude grid lines (subtle) ──────────────────────
      const ax = angleRef.current.x;
      const ay = angleRef.current.y;
      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = 'rgba(56,189,248,0.08)';
      ctx.lineWidth = 1;
      const latLines = 5;
      for (let l = 0; l <= latLines; l++) {
        const lat = -Math.PI / 2 + (Math.PI / latLines) * l;
        const yr  = Math.sin(lat);
        const rr  = Math.cos(lat);
        ctx.beginPath();
        for (let a = 0; a <= 64; a++) {
          const lng = (Math.PI * 2 / 64) * a;
          const [rx, ry, rz] = rotateXY(Math.cos(lng) * rr, yr, Math.sin(lng) * rr, ax, ay);
          const depth = (rz + 1) / 2;
          if (depth < 0.5) { ctx.beginPath(); continue; }
          const sx = cx + rx * R;
          const sy = cy + ry * R;
          if (a === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // ── floating particles around sphere ─────────────────────────────
      const numP = 28;
      for (let p = 0; p < numP; p++) {
        const angle = (p / numP) * Math.PI * 2 + t * (0.3 + (p % 3) * 0.15);
        const dist  = R * (1.12 + 0.18 * Math.sin(t * 0.7 + p * 1.3));
        const tilt  = Math.sin(t * 0.4 + p * 0.8) * 0.6;
        const px    = cx + Math.cos(angle) * dist * Math.cos(tilt);
        const py    = cy + Math.sin(angle) * dist * Math.sin(tilt) * 0.5 + Math.sin(tilt) * dist * 0.4;
        const sz    = 1.5 + Math.sin(t + p) * 0.8;
        const a2    = 0.25 + Math.sin(t * 1.2 + p) * 0.15;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${a2})`;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── core glow ──────────────────────────────────────────────────────
      const coreG = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.4);
      coreG.addColorStop(0, `rgba(56,189,248,${0.06 + Math.sin(t) * 0.02})`);
      coreG.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = coreG;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  // ── auto-rotation + drag interaction ────────────────────────────────────
  useEffect(() => {
    let af: number;
    const autoSpin = () => {
      if (!isDragging.current) {
        targetRef.current.y += 0.004;
      }
      angleRef.current.x += (targetRef.current.x - angleRef.current.x) * 0.06;
      angleRef.current.y += (targetRef.current.y - angleRef.current.y) * 0.06;
      af = requestAnimationFrame(autoSpin);
      // trigger react re-render for icon positions
      setAngle({ x: angleRef.current.x, y: angleRef.current.y });
    };
    af = requestAnimationFrame(autoSpin);
    return () => cancelAnimationFrame(af);
  }, []);

  const [angle, setAngle] = useState({ x: 0.35, y: 0 });

  // ── mouse/touch drag ────────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    targetRef.current.y += dx * 0.008;
    targetRef.current.x += dy * 0.008;
    targetRef.current.x = Math.max(-1, Math.min(1.2, targetRef.current.x));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = () => { isDragging.current = false; };

  // ── project points onto screen using current rotation ───────────────────
  const projected = useMemo(() => {
    return basePoints.map(([bx, by, bz], i) => {
      const [rx, ry, rz] = rotateXY(bx, by, bz, angle.x, angle.y);
      const depth = (rz + 1) / 2; // 0 = back, 1 = front
      const scale = 0.55 + depth * 0.45;
      const sx = rx * R;
      const sy = ry * R;
      return { sx, sy, depth, scale, index: i };
    });
  }, [angle, basePoints]);

  // sort back-to-front so front icons render on top
  const sorted = useMemo(() =>
    [...projected].sort((a, b) => a.depth - b.depth),
    [projected]
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 560,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />

      {/* Sphere container – centered */}
      <div style={{ position: 'relative', width: R * 2, height: R * 2, zIndex: 1 }}>
        {sorted.map(({ sx, sy, depth, scale, index }) => {
          if (index >= skills.length) return null;
          const skill  = skills[index];
          const color  = CAT_COLOR[skill.category] || '#38bdf8';
          const isBack = depth < 0.38;
          const isFront = depth > 0.7;
          const hovered = hoveredIdx === index;
          const nodeSize = hovered ? 56 : (42 + scale * 14);

          return (
            <div
              key={skill.name}
              style={{
                position: 'absolute',
                left:  R + sx,
                top:   R + sy,
                transform: `translate(-50%, -50%) scale(${hovered ? 1.2 : scale})`,
                zIndex: Math.round(depth * 100),
                opacity: isBack ? 0.22 + depth * 0.5 : 1,
                transition: 'opacity 0.15s, transform 0.15s',
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Node bubble */}
              <div style={{
                width: nodeSize,
                height: nodeSize,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 30%, ${color}22, rgba(2,6,23,0.9))`,
                border: `${isFront || hovered ? 2 : 1}px solid ${color}${isBack ? '44' : hovered ? 'ff' : '99'}`,
                boxShadow: isBack ? 'none' : hovered
                  ? `0 0 30px ${color}cc, 0 0 60px ${color}55, inset 0 0 20px ${color}22`
                  : isFront
                    ? `0 0 16px ${color}88, 0 0 32px ${color}33, inset 0 0 10px ${color}11`
                    : `0 0 8px ${color}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                position: 'relative',
                flexDirection: 'column',
              }}>
                {isImageIcon(skill.icon) ? (
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    style={{
                      width: nodeSize * 0.52,
                      height: nodeSize * 0.52,
                      objectFit: 'contain',
                      filter: isBack ? 'grayscale(1) opacity(0.4)' : `drop-shadow(0 0 6px ${color})`,
                    }}
                  />
                ) : (
                  <span style={{
                    fontSize: nodeSize * 0.42,
                    lineHeight: 1,
                    filter: isBack ? 'grayscale(1) opacity(0.4)' : `drop-shadow(0 0 8px ${color})`,
                  }}>
                    {skill.icon || '⭐'}
                  </span>
                )}

                {/* SVG progress ring */}
                {!isBack && (
                  <svg
                    width={nodeSize + 10}
                    height={nodeSize + 10}
                    style={{ position: 'absolute', top: -5, left: -5, pointerEvents: 'none' }}
                  >
                    {/* Track */}
                    <circle
                      cx={(nodeSize + 10) / 2} cy={(nodeSize + 10) / 2}
                      r={nodeSize / 2 + 3}
                      fill="none" stroke={`${color}22`} strokeWidth="2.5"
                    />
                    {/* Progress */}
                    <circle
                      cx={(nodeSize + 10) / 2} cy={(nodeSize + 10) / 2}
                      r={nodeSize / 2 + 3}
                      fill="none"
                      stroke={color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={`${(skill.level / 100) * (Math.PI * (nodeSize + 6))} ${Math.PI * (nodeSize + 6)}`}
                      strokeDashoffset={Math.PI * (nodeSize + 6) * 0.25}
                      opacity={hovered ? 1 : 0.65}
                      style={{ transition: 'opacity 0.2s' }}
                    />
                  </svg>
                )}
              </div>

              {/* Tooltip on hover */}
              {hovered && (
                <div style={{
                  position: 'absolute',
                  bottom: '110%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(2,6,23,0.95)',
                  border: `1px solid ${color}66`,
                  borderRadius: 10,
                  padding: '6px 12px',
                  whiteSpace: 'nowrap',
                  boxShadow: `0 0 20px ${color}33`,
                  backdropFilter: 'blur(12px)',
                  zIndex: 999,
                }}>
                  <div style={{ color: color, fontWeight: 800, fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
                    {skill.name}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem', textAlign: 'center', marginTop: 2 }}>
                    {skill.category} · {skill.level}%
                  </div>
                </div>
              )}

              {/* Name tag (only for front-hemisphere items) */}
              {!isBack && !hovered && (
                <div style={{
                  marginTop: 4,
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: isFront ? color : '#94a3b8',
                    background: 'rgba(2,6,23,0.8)',
                    border: `1px solid ${color}44`,
                    borderRadius: 5,
                    padding: '2px 6px',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.03em',
                  }}>
                    {skill.name}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Center holographic core */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 64, height: 64,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, rgba(56,189,248,0.35), rgba(2,6,23,0.95))',
          border: '2px solid rgba(56,189,248,0.5)',
          boxShadow: '0 0 30px rgba(56,189,248,0.6), 0 0 80px rgba(56,189,248,0.2), inset 0 0 20px rgba(56,189,248,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          zIndex: 50,
          animation: 'coreFloat 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}>
          👨‍💻
        </div>
      </div>

      {/* Drag hint */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(148,163,184,0.5)',
        fontSize: '0.65rem',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}>
        ⟳ Drag to rotate
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes coreFloat {
          0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 30px rgba(56,189,248,0.6), 0 0 80px rgba(56,189,248,0.2); }
          50% { transform: translate(-50%, -50%) scale(1.08); box-shadow: 0 0 40px rgba(56,189,248,0.8), 0 0 100px rgba(56,189,248,0.3); }
        }
      `}} />
    </div>
  );
}
