import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return fallback;
    }
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
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
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
  
  <!-- OpenGraph -->
  <meta property="og:type" content="${validType}">
  <meta property="og:url" content="${safeUrl}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:site_name" content="دنتال مپ (Dental Map)">
  <meta property="og:locale" content="fa_IR">

  <!-- Twitter -->
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
  return res.status(200).send(html);
}
