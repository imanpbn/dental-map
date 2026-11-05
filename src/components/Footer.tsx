import React from 'react';
import {
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Lock,
  ArrowUp,
  Layers,
  FileCheck2,
  Sparkles,
  Stethoscope,
  Building,
  Activity,
  ArrowLeftRight,
  Search,
  ExternalLink,
  ChevronLeft,
  BookOpen
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

  const categories = [
    { id: 'fixture', name: 'فیکسچر استخوانی', num: '۰۱' },
    { id: 'abutment', name: 'اباتمنت پروتزی', num: '۰۲' },
    { id: 'healing', name: 'هیلینگ کپ', num: '۰۳' },
    { id: 'impression', name: 'ایمپرشن کوپینگ', num: '۰۴' },
    { id: 'analog', name: 'آنالوگ کست', num: '۰۵' },
    { id: 'kit', name: 'کیت جراحی', num: '۰۶' },
    { id: 'scanbody', name: 'اسکن بادی دیجیتال', num: '۰۷' },
    { id: 'digital-analog', name: 'آنالوگ ۳ بعدی پرینت', num: '۰۸' }
  ];

  const services = [
    {
      title: 'شناسنامه دیجیتال و پاسپورت ۳۲ دندان (FDI)',
      href: '/passport',
      icon: FileCheck2
    },
    {
      title: 'آزمون هوشمند انتخاب سیستم ایمپلنت',
      href: '/quiz',
      icon: Sparkles
    },
    {
      title: 'دندانپزشکان و جراحان سراسر کشور',
      href: '/dentists',
      icon: Stethoscope
    },
    {
      title: 'دایرکتوری مراکز شبانه‌روزی و کلینیک‌ها',
      href: '/directory',
      icon: Building
    },
    {
      title: 'مترجم بیومکانیک تراکم استخوان (D1 تا D4)',
      href: '/#biomechanics-section',
      icon: Activity
    },
    {
      title: 'بسته‌های ترکیبی جراحی و پروتز (۴ در ۱)',
      href: '/#packages-section',
      icon: Layers
    },
    {
      title: 'ماتریس مقایسه سیستم‌های ایمپلنت و میکروگپ',
      href: '/#comparison-section',
      icon: ArrowLeftRight
    },
    {
      title: 'استعلام اصالت و کاتالوگ قطعات (REF Code)',
      href: '/#parts-catalog',
      icon: Search
    }
  ];

  return (
    <footer className="w-full px-[5%] pb-8 pt-4">
      <div className="bg-slate-950 text-slate-300 pt-16 pb-8 border border-slate-800 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Main 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: About Platform & Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
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

            <div className="text-xs text-slate-400 space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono dir-ltr font-bold text-slate-200">021-88001144</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-200">support@dentalmap.ir</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>تهران، میدان ونک، برج ونک، طبقه ششم</span>
              </div>
            </div>

            {/* ورود ادمین */}
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>ورود به پنل مدیریت پزشکان (Admin)</span>
              </button>
            </div>
          </div>

          {/* Col 2: دسته‌بندی قطعات */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">دسته‌بندی قطعات</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/parts/${cat.id}`}
                    className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition-colors group"
                  >
                    <span className="group-hover:translate-x-[-2px] transition-transform">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono group-hover:text-emerald-400">
                      #{cat.num}
                    </span>
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="/parts"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-1 text-xs"
                >
                  <span>کاتالوگ جامع همه قطعات (REF)</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: خدمات و ابزارها */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">خدمات و ابزارها</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {services.map((srv, idx) => {
                const IconComponent = srv.icon;
                return (
                  <li key={idx}>
                    <a
                      href={srv.href}
                      className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition-colors group"
                    >
                      <IconComponent className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                      <span className="line-clamp-1 group-hover:translate-x-[-2px] transition-transform">
                        {srv.title}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 4: دانشنامه و وبلاگ تخصصی */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">دانشنامه و وبلاگ</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="/blog/implant-passport-guide"
                  className="block py-1.5 px-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition-colors group"
                >
                  <span className="block font-medium text-slate-300 group-hover:text-emerald-400 group-hover:translate-x-[-2px] transition-transform">
                    راهنمای جامع پاسپورت اصالت ایمپلنت
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    بررسی شماره رفرنس (REF) و لات ساخت
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/blog/morse-taper-vs-flat-hex-microgap"
                  className="block py-1.5 px-2 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition-colors group"
                >
                  <span className="block font-medium text-slate-300 group-hover:text-emerald-400 group-hover:translate-x-[-2px] transition-transform">
                    تفاوت اتصال مورس تیپر با هگز تخت
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    بررسی معضل میکروگپ و پایداری استخوان
                  </span>
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="/blog"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-1 text-xs"
                >
                  <span>ورود به دانشنامه و همه مقالات</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
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
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <span>بازگشت به بالا</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
};
