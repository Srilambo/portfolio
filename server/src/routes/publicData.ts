import { Router } from 'express';
import { Setting, DataStore } from '../db/schema.js';

const router = Router();

async function getData(key: string): Promise<unknown> {
  const doc = await DataStore.findOne({ key }).lean();
  return doc ? JSON.parse(doc.value) : null;
}

// GET /api/data — public viewer gets everything in one go
router.get('/', async (_req, res) => {
  try {
    const settingsRows = await Setting.find().lean();
    const settings = Object.fromEntries(settingsRows.map(r => [r.key, r.value]));

    const projects   = await getData('projects')   ?? [];
    const skills     = await getData('skills')     ?? [];
    const experience = await getData('experience') ?? [];

    res.json({
      settings,
      projects,
      skills,
      experience
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch public data' });
  }
});

export default router;
