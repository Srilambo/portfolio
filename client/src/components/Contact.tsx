import { motion } from 'framer-motion';
import { useIntersection } from '../hooks/useIntersection';
import { useContactForm } from '../hooks/useContactForm';
import { getApiUrl } from '../utils/api';

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

  // Silently notify admin when visitor clicks the WhatsApp button
  const pingWhatsAppClick = (source: 'contact' | 'footer') => {
    fetch(getApiUrl('/api/whatsapp-click'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, page: window.location.pathname }),
    }).catch(() => {}); // fire-and-forget, never blocks the user
  };

  return (
    <section id="contact" ref={ref} className="section-wrapper" style={{ position: 'relative' }}>
      {/* Background Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '-5%',
          width: 380,
          height: 380,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '1rem' }}>📬</span>
          <span
            style={{
              color: 'var(--accent)',
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-mono)',
            }}
          >
            // LET'S CONNECT
          </span>
        </div>
        <h2 className="section-heading">
          Get In <span className="gradient-text">Touch</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1.05rem', maxWidth: 620, marginIn: 'auto' }}>
          Have a project idea, opportunity, or technical inquiry? Let's connect and build something extraordinary together.
        </p>

        {/* Quick Status Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontSize: '0.78rem', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: 99, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            Open for New Opportunities
          </span>
          <span style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: 99 }}>
            📍 Remote / Worldwide
          </span>
          <span style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '0.78rem', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: 99 }}>
            ⚡ Response Time &lt; 24 Hrs
          </span>
        </div>
      </div>

      <div className="contact-grid" style={{ position: 'relative', zIndex: 1 }}>
        {/* Info Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              {
                icon: '📧',
                label: 'Email',
                actionText: 'Send Mail',
                href: getEmailLink(settings?.email || 'srilambotharan@gmail.com'),
                active: true,
                onClick: undefined,
              },
              {
                icon: '📞',
                label: 'Call Me',
                actionText: 'Phone Call',
                href: getPhoneLink(settings?.phone || ''),
                active: !!settings?.phone,
                onClick: undefined,
              },
              {
                icon: '💬',
                label: 'WhatsApp',
                actionText: 'Chat Now',
                href: getWhatsAppLink(settings?.whatsapp || settings?.phone || ''),
                active: !!settings?.whatsapp || !!settings?.phone,
                onClick: () => pingWhatsAppClick('contact'),
              },
            ].map(
              (item, i) =>
                item.active && (
                  <a
                    key={i}
                    href={item.href}
                    target={item.onClick ? '_blank' : undefined}
                    rel={item.onClick ? 'noopener noreferrer' : undefined}
                    onClick={item.onClick}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justify: 'center',
                      padding: '1.85rem 1rem',
                      borderRadius: 22,
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(16px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.35), 0 0 20px rgba(56, 189, 248, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 50%, #10b981 100%)',
                        color: '#020617',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        marginBottom: '0.85rem',
                        boxShadow: '0 8px 20px rgba(56, 189, 248, 0.25)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.95rem' }}>{item.label}</div>
                    <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.68rem', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.actionText}
                    </div>
                  </a>
                )
            )}
          </div>

          {/* Banner */}
          <div
            style={{
              marginTop: '3.5rem',
              padding: '2.25rem',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: 24,
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(16px)',
            }}
          >
            <h4 style={{ color: '#f8fafc', margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>
              Let's talk about your next project
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: 8, fontWeight: 500, lineHeight: 1.6 }}>
              Whether you need fullstack engineering, architecture design, or custom consulting — I'm here to help turn vision into software.
            </p>
            <div style={{ position: 'absolute', right: -15, bottom: -15, fontSize: '5.5rem', opacity: 0.08, transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
              💬
            </div>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 24,
            padding: '2.25rem',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Send a Direct Message 🚀
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Name</label>
              <input type="text" name="name" placeholder="John Doe" className="input-glass" required value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Email</label>
              <input type="email" name="email" placeholder="john@example.com" className="input-glass" required value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</label>
            <input type="text" name="subject" placeholder="Project Inquiry / Opportunity" className="input-glass" required value={form.subject} onChange={handleChange} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</label>
            <textarea name="message" placeholder="Hi Srilambo, I'd like to discuss a project..." className="input-glass" rows={5} required value={form.message} onChange={handleChange} />
          </div>

          {success && (
            <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '1rem', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem' }}>
              Message sent successfully! I will review your inquiry and get back to you shortly.
            </div>
          )}
          {error && (
            <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '1rem', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '1.05rem',
              borderRadius: 12,
              border: 'none',
              background: 'var(--gradient)',
              color: '#050816',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 8px 20px rgba(56, 189, 248, 0.25)',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? 'Sending Message...' : 'Send Message 🚀'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

