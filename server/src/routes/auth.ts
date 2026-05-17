import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// OAuth routes only (Security: Google Only)

// Google Auth
router.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  let clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
  if (clientUrl.endsWith('/')) clientUrl = clientUrl.slice(0, -1);
  const redirectUri = `${clientUrl}/admin/login`;
  const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
  
  if (!clientId) {
    return res.status(500).json({ error: 'Google Client ID not configured' });
  }

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=select_account&state=google`;
  res.redirect(googleAuthUrl);
});

// POST /api/auth/google/callback
router.post('/google/callback', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    let clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
    if (clientUrl.endsWith('/')) clientUrl = clientUrl.slice(0, -1);
    
    // 1. Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${clientUrl}/admin/login`,
      }),
    });

    const tokenData = await tokenRes.json() as { access_token: string; error?: string; error_description?: string };
    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

    // 2. Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userRes.json() as { email: string };

    if (userData.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Unauthorized Google account' });
    }

    const token = jwt.sign({ role: 'admin', email: userData.email }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    res.json({ token });
  } catch (err: any) {
    console.error('Google Auth Error:', err);
    res.status(500).json({
      error: 'Google Authentication failed',
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

export default router;
