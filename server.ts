import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory rate limiting map for server
interface RateLimitRecord {
  failedAttempts: number;
  lockedUntil: number;
  lastAttemptAt: number;
}
const loginAttempts = new Map<string, RateLimitRecord>();

const JWT_SECRET = (
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'dentalmap_secure_hmac_secret_key_2026_super_hardened'
).trim();

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeUrl(rawUrl: string, fallback: string = 'https://dentalmap.ir'): string {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return 'https://dentalmap.ir' + trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return fallback;
    const hostname = parsed.hostname.toLowerCase();
    if (hostname === 'dentalmap.ir' || hostname.endsWith('.dentalmap.ir') || hostname === 'localhost') {
      return parsed.toString();
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function sanitizeImageUrl(rawImg: string, fallback: string = 'https://dentalmap.ir/images/og-preview.png'): string {
  if (!rawImg || typeof rawImg !== 'string') return fallback;
  const trimmed = rawImg.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return 'https://dentalmap.ir' + trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return parsed.toString();
    return fallback;
  } catch {
    return fallback;
  }
}

function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function safeStringCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API endpoint for lead valuation tracking or health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      platform: 'دنتال مپ (Dental Map)',
      port: PORT,
      timestamp: new Date().toISOString()
    });
  });

  // OpenGraph Social Bot Pre-render Endpoint (Hardened against XSS & Open Redirect)
  app.get('/api/seo/og', (req, res) => {
    const {
      title = 'دنتال مپ | مرجع شفافیت و اصالت قطعات ایمپلنت دندان ایران',
      description = 'سامانه جامع اصالت قطعات، دایرکتوری تخصصی جراحان و دندانپزشکان، راهنمای قیمت و شناسنامه دیجیتال ۳۲ دندان.',
      image = 'https://dentalmap.ir/images/og-preview.png',
      url = 'https://dentalmap.ir',
      type = 'website'
    } = req.query;

    const validUrl = sanitizeUrl(String(url));
    const validImage = sanitizeImageUrl(String(image));
    const validType = ['website', 'article', 'profile'].includes(String(type)) ? String(type) : 'website';

    const safeTitle = escapeHtml(String(title).slice(0, 150));
    const safeDesc = escapeHtml(String(description).slice(0, 300));
    const safeUrl = escapeHtml(validUrl);
    const safeImage = escapeHtml(validImage);

    const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}">
  <meta property="og:type" content="${validType}">
  <meta property="og:url" content="${safeUrl}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:site_name" content="دنتال مپ (Dental Map)">
  <meta property="og:locale" content="fa_IR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${safeUrl}">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${safeImage}">
  <meta http-equiv="refresh" content="0;url=${safeUrl}">
</head>
<body style="font-family: system-ui, sans-serif; text-align: center; padding: 40px; direction: rtl;">
  <h2>در حال انتقال به سامانه دنتال مپ...</h2>
  <p><a href="${safeUrl}">اگر به طور خودکار منتقل نشدید، اینجا کلیک کنید.</a></p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.send(html);
  });

  // Authentication endpoint (Hardened with HMAC-SHA256 & Brute-force Rate Limiting)
  app.post('/api/auth/login', async (req, res) => {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
    
    // Check Rate Limiting
    const record = loginAttempts.get(clientIp);
    const now = Date.now();
    if (record && record.lockedUntil > now) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return res.status(429).json({
        success: false,
        error: `به دلیل تلاش‌های ناموفق مکرر، ورود موقتاً مسدود شد. لطفاً ${remainingSeconds} ثانیه دیگر مجدداً تلاش فرمایید.`
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
        // Record failed attempt
        const r = loginAttempts.get(clientIp) || { failedAttempts: 0, lockedUntil: 0, lastAttemptAt: now };
        r.failedAttempts += 1;
        r.lastAttemptAt = now;
        if (r.failedAttempts >= 5) {
          r.lockedUntil = now + 15 * 60 * 1000;
        }
        loginAttempts.set(clientIp, r);

        // Artificial constant delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        return res.status(401).json({
          success: false,
          error: 'نام کاربری یا رمز عبور اشتباه است.'
        });
      }

      // Successful login: clear lockout
      loginAttempts.delete(clientIp);

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
  });

  // MeliPayamak SMS Integration Proxy
  app.post('/api/sms/send', async (req, res) => {
    try {
      const { apiKey, from, to, text, bodyId, args } = req.body || {};
      const key = (process.env.MELIPAYAMAK_API_KEY || apiKey || '29c3b26d3caf4cd3b865f43a10d1b19d').trim();

      const endpoint = bodyId
        ? `https://console.melipayamak.com/api/send/shared/${key}`
        : `https://console.melipayamak.com/api/send/simple/${key}`;

      const payload = bodyId
        ? { to, bodyId: Number(bodyId), args: args || [text] }
        : { from: from || '5000xxx', to, text };

      const meliRes = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await meliRes.json().catch(() => ({}));
      res.json({
        success: meliRes.ok,
        data,
        recId: (data as any)?.recId || (data as any)?.Value || 'rec-' + Date.now()
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/sms/credit', async (req, res) => {
    try {
      const key = (process.env.MELIPAYAMAK_API_KEY || (req.query.apiKey as string) || '29c3b26d3caf4cd3b865f43a10d1b19d').trim();
      const checkRes = await fetch(`https://console.melipayamak.com/api/receive/credit/${key}`);
      const data = await checkRes.json().catch(() => ({}));
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/sms/status', async (req, res) => {
    try {
      const key = (process.env.MELIPAYAMAK_API_KEY || (req.query.apiKey as string) || '29c3b26d3caf4cd3b865f43a10d1b19d').trim();
      const checkRes = await fetch(`https://console.melipayamak.com/api/receive/credit/${key}`);
      const data = await checkRes.json().catch(() => ({}));
      res.json({ success: checkRes.ok, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Headless WordPress API on subfolder /blog for unified domain authority
  app.get('/wp-json/wp/v2/posts', (_req, res) => {
    res.json([
      {
        id: 1,
        slug: 'implant-passport-guide',
        title: { rendered: 'راهنمای جامع پاسپورت اصالت ایمپلنت: چگونه شماره رفرنس و لات را بررسی کنیم؟' },
        link: '/blog/implant-passport-guide',
        status: 'publish'
      },
      {
        id: 2,
        slug: 'morse-taper-vs-flat-hex-microgap',
        title: { rendered: 'تفاوت اتصال مورس تیپر (Morse Taper) با هگز تخت: تشبیه لگو و رفع معضل میکروگپ' },
        link: '/blog/morse-taper-vs-flat-hex-microgap',
        status: 'publish'
      },
      {
        id: 3,
        slug: 'iso-14801-fatigue-test-earthquake-analogy',
        title: { rendered: 'آزمون زلزله خستگی استخوان طبق استاندارد DIN EN ISO 14801 چیست؟' },
        link: '/blog/iso-14801-fatigue-test-earthquake-analogy',
        status: 'publish'
      }
    ]);
  });

  if (!isProduction) {
    // Mount Vite in middleware mode for ultra-fast HMR during development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 سرور پلتفرم دنتال مپ (Dental Map) روی پورت ${PORT} اجرا شد:`);
    console.log(`🔗 http://localhost:${PORT}\n`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
