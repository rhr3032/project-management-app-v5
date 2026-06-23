import { getPrisma } from './prisma';

const COOKIE_NAME = 'pm_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'pm-app-secret-key-change-in-production-2024';

// Simple hash function for passwords (bcryptjs will be used in API routes)
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
}

// Simple base64 session token (signed with HMAC-like approach)
function encodeSession(userId: string, expiresAt: number): string {
  const payload = JSON.stringify({ userId, expiresAt });
  const encoded = Buffer.from(payload).toString('base64');
  const signature = Buffer.from(
    `${encoded}.${SESSION_SECRET}`
  ).toString('base64').slice(0, 32);
  return `${encoded}.${signature}`;
}

function decodeSession(token: string): { userId: string; expiresAt: number } | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;

    const expectedSig = Buffer.from(
      `${encoded}.${SESSION_SECRET}`
    ).toString('base64').slice(0, 32);

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
    if (payload.expiresAt < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function createSessionToken(userId: string, rememberMe: boolean = false): string {
  const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
  const expiresAt = Date.now() + duration;
  return encodeSession(userId, expiresAt);
}

export function getSessionCookieOptions(rememberMe: boolean = false) {
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;

export async function getUserFromSession(cookieValue: string | undefined) {
  if (!cookieValue) return null;

  const session = decodeSession(cookieValue);
  if (!session) return null;

  try {
    const user = await getPrisma().user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true },
    });
    return user;
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    })
  );
  return getUserFromSession(cookies[COOKIE_NAME]);
}

export async function seedUser() {
  const prisma = getPrisma();
  
  const existing = await prisma.user.findUnique({
    where: { email: 'rhr3032@yahoo.com' },
  });

  if (existing) return existing;

  const hashedPw = await hashPassword('rhr3032');
  
  return prisma.user.create({
    data: {
      email: 'rhr3032@yahoo.com',
      password: hashedPw,
      name: 'Admin',
    },
  });
}
