import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { Setting, DataStore } from '../db/schema.js';

const router = Router();
router.use(requireAdmin);

// GET /api/admin/settings/backup
router.get('/backup', async (_req, res) => {
  try {
    const settingsRows = await Setting.find().lean();
    const settings = Object.fromEntries(settingsRows.map(r => [r.key, r.value]));

    const getDS = async (key: string) => {
      const doc = await DataStore.findOne({ key }).lean();
      return doc ? JSON.parse(doc.value) : [];
    };

    const projects   = await getDS('projects');
    const skills     = await getDS('skills');
    const experience = await getDS('experience');
    const blogs      = await getDS('blogs');

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json({
      settings,
      projects,
      skills,
      experience,
      blogs
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate backup: ' + err.message });
  }
});

// POST /api/admin/settings/restore
router.post('/restore', async (req, res) => {
  try {
    const { settings, projects, skills, experience, blogs } = req.body;

    // Restore settings
    if (settings && typeof settings === 'object') {
      const entries = Object.entries(settings);
      await Promise.all(
        entries.map(([key, value]) =>
          Setting.findOneAndUpdate(
            { key },
            { key, value: String(value) },
            { upsert: true, new: true }
          )
        )
      );
    }

    // Restore data stores
    const saveDS = async (key: string, data: any) => {
      if (Array.isArray(data)) {
        await DataStore.findOneAndUpdate(
          { key },
          { key, value: JSON.stringify(data) },
          { upsert: true, new: true }
        );
      }
    };

    await saveDS('projects', projects);
    await saveDS('skills', skills);
    await saveDS('experience', experience);
    await saveDS('blogs', blogs);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to restore backup: ' + err.message });
  }
});

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
