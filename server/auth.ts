import crypto from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  auth?: { userId: string; email?: string; expiresAt: number };
}

interface AccessTokenPayload { sub: string; email?: string; exp: number; }
interface SupabaseUser { id: string; email?: string; }

function decodeBase64Url(value: string): Buffer { return Buffer.from(value, 'base64url'); }

function authenticateLegacyToken(token: string): AuthenticatedRequest['auth'] | null {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret) return null;
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) return null;
  const expected = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  const supplied = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (supplied.length !== expectedBuffer.length || !crypto.timingSafeEqual(supplied, expectedBuffer)) return null;
  try {
    const parsed = JSON.parse(decodeBase64Url(payload).toString('utf8')) as AccessTokenPayload;
    return parsed.sub && Number.isFinite(parsed.exp) && parsed.exp * 1000 > Date.now()
      ? { userId: parsed.sub, email: parsed.email, expiresAt: parsed.exp * 1000 } : null;
  } catch { return null; }
}

export async function authenticateAccessToken(token: string | undefined): Promise<AuthenticatedRequest['auth'] | null> {
  if (!token) return null;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (url && anonKey) {
    try {
      const response = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, {
        headers: { apikey: anonKey, Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5_000),
      });
      if (response.ok) {
        const user = await response.json() as SupabaseUser;
        if (user.id) return { userId: user.id, email: user.email, expiresAt: Date.now() + 60_000 };
      }
    } catch { return null; }
    return null;
  }
  // Local HMAC tokens are retained for non-production development only.
  return process.env.NODE_ENV === 'production' ? null : authenticateLegacyToken(token);
}

export async function requireAuthenticatedUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authorization = req.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
  const auth = await authenticateAccessToken(token);
  if (!auth) { res.status(401).json({ error: 'Authentication is required.' }); return; }
  req.auth = auth;
  next();
}
