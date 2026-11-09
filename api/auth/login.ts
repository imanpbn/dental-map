import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface RateLimitRecord {
  failedAttempts: number;
  lockedUntil: number;
  lastAttemptAt: number;
}

// In-memory rate limiting map for serverless instances
const loginAttempts = new Map<string, RateLimitRecord>();

const JWT_SECRET = (
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'dentalmap_secure_hmac_secret_key_2026_super_hardened'
).trim();

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

function checkRateLimit(ip: string): { isLocked: boolean; remainingSeconds: number } {
  const record = loginAttempts.get(ip);
  if (!record) return { isLocked: false, remainingSeconds: 0 };

  const now = Date.now();
  if (record.lockedUntil > now) {
    return {
      isLocked: true,
      remainingSeconds: Math.ceil((record.lockedUntil - now) / 1000)
    };
  }

  // Reset if last attempt was more than 15 minutes ago
  if (now - record.lastAttemptAt > 15 * 60 * 1000) {
    loginAttempts.delete(ip);
  }

  return { isLocked: false, remainingSeconds: 0 };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { failedAttempts: 0, lockedUntil: 0, lastAttemptAt: now };
  record.failedAttempts += 1;
  record.lastAttemptAt = now;

  // Lock for 15 minutes after 5 failed attempts
  if (record.failedAttempts >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000;
  }
  loginAttempts.set(ip, record);
}

function clearRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

// Cryptographically sign token using HMAC-SHA256
function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

// Constant-time string comparison to prevent timing attacks
function safeStringCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);

  if (rateLimit.isLocked) {
    return res.status(429).json({
      success: false,
      error: `به دلیل تلاش‌های ناموفق مکرر، ورود موقتاً مسدود شد. لطفاً ${rateLimit.remainingSeconds} ثانیه دیگر مجدداً تلاش فرمایید.`
    });
  }

  try {
    const { usernameOrEmail, password } = req.body || {};

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, error: 'لطفاً نام کاربری و رمز عبور را وارد فرمایید.' });
    }

    const input = String(usernameOrEmail).trim().toLowerCase();
    const cleanPass = String(password);

    const masterUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const masterEmail = (process.env.ADMIN_EMAIL || 'admin@dentalmap.ir').toLowerCase();
    const masterPassword = process.env.ADMIN_PASSWORD || 'DentalMap@2026';

    const isUserMatch = safeStringCompare(input, masterUsername) || safeStringCompare(input, masterEmail);
    const isPassMatch = safeStringCompare(cleanPass, masterPassword);

    if (!isUserMatch || !isPassMatch) {
      recordFailedAttempt(clientIp);
      // Artificial delay to prevent timing attacks and slow down brute-force scripts
      await new Promise((resolve) => setTimeout(resolve, 600));

      return res.status(401).json({
        success: false,
        error: 'نام کاربری یا رمز عبور اشتباه است.'
      });
    }

    // Successful login: reset failed attempts
    clearRateLimit(clientIp);

    const user = {
      id: 1,
      username: masterUsername,
      email: masterEmail,
      full_name: 'دکتر محمدرضا نایینی (مدیر ارشد سامانه)',
      role: 'super_admin',
      is_active: true,
      last_login_at: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };

    // Generate cryptographic HMAC-SHA256 token
    const token = signToken({
      uid: user.id,
      role: user.role,
      username: user.username,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      user,
      token
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'خطای سرور' });
  }
}
