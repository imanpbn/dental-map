import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Cpu,
  Layers,
  CheckCircle2,
  PhoneCall,
  MapPin,
  ExternalLink,
  ChevronLeft,
  FileCheck,
  Share2
} from 'lucide-react';
import { DentalComponent } from '../types';

interface NaxisGuidePageProps {
  components: DentalComponent[];
}

export const NaxisGuidePage: React.FC<NaxisGuidePageProps> = ({ components }) => {
  const naxisComponents = components.filter((c) => c.brand_id === 2);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Breadcrumb & Navigation Top Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium">
              <span>صفحه اصلی دنتال مپ</span>
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">راهنمای برندها</span>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold">ناکسیس آلمان (Naxis Germany)</span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به پرتال اصلی</span>
          </Link>
        </div>
      </div>

      {/* Hero Banner for Naxis */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-800 border-2 border-emerald-500/40 text-4xl flex items-center justify-center shadow-2xl">
                🇩🇪
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>برند دارنده استاندارد رسمی DIN EN ISO 14801 و CE MDR اتحادیه اروپا</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  راهنمای جامع بالینی و مهندسی ایمپلنت ناکسیس آلمان (Naxis Germany)
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  تحلیل متالورژی تیتانیوم گرید ۴ سردکاری‌شده، معماری اتصال دوگانه (Dual Connection: Hex 2.1mm + 11° Morse Taper)، سازگاری با سیستم Astra Aqua و فهرست نمایندگی‌های رسمی توزیع در تهران.
                </p>
              </div>
            </div>

            {/* Quick action hotline */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-2 shrink-0">
              <span className="text-slate-400 block text-[11px]">دفتر نمایندگی مرکزی در تهران:</span>
              <a
                href="tel:02188771230"
                className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm dir-ltr hover:text-emerald-300"
              >
                <PhoneCall className="w-4 h-4" />
                <span>021-88771230</span>
              </a>
              <span className="text-[10px] text-slate-400 block">پاسخگویی شنبه تا چهارشنبه ۹ الی ۱۷</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 8-col detail */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1: Dual Connection Architecture */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    ۱. معماری اتصال دوگانه (Dual Connection: Hex 2.1mm + 11° Morse Taper)
                  </h2>
                  <span className="text-xs text-slate-500">حذف کامل ریزحرکت‌های اکلوزال و پیشگیری از نفوذ باکتری‌ها</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                برخلاف سیستم‌های سنتی اکسترنال هگز یا اینترنال هگز تخت که در برابر نیروهای برشی اکلوزال لقی و میکروموشن پیدا می‌کنند، فیکسچرهای نکسیس مجهز به کونیکال ۱۱ درجه استاندارد مورس تیپر هستند. این شیب ۱۱ درجه باعث پدیده جوش اصطکاکی سرد (Cold Welding Effect) شده و فضای میکروگپ را به زیر ۰.۵ میکرون می‌رساند که مانع قطعی عبور باکتری‌های بی‌هوازی و پری‌ایمپلنتیت است.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block mb-1">
                    هگز داخلی ۲.۱ میلی‌متر:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    جهت استقرار زاویه‌ای ضدچرخش (Anti-rotational) در اباتمنت‌های زاویه‌دار، ایمپرشن کوپینگ و قطعات پروتزی با دقت زیر ۱۰ میکرون.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block mb-1">
                    مورس تیپر ۱۱ درجه نفوذناپذیر:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    تحمل بارهای محوری و جانبی جویدن، انتقال استرس مکانیکی به عمق استخوان و جلوگیری از بازجذب استخوان کرستال در اطراف گردن ایمپلنت.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Titanium Metallurgy & MPS Nano-Surface */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-teal-100 text-teal-800">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    ۲. متالورژی تیتانیوم خالص گرید ۴ و تکنولوژی سطح فعال MPS
                  </h2>
                  <span className="text-xs text-slate-500">پوشش بیواکتیو نانوساختار با تاییدیه DIN ISO 5832-2</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                ناکسیس از خالص‌ترین آلیاژ تیتانیوم گرید ۴ پزشکی مطابق با استاندارد DIN ISO 5832-2 آلمان استفاده می‌کند که به روش کشش سرد (Cold-Worked) تقویت مکانیکی شده و مقاومت کششی آن به بالای ۸۵۰ مگاپاسکال رسیده است؛ بدون آنکه سمیت احتمالی وانادیوم یا آلومینیوم موجود در آلیاژهای گرید ۵ را برای بافت‌های زیستی به همراه داشته باشد.
              </p>

              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">تکنولوژی سطح MPS (Micro-Pore Surface):</strong>
                    <span className="text-slate-600 mr-1">
                      سندبلاست با ذرات اکسید تیتانیوم بیواکتیو و سپس اسیداچینگ دوگانه حرارتی جهت ایجاد زبری ایده‌آل Ra = 1.5 - 2.0 µm.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">سرعت استئواینتگریشن استخوان:</strong>
                    <span className="text-slate-600 mr-1">
                      فعال‌سازی سریع پلاکت‌ها و پروتئین‌های فیبرین برای کوتاه کردن دوره جوش‌خوردن استخوان از ۱۲ هفته به ۶ الی ۸ هفته.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Astra Aqua Compatibility */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-800">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    ۳. سازگاری کامل با سیستم آسترا تک سوئد (Astra Tech Aqua Compatibility)
                  </h2>
                  <span className="text-xs text-slate-500">قابلیت استفاده از آچارها و ابزارهای استاندارد ۱۱ درجه</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                پروتزها، درایورها، ترکمترها و قطعات آزمایشگاهی ناکسیس به گونه‌ای مهندسی شده‌اند که با ابزارها و هیلینگ‌های پلتفرم کانیکال استاندارد استرا تک و سیستم‌های ۱۱ درجه سازگار بوده و به کلینیک‌ها و لابراتوارها امکان استفاده آسان از کیت‌های موجود را بدون تحمیل هزینه‌های سنگین ابزار جدید می‌دهد.
              </p>
            </div>

            {/* Section 4: Authorized Tehran Vendors */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-800">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    ۴. مراکز تامین، نمایندگی‌های رسمی و توزیع‌کنندگان معتبر در تهران
                  </h2>
                  <span className="text-xs text-slate-500">مراکز مجاز تامین قطعات استریل با هولوگرام لیزری و کد IRC</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 text-sm block">
                    دفتر مرکزی و نمایندگی انحصاری بازرگانی ناکسیس ایران:
                  </span>
                  <p className="text-slate-600">
                    تهران، خیابان ولیعصر، نرسیده به توانیر، برج پزشکی ولیعصر، طبقه ۴
                  </p>
                  <div className="flex items-center gap-2 text-emerald-700 font-mono font-bold text-sm">
                    <PhoneCall className="w-4 h-4" />
                    <span>021-88771230</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 text-sm block">
                    شعبه توزیع و تحویل فوری غرب تهران (سعادت‌آباد):
                  </span>
                  <p className="text-slate-600">
                    تهران، سعادت‌آباد، خیابان علامه طباطبایی شمالی، پلاک ۴۲
                  </p>
                  <div className="flex items-center gap-2 text-emerald-700 font-mono font-bold text-sm">
                    <PhoneCall className="w-4 h-4" />
                    <span>021-22368910</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar 4-col */}
          <div className="lg:col-span-4 space-y-6">
            {/* Registered Naxis Parts Catalog in DentalMap */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>قطعات ناکسیس ثبت‌شده در دنتال مپ</span>
              </h3>

              <div className="space-y-3">
                {naxisComponents.map((comp) => (
                  <Link
                    key={comp.id}
                    to={`/parts/ref/${comp.ref_code}`}
                    className="block p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-emerald-800 text-[11px]">
                        REF: {comp.ref_code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {comp.lot_number}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-900 block line-clamp-1">
                      {comp.name_fa}
                    </span>
                    <span className="font-mono text-emerald-700 font-bold text-xs mt-1 block">
                      {comp.price_toman.toLocaleString('fa-IR')} تومان
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Guarantee Callout */}
            <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-md border border-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <FileCheck className="w-5 h-5" />
                <span className="font-bold text-xs">گارانتی مادام‌العمر تعویض فیکسچر</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                تمامی فیکسچرهای ناکسیس آلمان کاشته‌شده در مراکز مورد تایید دنتال مپ دارای ضمانتنامه بین‌المللی تعویض رایگان قطعه در صورت عدم استئواینتگریشن می‌باشند.
              </p>
              <div className="pt-2">
                <Link
                  to="/"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs block text-center transition-colors"
                >
                  جستجوی جراحان ناکسیس در تهران
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
