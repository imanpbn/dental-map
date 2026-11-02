import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Cpu,
  Package,
  DollarSign,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Globe,
  Tag,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  X,
  ChevronLeft,
  LogOut,
  Key,
  Lock,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Link2,
  Sparkles,
  PhoneCall,
  UserPlus,
  Database,
  Cloud,
  RefreshCw,
  Send,
  MessageSquare,
  Smartphone,
  FileCode
} from 'lucide-react';
import {
  Doctor,
  Clinic,
  DentalComponent,
  WordPressBlogPost,
  WordPressPage,
  ClinicalPackage,
  ImplantBrand,
  Insurance,
  ClinicInsurance,
  LeadValuationRecord,
  AdminUser,
  AdminRole,
  SiteSettings,
  ComponentCategory
} from '../types';
import { AdminAuthService, AdminAccountRecord } from '../utils/auth';
import { CmsStorageService, defaultSiteSettings } from '../utils/cmsStorage';
import { SupabaseSyncService, isSupabaseConfigured, getSupabaseConfig } from '../utils/supabaseClient';
import { SmsService } from '../utils/smsService';

type AdminSection =
  | 'dashboard'
  | 'posts'
  | 'pages'
  | 'doctors'
  | 'clinics'
  | 'components'
  | 'brands'
  | 'packages'
  | 'leads'
  | 'users'
  | 'settings'
  | 'seo'
  | 'sms';

