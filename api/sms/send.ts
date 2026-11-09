import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate Limiting Memory Maps
const ipSmsHistory = new Map<string, { count: number; windowStart: number }>();
const phoneLastSent = new Map<string, number>();

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

function normalizeIranMobile(raw: string): string {
  if (!raw) return '';
  let cleaned = String(raw)
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[\s\-\+\(\)]/g, '')
    .trim();

  if (cleaned.startsWith('0098')) cleaned = '0' + cleaned.slice(4);
  if (cleaned.startsWith('98') && cleaned.length === 12) cleaned = '0' + cleaned.slice(2);
  if (cleaned.startsWith('+98')) cleaned = '0' + cleaned.slice(3);
  if (!cleaned.startsWith('0') && cleaned.startsWith('9') && cleaned.length === 10) cleaned = '0' + cleaned;
  return cleaned;
}

const ALLOWED_KEYWORDS = ['دنتال', 'dental', 'ایمپلنت', 'نوبت', 'پاسپورت', 'آزمون', 'کد تایید'];

function isAuthorizedContent(text: string, bodyId?: string | number): boolean {
  if (bodyId) {
    const validBodyIds = ['245890', '245891', '245892', 245890, 245891, 245892];
    if (validBodyIds.includes(bodyId)) return true;
  }
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return ALLOWED_KEYWORDS.some((kw) => lower.includes(kw));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = getClientIp(req);
  const now = Date.now();

  // 1. IP Rate Limiting: Max 5 SMS per 10 minutes per IP
  const ipRecord = ipSmsHistory.get(clientIp);
  if (ipRecord) {
    if (now - ipRecord.windowStart < 10 * 60 * 1000) {
      if (ipRecord.count >= 5) {
        const remainingMinutes = Math.ceil((10 * 60 * 1000 - (now - ipRecord.windowStart)) / 60000);
        return res.status(429).json({
          success: false,
          error: `تعداد درخواست‌های ارسال پیامک بیش از حد مجاز است. لطفاً ${remainingMinutes} دقیقه دیگر تلاش فرمایید.`
        });
      }
    } else {
      // Reset window
      ipSmsHistory.set(clientIp, { count: 0, windowStart: now });
    }
  } else {
    ipSmsHistory.set(clientIp, { count: 0, windowStart: now });
  }

  try {
    const { apiKey, from, to, text, bodyId, args } = req.body || {};

    // 2. Validate Recipient Mobile Number
    const cleanTo = normalizeIranMobile(to);
    if (!/^09\d{9}$/.test(cleanTo)) {
      return res.status(400).json({
        success: false,
        error: 'شماره تلفن همراه گیرنده نامعتبر است. فرمت صحیح: ۰۹۱۲۳۴۵۶۷۸۹'
      });
    }

    // 3. Cooldown per recipient phone number (Min 90 seconds between sends)
    const lastSentToPhone = phoneLastSent.get(cleanTo);
    if (lastSentToPhone && now - lastSentToPhone < 90 * 1000) {
      const waitSeconds = Math.ceil((90 * 1000 - (now - lastSentToPhone)) / 1000);
      return res.status(429).json({
        success: false,
        error: `لطفاً قبل از ارسال پیامک مجدد به این شماره، ${waitSeconds} ثانیه صبر فرمایید.`
      });
    }

    // 4. Abuse Prevention: Content & Pattern Authorization
    if (!isAuthorizedContent(text, bodyId)) {
      return res.status(403).json({
        success: false,
        error: 'ارسال متون غیرمرتبط با سامانه دنتال‌مپ مجاز نمی‌باشد.'
      });
    }

    // Server-side secret priority: Environment variable -> client fallback -> default
    const key = (process.env.MELIPAYAMAK_API_KEY || apiKey || '29c3b26d3caf4cd3b865f43a10d1b19d').trim();

    const endpoint = bodyId
      ? `https://console.melipayamak.com/api/send/shared/${key}`
      : `https://console.melipayamak.com/api/send/simple/${key}`;

    const payload = bodyId
      ? { to: cleanTo, bodyId: Number(bodyId), args: args || [text] }
      : { from: from || '5000xxx', to: cleanTo, text };

    const meliRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await meliRes.json().catch(() => ({}));

    if (meliRes.ok) {
      // Record successful rate limits
      const r = ipSmsHistory.get(clientIp);
      if (r) r.count += 1;
      phoneLastSent.set(cleanTo, now);
    }

    return res.status(200).json({
      success: meliRes.ok,
      data,
      recId: (data as any)?.recId || (data as any)?.Value || 'sim-' + Date.now()
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'خطای شبکه در ارسال پیامک' });
  }
}
