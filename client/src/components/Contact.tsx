import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import { useContactForm } from '../hooks/useContactForm';

export default function Contact({ settings }: { settings: any }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });
  const { form, state: { loading, success, error }, handleChange, handleSubmit } = useContactForm();

  const info = [
    { icon: '📧', label: 'Email', value: settings?.email || 'srilambotharan@gmail.com' },
    { icon: '📞', label: 'Mobile No', value: settings?.phone || 'Not Specified' },
    { icon: '💬', label: 'WhatsApp', value: settings?.whatsapp || 'Not Specified' },
  ];

  return (
    <section id="contact" ref={ref} className="section-wrapper">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="section-heading">Get In <span className="gradient-text">Touch</span></h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Have a project in mind? Let's build something amazing together.</p>
      </div>

      <div className="contact-grid">
        {/* Info Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {info.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--card-glass)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {item.value}
                    {item.badge && <span style={{ background: '#10b981', color: '#fff', fontSize: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: 99, textTransform: 'uppercase' }}>Available</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--gradient)', borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
            <h4 style={{ color: '#050816', margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Let's talk about your project</h4>
            <p style={{ color: 'rgba(5,8,22,0.7)', fontSize: '0.9rem', marginTop: 8, fontWeight: 600 }}>I usually respond within 24 hours.</p>
            <div style={{ position: 'absolute', right: -20, bottom: -20, fontSize: '5rem', opacity: 0.1, transform: 'rotate(-15deg)' }}>💬</div>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <input type="text" name="name" placeholder="Name" className="input-glass" required value={form.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" className="input-glass" required value={form.email} onChange={handleChange} />
          </div>
          <input type="text" name="subject" placeholder="Subject" className="input-glass" required value={form.subject} onChange={handleChange} />
          <textarea name="message" placeholder="Your Message" className="input-glass" rows={5} required value={form.message} onChange={handleChange} />
          
          {success && <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '1rem', borderRadius: 8, fontWeight: 600 }}>Message sent! I'll get back to you soon.</div>}
          {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: 8, fontWeight: 600 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ 
            marginTop: '1rem', padding: '1rem', borderRadius: 12, border: 'none', 
            background: 'var(--gradient)', color: '#050816', fontWeight: 800, fontSize: '1rem', 
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s',
            opacity: loading ? 0.7 : 1
          }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? 'Sending...' : 'Send Message 🚀'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
