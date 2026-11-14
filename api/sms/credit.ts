import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedCredit: { amount: number; status: string; fetchedAt: number; provider: string } | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const now = Date.now();
  const provider = (req.query.provider as string) || 'melipayamak';

  // 30-second cache
  if (cachedCredit && cachedCredit.provider === provider && now - cachedCredit.fetchedAt < 30 * 1000) {
    return res.status(200).json({ amount: cachedCredit.amount, status: cachedCredit.status });
  }

  try {
    if (provider === 'kavenegar' || process.env.KAVENEGAR_API_KEY) {
      const key = (process.env.KAVENEGAR_API_KEY || (req.query.apiKey as string) || '').trim();
      if (!key) return res.status(200).json({ amount: 0, status: 'کلید کاوه‌نگار تنظیم نشده' });

      const kRes = await fetch(`https://api.kavenegar.com/v1/${key}/account/info.json`);
      const kData = await kRes.json().catch(() => ({}));
      const amount = kData?.entries?.remaincredit || 0;
      cachedCredit = { amount, status: 'فعال (کاوه‌نگار)', fetchedAt: now, provider };
      return res.status(200).json({ amount, status: 'فعال' });
    }

    if (provider === 'farazsms' || provider === 'ippanel' || process.env.FARAZSMS_API_KEY) {
      const key = (process.env.FARAZSMS_API_KEY || (req.query.apiKey as string) || '').trim();
      if (!key) return res.status(200).json({ amount: 0, status: 'کلید فراز اس‌ام‌اس تنظیم نشده' });

      const fRes = await fetch('https://api2.ippanel.com/api/v1/payment/credit/mine', {
        headers: { Authorization: `AccessKey ${key}` }
      });
      const fData = await fRes.json().catch(() => ({}));
      const amount = fData?.data?.credit || 0;
      cachedCredit = { amount, status: 'فعال (فراز اس‌ام‌اس)', fetchedAt: now, provider };
      return res.status(200).json({ amount, status: 'فعال' });
    }

    // Default: MeliPayamak
    const key = (process.env.MELIPAYAMAK_API_KEY || (req.query.apiKey as string) || '29c3b26d3caf4cd3b865f43a10d1b19d').trim();
    const checkRes = await fetch(`https://console.melipayamak.com/api/receive/credit/${key}`);
    const data = await checkRes.json().catch(() => ({}));

    if (data && typeof data.amount === 'number') {
      cachedCredit = { amount: data.amount, status: data.status || 'فعال', fetchedAt: now, provider };
    }

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
