import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const key = (process.env.MELIPAYAMAK_API_KEY || (req.query.apiKey as string) || '29c3b26d3caf4cd3b865f43a10d1b19d').trim();
    const checkRes = await fetch(`https://console.melipayamak.com/api/receive/credit/${key}`);
    const data = await checkRes.json().catch(() => ({}));
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
