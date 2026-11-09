import React from 'react';
import {
  LayoutDashboard,
  FileText,
  FileCode,
  Users,
  Building2,
  Cpu,
  Package,
  DollarSign,
  Settings,
  Globe,
  Send
} from 'lucide-react';

export type AdminSection =
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

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  blogPostsCount: number;
  pagesCount: number;
  doctorsCount: number;
  clinicsCount: number;
  componentsCount: number;
  packagesCount: number;
  accountsCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  setActiveSection,
  blogPostsCount,
  pagesCount,
  doctorsCount,
  clinicsCount,
  componentsCount,
  packagesCount,
  accountsCount
}) => {
  return (
    <aside className="w-full md:w-64 bg-slate-900 border-l border-slate-800 text-slate-300 shrink-0 select-none">
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold block">
            DENTAL MAP CMS v7.2.0
          </span>
          <span className="text-xs font-black text-white">منوی اصلی مدیریت</span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
      </div>

      <nav className="p-2 space-y-1 text-xs">
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveSection('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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
            {blogPostsCount}
          </span>
        </button>

        {/* 3. Pages */}
        <button
          onClick={() => setActiveSection('pages')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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
            {pagesCount}
          </span>
        </button>

        {/* 4. Doctors */}
        <button
          onClick={() => setActiveSection('doctors')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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
            {doctorsCount}
          </span>
        </button>

        {/* 5. Clinics */}
        <button
          onClick={() => setActiveSection('clinics')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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
            {clinicsCount}
          </span>
        </button>

        {/* 6. Components */}
        <button
          onClick={() => setActiveSection('components')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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
            {componentsCount}
          </span>
        </button>

        {/* 7. Packages */}
        <button
          onClick={() => setActiveSection('packages')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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
            {packagesCount}
          </span>
        </button>

        {/* 8. Leads Valuation */}
        <button
          onClick={() => setActiveSection('leads')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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

        {/* 9. Users */}
        <button
          onClick={() => setActiveSection('users')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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
            {accountsCount}
          </span>
        </button>

        {/* 10. Site Settings */}
        <button
          onClick={() => setActiveSection('settings')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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

        {/* 11. SEO Meta */}
        <button
          onClick={() => setActiveSection('seo')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
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

        {/* 12. SMS Gateway */}
        <button
          onClick={() => setActiveSection('sms')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeSection === 'sms'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Send className="w-4 h-4 text-emerald-400" />
            <span>درگاه ملی‌پیامک (SMS)</span>
          </div>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 text-[10px] text-emerald-400 font-mono border border-emerald-800">
            فعال
          </span>
        </button>
      </nav>
    </aside>
  );
};
