import React from 'react';
import {
  Search,
  Sparkles,
  FileCheck
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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-20 rounded-2xl md:rounded-3xl my-4 shadow-xl border border-slate-800/80">
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
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              شناسنامه دیجیتال، اصالت قطعات و انتخاب هوشمندانه{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                ایمپلنت دندان
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              با دنتال مپ، از اصالت فیکسچر و اباتمنت خود با کد رفرنس (REF) و شماره لات (LOT) اطمینان یابید،
              پاسپورت ۳۲ دندان خود را دریافت کنید و پزشکان فوق تخصص و کلینیک‌های طرف قرارداد با بیمه را مقایسه کنید.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onSearchClick}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>کاتالوگ قطعات و استعلام کد REF</span>
              </button>

              <button
                onClick={onOpenPassport}
                className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-100 hover:text-white font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>شبیه‌ساز پاسپورت فک ۳۲ دندان</span>
              </button>
            </div>

            {/* Platform Stats (وسط‌چین شده مطابق درخواست) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-slate-800/80 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl sm:text-3xl font-black text-emerald-400 font-mono">۱۲,۴۸۰+</div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 text-center leading-tight">قطعه استعلام‌شده IMED</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl sm:text-3xl font-black text-teal-400 font-mono">۴۵۰+</div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 text-center leading-tight">جراح و متخصص معتبر</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl sm:text-3xl font-black text-emerald-300 font-mono">۱۰۰٪</div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 text-center leading-tight">تضمین اصالت و گارانتی</div>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase (جایگزین کارت فیکسچر پرچمدار سال با تصویر ارسالی کاربر) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900 group">
              {/* Subtle ambient medical glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

              <img
                src="/images/hero-dentist-patient.jpg"
                alt="درمان و جراحی تخصصی ایمپلنت دنتال‌مپ"
                className="w-full h-auto max-h-[520px] object-cover object-center rounded-3xl transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Bottom Subtle Overlay Badge */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-5 pt-12 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white text-xs sm:text-sm">
                    پلتفرم مرجع شفافیت و اصالت ایمپلنتولوژی
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                  مورد تایید IMED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
