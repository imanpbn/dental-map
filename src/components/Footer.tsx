import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowUp,
  FileCheck2,
  Stethoscope,
  Activity,
  Search,
  UserCheck
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenNaxisGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenNaxisGuide
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const primaryServices = [
    {
      title: 'آزمون هوشمند انتخاب برند ایمپلنت',
      desc: 'مشاوره بر اساس بودجه و شرایط استخوان',
      href: '/quiz',
      icon: Activity
    },
    {
      title: 'شناسنامه دیجیتال ۳۲ دندان (FDI)',
      desc: 'ثبت دائمی لات‌نامبر و گارانتی تعویض',
      href: '/passport',
      icon: FileCheck2
    },
    {
      title: 'کاتالوگ جامع قطعات و استعلام رفرنس',
      desc: 'بررسی مشخصات فنی، هگز و اصالت قطعه',
      href: '/parts',
      icon: Search
    },
    {
      title: 'دایرکتوری جراحان و مراکز درمانی',
      desc: 'فیلتر بر اساس منطقه، تخصص و بیمه‌ها',
      href: '/directory',
      icon: Stethoscope
    }
  ];

  const quickLinks = [
    { title: 'وبلاگ و دانشنامه', href: '/blog' },
    { title: 'راهنمای استاندارد قطعات', href: '/naxis-guide' },
    { title: 'درباره دنتال‌مپ', href: '/page/about-us' },
    { title: 'قوانین و مقررات', href: '/page/terms' },
    { title: 'تماس با پشتیبانی', href: '/page/contact' }
  ];

  return (
    <footer className="w-full px-[5%] pb-8 pt-4">
      <div className="bg-slate-950 text-slate-300 py-10 px-6 sm:px-10 border border-slate-800 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Row: Brand Identity & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">دنتال مَپ</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                سامانه مرجع شفافیت ایمپلنتولوژی کشور؛ شناسنامه دیجیتال ۳۲ دندان، اصالت قطعات و پیوند بیماران با جراحان متخصص.
              </p>
            </div>

            {/* Quick Actions & Contact */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@dentalmap.ir</span>
              </div>
              <Link
                to="/doctor-join"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>عضویت دندانپزشکان</span>
              </Link>
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>ورود مدیریت</span>
              </button>
            </div>
          </div>

          {/* Core Services Grid (4 Clean Interactive Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {primaryServices.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <Link
                  key={idx}
                  to={srv.href}
                  className="group p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-emerald-950 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 shrink-0 transition-colors">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                      {srv.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {srv.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Bar: Links, Copyright & Scroll-to-Top */}
          <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
              <span className="text-slate-400">© ۱۴۰۳ دنتال مَپ • تمامی حقوق محفوظ است.</span>
              <span className="hidden md:inline text-slate-700">|</span>
              {quickLinks.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.href}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs border border-slate-800 cursor-pointer shrink-0"
            >
              <span>بازگشت به بالا</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
