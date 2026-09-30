import { Router } from 'express';
import { getCachedPublicData } from '../db/dataCache.js';

const router = Router();

// GET /api/data — public viewer gets everything in one go (high-speed cached)
router.get('/', async (_req, res) => {
  try {
    const data = await getCachedPublicData();

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json(data);
  } catch (err: any) {
    console.error('Data fetch error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch public data',
      details: err.message || 'Unknown error'
    });
  }
});

export default router;
