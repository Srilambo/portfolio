import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { Schema, model, Model, Document } from 'mongoose';

// ── Inline DB connection ────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
let isConnected = false;

async function connectDB(): Promise<void> {
  if (isConnected && mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000, bufferCommands: false });
  isConnected = true;
}

// ── Inline Schemas ──────────────────────────────────────────
interface IMessage extends Document { name: string; email: string; subject: string; message: string; status: string; createdAt: Date; }
const MessageSchema = new Schema<IMessage>({ name: { type: String, required: true }, email: { type: String, required: true }, subject: { type: String, required: true }, message: { type: String, required: true }, status: { type: String, default: 'new' } }, { timestamps: { createdAt: 'createdAt', updatedAt: false } });
const Message: Model<IMessage> = mongoose.models.Message || model<IMessage>('Message', MessageSchema);

interface ISetting extends Document { key: string; value: string; }
const SettingSchema = new Schema<ISetting>({ key: { type: String, required: true, unique: true }, value: { type: String, default: '' } });
const Setting: Model<ISetting> = mongoose.models.Setting || model<ISetting>('Setting', SettingSchema);

interface IDataStore extends Document { key: string; value: string; }
const DataStoreSchema = new Schema<IDataStore>({ key: { type: String, required: true, unique: true }, value: { type: String, required: true } });
const DataStore: Model<IDataStore> = mongoose.models.DataStore || model<IDataStore>('DataStore', DataStoreSchema);

interface IReview extends Document { name: string; email: string; rating: number; comment: string; approved: boolean; createdAt: Date; }
const ReviewSchema = new Schema<IReview>({ name: { type: String, required: true }, email: { type: String, required: true }, rating: { type: Number, required: true, min: 1, max: 5 }, comment: { type: String, required: true }, approved: { type: Boolean, default: false } }, { timestamps: { createdAt: 'createdAt', updatedAt: false } });
const Review: Model<IReview> = mongoose.models.Review || model<IReview>('Review', ReviewSchema);

// ── Inline Cache ────────────────────────────────────────────
const cacheStore = new Map<string, { data: unknown; ts: number }>();
const TTL = 60 * 60 * 1000;
function cacheGet<T>(key: string): T | null {
  const e = cacheStore.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > TTL) { cacheStore.delete(key); return null; }
  return e.data as T;
}
function cacheSet<T>(key: string, data: T): void { cacheStore.set(key, { data, ts: Date.now() }); }

// ── Inline GitHub API ───────────────────────────────────────
async function fetchGithubData(username: string) {
  const cacheKey = `github:${username}`;
  const cached = cacheGet<object>(cacheKey);
  if (cached) return cached;
  const headers: Record<string, string> = { 'User-Agent': 'portfolio-app' };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`, { headers }),
  ]);
  if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');
  const user = await userRes.json() as { followers: number; public_repos: number };
  const repos = await reposRes.json() as { name: string; description: string; stargazers_count: number; html_url: string; language: string; fork: boolean }[];
  const ownRepos = repos.filter(r => !r.fork);
  const stars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const topRepos = ownRepos.slice(0, 6).map(r => ({ name: r.name, description: r.description || '', stars: r.stargazers_count, url: r.html_url, language: r.language || 'Unknown' }));
  const data = { followers: user.followers, publicRepos: user.public_repos, stars, topRepos };
  cacheSet(cacheKey, data);
  return data;
}

// ── Inline requireAdmin ─────────────────────────────────────
interface AdminPayload { role: string; email: string; iat: number; exp: number; }
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (process.env.NODE_ENV === 'development') {
    (req as any).admin = { role: 'admin', email: process.env.ADMIN_EMAIL || 'srilambotharan@gmail.com', iat: Date.now(), exp: Date.now() + 86400000 };
    next(); return;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) { res.status(401).json({ error: 'No token provided' }); return; }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;
    if (payload.role !== 'admin') throw new Error('Forbidden');
    (req as any).admin = payload;
    next();
  } catch { res.status(401).json({ error: 'Invalid or expired token' }); }
}

// ── Express App ─────────────────────────────────────────────
const app = express();
app.set('trust proxy', 1);

// DB middleware
app.use(async (_req, _res, next) => {
  try { await connectDB(); next(); }
  catch (err) { console.error('DB connection error:', err); next(err); }
});

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'https://srilambo.vercel.app', credentials: true }));
app.use(express.json({ limit: '50mb' }));

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 2000, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests' } });
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many contact form submissions' } });
const reviewLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many reviews submitted' } });
app.use(globalLimiter);

// ── Health ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', db: 'mongodb', ts: new Date().toISOString() }));

// ── Auth: Google OAuth ──────────────────────────────────────
app.get('/api/auth/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  let clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
  if (clientUrl.endsWith('/')) clientUrl = clientUrl.slice(0, -1);
  if (!clientId) { res.status(500).json({ error: 'Google Client ID not configured' }); return; }
  const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
  const redirectUri = `${clientUrl}/admin/login`;
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=select_account&state=google`);
});

