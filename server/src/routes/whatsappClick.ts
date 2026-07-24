import { Router } from 'express';
import { WhatsAppClick } from '../db/schema.js';
import { sendWhatsAppNotification } from '../services/whatsapp.js';

const router = Router();

/**
 * POST /api/whatsapp-click
 *
 * Called from the frontend when a visitor clicks any WhatsApp
 * button/logo on the portfolio. This:
 *  1. Saves the click to MongoDB (visible in admin panel)
 *  2. Pings the admin's WhatsApp with a notification
 *
 * Security: rate-limited by the global limiter. No personal data
 * from the visitor is sent — only source location + anonymous request info.
 */
router.post('/', async (req, res) => {
  const { source = 'other', page = '/' } = req.body as {
    source?: 'contact' | 'footer' | 'other';
    page?:   string;
  };

  // Basic input sanitisation
  const safeSource = ['contact', 'footer', 'other'].includes(source) ? source : 'other';
  const safePage   = String(page).slice(0, 200);

  // Anonymise IP — just keep first 2 octets (e.g. 192.168.x.x) for privacy
  const rawIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').split(',')[0].trim();
  const anonIp = rawIp.split('.').slice(0, 2).join('.') + '.x.x';

  // 1. Save click record to DB (non-fatal)
  try {
    await WhatsAppClick.create({ source: safeSource, page: safePage, ip: anonIp });
  } catch (dbErr) {
    console.error('[WhatsApp Click] DB error:', dbErr);
  }

  // 2. Send WhatsApp notification to admin (non-fatal)
  try {
    await sendWhatsAppNotification({
      name:    '📲 Visitor',
      email:   anonIp,
      subject: `WhatsApp Click — ${safeSource} section`,
      message: `Someone just clicked your WhatsApp button on the portfolio!\n\nSection: ${safeSource}\nPage: ${safePage}\nTime: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo' })} IST\n\nThey are likely opening a chat with you right now — get ready! 🚀`,
    });
  } catch (waErr) {
    console.error('[WhatsApp Click] Notification error:', waErr);
  }

  res.json({ success: true });
});

export default router;
