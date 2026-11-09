import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { apiKey, from, to, text, bodyId, args } = req.body || {};
    // Prioritize environment variable on the server, fallback to client config or default
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

    return res.status(200).json({
      success: meliRes.ok,
      data,
      recId: (data as any)?.recId || (data as any)?.Value || 'sim-' + Date.now()
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
