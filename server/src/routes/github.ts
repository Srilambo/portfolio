import { Router } from 'express';
import { fetchGithubData } from '../services/githubApi.js';

const router = Router();

// GET /api/github
router.get('/', async (_req, res) => {
  try {
    const data = await fetchGithubData(process.env.GITHUB_USERNAME || 'raavanaa');
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to fetch GitHub data' });
  }
});

export default router;
