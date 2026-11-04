import React from 'react';
import {
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  FileText,
  Lock,
  Heart,
  ChevronLeft,
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenNaxisGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenNaxisGuide
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: About Platform */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white">دنتال مَپ</span>
                <span className="text-[10px] text-emerald-400 block font-mono">
                  Dental Map Iran
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              نخستین سامانه ملی شفافیت قطعات، شناسنامه دیجیتال ۳۲ دندان و دایرکتوری جراحان دهان و فک و صورت ایران. تضمین اصالت و مبارزه با توزیع قطعات غیراستاندارد.
            </p>

            <div className="text-xs text-slate-400 space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span className="font-mono dir-ltr font-bold text-slate-200">021-88001144</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-slate-200">support@dentalmap.ir</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>تهران، میدان ونک، برج ونک، طبقه ششم</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white mb-4">سرویس‌های پلتفرم</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#parts-catalog" className="hover:text-emerald-400 transition-colors">
                  کاتالوگ ۸ دسته قطعات و استعلام رفرنس
                </a>
              </li>
              <li>
                <a href="/passport" className="hover:text-emerald-400 transition-colors">
                  صدور پاسپورت ۳۲ دندان و نسخه چاپی PDF
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-emerald-400 transition-colors">
                  دانشنامه و وبلاگ آموزشی (/blog)
                </a>
              </li>
              <li>
                <a href="#biomechanics-section" className="hover:text-emerald-400 transition-colors">
                  مترجم بیومکانیک تراکم استخوان D1-D4
                </a>
              </li>
              <li>
                <a href="/directory" className="hover:text-emerald-400 transition-colors">
                  دایرکتوری جراحان و مراکز شبانه‌روزی
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenNaxisGuide}
                  className="hover:text-emerald-400 transition-colors text-right"
                >
                  راهنمای فنی برند ناکسیس آلمان (Naxis Guide)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Admin & Verification */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white mb-4">پنل مدیریت و امنیت داده</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ورود به پنل مدیریت پزشکان و مراکز (Admin)</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500 block leading-relaxed">
                  احراز صلاحیت نظام پزشکی و نظارت بر اصالت شماره سریال‌های کارخانه‌ای
                </span>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block mb-1">
                طراحی منطبق بر استانداردهای امنیت داده‌های سلامت و حفظ حریم خصوصی بیماران
              </span>
            </div>
          </div>

          {/* Col 4: Newsletter & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white mb-4">خبرنامه علمی و استعلام قطعات</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              جهت دریافت آخرین بروزرسانی‌های کدهای رفرنس و بخشنامه‌های واردات تجهیزات پزشکی ایمپلنتولوژی:
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="ایمیل یا شماره موبایل..."
                className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
              <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors">
                عضویت در سامانه اطلاع‌رسانی
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>تمام حقوق مادی و معنوی این پلتفرم متعلق به سامانه شفافیت تجهیزات دندانپزشکی «دنتال مَپ» می‌باشد. © ۱۴۰۳</span>
            <span className="hidden md:inline">|</span>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="/about-us" className="hover:text-emerald-400 transition-colors">درباره ما</a>
              <span>•</span>
              <a href="/terms" className="hover:text-emerald-400 transition-colors">قوانین و مقررات</a>
              <span>•</span>
              <a href="/contact" className="hover:text-emerald-400 transition-colors">تماس با ما</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
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
