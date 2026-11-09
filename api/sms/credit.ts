import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedCredit: { amount: number; status: string; fetchedAt: number } | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const now = Date.now();
  // 30-second in-memory cache to prevent MeliPayamak upstream API rate limit blocks
  if (cachedCredit && now - cachedCredit.fetchedAt < 30 * 1000) {
    return res.status(200).json({ amount: cachedCredit.amount, status: cachedCredit.status });
  }

  try {
    const key = (process.env.MELIPAYAMAK_API_KEY || (req.query.apiKey as string) || '29c3b26d3caf4cd3b865f43a10d1b19d').trim();
    const checkRes = await fetch(`https://console.melipayamak.com/api/receive/credit/${key}`);
    const data = await checkRes.json().catch(() => ({}));
    
    if (data && typeof data.amount === 'number') {
      cachedCredit = { amount: data.amount, status: data.status || 'فعال', fetchedAt: now };
    }

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
