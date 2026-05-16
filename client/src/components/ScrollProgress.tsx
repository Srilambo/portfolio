import { useScrollProgress } from '../hooks/useScrollProgress';

export default function ScrollProgress() {
  const { progress } = useScrollProgress();

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 200,
        background: 'rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #00f5ff, #7928ca)',
          transition: 'width 0.1s linear',
          boxShadow: '0 0 10px rgba(0,245,255,0.6)',
        }}
      />
    </div>
  );
}
