import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
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

    // Simple secure token with expiration
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
}
