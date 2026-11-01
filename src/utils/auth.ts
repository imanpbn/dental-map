import { AdminUser, AdminRole } from '../types';

export interface AdminAccountRecord extends AdminUser {
  password_hash: string;
}

const STORAGE_ACCOUNTS_KEY = 'dentalmap_admin_accounts_v1';
const STORAGE_SESSION_KEY = 'dentalmap_admin_session_v1';

// Default master admin account
const DEFAULT_MASTER_ADMIN: AdminAccountRecord = {
  id: 1,
  username: 'admin',
  email: 'admin@dentalmap.ir',
  password_hash: 'DentalMap@2026', // Plaintext simulation or salted hash
  full_name: 'دکتر محمدرضا نایینی (مدیر ارشد سامانه)',
  role: 'super_admin',
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
};

export const AdminAuthService = {
  // Get all registered admin accounts
  getAccounts(): AdminAccountRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify([DEFAULT_MASTER_ADMIN]));
        return [DEFAULT_MASTER_ADMIN];
      }
      return JSON.parse(data);
    } catch {
      return [DEFAULT_MASTER_ADMIN];
    }
  },

  // Save accounts
  saveAccounts(accounts: AdminAccountRecord[]): void {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  },

  // Get current active session
  getCurrentUser(): AdminUser | null {
    try {
      const session = sessionStorage.getItem(STORAGE_SESSION_KEY) || localStorage.getItem(STORAGE_SESSION_KEY);
      if (!session) return null;
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  // Attempt login
  login(usernameOrEmail: string, password: string, rememberMe = true): { success: boolean; user?: AdminUser; error?: string } {
    const trimmedInput = usernameOrEmail.trim().toLowerCase();
    const accounts = this.getAccounts();

    const account = accounts.find(
      (acc) =>
        (acc.username.toLowerCase() === trimmedInput || acc.email.toLowerCase() === trimmedInput) &&
        acc.is_active
    );

    if (!account) {
      return {
        success: false,
        error: 'کاربری با این مشخصات یافت نشد یا حساب کاربری غیرفعال است.'
      };
    }

    if (account.password_hash !== password) {
      return {
        success: false,
        error: 'رمز عبور وارد شده نادرست است.'
      };
    }

    // Update last login
    account.last_login_at = new Date().toISOString();
    this.saveAccounts(accounts);

    const safeUser: AdminUser = {
      id: account.id,
      username: account.username,
      email: account.email,
      full_name: account.full_name,
      role: account.role,
      is_active: account.is_active,
      created_at: account.created_at,
      last_login_at: account.last_login_at,
      avatar: account.avatar
    };

    if (rememberMe) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(safeUser));
    } else {
      sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(safeUser));
    }

    return {
      success: true,
      user: safeUser
    };
  },

  // Register a new admin account
  register(newAdmin: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    role: AdminRole;
  }): { success: boolean; user?: AdminUser; error?: string } {
    const accounts = this.getAccounts();
    const trimmedUsername = newAdmin.username.trim().toLowerCase();
    const trimmedEmail = newAdmin.email.trim().toLowerCase();

    if (!trimmedUsername || trimmedUsername.length < 3) {
      return { success: false, error: 'نام کاربری باید حداقل ۳ نویسه باشد.' };
    }

    if (!newAdmin.password || newAdmin.password.length < 6) {
      return { success: false, error: 'رمز عبور باید حداقل ۶ نویسه داشته باشد.' };
    }

    if (accounts.some((a) => a.username.toLowerCase() === trimmedUsername)) {
      return { success: false, error: 'این نام کاربری قبلاً در سامانه ثبت شده است.' };
    }

    if (accounts.some((a) => a.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'این پست الکترونیک (ایمیل) قبلاً ثبت شده است.' };
    }

    const newRecord: AdminAccountRecord = {
      id: Date.now(),
      username: trimmedUsername,
      email: trimmedEmail,
      password_hash: newAdmin.password,
      full_name: newAdmin.full_name.trim(),
      role: newAdmin.role,
      is_active: true,
      created_at: new Date().toISOString()
    };

    accounts.push(newRecord);
    this.saveAccounts(accounts);

    const safeUser: AdminUser = {
      id: newRecord.id,
      username: newRecord.username,
      email: newRecord.email,
      full_name: newRecord.full_name,
      role: newRecord.role,
      is_active: newRecord.is_active,
      created_at: newRecord.created_at
    };

    return { success: true, user: safeUser };
  },

  // Update password for account
  updatePassword(adminId: number, oldPass: string, newPass: string): { success: boolean; error?: string } {
    const accounts = this.getAccounts();
    const account = accounts.find((a) => a.id === adminId);
    if (!account) return { success: false, error: 'کاربر یافت نشد.' };

    if (account.password_hash !== oldPass) {
      return { success: false, error: 'رمز عبور فعلی نادرست است.' };
    }

    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'رمز عبور جدید باید حداقل ۶ نویسه باشد.' };
    }

    account.password_hash = newPass;
    this.saveAccounts(accounts);
    return { success: true };
  },

  // Logout
  logout(): void {
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }
};
