import { Router } from 'express';
import { z } from 'zod';
import { Message } from '../db/schema.js';
import { sendContactEmail } from '../services/mailer.js';
import { sendWhatsAppNotification } from '../services/whatsapp.js';

const router = Router();

const ContactSchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

// POST /api/contact
router.post('/', async (req, res) => {
  const result = ContactSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Validation failed', issues: result.error.issues });
    return;
  }

  const { name, email, subject, message } = result.data;

  // Save to MongoDB
  try {
    await Message.create({ name, email, subject, message });
  } catch (dbErr) {
    console.error('DB insert error:', dbErr);
  }

  // Send email notification to admin (non-fatal)
  try {
    await sendContactEmail({ name, email, subject, message });
  } catch (mailErr) {
    console.error('Mail error:', mailErr);
  }

  // Send WhatsApp notification to admin (non-fatal — never breaks the form)
  try {
    await sendWhatsAppNotification({ name, email, subject, message });
  } catch (waErr) {
    console.error('WhatsApp notification error:', waErr);
  }

  res.json({ success: true, message: 'Message sent successfully' });
});

export default router;
