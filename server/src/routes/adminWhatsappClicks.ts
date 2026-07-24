import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { WhatsAppClick } from '../db/schema.js';

const router = Router();
router.use(requireAdmin);

/**
 * GET /api/admin/whatsapp-clicks
 * Returns all WhatsApp button click events, newest first.
 */
router.get('/', async (_req, res) => {
  try {
    const clicks = await WhatsAppClick.find()
      .sort({ createdAt: -1 })
      .lean();

    const data = clicks.map(c => ({
      id:         c._id.toString(),
      source:     c.source,
      page:       c.page,
      ip:         c.ip,
      created_at: c.createdAt,
    }));

    res.setHeader('Cache-Control', 'no-store');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch WhatsApp click events' });
  }
});

/**
 * DELETE /api/admin/whatsapp-clicks/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await WhatsAppClick.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: 'Record not found' });
  }
});

/**
 * DELETE /api/admin/whatsapp-clicks  (clear all)
 */
router.delete('/', async (_req, res) => {
  try {
    await WhatsAppClick.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear records' });
  }
});

export default router;
