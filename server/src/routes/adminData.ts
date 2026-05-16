import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { DataStore } from '../db/schema.js';

const router = Router();
router.use(requireAdmin);

async function getData(key: string): Promise<unknown> {
  const doc = await DataStore.findOne({ key }).lean();
  return doc ? JSON.parse(doc.value) : null;
}

async function setData(key: string, value: unknown): Promise<void> {
  await DataStore.findOneAndUpdate(
    { key },
    { key, value: JSON.stringify(value) },
    { upsert: true, new: true }
  );
}

// Projects
router.get('/projects',    async (_req, res) => res.json(await getData('projects') ?? []));
router.post('/projects',   async (req, res)  => { await setData('projects', req.body);  res.json({ success: true }); });

// Skills
router.get('/skills',      async (_req, res) => res.json(await getData('skills') ?? []));
router.post('/skills',     async (req, res)  => { await setData('skills', req.body);    res.json({ success: true }); });

// Experience
router.get('/experience',  async (_req, res) => res.json(await getData('experience') ?? []));
router.post('/experience', async (req, res)  => { await setData('experience', req.body); res.json({ success: true }); });

export default router;
