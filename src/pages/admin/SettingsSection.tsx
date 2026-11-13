import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw
} from 'lucide-react';
import {
  SiteSettings,
  Doctor,
  Clinic,
  DentalComponent,
  WordPressBlogPost,
  ClinicalPackage
} from '../../types';
import {
  isSupabaseConfigured,
  getSupabaseConfig,
  SupabaseSyncService
} from '../../utils/supabaseClient';
import { CmsStorageService, defaultSiteSettings } from '../../utils/cmsStorage';

interface SettingsSectionProps {
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  clinics: Clinic[];
  setClinics: React.Dispatch<React.SetStateAction<Clinic[]>>;
  components: DentalComponent[];
  setComponents: React.Dispatch<React.SetStateAction<DentalComponent[]>>;
  blogPosts: WordPressBlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<WordPressBlogPost[]>>;
  packages: ClinicalPackage[];
  showToast: (msg: string) => void;
  activeSection: 'settings' | 'seo';
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  siteSettings,
  setSiteSettings,
  doctors,
  setDoctors,
  clinics,
  setClinics,
  components,
  setComponents,
  blogPosts,
  setBlogPosts,
  packages,
  showToast,
  activeSection
}) => {
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (activeSection === 'seo') {
    return (
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
    );
  }

  return (
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
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupabase ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isTestingSupabase ? 'در حال تست...' : 'تست اتصال به سوپابیس'}</span>
            </button>

            <button
              type="button"
              disabled={isSyncingSupabase}
              onClick={async () => {
                if (
                  !window.confirm(
                    'آیا مایلید تمامی اطلاعات فعلی (پزشکان، کلینیک‌ها، قطعات، مقالات و پکیج‌ها) در دیتابیس Supabase ثبت شوند؟'
                  )
                ) {
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
              <Cloud className={`w-4 h-4 ${isSyncingSupabase ? 'animate-bounce' : ''}`} />
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
            راهنما: برای ایجاد جداول در سوپابیس برای اولین بار، وارد پنل Supabase شده و محتوای فایل{' '}
            <code className="text-emerald-300 font-mono">database/schema.sql</code> را در بخش SQL Editor کپی و روی Run کلیک کنید.
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
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره تغییرات تنظیمات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
