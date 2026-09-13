import crypto from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  auth?: { userId: string; email?: string; expiresAt: number };
}

interface AccessTokenPayload {
  sub: string;
  email?: string;
  exp: number;
}

function decodeBase64Url(value: string): Buffer {
  return Buffer.from(value, 'base64url');
}

function getTokenSecret(): string | null {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_TOKEN_SECRET must be configured in production');
  }
  return secret || null;
}

export function authenticateAccessToken(token: string | undefined): AuthenticatedRequest['auth'] | null {
  if (!token) return null;
  const secret = getTokenSecret();
  if (!secret) return null;

  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) return null;
  const expected = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  const supplied = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (supplied.length !== expectedBuffer.length || !crypto.timingSafeEqual(supplied, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(decodeBase64Url(payload).toString('utf8')) as AccessTokenPayload;
    if (!parsed.sub || !Number.isFinite(parsed.exp) || parsed.exp * 1000 <= Date.now()) return null;
    return { userId: parsed.sub, email: parsed.email, expiresAt: parsed.exp * 1000 };
  } catch {
    return null;
  }
}

export function requireAuthenticatedUser(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authorization = req.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
  const auth = authenticateAccessToken(token);
  if (!auth) {
    res.status(401).json({ error: 'Authentication is required.' });
    return;
  }
  req.auth = auth;
  next();
}
