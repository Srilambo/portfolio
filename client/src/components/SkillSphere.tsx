import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Skill } from '../types';

const TECH_LABELS = [
  'React','Node.js','TypeScript','Three.js','PostgreSQL',
  'Docker','Redis','GraphQL','AWS','Tailwind','Next.js','Git',
];

interface SkillSphereProps {
  skills?: Skill[];
}

function SphereLabels({ labels }: { labels: string[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef}>
      {labels.map((label, i) => {
        const phi   = Math.acos(-1 + (2 * i) / labels.length);
        const theta = Math.sqrt(labels.length * Math.PI) * phi;
        const r     = 2.4;
        const x     = r * Math.sin(phi) * Math.cos(theta);
        const y     = r * Math.cos(phi);
        const z     = r * Math.sin(phi) * Math.sin(theta);

        return (
          <Text
            key={label}
            position={[x, y, z]}
            fontSize={0.22}
            color="#38bdf8"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#818cf8"
          >
            {label}
          </Text>
        );
      })}
    </group>
  );
}

export default function SkillSphere({ skills }: SkillSphereProps) {
  const labels = skills && skills.length > 0
    ? skills.map(s => s.name)
    : TECH_LABELS;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} color="#38bdf8" intensity={1} />
        <SphereLabels labels={labels} />
      </Canvas>
    </div>
  );
}
