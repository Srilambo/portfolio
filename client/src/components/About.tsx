import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';

export default function About({ settings }: { settings: any }) {
  const [ref, isVisible] = useIntersection(0.1);

  // Dynamic Content with defaults
  const bio = settings?.aboutBio || settings?.bio || "I'm a Fullstack Developer who builds fast, polished web and mobile apps, from smooth interactive frontends to secure, scalable backends. I care about clean code, great UX, and shipping products that actually work in the real world.";
  const name = settings?.terminalName || settings?.name || 'Ananthkumar Srilambotharasarma';
  const role = settings?.terminalRole || settings?.title || 'Fullstack Developer';
  const location = settings?.terminalLocation || 'Global Remote';
  const stack = (settings?.terminalStack || 'React, Node.js, TypeScript, MongoDB')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);
  const status = settings?.terminalStatus || 'Building scalable web applications';
  const terminalFilename = settings?.terminalFilename || 'developer.config.ts';
  const terminalVersion = settings?.terminalVersion || 'v2.5.0';
  const heading = settings?.aboutHeading || 'Architecting High-Performance Web Applications';

  const pillars = [
    { 
      label: settings?.pillar1Title || 'Scalable Systems', 
      desc: settings?.pillar1Desc || 'Microservices, APIs & Cloud Deployments', 
      icon: settings?.pillar1Icon || '⚡' 
    },
    { 
      label: settings?.pillar2Title || 'Pixel-Perfect UI', 
      desc: settings?.pillar2Desc || 'Fluid animations & glassmorphism UX', 
      icon: settings?.pillar2Icon || '🎨' 
    },
    { 
      label: settings?.pillar3Title || 'High Performance', 
      desc: settings?.pillar3Desc || 'Sub-second page loads & optimized assets', 
      icon: settings?.pillar3Icon || '🚀' 
    },
    { 
      label: settings?.pillar4Title || 'Security & Integrity', 
      desc: settings?.pillar4Desc || 'JWT Auth, CORS, and SQL/NoSQL safety', 
      icon: settings?.pillar4Icon || '🛡️' 
    },
  ];

  return (
    <section id="about" ref={ref} className="section-wrapper" style={{ position: 'relative' }}>
      <div className="responsive-grid-2" style={{ alignItems: 'center' }}>
        
        {/* Left Side: Interactive Code Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative' }}
        >
          <div
            className="glass-card"
            style={{
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Terminal Header Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1.25rem',
                background: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#10b981' }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {terminalFilename}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>{terminalVersion}</span>
            </div>

            {/* Code Body */}
            <div style={{ padding: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.8 }}>
              <div>
                <span style={{ color: '#38bdf8' }}>const</span> <span style={{ color: '#34d399' }}>developer</span> = &#123;
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>name:</span> <span style={{ color: '#34d399' }}>'{name}'</span>,
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>role:</span> <span style={{ color: '#fbbf24' }}>'{role}'</span>,
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>location:</span> <span style={{ color: '#34d399' }}>'{location}'</span>,
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>stack:</span> [
                {stack.map((item: string, idx: number) => (
                  <span key={item}>
                    <span style={{ color: '#38bdf8' }}>'{item}'</span>
                    {idx < stack.length - 1 ? ', ' : ''}
                  </span>
                ))}
                ],
              </div>
              <div style={{ paddingLeft: '1.25rem' }}>
                <span style={{ color: '#94a3b8' }}>status:</span> <span style={{ color: '#10b981' }}>'{status}'</span>
              </div>
              <div>&#125;;</div>
            </div>
          </div>

          {/* Download CV Action Button under code terminal */}
          <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center' }}>
            {(() => {
              const hasCustomCv = !!settings?.cvUrl;
              const isDocx =
                settings?.cvFilename?.endsWith('.docx') ||
                settings?.cvFilename?.endsWith('.doc') ||
                settings?.cvUrl?.includes('word');
              const fileExt = isDocx ? 'DOCX' : 'PDF';
              const badgeColor = isDocx ? '#38bdf8' : '#ef4444';
              const badgeBg = isDocx ? 'rgba(56, 189, 248, 0.15)' : 'rgba(239, 68, 68, 0.15)';
              const badgeBorder = isDocx ? 'rgba(56, 189, 248, 0.35)' : 'rgba(239, 68, 68, 0.35)';

              const getCvDownloadFilename = () => {
                if (!settings?.cvUrl) return undefined;
                if (settings?.cvFilename) return settings.cvFilename;
                const baseName = (settings?.name || 'Srilambo').replace(/\s+/g, '_');
                const url = settings.cvUrl;
                if (url.startsWith('data:')) {
                  if (url.includes('wordprocessingml') || url.includes('officedocument') || url.includes('docx'))
                    return `${baseName}_CV.docx`;
                  if (url.includes('msword') || url.includes('doc')) return `${baseName}_CV.doc`;
                  if (url.includes('pdf')) return `${baseName}_CV.pdf`;
                  return `${baseName}_CV`;
                }
                return undefined;
              };

              const handleCvClick = (e: React.MouseEvent) => {
                if (!hasCustomCv) {
                  e.preventDefault();
                  const win = window.open('', '_blank');
                  if (!win) return;
                  const email = settings?.email || 'srilambotharan@gmail.com';
                  const phone = settings?.phone || '+94770850239';
                  const github = settings?.github || 'https://github.com/srilambo';
                  const linkedin = settings?.linkedin || 'https://linkedin.com/in/srilambo';
                  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${name} - CV Resume</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.6; max-width: 820px; margin: 0 auto; padding: 24px; }
    .header { border-bottom: 3px solid #0284c7; padding-bottom: 18px; margin-bottom: 22px; }
    h1 { margin: 0; font-size: 28px; color: #0f172a; font-weight: 800; letter-spacing: -0.02em; }
    .title { font-size: 17px; color: #0284c7; font-weight: 700; margin-top: 4px; }
    .meta { font-size: 13px; color: #475569; margin-top: 6px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #0284c7; font-weight: 800; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
    .bio { font-size: 14.5px; color: #334155; }
    .stack-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 4px 10px; font-size: 12.5px; font-weight: 600; color: #0369a1; }
    .btn-bar { margin-bottom: 24px; padding: 12px 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; }
    .print-btn { background: #0284c7; color: #fff; border: none; padding: 9px 18px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 13px; }
    @media print { .btn-bar { display: none; } }
  </style>
</head>
<body>
  <div class="btn-bar">
    <span>📄 <strong>${name} — Curriculum Vitae (PDF)</strong></span>
    <button class="print-btn" onclick="window.print()">🖨️ Save as PDF / Print</button>
  </div>
  <div class="header">
    <h1>${name}</h1>
    <div class="title">${role}</div>
    <div class="meta">${location} • ${email} • ${phone}</div>
    <div class="meta">${github} • ${linkedin}</div>
  </div>
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="bio">${bio}</div>
  </div>
  <div class="section">
    <div class="section-title">Core Technical Stack</div>
    <div class="stack-tags">
      ${stack.map((s: string) => `<span class="tag">${s}</span>`).join('')}
    </div>
  </div>
  <div class="section">
    <div class="section-title">Status & Engineering Focus</div>
    <div class="bio">${status}</div>
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 500); };
  </script>
</body>
</html>`;
                  win.document.write(html);
                  win.document.close();
                }
              };

              const downloadName = getCvDownloadFilename();

              return (
                <a
                  href={settings?.cvUrl || '#'}
                  onClick={handleCvClick}
                  download={downloadName}
                  target={settings?.cvUrl && !settings.cvUrl.startsWith('data:') ? '_blank' : undefined}
                  rel={settings?.cvUrl && !settings.cvUrl.startsWith('data:') ? 'noopener noreferrer' : undefined}
                  className="cv-download-btn"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 1.6rem',
                    borderRadius: '16px',
                    background:
                      'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.15)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* PDF / Document Sheet Badge */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: badgeBg,
                      border: `1px solid ${badgeBorder}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: `0 0 15px ${badgeBg}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        color: badgeColor,
                        letterSpacing: '0.05em',
                        lineHeight: 1,
                      }}
                    >
                      {fileExt}
                    </span>
                    <svg
                      style={{ width: 16, height: 16, color: badgeColor, marginTop: 2 }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>

                  {/* Label & Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.98rem',
                          fontWeight: 800,
                          color: '#f8fafc',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Download CV
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 99,
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {fileExt}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#94a3b8',
                        marginTop: 2,
                        fontWeight: 500,
                      }}
                    >
                      {settings?.cvFilename || 'Curriculum Vitae • Verified'}
                    </span>
                  </div>

                  {/* Download Action Arrow with Glowing Circle */}
                  <div
                    className="cv-arrow-circle"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'var(--gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#020617',
                      marginLeft: '0.5rem',
                      flexShrink: 0,
                      boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
                      transition: 'transform 0.25s ease',
                    }}
                  >
                    <svg
                      style={{ width: 17, height: 17 }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </div>
                </a>
              );
            })()}
          </div>

          {/* Background Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              inset: -20,
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: -1,
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* Right Side: Text Description & Pillars */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)' }}>
              // ABOUT ME
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.15 }}>
            {heading.includes('Web Applications') ? (
              <>
                {heading.replace('Web Applications', '')}
                <span className="gradient-text">Web Applications</span>
              </>
            ) : (
              heading
            )}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            {bio}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {pillars.map((item) => (
              <div
                key={item.label}
                className="glass-card"
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  borderRadius: '1rem',
                  background: 'rgba(15, 23, 42, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{item.icon}</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {item.label}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
