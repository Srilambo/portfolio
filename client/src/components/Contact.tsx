import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import { useContactForm } from '../hooks/useContactForm';

export default function Contact({ settings }: { settings: any }) {
  const [ref, isVisible] = useIntersection({ threshold: 0.1 });
  const { form, state: { loading, success, error }, handleChange, handleSubmit } = useContactForm();

  const getWhatsAppLink = (input: string) => {
    if (!input) return '#';
    if (input.startsWith('http')) return input;
    const cleaned = input.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  };

  const getPhoneLink = (input: string) => {
    if (!input) return '#';
    const cleaned = input.replace(/[^0-9+]/g, '');
    return `tel:${cleaned}`;
  };

  const getEmailLink = (input: string) => {
    if (!input) return '#';
    return `mailto:${input}`;
  };

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { 
                icon: '📧', 
                label: 'Email', 
                actionText: 'Send Mail',
                href: getEmailLink(settings?.email || 'srilambotharan@gmail.com'),
                active: true 
              },
              { 
                icon: '📞', 
                label: 'Call Me', 
                actionText: 'Phone Call',
                href: getPhoneLink(settings?.phone || ''),
                active: !!settings?.phone 
              },
              { 
                icon: '💬', 
                label: 'WhatsApp', 
                actionText: 'Chat Now',
                href: getWhatsAppLink(settings?.whatsapp || settings?.phone || ''),
                active: !!settings?.whatsapp || !!settings?.phone 
              },
            ].map((item, i) => (
              item.active && (
                <a 
                  key={i} 
                  href={item.href}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '1.75rem 1rem',
                    borderRadius: 20, 
                    background: 'var(--card-glass)', 
                    border: '1px solid var(--border-glass)', 
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-glass)';
                    e.currentTarget.style.background = 'var(--card-glass)';
                  }}
                >
                  <div style={{ 
                    width: 54, 
                    height: 54, 
                    borderRadius: '50%', 
                    background: 'var(--gradient)',
                    color: 'var(--bg)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '1.75rem',
                    marginBottom: '0.85rem',
                    boxShadow: '0 8px 16px rgba(56, 189, 248, 0.25)'
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.9rem' }}>{item.label}</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.65rem', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.actionText}</div>
                </a>
              )
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
