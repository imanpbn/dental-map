import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Link2,
  CheckCircle,
  XCircle,
  Building,
  PhoneCall,
  ChevronLeft,
  Lock,
  Eye,
  EyeOff,
  User,
  Mail,
  LogOut,
  AlertCircle,
  Users,
  UserPlus,
  Key
} from 'lucide-react';
import {
  Doctor,
  Clinic,
  Insurance,
  ClinicInsurance,
  LeadValuationRecord,
  AdminUser,
  AdminRole
} from '../types';
import { AdminAuthService, AdminAccountRecord } from '../utils/auth';

interface AdminPageProps {
  doctors: Doctor[];
  clinics: Clinic[];
  insurances: Insurance[];
  clinicInsurances: ClinicInsurance[];
  leadValuations: Record<number, LeadValuationRecord>;
  onToggleDoctorVerification: (doctorId: number) => void;
  onToggleClinicInsurance: (clinicId: number, insuranceId: number) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  doctors,
  clinics,
  insurances,
  clinicInsurances,
  leadValuations,
  onToggleDoctorVerification,
  onToggleClinicInsurance
}) => {
  // Current logged in admin session
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() =>
    AdminAuthService.getCurrentUser()
  );

  // Authentication Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<AdminRole>('moderator');

  // Authenticated Dashboard State
  const [adminTab, setAdminTab] = useState<'leads' | 'verification' | 'insurances' | 'accounts'>('leads');
  const [accountsList, setAccountsList] = useState<AdminAccountRecord[]>(() =>
    AdminAuthService.getAccounts()
  );

  // Password Change Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwChangeMessage, setPwChangeMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Handle Lockout countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  // Login handler
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (isLockedOut) {
      setAuthError(`حساب به دلیل تلاش‌های مکرر قفل شده است. لطفاً ${lockoutTimer} ثانیه صبر کنید.`);
      return;
    }

    if (!usernameInput.trim() || !passwordInput) {
      setAuthError('لطفاً نام کاربری و رمز عبور را وارد فرمایید.');
      return;
    }

    const res = AdminAuthService.login(usernameInput, passwordInput, rememberMe);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      setFailedAttempts(0);
      setAccountsList(AdminAuthService.getAccounts());
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 5) {
        setIsLockedOut(true);
        setLockoutTimer(30);
        setAuthError('۵ مرتبه تلاش ناموفق! دسترسی به مدت ۳۰ ثانیه محدود شد.');
      } else {
        setAuthError(res.error || 'اطلاعات ورود نامعتبر است.');
      }
    }
  };

  // Demo auto-fill and quick login
  const handleQuickDemoLogin = () => {
    setUsernameInput('admin@dentalmap.ir');
    setPasswordInput('DentalMap@2026');
    const res = AdminAuthService.login('admin@dentalmap.ir', 'DentalMap@2026', true);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAccountsList(AdminAuthService.getAccounts());
    }
  };

  // Registration handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const res = AdminAuthService.register({
      full_name: regFullName,
      username: regUsername,
      email: regEmail,
      password: regPassword,
      role: regRole
    });

    if (res.success && res.user) {
      setAuthSuccess('حساب کاربری مدیریت با موفقیت ایجاد شد! اکنون وارد پنل شدید.');
      setCurrentUser(res.user);
      setAccountsList(AdminAuthService.getAccounts());
    } else {
      setAuthError(res.error || 'خطا در ثبت حساب کاربری');
    }
  };

  // Logout handler
  const handleLogout = () => {
    AdminAuthService.logout();
    setCurrentUser(null);
    setUsernameInput('');
    setPasswordInput('');
    setAuthError(null);
  };

  // Change password handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwChangeMessage(null);
    if (!currentUser) return;

    const res = AdminAuthService.updatePassword(currentUser.id, oldPassword, newPassword);
    if (res.success) {
      setPwChangeMessage({ text: 'رمز عبور با موفقیت بروزرسانی شد.', isError: false });
      setOldPassword('');
      setNewPassword('');
    } else {
      setPwChangeMessage({ text: res.error || 'خطا در تغییر رمز عبور', isError: true });
    }
  };

  const totalValuation = Object.values(leadValuations).reduce(
    (acc, curr) => acc + curr.total_valuation_toman,
    0
  );
  const totalLeads = Object.values(leadValuations).reduce(
    (acc, curr) => acc + curr.lead_count,
    0
  );

  // --------------------------------------------------------------------------
  // 1. UNAUTHENTICATED: LOGIN & REGISTRATION VIEW
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-8 px-4 selection:bg-emerald-500 selection:text-white">
        {/* Top return link */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به پرتال اصلی دنتال مپ</span>
          </Link>
          <span className="text-[11px] text-slate-500 font-mono">v1.2 Secure Gateway</span>
        </div>

        {/* Central Auth Card */}
        <div className="max-w-md w-full mx-auto bg-slate-950/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Accent glow top */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-white">کنترل‌پنل مدیریت دنتال مپ</h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              دسترسی به داده‌های محرمانه ارزیابی لید، تایید نظام پزشکی و مدیریت کلینیک‌ها
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-900 p-1 mb-6 border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                authMode === 'login'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ورود با حساب کاربری
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                authMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ثبت حساب مدیر جدید
            </button>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Success Alert */}
          {authSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  نام کاربری یا ایمیل سازمانی:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="مثال: admin@dentalmap.ir یا admin"
                    dir="ltr"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    required
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  رمز عبور امنیتی:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    dir="ltr"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-emerald-600"
                  />
                  <span>مرا به خاطر بسپار</span>
                </label>
                <span className="text-[11px] text-slate-500">پروتکل امنیتی SHA-256</span>
              </div>

              <button
                type="submit"
                disabled={isLockedOut}
                className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  isLockedOut
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98]'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{isLockedOut ? `مسدود موقت (${lockoutTimer}s)` : 'ورود امن به پنل مدیریت'}</span>
              </button>

              {/* Demo Credentials Helper Box */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 bg-slate-900/50 p-4 rounded-2xl border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" />
                    <span>حساب آزمایشی مدیر ارشد (پیش‌فرض):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Demo Super Admin</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800/60" dir="ltr">
                  <div><span className="text-slate-500">User:</span> admin@dentalmap.ir</div>
                  <div><span className="text-slate-500">Pass:</span> DentalMap@2026</div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="mt-3 w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
                >
                  ⚡ ورود سریع با حساب تستی (One-Click Demo Login)
                </button>
              </div>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نام و نام خانوادگی مدیر:
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="مثال: دکتر علیرضا ناصری"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نام کاربری (لاتین):
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="admin_naseri"
                  dir="ltr"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  پست الکترونیک (ایمیل سازمانی):
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="naseri@dentalmap.ir"
                  dir="ltr"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نقش و سطح دسترسی:
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as AdminRole)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="moderator">ناظر احراز هویت پزشکان و کلینیک‌ها (Moderator)</option>
                  <option value="analyst">تحلیل‌گر ارزش‌گذاری لیدها (Analyst)</option>
                  <option value="super_admin">مدیر ارشد سامانه (Super Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  رمز عبور امنیتی (حداقل ۶ نویسه):
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>ایجاد حساب کاربری و ورود مستقیم</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="max-w-md w-full mx-auto text-center text-[11px] text-slate-500 mt-6">
          سامانه شفافیت ایمپلنتولوژی و کاتالوگ قطعات دنتال مپ ایران
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. AUTHENTICATED: FULL ADMIN CONTROL PANEL
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium">
              <span>صفحه اصلی دنتال مپ</span>
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold">کنترل‌پنل مدیریت و نظارت دنتال مپ</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Active User Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-700">{currentUser.full_name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {currentUser.role === 'super_admin' ? 'مدیر ارشد' : 'ناظر سیستم'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200"
              title="خروج از حساب مدیریت"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                پنل مدیریت و ارزیابی اقتصادی دنتال مپ
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                احراز صلاحیت جراحان، تخصیص بیمه‌های مراکز و سنجش ارزش مالی شبکه ارجاع بیماران
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>دسترسی امن سطح ادمین برقرار است</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setAdminTab('leads')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'leads'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>ارزیابی لیدها (M&A Lead Engine)</span>
          </button>

          <button
            onClick={() => setAdminTab('verification')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'verification'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span>احراز هویت جراحان و کد نظام پزشکی</span>
          </button>

          <button
            onClick={() => setAdminTab('insurances')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'insurances'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>مدیریت اتصال مراکز و بیمه‌ها</span>
          </button>

          <button
            onClick={() => setAdminTab('accounts')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'accounts'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>مدیریت حساب‌ها و رمز عبور</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Tab 1: Leads Valuation */}
        {/* ------------------------------------------------------------------ */}
        {adminTab === 'leads' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-bold block mb-1">
                  ارزش کل سرنخ‌های ارجاعی (Valuation):
                </span>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  {totalValuation.toLocaleString('fa-IR')} تومان
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  فرمول: تعداد تماس‌ها × ۳۵۰,۰۰۰ تومان ارزش خالص سرنخ
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-bold block mb-1">
                  کل سرنخ‌های ثبت‌شده (Leads Count):
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {totalLeads.toLocaleString('fa-IR')} سرنخ بیمار
                </div>
                <span className="text-[11px] text-emerald-600 font-bold mt-2 block">
                  نرخ تبدیل موفق برآورد شده: ۱۸.۴٪
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-bold block mb-1">
                  مراکز دارای تعهد شناسنامه:
                </span>
                <div className="text-2xl font-black text-teal-700 font-mono">
                  {clinics.length} کلینیک و مرکز
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  ۱۰۰٪ متعهد به ثبت بارکد و رفرنس ایمپلنت
                </span>
              </div>
            </div>

            {/* Leads Breakdown Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                جدول جزئیات تفکیکی ارزیابی سرنخ‌ها به ازای مراکز درمانی:
              </h3>
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-bold">شناسه</th>
                    <th className="pb-3 font-bold">نام مرکز درمانی</th>
                    <th className="pb-3 font-bold">تعداد لید تماس</th>
                    <th className="pb-3 font-bold">ارزش ایجاد شده</th>
                    <th className="pb-3 font-bold">آخرین لید دریافتی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clinics.map((clinic) => {
                    const record = leadValuations[clinic.id];
                    const count = record?.lead_count || 0;
                    const val = record?.total_valuation_toman || 0;
                    return (
                      <tr key={clinic.id} className="hover:bg-slate-50">
                        <td className="py-3.5 font-mono text-slate-400">{clinic.id}</td>
                        <td className="py-3.5 font-bold text-slate-900">{clinic.name}</td>
                        <td className="py-3.5 font-mono font-bold text-slate-800">
                          {count} لید
                        </td>
                        <td className="py-3.5 font-mono font-bold text-emerald-700">
                          {val.toLocaleString('fa-IR')} تومان
                        </td>
                        <td className="py-3.5 text-slate-500">
                          {record ? 'امروز' : 'در انتظار مراجع'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 2: Doctor Verification */}
        {/* ------------------------------------------------------------------ */}
        {adminTab === 'verification' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              بررسی صلاحیت و تاییدیه رسمی کد سازمان نظام پزشکی ایران:
            </h3>
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-bold">جراح / پزشک</th>
                  <th className="pb-3 font-bold">کد نظام پزشکی</th>
                  <th className="pb-3 font-bold">امتیاز</th>
                  <th className="pb-3 font-bold">تعهد شناسنامه</th>
                  <th className="pb-3 font-bold">وضعیت در پرتال</th>
                  <th className="pb-3 font-bold">عملیات نظارتی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-3.5 font-bold text-slate-900">
                      {d.first_name} {d.last_name}
                    </td>
                    <td className="py-3.5 font-mono text-slate-600 font-bold">
                      {d.medical_council_code}
                    </td>
                    <td className="py-3.5 text-amber-500 font-mono font-bold">★ {d.rating}</td>
                    <td className="py-3.5">
                      {d.passport_committed ? (
                        <span className="text-emerald-700 font-bold">تایید شده</span>
                      ) : (
                        <span className="text-slate-400">فاقد تعهد</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      {d.verified ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>احراز هویت شده</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md font-bold flex items-center gap-1 w-fit">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>در انتظار تایید مدارک</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <button
                        onClick={() => onToggleDoctorVerification(d.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                          d.verified
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                        }`}
                      >
                        {d.verified ? 'لغو تاییدیه' : 'تایید صلاحیت جراح'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 3: Insurances */}
        {/* ------------------------------------------------------------------ */}
        {adminTab === 'insurances' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                جدول واسط رابطه‌ای کلینیک‌ها و بیمه‌ها (Clinic_Insurances M:N):
              </h3>
              <p className="text-xs text-slate-500">
                جهت فعال‌سازی یا لغو قرارداد بیمه با هر مرکز درمانی، روی نشانگر بیمه مورد نظر کلیک نمایید.
              </p>
            </div>

            <div className="space-y-4">
              {clinics.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-3">
                    {c.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {insurances.map((ins) => {
                      const isLinked = clinicInsurances.some(
                        (ci) => ci.clinic_id === c.id && ci.insurance_id === ins.id
                      );
                      return (
                        <button
                          key={ins.id}
                          onClick={() => onToggleClinicInsurance(c.id, ins.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            isLinked
                              ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isLinked ? '✓ ' : '+ '}
                          {ins.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Tab 4: Admin Accounts & Password Management */}
        {/* ------------------------------------------------------------------ */}
        {adminTab === 'accounts' && (
          <div className="space-y-6">
            {/* Password Change Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>تغییر رمز عبور حساب جاری ({currentUser.username}):</span>
              </h3>

              {pwChangeMessage && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-bold ${
                    pwChangeMessage.isError
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {pwChangeMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    رمز عبور فعلی:
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    رمز عبور جدید (حداقل ۶ نویسه):
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    ذخیره رمز عبور جدید
                  </button>
                </div>
              </form>
            </div>

            {/* List of Registered Administrators */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>لیست حساب‌های مدیران مجاز سامانه ({accountsList.length}):</span>
                </h3>
              </div>

              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-bold">نام و نام خانوادگی</th>
                    <th className="pb-3 font-bold">نام کاربری</th>
                    <th className="pb-3 font-bold">پست الکترونیک</th>
                    <th className="pb-3 font-bold">نقش سازمانی</th>
                    <th className="pb-3 font-bold">وضعیت</th>
                    <th className="pb-3 font-bold">آخرین ورود</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accountsList.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50">
                      <td className="py-3.5 font-bold text-slate-900">
                        {acc.full_name}
                        {acc.id === currentUser.id && (
                          <span className="mr-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            حساب جاری شما
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 font-mono text-slate-600">{acc.username}</td>
                      <td className="py-3.5 font-mono text-slate-600">{acc.email}</td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-bold text-[11px]">
                          {acc.role === 'super_admin' ? 'مدیر ارشد' : 'ناظر سیستم'}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>فعال</span>
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                        {acc.last_login_at
                          ? new Date(acc.last_login_at).toLocaleDateString('fa-IR')
                          : 'بدون سابقه'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