app.post('/api/auth/google/callback', async (req, res) => {
  const { code } = req.body;
  if (!code) { res.status(400).json({ error: 'No code provided' }); return; }
  try {
    let clientUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
    if (clientUrl.endsWith('/')) clientUrl = clientUrl.slice(0, -1);
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: `${clientUrl}/admin/login` }) });
    const tokenData = await tokenRes.json() as { access_token: string; error?: string; error_description?: string };
    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${tokenData.access_token}` } });
    const userData = await userRes.json() as { email: string };
    const allowedEmail = process.env.ADMIN_EMAIL || 'srilambotharan@gmail.com';
    if (!userData.email || userData.email.toLowerCase() !== allowedEmail.toLowerCase()) { res.status(403).json({ error: 'Unauthorized Google account' }); return; }
    const token = jwt.sign({ role: 'admin', email: userData.email }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    res.json({ token });
  } catch (err: any) { res.status(500).json({ error: 'Google Authentication failed', details: err?.message }); }
});

// ── Contact ─────────────────────────────────────────────────
const ContactSchema = z.object({ name: z.string().min(1).max(100), email: z.string().email(), subject: z.string().min(1).max(200), message: z.string().min(1).max(5000) });
app.post('/api/contact', contactLimiter, async (req, res) => {
  const r = ContactSchema.safeParse(req.body);
  if (!r.success) { res.status(400).json({ error: 'Validation failed' }); return; }
  const { name, email, subject, message } = r.data;
  try {
    await Message.create({ name, email, subject, message });
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
      await transporter.sendMail({ from: `"Portfolio Contact" <${process.env.SMTP_USER}>`, to: process.env.EMAIL_TO, subject: `[Portfolio] ${subject}`, html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><p>${message.replace(/\n/g, '<br>')}</p>` });
      await transporter.sendMail({ from: `"Lambo Portfolio" <${process.env.SMTP_USER}>`, to: email, subject: `Thanks for reaching out, ${name}!`, html: `<p>Hi <strong>${name}</strong>,</p><p>Thank you for your message. I've received your enquiry and will get back to you within 24–48 hours.</p><p>Best regards,<br><strong>Lambo</strong></p>` });
    }
    res.json({ success: true });
  } catch (err: any) { console.error('Contact error:', err); res.status(500).json({ error: 'Failed to send message' }); }
});

// ── GitHub ──────────────────────────────────────────────────
app.get('/api/github', async (_req, res) => {
  try { const data = await fetchGithubData(process.env.GITHUB_USERNAME || 'srilambo'); res.json(data); }
  catch { res.status(502).json({ error: 'Failed to fetch GitHub data' }); }
});

// ── Public Data ─────────────────────────────────────────────
async function getDataStore(key: string) {
  const doc = await DataStore.findOne({ key }).lean();
  return doc ? JSON.parse(doc.value) : null;
}

app.get('/api/data', async (_req, res) => {
  try {
    const settingsRows = await Setting.find().lean();
    const settings = Object.fromEntries(settingsRows.map(r => [r.key, r.value]));
    const [projects, skills, experience, blogs, services, reviews] = await Promise.all([
      getDataStore('projects'), getDataStore('skills'), getDataStore('experience'),
      getDataStore('blogs'), getDataStore('services'),
      Review.find({ approved: true }).sort({ createdAt: -1 }).lean()
    ]);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({ settings, projects: projects ?? [], skills: skills ?? [], experience: experience ?? [], blogs: blogs ?? [], services: services ?? [], reviews });
  } catch (err: any) { console.error('Data fetch error:', err); res.status(500).json({ error: 'Failed to fetch public data', details: err?.message }); }
});

app.get('/api/settings', async (_req, res) => {
  try { const rows = await Setting.find().lean(); res.json(Object.fromEntries(rows.map(r => [r.key, r.value]))); }
  catch { res.status(500).json({ error: 'Failed to fetch settings' }); }
});

// ── Reviews (public) ────────────────────────────────────────
app.post('/api/reviews', reviewLimiter, async (req, res) => {
  const ReviewSubmitSchema = z.object({ name: z.string().min(1).max(100), email: z.string().email(), rating: z.number().int().min(1).max(5), comment: z.string().min(1).max(1000) });
  const r = ReviewSubmitSchema.safeParse(req.body);
  if (!r.success) { res.status(400).json({ error: 'Validation failed' }); return; }
  try { await Review.create({ ...r.data, approved: false }); res.json({ success: true, message: 'Review submitted and pending approval.' }); }
  catch { res.status(500).json({ error: 'Failed to submit review.' }); }
});

