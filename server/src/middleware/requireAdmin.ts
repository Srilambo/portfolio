import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminPayload { role: string; email: string; iat: number; exp: number; }

declare global {
  namespace Express {
    interface Request { admin?: AdminPayload; }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  // Automatically bypass authentication checks in local development mode to make testing dashboard settings seamless
  if (process.env.NODE_ENV === 'development') {
    req.admin = { role: 'admin', email: process.env.ADMIN_EMAIL || 'srilambotharan@gmail.com', iat: Date.now(), exp: Date.now() + 86400000 };
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;
    if (payload.role !== 'admin') throw new Error('Forbidden');
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
