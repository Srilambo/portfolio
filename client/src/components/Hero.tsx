import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';

const techIcons = [
  {
    name: 'GitHub',
    glow: '#f0f6fc',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    )
  },
  {
    name: 'React',
    glow: '#00d8ff',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(30 12 12)" stroke="#00D8FF" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(90 12 12)" stroke="#00D8FF" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(150 12 12)" stroke="#00D8FF" />
        <circle cx="12" cy="12" r="2" fill="#00D8FF" />
      </svg>
    )
  },
  {
    name: 'Flutter',
    glow: '#02569B',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M14.314 0L2.3 12l3.6 3.6 15.8-15.6h-7.386zM21.7 12l-3.6-3.6L5.9 20.4l3.6 3.6L21.7 12z" fill="#02569B" />
        <path d="M18.1 8.4L14.5 12l3.6 3.6 3.6-3.6z" fill="#0175C2" />
        <path d="M18.1 15.6l-3.6-3.6-3.6 3.6 3.6 3.6z" fill="#13B9FD" />
      </svg>
    )
  },
  {
    name: 'Node.js',
    glow: '#339933',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 2a1 1 0 0 0-.5.13l-9 5.2a1 1 0 0 0-.5.87v10.4a1 1 0 0 0 .5.87l9 5.2a1 1 0 0 0 1 0l9-5.2a1 1 0 0 0 .5-.87V8.2a1 1 0 0 0-.5-.87l-9-5.2A1 1 0 0 0 12 2zm-1 3.5v5.3l-4.5 2.6V8.1zm2 0 4.5 2.6v5.3l-4.5-2.6zm-5.5 8.9 4.5-2.6 4.5 2.6v5.2l-4.5 2.6-4.5-2.6z" fill="#339933" />
      </svg>
    )
  },
  {
    name: 'TypeScript',
    glow: '#3178c6',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M0 0h24v24H0V0zm22.484 21.46c-.035-1.285-.826-2.28-2.64-2.583-.93-.153-2.02-.21-2.905-.333-.31-.044-.48-.192-.48-.426 0-.325.295-.49.886-.49.623 0 1.258.192 1.834.502.263.14.542.062.66-.2l.745-1.428c.118-.227.027-.514-.207-.648a7.086 7.086 0 0 0-3.32-.782c-2.308 0-4.086 1.135-4.086 3.513 0 2.213 1.803 3.037 4.52 3.42 1.488.213 2.19.426 2.19.98 0 .426-.395.666-1.127.666-1.026 0-1.895-.445-2.553-.948a.499.499 0 0 0-.693.076l-1.04 1.23a.507.507 0 0 0 .046.72c1.02.822 2.656 1.344 4.316 1.344 2.807 0 4.757-1.306 4.757-3.708zm-9.336-6.19a.498.498 0 0 0-.5-.5h-2.14a.499.499 0 0 0-.5.5v9.803c0 .276-.224.5-.5.5h-1.99a.5.5 0 0 0-.5-.5V15.27a.498.498 0 0 0-.5-.5h-2.14a.498.498 0 0 0-.5.5v1.272c0 .276-.224.5-.5.5h-1.99a.5.5 0 0 0-.5-.5v-3.774c0-.276.224-.5.5-.5H12.65a.5.5 0 0 0 .5.5v1.774z" fill="#3178c6" />
      </svg>
    )
  },
  {
    name: 'JavaScript',
    glow: '#f7df1e',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M0 0h24v24H0V0zm20.312 21.688c-.688-1.125-2.062-2.188-4.5-2.562-.875-.125-1.812-.188-2.625-.312-.312-.062-.438-.188-.438-.438 0-.312.25-.438.812-.438.563 0 1.125.125 1.625.375a.5.5 0 0 0 .625-.188l.625-1.125c.125-.25.062-.5-.188-.625a6.012 6.012 0 0 0-2.875-.625c-2 0-3.625 1-3.625 3.125 0 1.938 1.563 2.688 3.938 3 .125.062.25.062.375.125v.063c.875.125 1.5.25 1.5.75 0 .375-.375.563-.938.563-.875 0-1.625-.375-2.188-.813a.5.5 0 0 0-.625.063l-.875 1c-.125.188-.125.438.062.563.875.688 2.25 1.125 3.688 1.125 2.5 0 4.188-1.188 4.188-3.375zm-9.062-6.438a.5.5 0 0 0-.5-.5H8.81c-.25 0-.5.25-.5.5v9.813c0 .25-.25.5-.5.5h-1.5a.5.5 0 0 0-.5-.5V15.75c0-.25-.25-.5-.5-.5h-1.94c-.25 0-.5.25-.5.5v1.25a.5.5 0 0 0-.5.5h-1.5a.5.5 0 0 0-.5-.5v-3.75a.5.5 0 0 0 .5-.5H10.75a.5.5 0 0 0 .5.5v1.75z" fill="#f7df1e" />
      </svg>
    )
  },
  {
    name: 'Python',
    glow: '#3776ab',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M11.902 0c-2.474 0-4.636.096-5.836.31-.9.162-1.652.545-2.228 1.134a3.844 3.844 0 0 0-.962 1.835c-.328 1.168-.316 2.457-.316 4.316h3.457v-.5c0-.987.802-1.789 1.789-1.789h4.636c.987 0 1.789.802 1.789 1.789v1.236H9.721c-2.188 0-3.953 1.765-3.953 3.953v2.863H2.31c-.9 0-1.652-.384-2.228-.973C.028 14.1 0 12.81 0 10.952c0-2.474.096-4.636.31-5.836C.472 4.216.855 3.464 1.444 2.888a3.844 3.844 0 0 1 1.835-.962C4.447.599 5.736.587 7.595.587h4.307V0zm2.377 24c2.474 0 4.636-.096 5.836-.31.9-.162 1.652-.545 2.228-1.134a3.844 3.844 0 0 0 .962-1.835c.328-1.168.316-2.457.316-4.316h-3.457v.5c0 .987-.802 1.789-1.789 1.789h-4.636c-.987 0-1.789-.802-1.789-1.789v-1.236h4.721c2.188 0 3.953-1.765 3.953-3.953V8.868h3.457c.9 0 1.652.384 2.228.973.054.588.082 1.878.082 3.736 0 2.474-.096 4.636-.31 5.836-.162.9-.545 1.652-1.134 2.228a3.844 3.844 0 0 1-1.835.962c-1.168.328-2.457.316-4.316.316h-4.307V24zM8.868 3.553a.987.987 0 1 1-1.974 0 .987.987 0 0 1 1.974 0zm6.264 16.894a.987.987 0 1 1-1.974 0 .987.987 0 0 1 1.974 0z" fill="#3776ab" />
      </svg>
    )
  },
  {
    name: 'MongoDB',
    glow: '#47a248',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 0c-.394 0-.756.241-.906.604L8.196 7.64C7.039 10.418 7 13.568 7.918 16.486c.642 2.04 1.833 3.834 3.176 5.176.394.394 1.018.394 1.412 0 1.343-1.342 2.534-3.136 3.176-5.176.918-2.918.879-6.068-.278-8.846L12.906.604A.996.996 0 0 0 12 0zm.013 3.654 1.644 3.948c.84 2.016.87 4.312.215 6.42-.486 1.554-1.39 2.92-2.392 3.93-.418-.418-.946-.928-1.365-1.425.437-.437.892-.93 1.258-1.442.274-.383.274-.9-.001-1.282-.383-.526-.976-.526-1.359 0-.256.358-.57.734-.848 1.07-.15-.992-.128-1.983.1-2.96.486-2.108 1.554-3.99 2.992-5.429-.074-.53-.153-1.077-.243-1.611-.013-.075.056-.12.1-.065z" fill="#47a248" />
      </svg>
    )
  },
  {
    name: 'HTML5',
    glow: '#e34f26',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm15.4 7.6H7.8l.2 2.4h8.6l-.3 3.6-4.3 1.2-4.3-1.2-.3-2.8H5.2l.5 5.6 6.3 1.8 6.3-1.8.6-6.4V7.6z" fill="#e34f26" />
      </svg>
    )
  },
  {
    name: 'CSS3',
    glow: '#1572b6',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm15.4 5.2H5.1l.4 4.8h10.3l-.4 4.8-3.4 1-3.4-1-.2-2.4H6.2l.4 5 5.4 1.5 5.4-1.5.7-7.2V5.2z" fill="#1572b6" />
      </svg>
    )
  }
];