app.get('/api/reviews', async (_req, res) => {
  try { res.json(await Review.find({ approved: true }).sort({ createdAt: -1 }).lean()); }
  catch { res.status(500).json({ error: 'Failed to fetch reviews.' }); }
});

// ── Admin Routes ────────────────────────────────────────────
// Admin Data
app.use('/api/admin', requireAdmin);

app.get('/api/admin/data', async (_req, res) => {
  try {
    const [projects, skills, experience, blogs, services] = await Promise.all([
      getDataStore('projects'), getDataStore('skills'), getDataStore('experience'),
      getDataStore('blogs'), getDataStore('services')
    ]);
    res.json({ projects: projects ?? [], skills: skills ?? [], experience: experience ?? [], blogs: blogs ?? [], services: services ?? [] });
  } catch { res.status(500).json({ error: 'Failed to fetch admin data' }); }
});

app.put('/api/admin/data/:key', async (req, res) => {
  const { key } = req.params;
  const allowed = ['projects', 'skills', 'experience', 'blogs', 'services'];
  if (!allowed.includes(key)) { res.status(400).json({ error: 'Invalid key' }); return; }
  try {
    await DataStore.findOneAndUpdate({ key }, { key, value: JSON.stringify(req.body) }, { upsert: true, new: true });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to save data' }); }
});

// Admin Messages
app.get('/api/admin/messages', requireAdmin, async (_req, res) => {
  try { const msgs = await Message.find().sort({ createdAt: -1 }).lean(); res.json(msgs.map(m => ({ ...m, id: m._id.toString(), created_at: m.createdAt }))); }
  catch { res.status(500).json({ error: 'Failed to fetch messages' }); }
});
app.put('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  const { status } = req.body as { status: string };
  if (!['new', 'read', 'replied'].includes(status)) { res.status(400).json({ error: 'Invalid status' }); return; }
  try { await Message.findByIdAndUpdate(req.params.id, { status }); res.json({ success: true }); }
  catch { res.status(404).json({ error: 'Message not found' }); }
});
app.delete('/api/admin/messages/:id', requireAdmin, async (req, res) => {
  try { await Message.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch { res.status(404).json({ error: 'Message not found' }); }
});

// Admin Reviews
app.get('/api/admin/reviews', requireAdmin, async (_req, res) => {
  try { res.json(await Review.find().sort({ createdAt: -1 }).lean()); }
  catch { res.status(500).json({ error: 'Failed to fetch reviews' }); }
});
app.put('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  try { const rv = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!rv) { res.status(404).json({ error: 'Review not found' }); return; } res.json(rv); }
  catch { res.status(500).json({ error: 'Failed to update review' }); }
});
app.delete('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  try { await Review.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch { res.status(404).json({ error: 'Review not found' }); }
});

// Admin Settings
app.get('/api/admin/settings/backup', requireAdmin, async (_req, res) => {
  try {
    const settingsRows = await Setting.find().lean();
    const settings = Object.fromEntries(settingsRows.map(r => [r.key, r.value]));
    const [projects, skills, experience, blogs] = await Promise.all([getDataStore('projects'), getDataStore('skills'), getDataStore('experience'), getDataStore('blogs')]);
    res.setHeader('Cache-Control', 'no-store'); res.json({ settings, projects, skills, experience, blogs });
  } catch (err: any) { res.status(500).json({ error: 'Failed to generate backup: ' + err?.message }); }
});
app.post('/api/admin/settings/restore', requireAdmin, async (req, res) => {
  try {
    const { settings, projects, skills, experience, blogs } = req.body;
    if (settings && typeof settings === 'object') {
      await Promise.all(Object.entries(settings).map(([key, value]) => Setting.findOneAndUpdate({ key }, { key, value: String(value) }, { upsert: true, new: true })));
    }
    const saveDS = async (key: string, data: unknown) => { if (Array.isArray(data)) await DataStore.findOneAndUpdate({ key }, { key, value: JSON.stringify(data) }, { upsert: true, new: true }); };
    await Promise.all([saveDS('projects', projects), saveDS('skills', skills), saveDS('experience', experience), saveDS('blogs', blogs)]);
    res.json({ success: true });
  } catch (err: any) { res.status(500).json({ error: 'Failed to restore backup: ' + err?.message }); }
});
app.get('/api/admin/settings', requireAdmin, async (_req, res) => {
  try { const rows = await Setting.find().lean(); res.setHeader('Cache-Control', 'no-store'); res.json(Object.fromEntries(rows.map(r => [r.key, r.value]))); }
  catch { res.status(500).json({ error: 'Failed to fetch settings' }); }
});
app.put('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    await Promise.all(Object.entries(req.body as Record<string, string>).map(([key, value]) => Setting.findOneAndUpdate({ key }, { key, value: String(value) }, { upsert: true, new: true })));
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Failed to save settings' }); }
});

// ── 404 + Error handlers ────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err?.message });
});

export default app;