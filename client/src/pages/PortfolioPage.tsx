import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Blogs from '../components/Blogs';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import CursorGlow from '../components/CursorGlow';
import LoadingScreen from '../components/LoadingScreen';

import { getApiUrl } from '../utils/api';
import { projects as defaultProjects } from '../data/projects';
import { experiences as defaultExperience } from '../data/experience';
import { skills as defaultSkills } from '../data/skills';

export default function PortfolioPage() {
  const [data, setData] = useState<any>(() => {
    try {
      const cached = sessionStorage.getItem('portfolio_cached_data');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('portfolio_cached_data');
    } catch {
      return true;
    }
  });
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading && !data) setLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/data?t=${Date.now()}`));
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `HTTP Error: ${res.status}`);
      }
      const d = await res.json();
      setData(d);
      setError(null);
      try {
        sessionStorage.setItem('portfolio_cached_data', JSON.stringify(d));
      } catch (_) {}
    } catch (err: any) {
      if (!data) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchData(true);

    const handleUpdate = () => fetchData(false);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'portfolio_last_updated') {
        fetchData(false);
      }
    };
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchData(false);
      }
    };

    window.addEventListener('portfolio_data_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('portfolio_data_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [fetchData]);

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

  const { settings = {}, projects = [], skills = [], experience = [], blogs = [], services = [], reviews = [] } = data || {};

  const activeProjects = (Array.isArray(projects) && projects.length > 0) ? projects : (data?.projects !== undefined ? projects : defaultProjects);
  const activeSkills = (Array.isArray(skills) && skills.length > 0) ? skills : (data?.skills !== undefined ? skills : defaultSkills);
  const activeExperience = (Array.isArray(experience) && experience.length > 0) ? experience : (data?.experience !== undefined ? experience : defaultExperience);

  return (
    <>
      <LoadingScreen isApiLoading={loading} />
      
      {!loading && data && (
        <>
          <ScrollProgress />
          <CursorGlow />
          <Navbar />
          <main>
            <Hero settings={settings} />
            <About settings={settings} />
            <Services settings={settings} services={services} />
            <Skills skills={activeSkills} />
            <Projects projects={activeProjects} />
            <Experience experience={activeExperience} />
            {/* Hidden for now: Shared Experiences section */}
            {/* <Blogs blogs={blogs} /> */}
            <Reviews reviews={reviews} />
            <Contact settings={settings} />
          </main>
          <Footer settings={settings} />
        </>
      )}
    </>
  );
}
