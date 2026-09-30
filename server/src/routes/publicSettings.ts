import { Router } from 'express';
import { getCachedSettings } from '../db/dataCache.js';

const router = Router();

// GET /api/settings — public viewer
router.get('/', async (_req, res) => {
  try {
    const obj = await getCachedSettings();
    res.json(obj);
  } catch {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

export default router;
