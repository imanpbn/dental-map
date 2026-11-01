import React from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  FileCheck,
  Award,
  Layers,
  Activity
} from 'lucide-react';
import { DentalComponent } from '../types';

interface HeroSectionProps {
  onSearchClick: () => void;
  onOpenPassport: () => void;
  onSelectComponent: (comp: DentalComponent) => void;
  featuredComponent?: DentalComponent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchClick,
  onOpenPassport,
  onSelectComponent,
  featuredComponent
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-20">
      {/* Background radial medical glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-medium shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نخستین پلتفرم جامع شفافیت ایمپلنتولوژی و تجهیزات دندانپزشکی کشور</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              شناسنامه دیجیتال، اصالت قطعات و انتخاب هوشمندانه{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                ایمپلنت دندان
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              با دنتال مپ، از اصالت فیکسچر و اباتمنت خود با کد رفرنس (REF) و شماره لات (LOT) اطمینان یابید،
              پاسپورت ۳۲ دندان خود را دریافت کنید و پزشکان فوق تخصص و کلینیک‌های طرف قرارداد با بیمه را مقایسه کنید.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#parts-catalog"
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Search className="w-4 h-4" />
                <span>کاتالوگ قطعات و استعلام کد REF</span>
              </a>

              <button
                onClick={onOpenPassport}
                className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-100 hover:text-white font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>شبیه‌ساز پاسپورت فک ۳۲ دندان</span>
              </button>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">۱۲,۴۸۰+</div>
                <div className="text-xs text-slate-400 mt-0.5">قطعه استعلام‌شده IMED</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">۴۵۰+</div>
                <div className="text-xs text-slate-400 mt-0.5">جراح و متخصص معتبر</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">۱۰۰٪</div>
                <div className="text-xs text-slate-400 mt-0.5">تضمین اصالت و گارانتی</div>
              </div>
            </div>
          </div>

          {/* Straumann BLX & Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/95 border border-slate-700/80 p-6 shadow-2xl backdrop-blur-xl">
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  برترین فیکسچر پرچمدار سال
                </span>
                <span className="text-xs text-slate-400 font-mono">سوئیس 🇨🇭</span>
              </div>

              {/* Title */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">Straumann BLX Roxolid SLActive</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  فیکسچر تیتانیوم-زیرکونیوم با اتصال TorcFit Conical 15°
                </p>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 gap-2.5 text-xs mb-5">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">کد رفرنس رسمی:</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">REF: 021.4312</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">استئواینتگریشن:</span>
                  <span className="text-white font-bold">۳ الی ۴ هفته هیدروفیلیک</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">پایداری اولیه:</span>
                  <span className="text-white font-bold">ISQ &gt; 78 (بسیار بالا)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">ریسک میکرومیکروگپ:</span>
                  <span className="text-emerald-400 font-bold">نزدیک به صفر (Zero Gap)</span>
                </div>
              </div>

              {/* Verification & Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تاییدیه اصالت CE MDR و FDA 510(k)</span>
                </div>
                {featuredComponent && (
                  <button
                    onClick={() => onSelectComponent(featuredComponent)}
                    className="text-xs font-bold text-white hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <span>مشاهده جزئیات</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
