import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { Message } from '../db/schema.js';

const router = Router();
router.use(requireAdmin);

// GET /api/admin/messages
router.get('/', async (_req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    // Normalize _id → id for frontend compatibility
    const data = messages.map(m => ({ ...m, id: m._id.toString(), created_at: m.createdAt }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PUT /api/admin/messages/:id
router.put('/:id', async (req, res) => {
  const { status } = req.body as { status: string };
  const valid = ['new', 'read', 'replied'];
  if (!valid.includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }
  try {
    await Message.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: 'Message not found' });
  }
});

// DELETE /api/admin/messages/:id
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: 'Message not found' });
  }
});

export default router;
