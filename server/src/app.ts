import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { globalLimiter, contactLimiter } from './middleware/rateLimiter.js';
import authRouter           from './routes/auth.js';
import contactRouter        from './routes/contact.js';
import githubRouter         from './routes/github.js';
import adminDataRouter      from './routes/adminData.js';
import adminMessagesRouter  from './routes/adminMessages.js';
import adminSettingsRouter  from './routes/adminSettings.js';
import publicSettingsRouter from './routes/publicSettings.js';
import publicDataRouter     from './routes/publicData.js';
import reviewsRouter        from './routes/reviews.js';
import adminReviewsRouter   from './routes/adminReviews.js';
import { connectDB } from './db/db.js';

const app = express();

// Trust reverse proxy (Vercel, Render, etc.) to get correct client IPs for rate limiting
app.set('trust proxy', 1);

// ── Database connection assurance (Serverless compatible) ──
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Failed to establish database connection:', err);
    next(err);
  }
});

// ── Security ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// ── Body parser ────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));

// ── Rate limiting ──────────────────────────────────────────
app.use(globalLimiter);

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',             authRouter);
app.use('/api/contact',          contactLimiter, contactRouter);
app.use('/api/github',           githubRouter);
app.use('/api/settings',         publicSettingsRouter);
app.use('/api/data',             publicDataRouter);
app.use('/api/reviews',          reviewsRouter);
app.use('/api/admin',            adminDataRouter);
app.use('/api/admin/messages',   adminMessagesRouter);
app.use('/api/admin/settings',   adminSettingsRouter);
app.use('/api/admin/reviews',    adminReviewsRouter);

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', db: 'mongodb', ts: new Date().toISOString() })
);

// ── 404 handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ───────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
