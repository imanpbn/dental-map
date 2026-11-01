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
