import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { getCachedDataStore, setCachedDataStore } from '../db/dataCache.js';

const router = Router();
router.use(requireAdmin);

// Projects
router.get('/projects',    async (_req, res) => res.json(await getCachedDataStore('projects') ?? []));
router.post('/projects',   async (req, res)  => { await setCachedDataStore('projects', req.body);  res.json({ success: true }); });

// Skills
router.get('/skills',      async (_req, res) => res.json(await getCachedDataStore('skills') ?? []));
router.post('/skills',     async (req, res)  => { await setCachedDataStore('skills', req.body);    res.json({ success: true }); });

// Experience
router.get('/experience',  async (_req, res) => res.json(await getCachedDataStore('experience') ?? []));
router.post('/experience', async (req, res)  => { await setCachedDataStore('experience', req.body); res.json({ success: true }); });

// Blogs
router.get('/blogs',       async (_req, res) => res.json(await getCachedDataStore('blogs') ?? []));
router.post('/blogs',      async (req, res)  => { await setCachedDataStore('blogs', req.body);     res.json({ success: true }); });

// Services
router.get('/services',    async (_req, res) => res.json(await getCachedDataStore('services') ?? []));
router.post('/services',   async (req, res)  => { await setCachedDataStore('services', req.body);  res.json({ success: true }); });

export default router;
