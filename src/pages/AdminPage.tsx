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
  FileCode,
  FileCheck2,
  Printer,
  Download,
  FileSpreadsheet,
  ChevronRight,
  Filter
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
  ComponentCategory,
  DoctorApplication,
  IssuedPassport
} from '../types';
import { initialCities, initialSpecialties } from '../initialData';
import { AdminAuthService, AdminAccountRecord } from '../utils/auth';
import { CmsStorageService, defaultSiteSettings } from '../utils/cmsStorage';
import { SupabaseSyncService, isSupabaseConfigured, getSupabaseConfig } from '../utils/supabaseClient';
import { WordPressService } from '../utils/wordPressClient';
import { SmsService } from '../utils/smsService';
import { AdminSidebar, AdminSection } from './admin/AdminSidebar';
import { SmsSection } from './admin/SmsSection';
import { OfficialPassportCertificate } from '../components/OfficialPassportCertificate';
import { DoctorBulkImportModal } from './admin/DoctorBulkImportModal';
import { DoctorImportService } from '../utils/doctorImportService';

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
  doctorApplications?: DoctorApplication[];
  setDoctorApplications?: React.Dispatch<React.SetStateAction<DoctorApplication[]>>;
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
  setSiteSettings,
  doctorApplications,
  setDoctorApplications
}) => {
  // Session State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() =>
    AdminAuthService.getCurrentUser()
  );

  // Doctor Applications Cartable
  const [applications, setApplications] = useState<DoctorApplication[]>(() =>
    doctorApplications && doctorApplications.length > 0
      ? doctorApplications
      : CmsStorageService.getDoctorApplications()
  );
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Issued Digital Passports
  const [passports, setPassports] = useState<IssuedPassport[]>(() =>
    CmsStorageService.getIssuedPassports()
  );
  const [selectedPassportCertificate, setSelectedPassportCertificate] = useState<IssuedPassport | null>(null);
  const [passportSearch, setPassportSearch] = useState('');

  useEffect(() => {
    if (doctorApplications) {
      setApplications(doctorApplications);
    }
  }, [doctorApplications]);

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

  // Doctors Bulk Import & Large Dataset Pagination
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState<'all' | string>('all');
  const [doctorVerifiedFilter, setDoctorVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [doctorCurrentPage, setDoctorCurrentPage] = useState(1);
  const [doctorPageSize, setDoctorPageSize] = useState(25);

  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<DentalComponent | null>(null);

  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);

  // WordPress Headless Sync State
  const [isSyncingWp, setIsSyncingWp] = useState(false);
  const [wpSyncMessage, setWpSyncMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleSyncFromWordPress = async () => {
    setIsSyncingWp(true);
    setWpSyncMessage(null);
    try {
      const livePosts = await WordPressService.fetchPosts({ perPage: 50 });
      if (livePosts.length > 0) {
        setBlogPosts(livePosts);
        CmsStorageService.saveBlogPosts(livePosts);
        setWpSyncMessage({
          success: true,
          text: `همگام‌سازی موفق: ${livePosts.length} نوشته از وردپرس (cms.dentalmap.ir) با موفقیت دریافت شد.`
        });
      } else {
        setWpSyncMessage({
          success: false,
          text: 'پاسخی از وردپرس دریافت شد، اما هیچ نوشته‌ای یافت نشد.'
        });
      }
    } catch (err: any) {
      setWpSyncMessage({
        success: false,
        text: `خطای ارتباط با وردپرس: ${err.message || 'شبکه در دسترس نیست'}`
      });
    } finally {
      setIsSyncingWp(false);
      setTimeout(() => setWpSyncMessage(null), 6000);
    }
  };

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

  // Doctor Application Handlers
  const handleApproveApplication = async (app: DoctorApplication) => {
    if (!window.confirm(`آیا از تایید و انتشار «${app.full_name}» در دایرکتوری عمومی اطمینان دارید؟`)) {
      return;
    }

    const updatedApps = applications.map((a) =>
      a.id === app.id
        ? { ...a, status: 'approved' as const, reviewed_at: new Date().toISOString() }
        : a
    );
    setApplications(updatedApps);
    setDoctorApplications?.(updatedApps);
    CmsStorageService.saveDoctorApplications(updatedApps);

    // Create Doctor entity if not already present
    const existingDoctor = doctors.find((d) => d.medical_council_code === app.medical_council_code);
    if (!existingDoctor) {
      const nameParts = app.full_name.trim().split(' ');
      const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

      const newDoctor: Doctor = {
        id: Date.now(),
        first_name: firstName,
        last_name: lastName,
        slug: `dr-${app.medical_council_code}`,
        medical_council_code: app.medical_council_code,
        gender: 'male',
        specialty_id: app.specialty_id,
        patient_age_group: 'adults',
        passport_committed: true,
        bio: app.bio || `پزشک متخصص ایمپلنت دارای پروانه معتبر از سازمان نظام پزشکی با کد ${app.medical_council_code}`,
        rating: 5.0,
        reviews_count: 1,
        experience_years: 10,
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
        verified: true,
        created_at: new Date().toISOString()
      };
      const newDoctors = [...doctors, newDoctor];
      setDoctors(newDoctors);
      CmsStorageService.saveDoctors(newDoctors);
    }

    // If clinic, also create Clinic entity if not already present
    if (app.center_type === 'clinic') {
      const existingClinic = clinics.find((c) => c.name === app.full_name);
      if (!existingClinic) {
        const newClinic: Clinic = {
          id: Date.now() + 1,
          name: app.full_name,
          slug: `clinic-${app.medical_council_code}`,
          center_type: 'clinic',
          city_id: app.city_id,
          district_id: app.district_id || 1,
          address: app.address,
          latitude: 35.6892,
          longitude: 51.3890,
          phone: app.phone || app.mobile,
          is_24_7: app.is_24_7,
          is_free_tariff_only: false,
          created_at: new Date().toISOString()
        };
        const newClinics = [...clinics, newClinic];
        setClinics(newClinics);
        CmsStorageService.saveClinics(newClinics);
      }
    }

    if (app.mobile) {
      try {
        await SmsService.sendSms({
          to: app.mobile,
          text: `دندانپزشک گرامی جناب آقای/سرکار خانم ${app.full_name}، درخواست عضویت شما در دنتال‌مپ تایید شد و پروفایل شما در دایرکتوری سراسری فعال گردید.\nلینک مشاهده: https://dentalmap.ir/doctor/dr-${app.medical_council_code}`,
          type: 'test'
        });
      } catch (err) {
        console.warn('SMS dispatch error on approval:', err);
      }
    }

    showToast(`پروفایل «${app.full_name}» با موفقیت تایید، منتشر و پیامک فعال‌سازی ارسال شد.`);
  };

  const handleRejectApplication = async (app: DoctorApplication) => {
    const reason = window.prompt(
      `علت عدم تایید درخواست «${app.full_name}» را وارد نمایید (جهت پیامک به پزشک):`,
      'نقص در احراز اطلاعات کد نظام پزشکی یا عدم تطابق آدرس'
    );
    if (reason === null) return;

    const trimmed = reason.trim() || 'عدم احراز شرایط';
    const updatedApps = applications.map((a) =>
      a.id === app.id
        ? {
            ...a,
            status: 'rejected' as const,
            reviewed_at: new Date().toISOString(),
            rejection_reason: trimmed
          }
        : a
    );
    setApplications(updatedApps);
    setDoctorApplications?.(updatedApps);
    CmsStorageService.saveDoctorApplications(updatedApps);

    if (app.mobile) {
      try {
        await SmsService.sendSms({
          to: app.mobile,
          text: `متقاضی گرامی ${app.full_name}، درخواست عضویت شما در دنتال‌مپ به علت: «${trimmed}» تایید نشد. جهت ویرایش یا بررسی مجدد به پشتیبانی دنتال‌مپ مراجعه فرمایید.`,
          type: 'test'
        });
      } catch (err) {
        console.warn('SMS dispatch error on rejection:', err);
      }
    }

    showToast(`درخواست «${app.full_name}» رد شد و پیامک اطلاع‌رسانی ارسال گردید.`);
  };

  const handleDeleteApplication = (id: number) => {
    if (!window.confirm('آیا از حذف کامل این درخواست از کارتابل مطمئن هستید؟')) return;
    const updatedApps = applications.filter((a) => a.id !== id);
    setApplications(updatedApps);
    setDoctorApplications?.(updatedApps);
    CmsStorageService.saveDoctorApplications(updatedApps);
    showToast('درخواست موردنظر از کارتابل حذف گردید.');
  };

  // Digital Passport Handlers
  const handleResendPassportSms = async (p: IssuedPassport) => {
    if (!p.patient_mobile) {
      alert('شماره موبایل برای این بیمار ثبت نشده است.');
      return;
    }
    try {
      await SmsService.sendSms({
        to: p.patient_mobile,
        text: `بیمار گرامی ${p.patient_name}، شناسه پیگیری پاسپورت ایمپلنت دندان شما: ${p.id}\nمشاهده شناسنامه و اصالت قطعات:\n${p.verification_url || `https://dentalmap.ir/passport?code=${p.id}`}\nدنتال‌مپ`,
        type: 'passport'
      });
      showToast(`پیامک استعلام به شماره ${p.patient_mobile} ارسال گردید.`);
    } catch {
      showToast('خطا در ارسال پیامک. تنظیمات پیامک را بررسی فرمایید.');
    }
  };

  const handleTogglePassportStatus = (id: string) => {
    const updated = passports.map((p) =>
      p.id === id
        ? { ...p, status: (p.status === 'active' ? 'revoked' : 'active') as 'active' | 'revoked' }
        : p
    );
    setPassports(updated);
    CmsStorageService.saveIssuedPassports(updated);
    showToast('وضعیت اعتبار شناسنامه به‌روزرسانی شد.');
  };

  const handleDeletePassport = (id: string) => {
    if (!window.confirm(`آیا از حذف کامل شناسنامه ${id} از پایگاه‌داده اطمینان دارید؟`)) return;
    const updated = passports.filter((p) => p.id !== id);
    setPassports(updated);
    CmsStorageService.saveIssuedPassports(updated);
    showToast('شناسنامه از پایگاه‌داده حذف گردید.');
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
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    if (isLockedOut) {
      setAuthError(`حساب مسدود است. لطفاً ${lockoutTimer} ثانیه صبر کنید.`);
      return;
    }

    const res = await AdminAuthService.login(usernameInput, passwordInput, rememberMe);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAccountsList(AdminAuthService.getAccounts());
      showToast(`خوش آمدید ${res.user.full_name}`);
    } else {
      setAuthError(res.error || 'اطلاعات ورود نادرست است.');
    }
  };

  // Handle Demo Quick Login
  const handleQuickDemoLogin = async () => {
    const res = await AdminAuthService.login('admin@dentalmap.ir', 'DentalMap@2026', true);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setAccountsList(AdminAuthService.getAccounts());
      showToast('ورود با حساب مدیر ارشد انجام شد.');
    } else {
      setAuthError(res.error || 'خطا در ورود سریع');
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
        {/* WORDPRESS RTL SIDEBAR (ماژول تفکیک‌شده منوی کناری ادمین) */}
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          blogPostsCount={blogPosts.length}
          pagesCount={pages.length}
          doctorsCount={doctors.length}
          clinicsCount={clinics.length}
          applicationsCount={applications.filter((a) => a.status === 'pending').length}
          passportsCount={passports.length}
          componentsCount={components.length}
          packagesCount={packages.length}
          accountsCount={accountsList.length}
        />

        {/* ------------------------------------------------------------------ */}
        {/* MAIN CMS CONTENT VIEW (محیط کاربری محتوا) */}
        {/* ------------------------------------------------------------------ */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ---------------------------------------------------------------- */}
          {/* SECTION: DASHBOARD */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Actions Bar (Quick Launchers at Top) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        درود، {currentUser.full_name} خوش آمدید!
                      </h2>
                      {isSupabaseConfigured() ? (
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          پایگاه‌داده ابری: متصل به PostgreSQL
                        </span>
                      ) : (
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          حالت مستقل (کش محلی فعال)
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      مدیریت آنی مقالات، جراحان، کاتالوگ قطعات و کلینیک‌های دنتال مپ
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>دسترسی‌های سریع (Quick Launchers):</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => {
                      setEditingPost(null);
                      setIsPostModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex flex-col items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-emerald-700" />
                    <span>نوشتن مقاله جدید</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingDoctor(null);
                      setIsDoctorModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold flex flex-col items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Users className="w-5 h-5 text-teal-700" />
                    <span>افزودن جراح جدید</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingComponent(null);
                      setIsComponentModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-xs font-bold flex flex-col items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Cpu className="w-5 h-5 text-cyan-700" />
                    <span>ثبت قطعه ایمپلنت</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingClinic(null);
                      setIsClinicModalOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex flex-col items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-5 h-5 text-amber-700" />
                    <span>افزودن مرکز درمانی</span>
                  </button>
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
                    در دسته‌بندی‌های تخصصی
                  </span>
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

              {/* WordPress Headless Connection Bar */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-950">
                        موتور وبلاگ وردپرس هدلس فعال است
                      </span>
                      <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.5 rounded-full font-mono">
                        cms.dentalmap.ir
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      مقالات منتشرشده در وردپرس، به‌طور خودکار در مسیر dentalmap.ir/blog نمایش داده می‌شوند.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSyncFromWordPress}
                    disabled={isSyncingWp}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWp ? 'animate-spin' : ''}`} />
                    <span>{isSyncingWp ? 'در حال دریافت...' : 'تازه‌سازی از وردپرس'}</span>
                  </button>

                  <a
                    href="https://cms.dentalmap.ir/wp-admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ورود به پیشخوان وردپرس</span>
                  </a>
                </div>
              </div>

              {wpSyncMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    wpSyncMessage.success
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-100 text-rose-900 border border-rose-200'
                  }`}
                >
                  {wpSyncMessage.text}
                </div>
              )}

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
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              page.template === 'landing'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {page.template === 'landing'
                              ? '🎯 لندینگ پیج اختصاصی'
                              : page.template === 'fullwidth'
                              ? 'تمام‌عرض'
                              : page.template === 'narrow'
                              ? 'تک‌ستونه'
                              : 'پیش‌فرض'}
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
                                  SupabaseSyncService.deletePage(page.id);
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
          {activeSection === 'doctors' && (() => {
            const filteredDoctors = doctors.filter((doc) => {
              if (doctorSearchTerm.trim()) {
                const term = doctorSearchTerm.trim().toLowerCase();
                const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase();
                const code = doc.medical_council_code;
                if (!fullName.includes(term) && !code.includes(term)) {
                  return false;
                }
              }
              if (doctorSpecialtyFilter !== 'all') {
                if (doc.specialty_id !== Number(doctorSpecialtyFilter)) {
                  return false;
                }
              }
              if (doctorVerifiedFilter === 'verified' && !doc.verified) return false;
              if (doctorVerifiedFilter === 'unverified' && doc.verified) return false;
              return true;
            });

            const totalDoctorPages = Math.ceil(filteredDoctors.length / doctorPageSize) || 1;
            const validPage = Math.min(doctorCurrentPage, totalDoctorPages);
            const paginatedDoctors = filteredDoctors.slice(
              (validPage - 1) * doctorPageSize,
              validPage * doctorPageSize
            );

            return (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                {/* Header Title & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      بانک اطلاعات و احراز هویت جراحان و دندانپزشکان
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      مدیریت پروفایل‌ها، استعلام کدهای نظام پزشکی و تعهدنامه شناسنامه اصالت (پشتیبانی تا ۱۵۰۰+ پزشک)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setIsBulkImportModalOpen(true)}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>ایمپورت گروهی (اکسل / CSV)</span>
                    </button>

                    <button
                      onClick={() => {
                        const csv = DoctorImportService.exportDoctorsToCsv(doctors, initialSpecialties);
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `dentalmap_doctors_${doctors.length}_records.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        showToast(`فایل اکسل شامل ${doctors.length} پزشک دانلود شد.`);
                      }}
                      className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="دانلود خروجی کامل پزشکان در قالب فایل اکسل"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>خروجی اکسل</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingDoctor(null);
                        setIsDoctorModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن پزشک</span>
                    </button>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-bold text-xs">کل دندانپزشکان</span>
                      <Users className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      {doctors.length.toLocaleString('fa-IR')}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">پروفایل ثبت‌شده در سیستم</div>
                  </div>

                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                    <div className="flex items-center justify-between text-emerald-700 mb-1">
                      <span className="font-bold text-xs">تایید نظام پزشکی</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xl font-black text-emerald-800 font-mono">
                      {doctors.filter((d) => d.verified).length.toLocaleString('fa-IR')}
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">دارای نشان اصالت در سایت</div>
                  </div>

                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
                    <div className="flex items-center justify-between text-amber-700 mb-1">
                      <span className="font-bold text-xs">در انتظار احراز</span>
                      <XCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-xl font-black text-amber-800 font-mono">
                      {doctors.filter((d) => !d.verified).length.toLocaleString('fa-IR')}
                    </div>
                    <div className="text-[10px] text-amber-600 mt-0.5">نیازمند بررسی مدارک</div>
                  </div>

                  <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl">
                    <div className="flex items-center justify-between text-teal-700 mb-1">
                      <span className="font-bold text-xs">دارای تعهد شناسنامه</span>
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="text-xl font-black text-teal-800 font-mono">
                      {doctors.filter((d) => d.passport_committed).length.toLocaleString('fa-IR')}
                    </div>
                    <div className="text-[10px] text-teal-600 mt-0.5">پاسپورت اصالت قطعات</div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                      <input
                        type="text"
                        value={doctorSearchTerm}
                        onChange={(e) => {
                          setDoctorSearchTerm(e.target.value);
                          setDoctorCurrentPage(1);
                        }}
                        placeholder="جستجوی نام، فامیلی یا کد نظام..."
                        className="w-full pr-9 pl-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {/* Specialty Filter */}
                    <select
                      value={doctorSpecialtyFilter}
                      onChange={(e) => {
                        setDoctorSpecialtyFilter(e.target.value);
                        setDoctorCurrentPage(1);
                      }}
                      className="py-1.5 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:border-emerald-500 outline-none"
                    >
                      <option value="all">همه تخصص‌ها</option>
                      {initialSpecialties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>

                    {/* Verification Filter */}
                    <select
                      value={doctorVerifiedFilter}
                      onChange={(e) => {
                        setDoctorVerifiedFilter(e.target.value as any);
                        setDoctorCurrentPage(1);
                      }}
                      className="py-1.5 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:border-emerald-500 outline-none"
                    >
                      <option value="all">همه وضعیت‌ها</option>
                      <option value="verified">فقط تایید شده‌ها</option>
                      <option value="unverified">فقط در انتظارها</option>
                    </select>
                  </div>

                  <div className="text-xs text-slate-500 self-end md:self-auto font-medium">
                    یافت‌شده: <strong className="text-emerald-700 font-mono">{filteredDoctors.length.toLocaleString('fa-IR')}</strong> از {doctors.length.toLocaleString('fa-IR')} پزشک
                  </div>
                </div>

                {/* Table of Doctors */}
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-bold">پزشک</th>
                        <th className="py-3 px-3 font-bold">کد نظام پزشکی</th>
                        <th className="py-3 px-3 font-bold">تخصص</th>
                        <th className="py-3 px-3 font-bold">سابقه</th>
                        <th className="py-3 px-3 font-bold">امتیاز</th>
                        <th className="py-3 px-3 font-bold">تعهد شناسنامه</th>
                        <th className="py-3 px-3 font-bold">وضعیت تایید</th>
                        <th className="py-3 px-4 font-bold">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedDoctors.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                            هیچ پزشکی با فیلترهای انتخابی یافت نشد.
                          </td>
                        </tr>
                      ) : (
                        paginatedDoctors.map((doc) => {
                          const spec = initialSpecialties.find((s) => s.id === doc.specialty_id)?.title || 'عمومی';
                          return (
                            <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={doc.avatar}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
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
                              <td className="py-3 px-3 font-mono font-bold text-slate-700">
                                {doc.medical_council_code}
                              </td>
                              <td className="py-3 px-3 text-slate-600 text-[11px]">
                                {spec}
                              </td>
                              <td className="py-3 px-3 text-slate-600 font-mono">{doc.experience_years} سال</td>
                              <td className="py-3 px-3 text-amber-500 font-mono font-bold">★ {doc.rating}</td>
                              <td className="py-3 px-3">
                                {doc.passport_committed ? (
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                    ✓ دارای تعهد
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[10px]">فاقد تعهد</span>
                                )}
                              </td>
                              <td className="py-3 px-3">
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
                              <td className="py-3 px-4">
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
                                    className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
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
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
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
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>نمایش</span>
                    <select
                      value={doctorPageSize}
                      onChange={(e) => {
                        setDoctorPageSize(Number(e.target.value));
                        setDoctorCurrentPage(1);
                      }}
                      className="p-1 border border-slate-300 rounded-lg bg-white text-xs text-slate-700"
                    >
                      <option value={20}>۲۰ پزشک در صفحه</option>
                      <option value={50}>۵۰ پزشک در صفحه</option>
                      <option value={100}>۱۰۰ پزشک در صفحه</option>
                    </select>
                    <span>
                      (صفحه {validPage.toLocaleString('fa-IR')} از {totalDoctorPages.toLocaleString('fa-IR')})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDoctorCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={validPage === 1}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span>صفحه قبل</span>
                    </button>

                    <span className="px-3 py-1 font-mono font-bold text-slate-800 bg-slate-50 rounded-lg border border-slate-200">
                      {validPage.toLocaleString('fa-IR')} / {totalDoctorPages.toLocaleString('fa-IR')}
                    </span>

                    <button
                      onClick={() => setDoctorCurrentPage((p) => Math.min(totalDoctorPages, p + 1))}
                      disabled={validPage >= totalDoctorPages}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span>صفحه بعد</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

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
          {/* SECTION: DOCTOR APPLICATIONS (کارتابل درخواست‌های عضویت) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'applications' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                        <UserCheck className="w-5 h-5" />
                      </span>
                      <h2 className="text-base font-black text-slate-900">
                        کارتابل درخواست‌های ثبت‌نام پزشکان و کلینیک‌ها
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 mr-9">
                      بررسی اطلاعات هویتی، استعلام شماره نظام پزشکی و تایید انتشار در دایرکتوری عمومی دنتال‌مپ
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <a
                      href="https://membersearch.irimc.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>سامانه جستجوی نظام پزشکی (IRIMC)</span>
                    </a>
                  </div>
                </div>

                {/* Counter Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div
                    onClick={() => setAppFilter('pending')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      appFilter === 'pending'
                        ? 'bg-amber-500/10 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold block mb-1">در انتظار بررسی</span>
                    <span className="text-xl font-black font-mono text-amber-600">
                      {applications.filter((a) => a.status === 'pending').length}
                    </span>
                  </div>

                  <div
                    onClick={() => setAppFilter('approved')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      appFilter === 'approved'
                        ? 'bg-emerald-500/10 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400/20'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold block mb-1">تایید شده (فعال)</span>
                    <span className="text-xl font-black font-mono text-emerald-600">
                      {applications.filter((a) => a.status === 'approved').length}
                    </span>
                  </div>

                  <div
                    onClick={() => setAppFilter('rejected')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      appFilter === 'rejected'
                        ? 'bg-rose-500/10 border-rose-400 text-rose-900 ring-2 ring-rose-400/20'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold block mb-1">رد شده</span>
                    <span className="text-xl font-black font-mono text-rose-600">
                      {applications.filter((a) => a.status === 'rejected').length}
                    </span>
                  </div>

                  <div
                    onClick={() => setAppFilter('all')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      appFilter === 'all'
                        ? 'bg-teal-500/10 border-teal-400 text-teal-900 ring-2 ring-teal-400/20'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-bold block mb-1">کل درخواست‌ها</span>
                    <span className="text-xl font-black font-mono text-slate-800">
                      {applications.length}
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setAppFilter(tab)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          appFilter === tab
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab === 'all' && 'همه'}
                        {tab === 'pending' && 'در انتظار'}
                        {tab === 'approved' && 'تایید شده'}
                        {tab === 'rejected' && 'رد شده'}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="جستجوی نام، کد نظام یا موبایل..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Applications List */}
              {(() => {
                const filtered = applications.filter((app) => {
                  if (appFilter !== 'all' && app.status !== appFilter) return false;
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    app.full_name.toLowerCase().includes(q) ||
                    app.medical_council_code.toLowerCase().includes(q) ||
                    app.mobile.toLowerCase().includes(q) ||
                    app.address.toLowerCase().includes(q)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                      <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-700">هیچ درخواستی در این بخش یافت نشد</p>
                      <p className="text-xs text-slate-400 mt-1">
                        با ارسال فرم از سوی دندانپزشکان، درخواست‌ها در این کارتابل نمایش داده می‌شوند.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filtered.map((app) => {
                      const cityName = initialCities.find((c) => c.id === app.city_id)?.name || 'نامشخص';
                      const specialtyName = initialSpecialties.find((s) => s.id === app.specialty_id)?.title || 'ایمپلنتولوژی دندان';

                      return (
                        <div
                          key={app.id}
                          className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300 space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <span
                                className={`p-2.5 rounded-2xl ${
                                  app.center_type === 'clinic'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {app.center_type === 'clinic' ? (
                                  <Building2 className="w-5 h-5" />
                                ) : (
                                  <Users className="w-5 h-5" />
                                )}
                              </span>

                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-sm font-black text-slate-900">{app.full_name}</h3>
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                                    کد نظام: {app.medical_council_code}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold">
                                    {specialtyName}
                                  </span>
                                  {app.is_24_7 && (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold">
                                      شبانه روزی ۲۴ ساعته
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                  شهر: <strong className="text-slate-700">{cityName}</strong> | نشانی: {app.address}
                                </p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                              {app.status === 'pending' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  <Clock className="w-3.5 h-3.5" />
                                  در انتظار بررسی
                                </span>
                              )}
                              {app.status === 'approved' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  تایید و منتشر شده
                                </span>
                              )}
                              {app.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  <XCircle className="w-3.5 h-3.5" />
                                  رد شده
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Details Row: Contact, Brands, Insurances */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl text-xs">
                            <div>
                              <span className="text-[11px] text-slate-400 font-bold block mb-1">راه‌های ارتباطی:</span>
                              <div className="space-y-1">
                                <a
                                  href={`tel:${app.mobile}`}
                                  className="flex items-center gap-1.5 font-mono text-slate-800 hover:text-emerald-600 font-bold"
                                >
                                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                                  <span>موبایل: {app.mobile}</span>
                                </a>
                                {app.phone && (
                                  <a
                                    href={`tel:${app.phone}`}
                                    className="flex items-center gap-1.5 font-mono text-slate-700 hover:text-emerald-600"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                                    <span>مطب: {app.phone}</span>
                                  </a>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="text-[11px] text-slate-400 font-bold block mb-1">برندهای ایمپلنت مورد استفاده:</span>
                              <div className="flex flex-wrap gap-1">
                                {app.brands && app.brands.length > 0 ? (
                                  app.brands.map((b) => (
                                    <span key={b} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px] font-mono">
                                      {b}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400 text-[11px]">برندی ثبت نشده</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="text-[11px] text-slate-400 font-bold block mb-1">بیمه‌های طرف قرارداد:</span>
                              <div className="flex flex-wrap gap-1">
                                {app.insurances && app.insurances.length > 0 ? (
                                  app.insurances.map((ins) => (
                                    <span key={ins} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px]">
                                      {ins}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400 text-[11px]">فاقد بیمه تکمیلی</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bio preview if any */}
                          {app.bio && (
                            <div className="p-3 bg-teal-50/50 rounded-xl text-xs text-slate-700 border border-teal-100">
                              <span className="font-bold text-teal-900 block mb-0.5">بیوگرافی و سوابق:</span>
                              <p className="line-clamp-2">{app.bio}</p>
                            </div>
                          )}

                          {/* Rejection Reason if any */}
                          {app.rejection_reason && (
                            <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-800 border border-rose-200">
                              <span className="font-bold block mb-0.5">علت رد درخواست:</span>
                              <p>{app.rejection_reason}</p>
                            </div>
                          )}

                          {/* Action Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                            <span className="text-slate-400 font-mono text-[11px]">
                              تاریخ ثبت: {new Date(app.created_at).toLocaleDateString('fa-IR')}
                              {app.reviewed_at && ` | بررسی: ${new Date(app.reviewed_at).toLocaleDateString('fa-IR')}`}
                            </span>

                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={`https://membersearch.irimc.org`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                                <span>استعلام کد نظام</span>
                              </a>

                              {app.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveApplication(app)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>تایید و انتشار در دایرکتوری</span>
                                  </button>

                                  <button
                                    onClick={() => handleRejectApplication(app)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-all border border-rose-200 cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>رد درخواست</span>
                                  </button>
                                </>
                              )}

                              {app.status === 'approved' && (
                                <Link
                                  to={`/doctor/dr-${app.medical_council_code}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-all border border-emerald-200"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>مشاهده پروفایل در سایت</span>
                                </Link>
                              )}

                              <button
                                onClick={() => handleDeleteApplication(app.id)}
                                className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-700 transition-all cursor-pointer"
                                title="حذف از کارتابل"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* SECTION: PASSPORTS (پاسپورت‌های صادرشده FDI) */}
          {/* ---------------------------------------------------------------- */}
          {activeSection === 'passports' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                        <FileCheck2 className="w-5 h-5" />
                      </span>
                      <h2 className="text-base font-black text-slate-900">
                        سامانه مدیریت پاسپورت‌های دیجیتال ۳۲ دندان (FDI Digital Passports)
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 mr-9">
                      مشاهده، ردیابی، چاپ مجدد شناسنامه رسمی بیمار و ارسال پیامک حاوی لینک استعلام آنلاین
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Link
                      to="/passport"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>پرتال صدور و استعلام پاسپورت در سایت</span>
                    </Link>
                  </div>
                </div>

                {/* Counter Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 text-teal-900">
                    <span className="text-[11px] font-bold block mb-1">کل پاسپورت‌های صادرشده:</span>
                    <span className="text-xl font-black font-mono text-teal-700">{passports.length}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-900">
                    <span className="text-[11px] font-bold block mb-1">شناسنامه‌های فعال و معتبر:</span>
                    <span className="text-xl font-black font-mono text-emerald-700">
                      {passports.filter((p) => p.status === 'active').length}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
                    <span className="text-[11px] font-bold block mb-1">مجموع ایمپلنت‌های ثبت‌شده:</span>
                    <span className="text-xl font-black font-mono text-slate-800">
                      {passports.reduce((acc, p) => acc + (p.teeth?.length || 0), 0)} قطعه
                    </span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="جستجوی شماره پرونده (DMP)، نام بیمار، کدملی یا موبایل..."
                      value={passportSearch}
                      onChange={(e) => setPassportSearch(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Passports List */}
              {(() => {
                const filtered = passports.filter((p) => {
                  if (!passportSearch.trim()) return true;
                  const q = passportSearch.toLowerCase();
                  return (
                    p.id.toLowerCase().includes(q) ||
                    p.patient_name.toLowerCase().includes(q) ||
                    p.patient_national_id.includes(q) ||
                    p.patient_mobile.includes(q) ||
                    (p.surgeon_name && p.surgeon_name.toLowerCase().includes(q)) ||
                    (p.clinic_name && p.clinic_name.toLowerCase().includes(q))
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                      <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-700">هیچ شناسنامه‌ای یافت نشد</p>
                      <p className="text-xs text-slate-400 mt-1">
                        با صدور پاسپورت در بخش /passport، مشخصات در این بخش نمایش داده خواهد شد.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filtered.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-700">
                              <ShieldCheck className="w-5 h-5" />
                            </span>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-black text-slate-900">{p.patient_name}</h3>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold border border-emerald-200">
                                  {p.id}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px]">
                                  کدملی: {p.patient_national_id}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                جراح: <strong className="text-slate-700">{p.surgeon_name || 'نامشخص'}</strong> | مرکز: {p.clinic_name || 'نامشخص'}
                              </p>
                            </div>
                          </div>

                          <div>
                            {p.status === 'active' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                معتبر و فعال
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                <XCircle className="w-3.5 h-3.5" />
                                باطل شده
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Teeth summary */}
                        <div className="p-3 bg-slate-50 rounded-2xl text-xs flex flex-wrap items-center gap-2">
                          <span className="text-slate-500 font-bold">دندان‌های کاشته‌شده ({p.teeth?.length || 0}):</span>
                          {p.teeth?.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-[11px] font-mono"
                            >
                              #{t.tooth_number} ({t.brand_name?.split(' ')[0] || 'Implant'} | REF: {t.fixture_ref})
                            </span>
                          ))}
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                          <span className="text-slate-400 font-mono text-[11px]">
                            تاریخ صدور: {p.issue_date_shamsi} | شماره همراه: {p.patient_mobile}
                          </span>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => setSelectedPassportCertificate(p)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>مشاهده و چاپ شناسنامه رسمی (PDF)</span>
                            </button>

                            <button
                              onClick={() => handleResendPassportSms(p)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5 text-slate-500" />
                              <span>ارسال مجدد پیامک</span>
                            </button>

                            <button
                              onClick={() => handleTogglePassportStatus(p.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 text-[11px] font-bold transition-all cursor-pointer"
                            >
                              {p.status === 'active' ? 'لغو اعتبار' : 'فعال‌سازی مجدد'}
                            </button>

                            <button
                              onClick={() => handleDeletePassport(p.id)}
                              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-700 transition-all cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
            <SmsSection
              smsConfig={smsConfig}
              setSmsConfig={setSmsConfig}
              smsCredit={smsCredit}
              smsLogs={smsLogs}
              testSmsPhone={testSmsPhone}
              setTestSmsPhone={setTestSmsPhone}
              testSmsMessage={testSmsMessage}
              setTestSmsMessage={setTestSmsMessage}
              isSendingTestSms={isSendingTestSms}
              testSmsResult={testSmsResult}
              onSaveSmsSettings={handleSaveSmsSettings}
              onSendTestSms={handleSendTestSms}
              onClearSmsLogs={handleClearSmsLogs}
            />
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
                  const target = updated.find((p) => p.id === editingPage.id);
                  if (target) SupabaseSyncService.syncPage(target);
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
                  SupabaseSyncService.syncPage(newPage);
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
                    <option value="landing">قالب لندینگ پیج تخصصی (مان‌اپ / درمان و کلینیک)</option>
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
      {/* MODAL: BULK IMPORT DOCTORS (ایمپورت گروهی تا ۱۵۰۰+ پزشک) */}
      {/* ------------------------------------------------------------------ */}
      <DoctorBulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        existingDoctors={doctors}
        specialties={initialSpecialties}
        onImportComplete={(finalDoctors) => {
          setDoctors(finalDoctors);
          setDoctorCurrentPage(1);
        }}
        showToast={showToast}
      />

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

      {/* Official Passport Certificate Preview & Print Modal */}
      {selectedPassportCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative max-w-4xl w-full my-8 bg-white rounded-3xl p-4 sm:p-6 shadow-2xl">
            <OfficialPassportCertificate
              passport={selectedPassportCertificate}
              onClose={() => setSelectedPassportCertificate(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
