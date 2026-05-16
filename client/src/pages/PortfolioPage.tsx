import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
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
    fetch(getApiUrl('/api/data'))
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050816', color: '#ef4444', textAlign: 'center' }}>
        <h2>Connection Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  const { settings = {}, projects = [], skills = [], experience = [] } = data || {};

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Services />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
