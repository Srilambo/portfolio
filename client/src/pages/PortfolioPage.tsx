import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Blogs from '../components/Blogs';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import CursorGlow from '../components/CursorGlow';

import { getApiUrl } from '../utils/api';

export default function PortfolioPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(getApiUrl('/api/data'));
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.details || errorData.error || `HTTP Error: ${res.status}`);
        }
        const d = await res.json();
        setData(d);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050816', color: '#00f5ff' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.1em', animation: 'pulse 1.5s infinite' }}>
          LOADING PORTFOLIO...
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        height: '100vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', 
        background: '#050816', color: 'white', gap: '1rem' 
      }}>
        <h2 style={{ color: '#ef4444' }}>Connection Error</h2>
        <div style={{ 
          background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', 
          padding: '1rem', borderRadius: 8, maxWidth: '80%', 
          fontFamily: 'monospace', fontSize: '0.9rem' 
        }}>
          {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            background: 'var(--gradient)', border: 'none', 
            padding: '0.6rem 1.5rem', borderRadius: 8, 
            color: 'white', fontWeight: 700, cursor: 'pointer' 
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const { settings = {}, projects = [], skills = [], experience = [], blogs = [] } = data || {};

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Services settings={settings} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Blogs blogs={blogs} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
