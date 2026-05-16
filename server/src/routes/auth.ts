import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (
    email    !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { role: 'admin', email },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

// GET /api/auth/github
router.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.CLIENT_URL}/admin/login`; // Or a specific callback route
  const scope = 'read:user';
  
  if (!clientId) {
    return res.status(500).json({ error: 'GitHub Client ID not configured' });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  res.redirect(githubAuthUrl);
});

// POST /api/auth/github/callback
router.post('/github/callback', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json() as { access_token: string; error?: string };
    if (tokenData.error) throw new Error(tokenData.error);

    // 2. Get user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${tokenData.access_token}` },
    });
    const userData = await userRes.json() as { login: string };

    // 3. Check if user is the admin
    if (userData.login !== process.env.GITHUB_USERNAME) {
      return res.status(403).json({ error: 'Unauthorized GitHub user' });
    }

    // 4. Issue JWT
    const token = jwt.sign(
      { role: 'admin', githubUser: userData.login },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err: any) {
    console.error('GitHub Auth Error:', err);
    res.status(500).json({ error: 'GitHub Authentication failed' });
  }
});

export default router;