export default function Hero({ settings }: { settings: any }) {
  const [hoveredCard, setHoveredCard] = useState(false);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [boostSpeed, setBoostSpeed] = useState(1);
  const [clickedIcon, setClickedIcon] = useState<string | null>(null);

  useEffect(() => {
    let animId: number;
    const updateAngle = () => {
      setOrbitAngle(prev => (prev + 0.4 * boostSpeed) % 360);
      if (boostSpeed > 1) {
        setBoostSpeed(prev => Math.max(1, prev - 0.08));
      }
      animId = requestAnimationFrame(updateAngle);
    };
    animId = requestAnimationFrame(updateAngle);
    return () => cancelAnimationFrame(animId);
  }, [boostSpeed]);

  const handleMouseLeave = () => {
    setHoveredCard(false);
  };

  const name = settings?.name || 'SriLambo';
  const bio  = settings?.bio || 'I build scalable web apps from pixel to production.';
  const role = settings?.title || settings?.role || 'Fullstack Developer';

  const stats = [
    { label: 'Experience', value: '3+' },
    { label: 'Projects', value: '220+' },
    { label: 'Clients', value: '60+' },
  ];

  return (
    <section id="hero" style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '5rem 1.5rem'
    }}>
      <ParticleCanvas />

      <div className="section-wrapper responsive-grid-3" style={{ 
        alignItems: 'center',
        zIndex: 1,
        width: '100%'
      }}>
        
        {/* Left Side: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ 
            color: 'var(--accent)', 
            fontWeight: 700, 
            fontSize: '1.1rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.2em' 
          }}>
            {role}
          </span>
          <h1 style={{ 
            fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', 
            fontWeight: 900, 
            margin: '1rem 0 0.25rem', 
            lineHeight: 1,
            color: 'var(--text-primary)',
            background: 'var(--gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {settings?.nickname || name}
          </h1>
          {settings?.nickname && (
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              margin: '0 0 1.5rem',
              letterSpacing: '0.03em'
            }}>
              {name}
            </p>
          )}
          <div style={{ width: 80, height: 4, background: 'var(--gradient)', marginBottom: '2rem' }} />
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.1rem', 
            lineHeight: 1.8, 
            maxWidth: '500px',
            marginBottom: '3rem'
          }}>
            {bio}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ 
              background: 'var(--gradient)', 
              color: 'var(--bg)', 
              padding: '1rem 2.5rem', 
              borderRadius: 12, 
              border: 'none', 
              fontWeight: 800, 
              cursor: 'pointer' 
            }}>
              Hire Me
            </button>
            <button style={{ 
              background: 'transparent', 
              color: 'var(--text-primary)', 
              padding: '1rem 2rem', 
              borderRadius: 12, 
              border: '1px solid var(--border-glass)', 
              fontWeight: 700, 
              cursor: 'pointer' 
            }}>
              My Work
            </button>
          </div>
        </motion.div>

        {/* Center: Image with Orbiting Tech Stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="orbit-wrapper"
          style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          {/* 3D Parallax Profile Card Container */}
          <div 
            className="profile-3d-card-container"
            onMouseEnter={() => setHoveredCard(true)}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'relative',
              zIndex: 2,
              perspective: '1000px',
              cursor: 'default'
            }}
          >
            <div 
              style={{ 
                width: 'clamp(270px, 36vw, 410px)', 
                aspectRatio: '0.82', 
                background: 'transparent', 
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                transform: hoveredCard
                  ? 'perspective(1000px) scale(1.01)'
                  : 'perspective(1000px) scale(1)'
              }}
            >



              {/* Layer 2: Person (Cutout image with transparent bg) */}
              <img 
                src={settings?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"} 
                alt={name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 2,
                  transformOrigin: 'bottom center',
                  transform: hoveredCard
                    ? 'translateY(-15px) scale(1.12)'
                    : 'translateY(-5px) scale(1.03)',
                  transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.65))',
                  clipPath: 'polygon(-30% -50%, 130% -50%, 130% 100%, -30% 100%)'
                }}
              />



              {/* Tech Icons orbiting along the slanted 3D atomic paths */}
              <div 
                style={{
                  position: 'absolute',
                  inset: '-10%', // Fills the exact bounds of the SVGs so coordinates match 1:1!
                  pointerEvents: 'none',
                  zIndex: 4
                }}
              >
                {techIcons.map((tech, index) => {
                  const isOrbit1 = index % 2 === 0;
                  const rx = 170;
                  const ry = 62;
                  
                  let iconTheta = 0;
                  let alpha = 0;
                  
                  if (isOrbit1) {
                    const k = index / 2;
                    iconTheta = ((orbitAngle * Math.PI) / 180) + (k * 2 * Math.PI) / 5;
                    alpha = -28 * (Math.PI / 180);
                  } else {
                    const k = (index - 1) / 2;
                    iconTheta = ((orbitAngle * Math.PI) / 180) + (k * 2 * Math.PI) / 5 + Math.PI / 5.5;
                    alpha = 28 * (Math.PI / 180);
                  }
                  
                  const x = rx * Math.cos(iconTheta);
                  const y = ry * Math.sin(iconTheta);
                  
                  const xRotated = x * Math.cos(alpha) - y * Math.sin(alpha);
                  const yRotated = x * Math.sin(alpha) + y * Math.cos(alpha);
                  
                  const leftPercent = ((200 + xRotated) / 400) * 100;
                  const topPercent = ((200 + yRotated) / 400) * 100;
                  
                  const isClicked = clickedIcon === tech.name;
                  const isFront = Math.sin(iconTheta) >= 0;
                  const zIndex = isClicked ? 50 : (isFront ? 3 : 1);
                  
                  const parallaxX = 0;
                  const parallaxY = isFront ? -10 : 0;
                  
                  return (
                    <div 
                      key={tech.name}
                      className="orbit-icon-wrapper"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClickedIcon(tech.name);
                        setBoostSpeed(8);
                        setTimeout(() => setClickedIcon(null), 850);
                      }}
                      style={{
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                        zIndex,
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                        transform: isClicked
                          ? `translate(-50%, -50%) translateX(${parallaxX}px) translateY(${parallaxY}px) scale(1.65) rotate(360deg)`
                          : (hoveredCard
                              ? `translate(-50%, -50%) translateX(${parallaxX}px) translateY(${parallaxY}px) scale(${isFront ? 1.08 : 0.86})`
                              : `translate(-50%, -50%) scale(${isFront ? 1 : 0.88})`),
                        transition: isClicked 
                          ? 'all 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                          : 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                        opacity: isClicked ? 1 : (isFront ? 1 : 0.5)
                      }}
                    >
                      <div 
                        className="orbit-icon"
                        style={{ 
                          '--glow-color': `${tech.glow}99`,
                          borderColor: isClicked ? `${tech.glow}` : `${tech.glow}26`,
                          boxShadow: isClicked 
                            ? `0 0 30px ${tech.glow}, 0 0 60px ${tech.glow}aa` 
                            : `0 0 15px ${tech.glow}33`
                        } as any}
                      >
                        {tech.svg}
                        <div className="orbit-tooltip">{tech.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>


        </motion.div>

        {/* Right Side: Stats */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-stats-wrapper"
        >
          {stats.map((s, i) => (
            <div key={i} className="hero-stat-item">
              <div style={{ 
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
                fontWeight: 900, 
                color: 'var(--text-primary)',
                lineHeight: 1
              }}>
                {s.value}
              </div>
              <div style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                fontWeight: 600,
                marginTop: 8
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Social Links Bar */}
      <div style={{ 
        position: 'absolute', 
        bottom: '5rem', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        gap: '4rem',
        opacity: 0.5,
        filter: 'grayscale(1)',
        pointerEvents: 'none'
      }}>
        {['Behance', 'Dribbble', 'Upwork', 'Fiverr'].map(brand => (
          <span key={brand} style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{brand}</span>
        ))}
      </div>
    </section>
  );
}
