import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Authentication endpoint
  app.post('/api/auth/login', (req, res) => {
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

      const isMatch = (input === masterUsername || input === masterEmail) && cleanPass === masterPassword;

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'نام کاربری یا رمز عبور اشتباه است.'
        });
      }

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

      const sessionToken = Buffer.from(
        JSON.stringify({
          uid: user.id,
          role: user.role,
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000
        })
      ).toString('base64');

      return res.status(200).json({
        success: true,
        user,
        token: sessionToken
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
