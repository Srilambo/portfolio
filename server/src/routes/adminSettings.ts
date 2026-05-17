import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { Setting } from '../db/schema.js';

const router = Router();
router.use(requireAdmin);

// GET /api/admin/settings
router.get('/', async (_req, res) => {
  try {
    const rows = await Setting.find().lean();
    const obj = Object.fromEntries(rows.map(r => [r.key, r.value]));
    
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json(obj);
  } catch {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/admin/settings
router.put('/', async (req, res) => {
  try {
    const entries = Object.entries(req.body as Record<string, string>);
    await Promise.all(
      entries.map(([key, value]) =>
        Setting.findOneAndUpdate(
          { key },
          { key, value: String(value) },
          { upsert: true, new: true }
        )
      )
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;
