import React from 'react';
import {
  Layers,
  FileCheck2,
  Cpu,
  MapPin,
  ArrowLeft,
  Check
} from 'lucide-react';

interface PlatformServicesSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const PlatformServicesSection: React.FC<PlatformServicesSectionProps> = ({
  onNavigate
}) => {
  const services = [
    {
      id: 'parts-catalog',
      icon: Layers,
      title: 'کاتالوگ جامع قطعات و استعلام رفرنس (REF)',
      subtitle: 'دسترسی به مشخصات فنی و کدهای استاندارد قطعات',
      desc: 'فیلتر، مقایسه و بررسی ابعاد، هگز، مورس تیپر، سازگاری و اصالت فیکسچرها، اباتمنت‌ها و قطعات دیجیتال از سوئیس تا آلمان و کره.',
      color: 'from-emerald-500/10 to-emerald-500/5',
      borderColor: 'border-emerald-500/20 hover:border-emerald-500/50',
      iconColor: 'text-emerald-600 bg-emerald-100',
      features: ['کدهای رسمی شرکت‌های مادر', 'سازگاری کست و اسکن دیجیتال', 'مشاهده قیمت روز قطعات']
    },
    {
      id: 'passport-section',
      icon: FileCheck2,
      title: 'پاسپورت هوشمند فک ۳۲ دندان (FDI)',
      subtitle: 'شناسنامه دیجیتال و دائمی ایمپلنت‌های بیمار',
      desc: 'ثبت موقعیت دندان، کد فیکسچر، شماره لات ساخت، تورک اتصال، نام جراح و تاریخ با قابلیت چاپ PDF و کد اختصاصی QR.',
      color: 'from-teal-500/10 to-teal-500/5',
      borderColor: 'border-teal-500/20 hover:border-teal-500/50',
      iconColor: 'text-teal-600 bg-teal-100',
      features: ['نقشه استاندارد ۳۲ دندانه فک', 'اعتبار گارانتی مادام‌العمر', 'نسخه چاپی رسمی برای بیمار']
    },
    {
      id: 'biomechanics-section',
      icon: Cpu,
      title: 'مترجم بیومکانیک و تراکم استخوان',
      subtitle: 'پیشنهاددهنده تورک و زاویه کاشت بر اساس D1-D4',
      desc: 'محاسبه‌گر بالینی تعیین اندازه فیکسچر، سرعت دریل، زاویه اباتمنت و تخمین ISQ برای انواع بافت استخوانی فک بالا و پایین.',
      color: 'from-cyan-500/10 to-cyan-500/5',
      borderColor: 'border-cyan-500/20 hover:border-cyan-500/50',
      iconColor: 'text-cyan-600 bg-cyan-100',
      features: ['راهنمای تراکم‌های D1 تا D4', 'کاهش ریسک نکروز و لقی ایمپلنت', 'تنظیمات تورک Ncm استاندارد']
    },
    {
      id: 'directory-section',
      icon: MapPin,
      title: 'دایرکتوری جراحان و مراکز درمانی ایران',
      subtitle: 'فیلتر چندبعدی مطب‌ها، کلینیک‌ها و بیمه‌ها',
      desc: 'جستجوی پزشک بر اساس منطقه شهرداری تهران و شهرها، جنسیت، رده سنی بیمار، کلینیک‌های شبانه‌روزی ۲۴/۷ و بیمه‌های پایه و تکمیلی.',
      color: 'from-slate-500/10 to-slate-500/5',
      borderColor: 'border-slate-500/20 hover:border-slate-500/50',
      iconColor: 'text-slate-700 bg-slate-100',
      features: ['کد نظام پزشکی معتبر', 'تفکیک مطب، کلینیک و بیمارستان', 'پوشش بیمه‌های دانا، البرز و ایران']
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-200">
            <span>سرویس‌های چهارگانه دنتال مپ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            زیرساخت فنی شفافیت زنجیره درمان ایمپلنتولوژی
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            از انتخاب سیستم ایمپلنت سازگار تا صدور پاسپورت دیجیتال و تطبیق پزشک متخصص
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv) => {
            const IconComponent = srv.icon;
            return (
              <div
                key={srv.id}
                className={`rounded-2xl p-6 bg-gradient-to-br ${srv.color} border ${srv.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${srv.iconColor}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                    {srv.title}
                  </h3>
                  <div className="text-xs font-medium text-emerald-700 mb-3">
                    {srv.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {srv.desc}
                  </p>

                  <ul className="space-y-1.5 mb-6 text-[11px] text-slate-700">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onNavigate(srv.id)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>ورود به بخش</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
