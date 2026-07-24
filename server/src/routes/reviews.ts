import { Router } from 'express';
import { z } from 'zod';
import { Review } from '../db/schema.js';
import { sendWhatsAppNotification } from '../services/whatsapp.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many reviews submitted. Please wait 15 minutes.' },
});

const ReviewSubmitSchema = z.object({
  name:    z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email:   z.string().email('Invalid email address'),
  rating:  z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(1, 'Comment is required').max(1000, 'Comment is too long'),
});

// POST /api/reviews - Public review submission
router.post('/', reviewLimiter, async (req, res) => {
  const result = ReviewSubmitSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Validation failed', issues: result.error.issues });
    return;
  }

  const { name, email, rating, comment } = result.data;

  try {
    await Review.create({ name, email, rating, comment, approved: false });
    res.json({ success: true, message: 'Review submitted successfully. It will display once approved.' });
  } catch (err: any) {
    console.error('Failed to save review:', err);
    res.status(500).json({ error: 'Failed to submit review.' });
    return;
  }

  // Notify admin via WhatsApp (non-fatal)
  try {
    const stars = '⭐'.repeat(rating);
    await sendWhatsAppNotification({
      name,
      email,
      subject: `New ${rating}-Star Review — Pending Approval`,
      message: `${stars}\n\n"${comment}"\n\n— ${name} (${email})\n\nGo to your admin panel to approve or reject it.`,
    });
  } catch (waErr) {
    console.error('[WhatsApp] Review notification error:', waErr);
  }
});


// GET /api/reviews - Get approved reviews only
router.get('/', async (_req, res) => {
  try {
    const approvedReviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).lean();
    res.json(approvedReviews);
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

export default router;
