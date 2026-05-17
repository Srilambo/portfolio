import { useMemo } from 'react';
import type { Skill } from '../types';

export default function SolarSystemSkills({ skills }: { skills: Skill[] }) {
  
  // Calculate distinct orbits for each skill so they act like planets!
  const planets = useMemo(() => {
    return skills.map((skill, i) => {
      // Create 6 distinct planetary rings
      const orbitIndex = i % 6; 
      // Calculate radius based on orbit index (inner to outer)
      const radius = 100 + (orbitIndex * 45) + (Math.random() * 10);
      // Speed (inner planets orbit faster than outer planets)
      const speed = 15 + (orbitIndex * 8) + (Math.random() * 5); 
      // Random starting point in the orbit
      const delay = Math.random() * -100; 
      
      return { ...skill, radius, speed, delay, orbitIndex };
    });
  }, [skills]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: 700, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'hidden', 
      perspective: '1200px' // Creates the 3D depth!
    }}>
      
      {/* 3D Scene Container tilted like a galaxy disc */}
      <div style={{ 
        position: 'relative', 
        width: 0, 
        height: 0, 
        transformStyle: 'preserve-3d', 
        transform: 'rotateX(65deg)' // Tilt the entire solar system
      }}>
        
        {/* The SUN (Center) */}
        <div style={{
          position: 'absolute',
          top: -45, left: -45, width: 90, height: 90,
          background: 'radial-gradient(circle at 30% 30%, #fffde7, #ffeb3b, #f57c00)',
          borderRadius: '50%',
          boxShadow: '0 0 50px #ff9800, 0 0 120px #ff5722, inset 0 0 20px #fff',
          transform: 'rotateX(-65deg)', // Counter-rotate to face the camera perfectly
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', zIndex: 100
        }}>
          👨‍💻
        </div>

        {/* The Planets (Skills) & Orbit Rings */}
        {planets.map((planet) => (
          <div key={planet.name} style={{
            position: 'absolute',
            top: -planet.radius,
            left: -planet.radius,
            width: planet.radius * 2,
            height: planet.radius * 2,
            border: '1px solid rgba(255,255,255,0.06)', // The visible orbital ring
            borderRadius: '50%',
            transformStyle: 'preserve-3d',
            animation: `orbit-anim ${planet.speed}s linear infinite`,
            animationDelay: `${planet.delay}s`
          }}>
            
            {/* The Planet Container */}
            <div style={{
              position: 'absolute',
              top: -20, // offset by half size to center on the ring line
              left: '50%',
              marginLeft: -20,
              width: 40, height: 40,
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(56,189,248,0.25), inset 0 0 10px rgba(56,189,248,0.2)',
              // Counter-rotate the orbit Z AND the scene's X tilt!
              animation: `counter-orbit-anim ${planet.speed}s linear infinite`,
              animationDelay: `${planet.delay}s`,
              transformStyle: 'preserve-3d',
            }}>
              
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                transform: 'translateZ(20px)' // pop out slightly
              }}>
                <span style={{ fontSize: '1.4rem' }}>{planet.icon || '✨'}</span>
                
                <span style={{ 
                  position: 'absolute', top: '130%', fontSize: '0.75rem', 
                  color: '#e2e8f0', fontWeight: 700, whiteSpace: 'nowrap',
                  background: 'rgba(2, 6, 23, 0.75)', backdropFilter: 'blur(4px)',
                  padding: '4px 8px', borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {planet.name}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes orbit-anim {
          0%   { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
        @keyframes counter-orbit-anim {
          0%   { transform: rotateZ(0deg) rotateX(-65deg); }
          100% { transform: rotateZ(-360deg) rotateX(-65deg); }
        }
      `}} />
    </div>
  );
}
