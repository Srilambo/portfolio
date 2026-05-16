import { Router } from 'express';
import { Setting } from '../db/schema.js';

const router = Router();

// GET /api/settings — public viewer
router.get('/', async (_req, res) => {
  try {
    const rows = await Setting.find().lean();
    const obj = Object.fromEntries(rows.map(r => [r.key, r.value]));
    res.json(obj);
  } catch {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

export default router;
