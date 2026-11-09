import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const {
    title = 'دنتال مپ | مرجع شفافیت و اصالت قطعات ایمپلنت دندان ایران',
    description = 'سامانه جامع اصالت قطعات، دایرکتوری تخصصی جراحان و دندانپزشکان، راهنمای قیمت و شناسنامه دیجیتال ۳۲ دندان.',
    image = 'https://dentalmap.ir/images/og-preview.png',
    url = 'https://dentalmap.ir',
    type = 'website'
  } = req.query;

  const safeTitle = String(title).replace(/"/g, '&quot;');
  const safeDesc = String(description).replace(/"/g, '&quot;');
  const safeImage = String(image);
  const safeUrl = String(url);

  const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}">
  
  <!-- OpenGraph -->
  <meta property="og:type" content="${type}">
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
  return res.status(200).send(html);
}