interface AdminPageProps {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  clinics: Clinic[];
  setClinics: React.Dispatch<React.SetStateAction<Clinic[]>>;
  components: DentalComponent[];
  setComponents: React.Dispatch<React.SetStateAction<DentalComponent[]>>;
  blogPosts: WordPressBlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<WordPressBlogPost[]>>;
  pages: WordPressPage[];
  setPages: React.Dispatch<React.SetStateAction<WordPressPage[]>>;
  packages: ClinicalPackage[];
  setPackages: React.Dispatch<React.SetStateAction<ClinicalPackage[]>>;
  brands: ImplantBrand[];
  setBrands: React.Dispatch<React.SetStateAction<ImplantBrand[]>>;
  insurances: Insurance[];
  clinicInsurances: ClinicInsurance[];
  leadValuations: Record<number, LeadValuationRecord>;
  onToggleDoctorVerification: (doctorId: number) => void;
  onToggleClinicInsurance: (clinicId: number, insuranceId: number) => void;
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  doctors,
  setDoctors,
  clinics,
  setClinics,
  components,
  setComponents,
  blogPosts,
  setBlogPosts,
  pages,
  setPages,
  packages,
  setPackages,
  brands,
  setBrands,
  insurances,
  clinicInsurances,
  leadValuations,
  onToggleDoctorVerification,
  onToggleClinicInsurance,
  siteSettings,
  setSiteSettings
}) => {
  // Session State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() =>
    AdminAuthService.getCurrentUser()
  );

  // Active Sidebar Section (WordPress Menu)
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  // Authentication Form States
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Registration Form States
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<AdminRole>('moderator');

  // Search & Filters within CMS
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modals for CRUD operations
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<WordPressBlogPost | null>(null);

  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<WordPressPage | null>(null);

  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<DentalComponent | null>(null);

  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);

  // User Accounts
  const [accountsList, setAccountsList] = useState<AdminAccountRecord[]>(() =>
    AdminAuthService.getAccounts()
  );

  // Supabase Cloud State
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // MeliPayamak SMS State
  const [smsConfig, setSmsConfig] = useState(() => SmsService.getSettings());
  const [smsLogs, setSmsLogs] = useState(() => SmsService.getLogs());
  const [testSmsPhone, setTestSmsPhone] = useState('');
  const [testSmsMessage, setTestSmsMessage] = useState('سلام، این یک پیامک آزمایشی از سامانه استعلام و پاسپورت ایمپلنت دنتال‌مپ است.');
  const [isSendingTestSms, setIsSendingTestSms] = useState(false);
  const [testSmsResult, setTestSmsResult] = useState<{ success: boolean; message: string; recId?: string } | null>(null);
  const [smsCredit, setSmsCredit] = useState<{ amount?: number; status?: string } | null>(null);

  useEffect(() => {
    if (activeSection === 'sms') {
      SmsService.getCredit().then((data) => setSmsCredit(data)).catch(() => {});
    }
  }, [activeSection]);

  const handleSaveSmsSettings = (e: React.FormEvent) => {
    e.preventDefault();
    SmsService.saveSettings(smsConfig);
    showToast('تنظیمات سامانه ملی‌پیامک با موفقیت ذخیره شد.');
  };

  const handleSendTestSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testSmsPhone) {
      alert('لطفاً شماره موبایل گیرنده را وارد فرمایید.');
      return;
    }

    setIsSendingTestSms(true);
    setTestSmsResult(null);

    const res = await SmsService.sendSms({
      to: testSmsPhone,
      text: testSmsMessage,
      type: 'test'
    });

    setIsSendingTestSms(false);
    setTestSmsResult(res);
    setSmsLogs(SmsService.getLogs());
    if (res.success) {
      showToast('پیامک آزمایشی با موفقیت ارسال شد.');
    }
  };

  const handleClearSmsLogs = () => {
    if (window.confirm('آیا از پاک‌سازی تاریخچه پیامک‌ها اطمینان دارید؟')) {
      SmsService.clearLogs();
      setSmsLogs([]);
      showToast('تاریخچه پیامک‌ها پاک شد.');
    }
  };

  // Show Toast
  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Lockout Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  // Handle Login
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (isLockedOut) {
      setAuthError(`حساب مسدود است. لطفاً ${lockoutTimer} ثانیه صبر کنید.`);
      return;
    }

    const res = AdminAuthService.login(usernameInput, passwordInput, rememberMe);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAccountsList(AdminAuthService.getAccounts());
      showToast(`خوش آمدید ${res.user.full_name}`);
    } else {
      setAuthError(res.error || 'اطلاعات ورود نادرست است.');
    }
  };

  // Handle Demo Quick Login
  const handleQuickDemoLogin = () => {
    const res = AdminAuthService.login('admin@dentalmap.ir', 'DentalMap@2026', true);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAccountsList(AdminAuthService.getAccounts());
      showToast('ورود با حساب مدیر ارشد انجام شد.');
    }
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = AdminAuthService.register({
      full_name: regFullName,
      username: regUsername,
      email: regEmail,
      password: regPassword,
      role: regRole
    });

    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAccountsList(AdminAuthService.getAccounts());
      showToast('حساب کاربری جدید ایجاد شد و وارد شدید.');
    } else {
      setAuthError(res.error || 'خطا در ثبت حساب کاربری');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    AdminAuthService.logout();
    setCurrentUser(null);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    if (!currentUser) return;

    const res = AdminAuthService.updatePassword(currentUser.id, oldPassword, newPassword);
    if (res.success) {
      setPwMessage({ text: 'رمز عبور با موفقیت تغییر یافت.', isError: false });
      setOldPassword('');
      setNewPassword('');
    } else {
      setPwMessage({ text: res.error || 'خطا در تغییر رمز عبور', isError: true });
    }
  };

  // Calculations for KPI Cards
  const totalValuation = Object.values(leadValuations).reduce(
    (acc, curr) => acc + curr.total_valuation_toman,
    0
  );
  const totalLeads = Object.values(leadValuations).reduce(
    (acc, curr) => acc + curr.lead_count,
    0
  );

  // --------------------------------------------------------------------------
  // 1. UNAUTHENTICATED SCREEN (WordPress Login)
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-10 px-4">
        <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>بازگشت به سایت دنتال مپ</span>
          </Link>
          <span className="text-[11px] text-slate-500 font-mono">WordPress-grade CMS v7.1</span>
        </div>

        <div className="max-w-md w-full mx-auto bg-slate-950/90 backdrop-blur-md rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-white">ورود به پیشخوان دنتال مپ (CMS)</h1>
            <p className="text-xs text-slate-400 mt-1">
              مدیریت نوشته‌ها، پزشکان، کاتالوگ قطعات، مراکز و سئوی سایت
            </p>
          </div>

          <div className="flex rounded-xl bg-slate-900 p-1 mb-6 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(null); }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                authMode === 'login' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ورود به سیستم
            </button>
            <button
              onClick={() => { setAuthMode('register'); setAuthError(null); }}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                authMode === 'register' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              عضویت مدیر جدید
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نام کاربری یا ایمیل:
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin@dentalmap.ir"
                  dir="ltr"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  رمز عبور:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    dir="ltr"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-emerald-600"
                  />
                  <span>مرا به خاطر بسپار</span>
                </label>
                <span className="text-[11px] text-slate-500">پروتکل امنیتی شتاب‌یافته</span>
              </div>

              <button
                type="submit"
                disabled={isLockedOut}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>ورود به پیشخوان مدیریت</span>
              </button>

              <div className="pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
                >
                  ⚡ ورود با یک کلیک (حساب پیش‌فرض مدیر ارشد)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نام و نام خانوادگی مدیر:
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="دکتر علیرضا محمدی"
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
                  placeholder="editor_mohammadi"
                  dir="ltr"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  پست الکترونیک (ایمیل):
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="mohammadi@dentalmap.ir"
                  dir="ltr"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  سطح دسترسی:
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as AdminRole)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="moderator">نویسنده و ناظر محتوا (Editor / Moderator)</option>
                  <option value="analyst">تحلیل‌گر ارزیابی لید (Analyst)</option>
                  <option value="super_admin">مدیر ارشد کل سامانه (Super Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  رمز عبور (حداقل ۶ نویسه):
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
                <span>ثبت حساب و ورود به پیشخوان</span>
              </button>
            </form>
          )}
        </div>

        <div className="max-w-md w-full mx-auto text-center text-[11px] text-slate-500 mt-6">
          سامانه شفافیت ایمپلنت دندان دنتال مپ ایران
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. AUTHENTICATED: WORDPRESS-STYLE FULL CMS DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* WORDPRESS TOP ADMIN BAR (نوار ابزار بالای وردپرس) */}
      {/* ------------------------------------------------------------------ */}
      <header className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-4 h-11 flex items-center justify-between sticky top-0 z-40 select-none">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 text-slate-200 hover:text-emerald-400 font-bold transition-colors"
            title="مشاهده وب‌سایت در برگه جدید"
          >
            <span className="text-emerald-400">🦷</span>
            <span>دنتال مپ ایران</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Quick Create Dropdown / Buttons */}
          <div className="hidden md:flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">➕ ایجاد تازه:</span>
            <button
              onClick={() => {
                setEditingPost(null);
                setIsPostModalOpen(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              نوشته
            </button>
            <button
              onClick={() => {
                setEditingDoctor(null);
                setIsDoctorModalOpen(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              پزشک
            </button>
            <button
              onClick={() => {
                setEditingComponent(null);
                setIsComponentModalOpen(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              قطعه ایمپلنت
            </button>
            <button
              onClick={() => {
                setEditingClinic(null);
                setIsClinicModalOpen(true);
              }}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              مرکز درمانی
            </button>
          </div>
        </div>

        {/* User Pill & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">درود،</span>
            <span className="font-bold text-emerald-400">{currentUser.full_name}</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {currentUser.role === 'super_admin' ? 'مدیر ارشد' : 'نویسنده / ناظر'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-[11px] font-bold border border-rose-800/50 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTAINER: SIDEBAR + CONTENT AREA */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* WORDPRESS RTL SIDEBAR (ستون کناری ناوبری وردپرس) */}
        <aside className="w-full md:w-64 bg-slate-900 border-l border-slate-800 text-slate-300 shrink-0 select-none">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                DENTAL MAP CMS v7.1.3
              </span>
              <span className="text-xs font-black text-white">منوی اصلی مدیریت</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          {/* Sidebar Menu Items */}
          <nav className="p-2 space-y-1 text-xs">
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>پیشخوان (Dashboard)</span>
              </div>
            </button>

            {/* 2. Posts */}
            <button
              onClick={() => setActiveSection('posts')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'posts'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>نوشته‌ها و مقالات</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-emerald-400 font-mono">
                {blogPosts.length}
              </span>
            </button>

            {/* 3. Pages (برگه‌ها / صفحات ایستا) */}
            <button
              onClick={() => setActiveSection('pages')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'pages'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>برگه‌ها (صفحات)</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-teal-400 font-mono">
                {pages.length}
              </span>
            </button>

            {/* 4. Doctors */}
            <button
              onClick={() => setActiveSection('doctors')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'doctors'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>پزشکان و جراحان</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-teal-400 font-mono">
                {doctors.length}
              </span>
            </button>

            {/* 4. Clinics */}
            <button
              onClick={() => setActiveSection('clinics')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'clinics'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4" />
                <span>کلینیک‌ها و مراکز</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-amber-400 font-mono">
                {clinics.length}
              </span>
            </button>

            {/* 5. Components */}
            <button
              onClick={() => setActiveSection('components')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'components'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4" />
                <span>کاتالوگ قطعات ۸ گانه</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-cyan-400 font-mono">
                {components.length}
              </span>
            </button>

            {/* 6. Packages */}
            <button
              onClick={() => setActiveSection('packages')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'packages'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>پکیج‌های جراحی</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-indigo-400 font-mono">
                {packages.length}
              </span>
            </button>

            {/* 7. Leads Valuation */}
            <button
              onClick={() => setActiveSection('leads')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'leads'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4" />
                <span>ارزیابی لید و درآمد M&A</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </button>

            <div className="my-2 border-t border-slate-800" />

            {/* 8. Users & Permissions */}
            <button
              onClick={() => setActiveSection('users')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'users'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>کاربران و مدیران</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
                {accountsList.length}
              </span>
            </button>

            {/* 9. Site Settings */}
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'settings'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>تنظیمات عمومی سایت</span>
              </div>
            </button>

            {/* 10. SEO Meta */}
            <button
              onClick={() => setActiveSection('seo')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'seo'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" />
                <span>سئو و یواست (Yoast SEO)</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">
                100% OK
              </span>
            </button>

            {/* 11. SMS Gateway (MeliPayamak) */}
            <button
              onClick={() => setActiveSection('sms')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeSection === 'sms'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>سامانه پیامک (ملی‌پیامک)</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">
                فعال
              </span>
            </button>
          </nav>
        </aside>

        {/* ------------------------------------------------------------------ */}
        {/* MAIN CMS CONTENT VIEW (محیط کاربری محتوا) */}
        {/* ------------------------------------------------------------------ */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ---------------------------------------------------------------- */}
          {/* SECTION: DASHBOARD */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>پیشخوان مدیریت یکپارچه محتوای دنتال مپ</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black mb-2">
                    درود، {currentUser.full_name} به CMS دنتال مپ خوش آمدید!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    از طریق این بخش می‌توانید تمامی نوشته‌ها، پزشکان، کاتالوگ قطعات ۸ گانه و تنظیمات سایت را به صورت آنی مدیریت نمایید. تغییرات بلافاصله در فرانت‌اند اعمال می‌شوند.
                  </p>
                </div>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                    <span>ارزش اقتصادی لیدها:</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl font-black text-emerald-700 font-mono">
                    {totalValuation.toLocaleString('fa-IR')} ت
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    {totalLeads} لید ثبت شده
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                    <span>پزشکان تایید شده:</span>
                    <UserCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {doctors.filter((d) => d.verified).length} / {doctors.length}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                    ۱۰۰٪ دارای کد نظام پزشکی
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                    <span>مراکز درمانی فعال:</span>
                    <Building2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {clinics.length} کلینیک
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    تهران و سایر استان‌ها
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
                    <span>قطعات در کاتالوگ:</span>
                    <Cpu className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {components.length} قطعه
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    در ۸ دسته‌بندی تخصصی
                  </span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>دسترسی‌های سریع (Quick Launchers):</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setEditingPost(null);
                      setIsPostModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex flex-col items-center gap-2 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-emerald-700" />
                    <span>نوشتن مقاله جدید</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingDoctor(null);
                      setIsDoctorModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold flex flex-col items-center gap-2 transition-colors"
                  >
                    <Users className="w-5 h-5 text-teal-700" />
                    <span>افزودن جراح جدید</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingComponent(null);
                      setIsComponentModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-xs font-bold flex flex-col items-center gap-2 transition-colors"
                  >
                    <Cpu className="w-5 h-5 text-cyan-700" />
                    <span>ثبت قطعه ایمپلنت</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingClinic(null);
                      setIsClinicModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex flex-col items-center gap-2 transition-colors"
                  >
                    <Building2 className="w-5 h-5 text-amber-700" />
                    <span>افزودن مرکز درمانی</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: POSTS (نوشته‌ها و مقالات) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'posts' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    مدیریت نوشته‌ها و مقالات دانشنامه وبلاگ (/blog)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    افزودن، ویرایش، حذف و انتشار مقالات متصل به وردپرس headless
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingPost(null);
                    setIsPostModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن نوشته تازه</span>
                </button>
              </div>

              {/* Table of Posts */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 font-bold">تصویر</th>
                      <th className="pb-3 font-bold">عنوان نوشته</th>
                      <th className="pb-3 font-bold">دسته‌بندی</th>
                      <th className="pb-3 font-bold">نویسنده</th>
                      <th className="pb-3 font-bold">زمان مطالعه</th>
                      <th className="pb-3 font-bold">تاریخ انتشار</th>
                      <th className="pb-3 font-bold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <img
                            src={post.featured_image}
                            alt=""
                            className="w-12 h-9 rounded-lg object-cover border"
                          />
                        </td>
                        <td className="py-3 font-bold text-slate-900 max-w-md">
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank"
                            className="hover:text-emerald-700 flex items-center gap-1"
                          >
                            <span>{post.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            /{post.slug}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">{post.author}</td>
                        <td className="py-3 font-mono">{post.read_time_minutes} دقیقه</td>
                        <td className="py-3 text-slate-400 font-mono text-[11px]">
                          {post.published_at}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingPost(post);
                                setIsPostModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="ویرایش نوشته"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('آیا از حذف این نوشته اطمینان دارید؟')) {
                                  const updated = blogPosts.filter((p) => p.id !== post.id);
                                  setBlogPosts(updated);
                                  CmsStorageService.saveBlogPosts(updated);
                                  SupabaseSyncService.deleteBlogPost(post.id);
                                  showToast('نوشته با موفقیت حذف گردید.');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                              title="حذف نوشته"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: PAGES (برگه‌ها / صفحات ایستا) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'pages' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-emerald-600" />
                    <span>مدیریت برگه‌ها (صفحات ایستا و لندینگ‌ها)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    افزودن، ویرایش، حذف و انتشار صفحات مستقل سایت (درباره ما، شرایط و قوانین، تماس، صفحات فرود)
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingPage(null);
                    setIsPageModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن برگه تازه</span>
                </button>
              </div>

              {/* Table of Pages */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-3 pr-2">عنوان برگه</th>
                      <th className="pb-3">پیوند یکتا (Slug)</th>
                      <th className="pb-3">نویسنده</th>
                      <th className="pb-3">قالب برگه</th>
                      <th className="pb-3">وضعیت</th>
                      <th className="pb-3">تاریخ</th>
                      <th className="pb-3 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {pages.map((page) => (
                      <tr key={page.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 pr-2 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <FileCode className="w-4 h-4 text-slate-400" />
                            <span>{page.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 font-mono text-emerald-700 dir-ltr text-right">
                          /page/{page.slug}
                        </td>
                        <td className="py-3.5 text-slate-600">{page.author}</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {page.template === 'fullwidth' ? 'تمام‌عرض' : page.template === 'narrow' ? 'تک‌ستونه' : 'پیش‌فرض'}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              page.status === 'publish'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {page.status === 'publish' ? 'منتشرشده' : 'پیش‌نویس'}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                          {page.published_at}
                        </td>
                        <td className="py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={`/page/${page.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                              title="مشاهده برگه در سایت"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => {
                                setEditingPage(page);
                                setIsPageModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                              title="ویرایش برگه"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`آیا از حذف برگه «${page.title}» مطمئن هستید؟`)) {
                                  const updated = pages.filter((p) => p.id !== page.id);
                                  setPages(updated);
                                  CmsStorageService.savePages(updated);
                                  showToast('برگه با موفقیت حذف گردید.');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                              title="حذف برگه"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: DOCTORS (پزشکان و جراحان) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'doctors' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    بانک اطلاعات و احراز هویت جراحان و دندانپزشکان
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    مدیریت پروفایل‌ها، استعلام کدهای نظام پزشکی و تعهدنامه شناسنامه اصالت
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingDoctor(null);
                    setIsDoctorModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن پزشک جدید</span>
                </button>
              </div>

              {/* Table of Doctors */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 font-bold">پزشک</th>
                      <th className="pb-3 font-bold">کد نظام پزشکی</th>
                      <th className="pb-3 font-bold">سابقه</th>
                      <th className="pb-3 font-bold">امتیاز</th>
                      <th className="pb-3 font-bold">تعهد شناسنامه</th>
                      <th className="pb-3 font-bold">وضعیت تایید</th>
                      <th className="pb-3 font-bold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {doctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={doc.avatar}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border"
                            />
                            <div>
                              <Link
                                to={`/doctor/${doc.medical_council_code}-${doc.slug}`}
                                target="_blank"
                                className="font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
                              >
                                <span>{doc.first_name} {doc.last_name}</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </Link>
                              <span className="text-[10px] text-slate-500 block">
                                {doc.gender === 'male' ? 'آقا' : 'خانم'} • رده سنی: {doc.patient_age_group}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-mono font-bold text-slate-700">
                          {doc.medical_council_code}
                        </td>
                        <td className="py-3 text-slate-600 font-mono">{doc.experience_years} سال</td>
                        <td className="py-3 text-amber-500 font-mono font-bold">★ {doc.rating}</td>
                        <td className="py-3">
                          {doc.passport_committed ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              ✓ دارای تعهد
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">فاقد تعهد</span>
                          )}
                        </td>
                        <td className="py-3">
                          {doc.verified ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>تایید نظام پزشکی</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3 text-amber-600" />
                              <span>در انتظار بررسی</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onToggleDoctorVerification(doc.id);
                                const updated = doctors.map((d) =>
                                  d.id === doc.id ? { ...d, verified: !d.verified } : d
                                );
                                setDoctors(updated);
                                CmsStorageService.saveDoctors(updated);
                                showToast('وضعیت تایید پزشک تغییر یافت.');
                              }}
                              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                                doc.verified
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {doc.verified ? 'لغو' : 'تایید'}
                            </button>
                            <button
                              onClick={() => {
                                setEditingDoctor(doc);
                                setIsDoctorModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('آیا از حذف این پزشک مطمئنید؟')) {
                                  const updated = doctors.filter((d) => d.id !== doc.id);
                                  setDoctors(updated);
                                  CmsStorageService.saveDoctors(updated);
                                  SupabaseSyncService.deleteDoctor(doc.id);
                                  showToast('پزشک حذف شد.');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: CLINICS (مراکز و کلینیک‌ها) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'clinics' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    مدیریت مراکز درمانی، کلینیک‌ها و بیمارستان‌های دندانپزشکی
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    اتصال قراردادهای بیمه‌های تکمیلی، آدرس، تلفن و وضعیت شبانه‌روزی
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingClinic(null);
                    setIsClinicModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن مرکز جدید</span>
                </button>
              </div>

              {/* Table of Clinics */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 font-bold">نام مرکز درمانی</th>
                      <th className="pb-3 font-bold">نوع مرکز</th>
                      <th className="pb-3 font-bold">آدرس و تلفن</th>
                      <th className="pb-3 font-bold">۲۴ ساعته</th>
                      <th className="pb-3 font-bold">بیمه‌های متصل</th>
                      <th className="pb-3 font-bold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clinics.map((clinic) => {
                      const matchedIns = clinicInsurances
                        .filter((ci) => ci.clinic_id === clinic.id)
                        .map((ci) => insurances.find((ins) => ins.id === ci.insurance_id))
                        .filter(Boolean) as Insurance[];

                      return (
                        <tr key={clinic.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3">
                            <span className="font-bold text-slate-900 block">{clinic.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {clinic.id} • /{clinic.slug}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {clinic.center_type === 'hospital'
                                ? 'بیمارستان'
                                : clinic.center_type === 'clinic'
                                ? 'کلینیک'
                                : 'مطب شخصی'}
                            </span>
                          </td>
                          <td className="py-3 text-slate-600 max-w-xs">
                            <div className="truncate">{clinic.address}</div>
                            <div className="font-mono text-[10px] text-slate-400">{clinic.phone}</div>
                          </td>
                          <td className="py-3">
                            {clinic.is_24_7 ? (
                              <span className="text-emerald-700 font-bold">۲۴/۷ شبانه‌روزی</span>
                            ) : (
                              <span className="text-slate-400">ساعات مشخص</span>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              {matchedIns.length > 0 ? (
                                matchedIns.map((ins) => (
                                  <span
                                    key={ins.id}
                                    className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[10px]"
                                  >
                                    {ins.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-400 text-[10px]">صرفاً تعرفه آزاد</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingClinic(clinic);
                                  setIsClinicModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('آیا از حذف این مرکز اطمینان دارید؟')) {
                                    const updated = clinics.filter((c) => c.id !== clinic.id);
                                    setClinics(updated);
                                    CmsStorageService.saveClinics(updated);
                                    SupabaseSyncService.deleteClinic(clinic.id);
                                    showToast('مرکز درمانی با موفقیت حذف شد.');
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: COMPONENTS (کاتالوگ قطعات ۸ گانه) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'components' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    کاتالوگ قطعات هشت‌گانه ایمپلنت دندان (Components & SKUs)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    فیکسچر، اباتمنت، هیلینگ، ایمپرشن، آنالوگ، کیت، اسکن‌بادی و دیجیتال آنالوگ
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingComponent(null);
                    setIsComponentModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت قطعه جدید</span>
                </button>
              </div>

              {/* Table of Components */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 font-bold">کد رفرنس (REF)</th>
                      <th className="pb-3 font-bold">شماره لات</th>
                      <th className="pb-3 font-bold">نام قطعه</th>
                      <th className="pb-3 font-bold">رده ۸ گانه</th>
                      <th className="pb-3 font-bold">پلتفرم / هگز</th>
                      <th className="pb-3 font-bold">آلیاژ ساخت</th>
                      <th className="pb-3 font-bold">قیمت قطعه اصلی</th>
                      <th className="pb-3 font-bold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {components.map((part) => (
                      <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 font-mono font-bold text-emerald-700">
                          <Link
                            to={`/parts/ref/${part.ref_code}`}
                            target="_blank"
                            className="hover:underline flex items-center gap-1"
                          >
                            <span>{part.ref_code}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </td>
                        <td className="py-3 font-mono text-slate-500">{part.lot_number}</td>
                        <td className="py-3 font-bold text-slate-900 max-w-xs">
                          <div className="truncate">{part.name_fa}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {part.name_en}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {part.category}
                          </span>
                        </td>
                        <td className="py-3 font-mono">{part.hex_size || part.platform_size || '-'}</td>
                        <td className="py-3 text-slate-600">{part.material}</td>
                        <td className="py-3 font-mono font-bold text-slate-900">
                          {part.price_toman.toLocaleString('fa-IR')} ت
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingComponent(part);
                                setIsComponentModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('آیا از حذف این قطعه اطمینان دارید؟')) {
                                  const updated = components.filter((c) => c.id !== part.id);
                                  setComponents(updated);
                                  CmsStorageService.saveComponents(updated);
                                  SupabaseSyncService.deleteComponent(part.id);
                                  showToast('قطعه ایمپلنت با موفقیت حذف شد.');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: PACKAGES (پکیج‌های جراحی) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'packages' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <h2 className="text-base font-black text-slate-900 pb-2 border-b">
                مدیریت پکیج‌های کامل جراحی و پروتز ایمپلنت (Surgical Suites)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {pkg.brand_name}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-2 mb-1">{pkg.title}</h3>
                      <p className="text-xs text-slate-500 mb-4">{pkg.description}</p>
                      <div className="space-y-1 text-xs text-slate-600 mb-4 font-mono">
                        <div>فیکسچر: {pkg.fixture_ref}</div>
                        <div>اباتمنت: {pkg.abutment_ref}</div>
                        <div>کلاهک لثه: {pkg.healing_ref}</div>
                        <div>ایمپرشن: {pkg.impression_ref}</div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {pkg.price_toman.toLocaleString('fa-IR')} ت
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded">
                        {pkg.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: LEADS VALUATION (ارزیابی اقتصادی لید) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'leads' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-slate-900">
                    موتور ارزش‌گذاری سرنخ‌های ارجاعی (M&A Lead Engine):
                  </h2>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                    نرخ هر لید: ۳۵۰,۰۰۰ تومان
                  </span>
                </div>
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 font-bold">شناسه</th>
                      <th className="pb-3 font-bold">مرکز درمانی</th>
                      <th className="pb-3 font-bold">تعداد لید تماس</th>
                      <th className="pb-3 font-bold">ارزش ایجاد شده</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clinics.map((clinic) => {
                      const record = leadValuations[clinic.id];
                      const count = record?.lead_count || 0;
                      const val = record?.total_valuation_toman || 0;
                      return (
                        <tr key={clinic.id} className="hover:bg-slate-50">
                          <td className="py-3 font-mono text-slate-400">{clinic.id}</td>
                          <td className="py-3 font-bold text-slate-900">{clinic.name}</td>
                          <td className="py-3 font-mono font-bold">{count} تماس</td>
                          <td className="py-3 font-mono font-bold text-emerald-700">
                            {val.toLocaleString('fa-IR')} تومان
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: USERS & PERMISSIONS (کاربران و مدیران) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              {/* Password Change Box */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-600" />
                  <span>تغییر رمز عبور حساب جاری ({currentUser.username}):</span>
                </h3>

                {pwMessage && (
                  <div
                    className={`p-3 rounded-xl mb-4 text-xs font-bold ${
                      pwMessage.isError
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {pwMessage.text}
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
                      رمز عبور جدید:
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
                      ذخیره رمز جدید
                    </button>
                  </div>
                </form>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>مدیران و دسترسی‌های سامانه ({accountsList.length}):</span>
                </h3>
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 font-bold">نام و نام خانوادگی</th>
                      <th className="pb-3 font-bold">نام کاربری</th>
                      <th className="pb-3 font-bold">ایمیل</th>
                      <th className="pb-3 font-bold">نقش</th>
                      <th className="pb-3 font-bold">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accountsList.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50">
                        <td className="py-3 font-bold text-slate-900">{acc.full_name}</td>
                        <td className="py-3 font-mono text-slate-600">{acc.username}</td>
                        <td className="py-3 font-mono text-slate-600">{acc.email}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                            {acc.role === 'super_admin' ? 'مدیر ارشد' : 'ناظر سیستم'}
                          </span>
                        </td>
                        <td className="py-3 text-emerald-700 font-bold">فعال</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: SITE SETTINGS (تنظیمات عمومی سایت) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              {/* SUPABASE CLOUD DATABASE INTEGRATION CARD */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-700/80 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-white">
                          پایگاه‌داده رابطه‌ای ابری Supabase PostgreSQL
                        </h2>
                        {isSupabaseConfigured() ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            متصل به Vercel & Supabase
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            حالت لوکال (آفلاین)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        یکپارچه‌سازی سرورلس با پایگاه‌داده PostgreSQL سوپابیس و هاستینگ Vercel برای ذخیره و همگام‌سازی ابری اطلاعات
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      disabled={isTestingSupabase}
                      onClick={async () => {
                        setIsTestingSupabase(true);
                        setSupabaseTestResult(null);
                        try {
                          const res = await SupabaseSyncService.testConnection();
                          setSupabaseTestResult(res);
                        } finally {
                          setIsTestingSupabase(false);
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupabase ? "animate-spin text-emerald-400" : ""}`} />
                      <span>{isTestingSupabase ? 'در حال تست...' : 'تست اتصال به سوپابیس'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSyncingSupabase}
                      onClick={async () => {
                        if (!window.confirm('آیا مایلید تمامی اطلاعات فعلی (پزشکان، کلینیک‌ها، قطعات، مقالات و پکیج‌ها) در دیتابیس Supabase ثبت شوند؟')) {
                          return;
                        }
                        setIsSyncingSupabase(true);
                        try {
                          const res = await SupabaseSyncService.syncAllLocalToSupabase({
                            doctors,
                            clinics,
                            components,
                            blogPosts,
                            packages,
                            settings: siteSettings
                          });
                          if (res.success) {
                            showToast('همگام‌سازی ابری با موفقیت انجام شد!');
                            setSupabaseTestResult({
                              success: true,
                              message: `با موفقیت همگام‌سازی شد: ${res.counts.doctors} پزشک، ${res.counts.clinics} کلینیک، ${res.counts.components} قطعه، ${res.counts.blogPosts} مقاله.`
                            });
                          } else {
                            setSupabaseTestResult({
                              success: false,
                              message: res.message
                            });
                          }
                        } finally {
                          setIsSyncingSupabase(false);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      <Cloud className={`w-4 h-4 ${isSyncingSupabase ? "animate-bounce" : ""}`} />
                      <span>{isSyncingSupabase ? 'در حال همگام‌سازی...' : 'همگام‌سازی کلیه اطلاعات به دیتابیس ابری'}</span>
                    </button>
                  </div>
                </div>

                {/* Connection Test / Status Result Alert */}
                {supabaseTestResult && (
                  <div
                    className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${
                      supabaseTestResult.success
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    {supabaseTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-bold">{supabaseTestResult.message}</p>
                    </div>
                  </div>
                )}

                {/* Configuration Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                    <span className="text-slate-400 text-[11px] block mb-1">وضعیت شناسایی متغیرهای محیطی:</span>
                    <span className="font-bold font-mono text-emerald-400">
                      {isSupabaseConfigured() ? 'NEXT_PUBLIC_ / SUPABASE_* شناسایی شد' : 'متغیرهای محیطی تنظیم نشده‌اند'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                    <span className="text-slate-400 text-[11px] block mb-1">آدرس دامنه پایگاه‌داده:</span>
                    <span className="font-bold font-mono text-slate-200 dir-ltr text-right block">
                      {getSupabaseConfig().url}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                    <span className="text-slate-400 text-[11px] block mb-1">موتور ذخیره‌سازی دوگانه:</span>
                    <span className="font-bold text-slate-200">
                      PostgreSQL ابری + LocalStorage آفلاین
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400 leading-relaxed flex items-center justify-between">
                  <span>
                    راهنما: برای ایجاد جداول در سوپابیس برای اولین بار، وارد پنل Supabase شده و محتوای فایل <code className="text-emerald-300 font-mono">database/schema.sql</code> را در بخش SQL Editor کپی و روی Run کلیک کنید.
                  </span>
                </div>
              </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    تنظیمات عمومی پلتفرم دنتال مپ
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    شماره تلفن خط ویژه، پیام‌های نوار بالا و بازنشانی پیش‌فرض
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('آیا مایلید تمام داده‌های سایت به تنظیمات اولیه کارخانه بازگردد؟')) {
                      CmsStorageService.resetToDefaults();
                      setDoctors(CmsStorageService.getDoctors());
                      setClinics(CmsStorageService.getClinics());
                      setComponents(CmsStorageService.getComponents());
                      setBlogPosts(CmsStorageService.getBlogPosts());
                      setSiteSettings(defaultSiteSettings);
                      showToast('تمامی تنظیمات و داده‌ها به حالت اولیه کارخانه بازنشانی شدند.');
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>بازنشانی به تنظیمات پیش‌فرض</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    شماره تلفن خط ویژه مشاوره (Hotline):
                  </label>
                  <input
                    type="text"
                    value={siteSettings.hotline}
                    onChange={(e) => {
                      const updated = { ...siteSettings, hotline: e.target.value };
                      setSiteSettings(updated);
                      CmsStorageService.saveSettings(updated);
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    در تمامی هدرها، کاتالوگ قطعات و نوار بالای سایت نمایش داده می‌شود.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    عنوان سربرگ پلتفرم (Site Title):
                  </label>
                  <input
                    type="text"
                    value={siteSettings.site_title}
                    onChange={(e) => {
                      const updated = { ...siteSettings, site_title: e.target.value };
                      setSiteSettings(updated);
                      CmsStorageService.saveSettings(updated);
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    متن اعلان نوار بالا (Announcement Banner):
                  </label>
                  <input
                    type="text"
                    value={siteSettings.announcement}
                    onChange={(e) => {
                      const updated = { ...siteSettings, announcement: e.target.value };
                      setSiteSettings(updated);
                      CmsStorageService.saveSettings(updated);
                    }}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    SupabaseSyncService.syncSettings(siteSettings);
                    showToast('تنظیمات عمومی با موفقیت در فضای ابری و محلی ذخیره شد.');
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره تغییرات تنظیمات</span>
                </button>
              </div>
            </div>
          </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: YOAST SEO (سئو و متادیتا) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'seo' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                  Y
                </span>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    تنظیمات سئو و ساختار داده‌های نشاندار (Yoast SEO / Schema)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    عنوان متای اصلی، توضیحات گوگل و اعتبارسنجی تگ‌های کانونیکال
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    دامنه کانونیکال مرجع:
                  </label>
                  <input
                    type="text"
                    value={siteSettings.canonical_domain}
                    onChange={(e) => {
                      const updated = { ...siteSettings, canonical_domain: e.target.value };
                      setSiteSettings(updated);
                      CmsStorageService.saveSettings(updated);
                    }}
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    توضیحات متای صفحه اصلی (Meta Description):
                  </label>
                  <textarea
                    rows={3}
                    value={siteSettings.meta_description}
                    onChange={(e) => {
                      const updated = { ...siteSettings, meta_description: e.target.value };
                      setSiteSettings(updated);
                      CmsStorageService.saveSettings(updated);
                    }}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs leading-relaxed"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>طول بهینه توصیه شده: ۱۲۰ تا ۱۶۰ کاراکتر</span>
                    <span className="font-mono">{siteSettings.meta_description.length} کاراکتر</span>
                  </div>
                </div>

                {/* Live Google Snippet Preview */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    پیش‌نمایش زنده در نتایج جستجوی گوگل (Google Snippet):
                  </span>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-mono block dir-ltr text-right">
                      {siteSettings.canonical_domain}
                    </span>
                    <h3 className="text-base text-blue-700 hover:underline cursor-pointer font-medium leading-snug">
                      {siteSettings.site_title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {siteSettings.meta_description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: SMS GATEWAY (ملی‌پیامک) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'sms' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <span>سامانه پیامک ملی‌پیامک (MeliPayamak)</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                        REST API v2
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ارسال آنی پیامک‌های رزرو نوبت، استعلام پاسپورت و کارنامه آزمون با پترن خدماتی
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {smsCredit && typeof smsCredit.amount === 'number' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-center">
                      <div className="text-[10px] text-slate-400">اعتبار حساب ملی‌پیامک:</div>
                      <div className="text-sm font-black text-emerald-400 font-mono">
                        {Math.floor(smsCredit.amount).toLocaleString('fa-IR')} پیامک
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      توکن فعال: {smsConfig.apiKey ? `${smsConfig.apiKey.substring(0, 8)}...` : 'تنظیم نشده'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Column 1: Config Settings */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Settings className="w-4 h-4 text-emerald-600" />
                    <span>تنظیمات احراز هویت و الگوهای ملی‌پیامک</span>
                  </h3>

                  <form onSubmit={handleSaveSmsSettings} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        کلید وب‌سرویس / توکن کنسول (API Key):
                      </label>
                      <input
                        type="text"
                        value={smsConfig.apiKey}
                        onChange={(e) => setSmsConfig({ ...smsConfig, apiKey: e.target.value })}
                        placeholder="d24ffa2e-c03b-40d5-b1f6-b695fc84eee6"
                        dir="ltr"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        required
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        کلید ارائه‌شده از منوی تنظیمات پنل کاربری ملی‌پیامک (کنسول).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          شماره خط فرستنده (اختصاصی / اشتراکی):
                        </label>
                        <input
                          type="text"
                          value={smsConfig.senderNumber}
                          onChange={(e) => setSmsConfig({ ...smsConfig, senderNumber: e.target.value })}
                          placeholder="50004001"
                          dir="ltr"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-800 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          وضعیت ارسال پیامک در کل سایت:
                        </label>
                        <div className="flex items-center gap-3 pt-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={smsConfig.isSmsActive}
                              onChange={(e) => setSmsConfig({ ...smsConfig, isSmsActive: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            <span className="mr-3 text-xs font-semibold text-slate-700">
                              {smsConfig.isSmsActive ? 'فعال و عملیاتی' : 'غیرفعال'}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <span className="font-bold text-slate-800 block">
                        شناسه الگوهای خدماتی (عبور از بلک‌لیست مخابرات - Shared BodyId):
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">کد پترن نوبت‌دهی:</label>
                          <input
                            type="text"
                            value={smsConfig.patternAppointment}
                            onChange={(e) => setSmsConfig({ ...smsConfig, patternAppointment: e.target.value })}
                            placeholder="245890"
                            dir="ltr"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">کد پترن پاسپورت:</label>
                          <input
                            type="text"
                            value={smsConfig.patternPassport}
                            onChange={(e) => setSmsConfig({ ...smsConfig, patternPassport: e.target.value })}
                            placeholder="245891"
                            dir="ltr"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">کد پترن آزمون:</label>
                          <input
                            type="text"
                            value={smsConfig.patternQuiz}
                            onChange={(e) => setSmsConfig({ ...smsConfig, patternQuiz: e.target.value })}
                            placeholder="245892"
                            dir="ltr"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all"
                      >
                        <Save className="w-4 h-4" />
                        <span>ذخیره تنظیمات ملی‌پیامک</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Column 2: Live Test Box */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>ارسال پیامک آزمایشی زنده</span>
                    </h3>

                    <form onSubmit={handleSendTestSms} className="space-y-3 mt-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          شماره موبایل گیرنده جهت تست:
                        </label>
                        <input
                          type="text"
                          value={testSmsPhone}
                          onChange={(e) => setTestSmsPhone(e.target.value)}
                          placeholder="09121234567"
                          dir="ltr"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 text-xs"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          متن پیامک آزمایشی:
                        </label>
                        <textarea
                          rows={3}
                          value={testSmsMessage}
                          onChange={(e) => setTestSmsMessage(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingTestSms}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
                      >
                        {isSendingTestSms ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                            <span>در حال برقراری ارتباط با وب‌سرویس…</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-emerald-400" />
                            <span>ارسال پیامک آزمایشی</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {testSmsResult && (
                    <div
                      className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                        testSmsResult.success
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {testSmsResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span>{testSmsResult.message}</span>
                      </div>
                      {testSmsResult.recId && (
                        <div className="text-[11px] font-mono text-slate-600">
                          کد رهگیری سامانه (recId): <b>{testSmsResult.recId}</b>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SMS Logs Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      تاریخچه و لاگ پیامک‌های ارسالی سیستم ({smsLogs.length} پیامک)
                    </h3>
                  </div>

                  {smsLogs.length > 0 && (
                    <button
                      onClick={handleClearSmsLogs}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                    >
                      پاک‌سازی لاگ‌ها
                    </button>
                  )}
                </div>

                {smsLogs.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    تاکنون هیچ پیامکی از سامانه ارسال نشده است. برای اولین تست از فرم بالا اقدام فرمایید.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                        <tr>
                          <th className="p-3">شماره گیرنده</th>
                          <th className="p-3">نوع پیامک</th>
                          <th className="p-3">متن ارسالی</th>
                          <th className="p-3">شناسه رهگیری (recId)</th>
                          <th className="p-3">زمان ثبت</th>
                          <th className="p-3">وضعیت</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {smsLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-mono font-bold text-slate-800 dir-ltr text-right">
                              {log.to}
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  log.type === 'appointment'
                                    ? 'bg-blue-100 text-blue-800'
                                    : log.type === 'passport'
                                    ? 'bg-purple-100 text-purple-800'
                                    : log.type === 'quiz'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {log.type === 'appointment'
                                  ? 'رزرو نوبت'
                                  : log.type === 'passport'
                                  ? 'پاسپورت دندان'
                                  : log.type === 'quiz'
                                  ? 'کارنامه آزمون'
                                  : 'تست سیستم'}
                              </span>
                            </td>
                            <td className="p-3 max-w-xs truncate text-slate-600" title={log.text}>
                              {log.text}
                            </td>
                            <td className="p-3 font-mono text-[11px] text-slate-500">
                              {log.recId || '—'}
                            </td>
                            <td className="p-3 text-[11px] text-slate-400 font-mono dir-ltr text-right">
                              {new Date(log.created_at).toLocaleTimeString('fa-IR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-3">
                              {log.status === 'sent' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                                  <Check className="w-3 h-3" /> ارسال موفق
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                                  <X className="w-3 h-3" /> ناموفق
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: ADD / EDIT POST (فرم افزودن و ویرایش مقاله) */}
      {/* ------------------------------------------------------------------ */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-black text-slate-900 text-base">
                {editingPost ? 'ویرایش نوشته وبلاگ' : 'افزودن نوشته تازه به وردپرس'}
              </h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem('postTitle') as HTMLInputElement).value;
                const slug = (form.elements.namedItem('postSlug') as HTMLInputElement).value;
                const category = (form.elements.namedItem('postCategory') as HTMLInputElement).value;
                const excerpt = (form.elements.namedItem('postExcerpt') as HTMLTextAreaElement).value;
                const content = (form.elements.namedItem('postContent') as HTMLTextAreaElement).value;
                const author = (form.elements.namedItem('postAuthor') as HTMLInputElement).value;
                const readTime = parseInt((form.elements.namedItem('postReadTime') as HTMLInputElement).value, 10) || 5;
                const image = (form.elements.namedItem('postImage') as HTMLInputElement).value;

                if (editingPost) {
                  const updated = blogPosts.map((p) =>
                    p.id === editingPost.id
                      ? {
                          ...p,
                          title,
                          slug,
                          category,
                          excerpt,
                          content,
                          author,
                          read_time_minutes: readTime,
                          featured_image: image
                        }
                      : p
                  );
                  setBlogPosts(updated);
                  CmsStorageService.saveBlogPosts(updated);
                  const target = updated.find((p) => p.id === editingPost.id);
                  if (target) SupabaseSyncService.syncBlogPost(target);
                  showToast('نوشته با موفقیت بروزرسانی شد.');
                } else {
                  const newPost: WordPressBlogPost = {
                    id: Date.now(),
                    title,
                    slug,
                    category,
                    excerpt,
                    content,
                    author,
                    read_time_minutes: readTime,
                    published_at: new Date().toLocaleDateString('fa-IR'),
                    featured_image: image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
                    meta_robots: 'index, follow'
                  };
                  const updated = [newPost, ...blogPosts];
                  setBlogPosts(updated);
                  CmsStorageService.saveBlogPosts(updated);
                  SupabaseSyncService.syncBlogPost(newPost);
                  showToast('نوشته تازه منتشر شد.');
                }
                setIsPostModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان نوشته:</label>
                <input
                  name="postTitle"
                  defaultValue={editingPost?.title || ''}
                  placeholder="راهنمای جامع ایمپلنت..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نامک (Slug):</label>
                  <input
                    name="postSlug"
                    defaultValue={editingPost?.slug || ''}
                    placeholder="implant-guide"
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">دسته‌بندی:</label>
                  <input
                    name="postCategory"
                    defaultValue={editingPost?.category || 'آموزش بالینی'}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">چکیده کوتاه (Excerpt):</label>
                <textarea
                  name="postExcerpt"
                  defaultValue={editingPost?.excerpt || ''}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl p-3"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">متن کامل مقاله:</label>
                <textarea
                  name="postContent"
                  defaultValue={editingPost?.content || ''}
                  rows={6}
                  className="w-full border border-slate-200 rounded-xl p-3 font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نویسنده:</label>
                  <input
                    name="postAuthor"
                    defaultValue={editingPost?.author || currentUser.full_name}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">زمان مطالعه (دقیقه):</label>
                  <input
                    name="postReadTime"
                    type="number"
                    defaultValue={editingPost?.read_time_minutes || 6}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">آدرس تصویر شاخص:</label>
                  <input
                    name="postImage"
                    defaultValue={editingPost?.featured_image || ''}
                    placeholder="https://..."
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {editingPost ? 'ذخیره تغییرات' : 'انتشار در سایت'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: ADD / EDIT PAGE (فرم افزودن و ویرایش برگه) */}
      {/* ------------------------------------------------------------------ */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-black text-slate-900 text-base">
                {editingPage ? 'ویرایش برگه (صفحه ایستا)' : 'افزودن برگه تازه به سامانه'}
              </h3>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem('pageTitle') as HTMLInputElement).value;
                const slug = (form.elements.namedItem('pageSlug') as HTMLInputElement).value;
                const template = (form.elements.namedItem('pageTemplate') as HTMLSelectElement).value as any;
                const excerpt = (form.elements.namedItem('pageExcerpt') as HTMLTextAreaElement).value;
                const content = (form.elements.namedItem('pageContent') as HTMLTextAreaElement).value;
                const author = (form.elements.namedItem('pageAuthor') as HTMLInputElement).value;
                const status = (form.elements.namedItem('pageStatus') as HTMLSelectElement).value as any;
                const image = (form.elements.namedItem('pageImage') as HTMLInputElement).value;

                if (editingPage) {
                  const updated = pages.map((p) =>
                    p.id === editingPage.id
                      ? {
                          ...p,
                          title,
                          slug,
                          template,
                          excerpt,
                          content,
                          author,
                          status,
                          featured_image: image
                        }
                      : p
                  );
                  setPages(updated);
                  CmsStorageService.savePages(updated);
                  showToast('برگه با موفقیت بروزرسانی شد.');
                } else {
                  const newPage: WordPressPage = {
                    id: Date.now(),
                    title,
                    slug,
                    template,
                    excerpt,
                    content,
                    author: author || currentUser.full_name,
                    status,
                    published_at: new Date().toLocaleDateString('fa-IR'),
                    featured_image: image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
                    meta_robots: 'index, follow'
                  };
                  const updated = [newPage, ...pages];
                  setPages(updated);
                  CmsStorageService.savePages(updated);
                  showToast('برگه تازه با موفقیت ایجاد و منتشر گردید.');
                }
                setIsPageModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">عنوان برگه:</label>
                  <input
                    name="pageTitle"
                    defaultValue={editingPage?.title || ''}
                    placeholder="مثلاً: درباره پلتفرم دنتال‌مپ"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نامک / پیوند یکتا (Slug):</label>
                  <input
                    name="pageSlug"
                    defaultValue={editingPage?.slug || ''}
                    placeholder="about-dentalmap"
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">قالب برگه (Template):</label>
                  <select
                    name="pageTemplate"
                    defaultValue={editingPage?.template || 'default'}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="default">قالب استاندارد و مقاله‌ای</option>
                    <option value="fullwidth">قالب تمام‌عرض (Full Width)</option>
                    <option value="narrow">قالب متمرکز و تک‌ستونه</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">وضعیت انتشار:</label>
                  <select
                    name="pageStatus"
                    defaultValue={editingPage?.status || 'publish'}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="publish">منتشر شده (عمومی)</option>
                    <option value="draft">پیش‌نویس (خصوصی)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">خلاصه برگه (Excerpt - برای سئو):</label>
                <textarea
                  name="pageExcerpt"
                  defaultValue={editingPage?.excerpt || ''}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">محتوا و متن کامل برگه (HTML یا متن):</label>
                <textarea
                  name="pageContent"
                  defaultValue={editingPage?.content || ''}
                  rows={7}
                  placeholder="محتوا و پاراگراف‌های برگه را وارد فرمایید..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نویسنده برگه:</label>
                  <input
                    name="pageAuthor"
                    defaultValue={editingPage?.author || currentUser.full_name}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">آدرس تصویر شاخص (Featured Image):</label>
                  <input
                    name="pageImage"
                    defaultValue={editingPage?.featured_image || ''}
                    placeholder="https://..."
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md"
                >
                  {editingPage ? 'ذخیره تغییرات برگه' : 'انتشار برگه در سایت'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: ADD / EDIT DOCTOR (فرم جراح) */}
      {/* ------------------------------------------------------------------ */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-black text-slate-900 text-base">
                {editingDoctor ? 'ویرایش اطلاعات جراح' : 'افزودن پزشک / جراح تازه'}
              </h3>
              <button
                onClick={() => setIsDoctorModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const firstName = (form.elements.namedItem('docFirstName') as HTMLInputElement).value;
                const lastName = (form.elements.namedItem('docLastName') as HTMLInputElement).value;
                const code = (form.elements.namedItem('docCode') as HTMLInputElement).value;
                const exp = parseInt((form.elements.namedItem('docExp') as HTMLInputElement).value, 10) || 10;
                const rating = parseFloat((form.elements.namedItem('docRating') as HTMLInputElement).value) || 4.9;
                const bio = (form.elements.namedItem('docBio') as HTMLTextAreaElement).value;
                const avatar = (form.elements.namedItem('docAvatar') as HTMLInputElement).value;
                const verified = (form.elements.namedItem('docVerified') as HTMLInputElement).checked;
                const passport = (form.elements.namedItem('docPassport') as HTMLInputElement).checked;

                if (editingDoctor) {
                  const updated = doctors.map((d) =>
                    d.id === editingDoctor.id
                      ? {
                          ...d,
                          first_name: firstName,
                          last_name: lastName,
                          medical_council_code: code,
                          experience_years: exp,
                          rating,
                          bio,
                          avatar: avatar || d.avatar,
                          verified,
                          passport_committed: passport
                        }
                      : d
                  );
                  setDoctors(updated);
                  CmsStorageService.saveDoctors(updated);
                  const target = updated.find((d) => d.id === editingDoctor.id);
                  if (target) SupabaseSyncService.syncDoctor(target);
                  showToast('مشخصات پزشک با موفقیت بروزرسانی شد.');
                } else {
                  const newDoc: Doctor = {
                    id: Date.now(),
                    first_name: firstName,
                    last_name: lastName,
                    slug: `dr-${firstName.replace(/\s+/g, '-')}-${lastName.replace(/\s+/g, '-')}`,
                    medical_council_code: code,
                    gender: 'male',
                    specialty_id: 2,
                    patient_age_group: 'adults',
                    passport_committed: passport,
                    bio,
                    rating,
                    reviews_count: 1,
                    experience_years: exp,
                    verified,
                    avatar:
                      avatar ||
                      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
                  };
                  const updated = [newDoc, ...doctors];
                  setDoctors(updated);
                  CmsStorageService.saveDoctors(updated);
                  SupabaseSyncService.syncDoctor(newDoc);
                  showToast('پزشک جدید افزوده شد.');
                }
                setIsDoctorModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نام:</label>
                  <input
                    name="docFirstName"
                    defaultValue={editingDoctor?.first_name || 'دکتر '}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نام خانوادگی:</label>
                  <input
                    name="docLastName"
                    defaultValue={editingDoctor?.last_name || ''}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">کد نظام پزشکی:</label>
                  <input
                    name="docCode"
                    defaultValue={editingDoctor?.medical_council_code || ''}
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سابقه (سال):</label>
                  <input
                    name="docExp"
                    type="number"
                    defaultValue={editingDoctor?.experience_years || 12}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">امتیاز مراجعین:</label>
                  <input
                    name="docRating"
                    type="number"
                    step="0.01"
                    defaultValue={editingDoctor?.rating || 4.9}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">بیوگرافی و رزومه علمی:</label>
                <textarea
                  name="docBio"
                  defaultValue={editingDoctor?.bio || ''}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl p-3"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">آدرس عکس پرسنلی:</label>
                <input
                  name="docAvatar"
                  defaultValue={editingDoctor?.avatar || ''}
                  placeholder="https://..."
                  dir="ltr"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    name="docVerified"
                    type="checkbox"
                    defaultChecked={editingDoctor?.verified ?? true}
                    className="rounded accent-emerald-600"
                  />
                  <span className="font-bold text-emerald-800">تایید رسمی نظام پزشکی</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    name="docPassport"
                    type="checkbox"
                    defaultChecked={editingDoctor?.passport_committed ?? true}
                    className="rounded accent-emerald-600"
                  />
                  <span className="font-bold text-teal-800">متعهد به صدور شناسنامه</span>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: ADD / EDIT COMPONENT (فرم قطعه) */}
      {/* ------------------------------------------------------------------ */}
      {isComponentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-black text-slate-900 text-base">
                {editingComponent ? 'ویرایش قطعه کاتالوگ' : 'افزودن قطعه ایمپلنت جدید'}
              </h3>
              <button
                onClick={() => setIsComponentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const refCode = (form.elements.namedItem('partRef') as HTMLInputElement).value;
                const lot = (form.elements.namedItem('partLot') as HTMLInputElement).value;
                const nameFa = (form.elements.namedItem('partNameFa') as HTMLInputElement).value;
                const nameEn = (form.elements.namedItem('partNameEn') as HTMLInputElement).value;
                const category = (form.elements.namedItem('partCategory') as HTMLSelectElement).value as ComponentCategory;
                const price = parseInt((form.elements.namedItem('partPrice') as HTMLInputElement).value, 10) || 5000000;
                const material = (form.elements.namedItem('partMaterial') as HTMLInputElement).value;
                const hex = (form.elements.namedItem('partHex') as HTMLInputElement).value;

                if (editingComponent) {
                  const updated = components.map((c) =>
                    c.id === editingComponent.id
                      ? {
                          ...c,
                          ref_code: refCode,
                          lot_number: lot,
                          name_fa: nameFa,
                          name_en: nameEn,
                          category,
                          price_toman: price,
                          material,
                          hex_size: hex
                        }
                      : c
                  );
                  setComponents(updated);
                  CmsStorageService.saveComponents(updated);
                  const target = updated.find((c) => c.id === editingComponent.id);
                  if (target) SupabaseSyncService.syncComponent(target);
                  showToast('مشخصات قطعه بروزرسانی شد.');
                } else {
                  const newComp: DentalComponent = {
                    id: Date.now(),
                    brand_id: 2,
                    category,
                    ref_code: refCode,
                    lot_number: lot,
                    name_fa: nameFa,
                    name_en: nameEn,
                    description: nameFa,
                    material,
                    hex_size: hex,
                    platform_size: hex,
                    compatibility: 'استاندارد اتصال اینترنال بین‌المللی',
                    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=300',
                    price_toman: price,
                    in_stock: true
                  };
                  const updated = [newComp, ...components];
                  setComponents(updated);
                  CmsStorageService.saveComponents(updated);
                  SupabaseSyncService.syncComponent(newComp);
                  showToast('قطعه ایمپلنت جدید اضافه شد.');
                }
                setIsComponentModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">کد رفرنس رسمی (REF):</label>
                  <input
                    name="partRef"
                    defaultValue={editingComponent?.ref_code || ''}
                    placeholder="021.4312"
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شماره لات استریل (LOT):</label>
                  <input
                    name="partLot"
                    defaultValue={editingComponent?.lot_number || 'LOT-2026-X'}
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نام فارسی قطعه:</label>
                <input
                  name="partNameFa"
                  defaultValue={editingComponent?.name_fa || ''}
                  placeholder="فیکسچر ناکسیس آلمان..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نام انگلیسی قطعه:</label>
                <input
                  name="partNameEn"
                  defaultValue={editingComponent?.name_en || ''}
                  dir="ltr"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رده هشت‌گانه:</label>
                  <select
                    name="partCategory"
                    defaultValue={editingComponent?.category || 'fixture'}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="fixture">فیکسچر (داخل استخوان)</option>
                    <option value="abutment">اباتمنت (پروتزی)</option>
                    <option value="healing">هیلینگ کپ (لثه)</option>
                    <option value="impression_coping">ایمپرشن کوپینگ (قالب‌گیری)</option>
                    <option value="analog">آنالوگ کست</option>
                    <option value="surgical_kit">کیت جراحی</option>
                    <option value="scan_body">اسکن‌بادی دیجیتال</option>
                    <option value="digital_analog">آنالوگ پرینت ۳ بعدی</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">قیمت رسمی (تومان):</label>
                  <input
                    name="partPrice"
                    type="number"
                    defaultValue={editingComponent?.price_toman || 5500000}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">آلیاژ ساختاری:</label>
                  <input
                    name="partMaterial"
                    defaultValue={editingComponent?.material || 'Titanium Grade 4 Cold-Worked'}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سایز هگز / پلتفرم:</label>
                  <input
                    name="partHex"
                    defaultValue={editingComponent?.hex_size || 'Hex 2.1mm'}
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComponentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: ADD / EDIT CLINIC (فرم کلینیک) */}
      {/* ------------------------------------------------------------------ */}
      {isClinicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-black text-slate-900 text-base">
                {editingClinic ? 'ویرایش مرکز درمانی' : 'افزودن کلینیک / مطب جدید'}
              </h3>
              <button
                onClick={() => setIsClinicModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('clinicName') as HTMLInputElement).value;
                const address = (form.elements.namedItem('clinicAddress') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('clinicPhone') as HTMLInputElement).value;
                const type = (form.elements.namedItem('clinicType') as HTMLSelectElement).value as any;
                const is24_7 = (form.elements.namedItem('clinic24_7') as HTMLInputElement).checked;

                if (editingClinic) {
                  const updated = clinics.map((c) =>
                    c.id === editingClinic.id
                      ? {
                          ...c,
                          name,
                          address,
                          phone,
                          center_type: type,
                          is_24_7: is24_7
                        }
                      : c
                  );
                  setClinics(updated);
                  CmsStorageService.saveClinics(updated);
                  const target = updated.find((c) => c.id === editingClinic.id);
                  if (target) SupabaseSyncService.syncClinic(target);
                  showToast('اطلاعات کلینیک بروزرسانی شد.');
                } else {
                  const newClinic: Clinic = {
                    id: Date.now(),
                    name,
                    slug: `clinic-${Date.now()}`,
                    center_type: type,
                    city_id: 1,
                    district_id: 1,
                    address,
                    latitude: 35.7219,
                    longitude: 51.3347,
                    phone,
                    is_24_7: is24_7,
                    is_free_tariff_only: false
                  };
                  const updated = [newClinic, ...clinics];
                  setClinics(updated);
                  CmsStorageService.saveClinics(updated);
                  SupabaseSyncService.syncClinic(newClinic);
                  showToast('مرکز درمانی جدید افزوده شد.');
                }
                setIsClinicModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">نام کامل مرکز درمانی:</label>
                <input
                  name="clinicName"
                  defaultValue={editingClinic?.name || ''}
                  placeholder="کلینیک تخصصی ایمپلنت..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع مرکز:</label>
                  <select
                    name="clinicType"
                    defaultValue={editingClinic?.center_type || 'clinic'}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="clinic">کلینیک و درمانگاه تخصصی</option>
                    <option value="hospital">بیمارستان و مرکز جراحی</option>
                    <option value="private_office">مطب شخصی</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تلفن تماس:</label>
                  <input
                    name="clinicPhone"
                    defaultValue={editingClinic?.phone || '021-'}
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">آدرس دقیق:</label>
                <input
                  name="clinicAddress"
                  defaultValue={editingClinic?.address || ''}
                  placeholder="تهران، خیابان..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    name="clinic24_7"
                    type="checkbox"
                    defaultChecked={editingClinic?.is_24_7 ?? false}
                    className="rounded accent-emerald-600"
                  />
                  <span className="font-bold text-slate-700">مرکز شبانه‌روزی ۲۴/۷ است</span>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClinicModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
