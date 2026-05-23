import { Router } from 'express';
import { Setting, DataStore, Review } from '../db/schema.js';
import { connectDB } from '../db/db.js';

const router = Router();

async function getData(key: string): Promise<unknown> {
  await connectDB();
  const doc = await DataStore.findOne({ key }).lean();
  return doc ? JSON.parse(doc.value) : null;
}

// GET /api/data — public viewer gets everything in one go
router.get('/', async (_req, res) => {
  try {
    await connectDB();
    const settingsRows = await Setting.find().lean();
    const settings = Object.fromEntries(settingsRows.map(r => [r.key, r.value]));

    const projects   = await getData('projects')   ?? [];
    const skills     = await getData('skills')     ?? [];
    const experience = await getData('experience') ?? [];
    const blogs      = await getData('blogs')      ?? [];
    const services   = await getData('services')   ?? [];
    const reviews    = await Review.find({ approved: true }).sort({ createdAt: -1 }).lean();

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json({
      settings,
      projects,
      skills,
      experience,
      blogs,
      services,
      reviews
    });
  } catch (err: any) {
    console.error('Data fetch error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch public data',
      details: err.message || 'Unknown error'
    });
  }
});

export default router;
