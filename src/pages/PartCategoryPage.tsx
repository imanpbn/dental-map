import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Layers,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  PhoneCall
} from 'lucide-react';
import { DentalComponent, ImplantBrand, ComponentCategory } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface PartCategoryPageProps {
  components: DentalComponent[];
  brands: ImplantBrand[];
}

export const CATEGORY_NAMES: Record<string, string> = {
  fixture: 'فیکسچرهای استخوانی (Fixture)',
  abutment: 'اباتمنت‌های پروتزی (Abutment)',
  healing: 'کلاهک‌های شکل‌دهنده لثه (Healing Cap)',
  impression_coping: 'ایمپرشن کوپینگ‌های قالب‌گیری (Impression Coping)',
  analog: 'آنالوگ‌های کست گچی (Analog)',
  surgical_kit: 'کیت‌های جراحی و درایور (Surgical Kit)',
  scan_body: 'شاخص‌های اسکن دیجیتال (Scan Body)',
  digital_analog: 'آنالوگ‌های مدل پرینت ۳ بعدی (Digital Analog)'
};

export const PartCategoryPage: React.FC<PartCategoryPageProps> = ({
  components,
  brands
}) => {
  const { categorySlug, refCode } = useParams<{ categorySlug?: string; refCode?: string }>();

  // If a single part by REF is requested
  if (refCode) {
    const component = components.find(
      (c) => c.ref_code.toLowerCase() === decodeURIComponent(refCode).toLowerCase()
    );

    if (!component) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs">
            <h2 className="font-bold text-slate-800 text-base mb-2">قطعه با این کد رفرنس یافت نشد</h2>
            <Link
              to="/#parts-catalog"
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block"
            >
              بازگشت به کاتالوگ قطعات
            </Link>
          </div>
        </div>
      );
    }

    const brand = brands.find((b) => b.id === component.brand_id);

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        <link rel="canonical" href={`https://dentalmap.ir/parts/ref/${component.ref_code}`} />

        {/* Top Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs truncate">
              <Link to="/" className="text-slate-500 hover:text-emerald-700 transition-colors">
                صفحه اصلی
              </Link>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link
                to={DentalMapRoutes.partsHub()}
                className="text-slate-500 hover:text-emerald-700 transition-colors"
              >
                کاتالوگ قطعات
              </Link>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <Link
                to={DentalMapRoutes.partCategory(component.category)}
                className="text-slate-700 hover:text-emerald-700 font-bold transition-colors"
              >
                {CATEGORY_NAMES[component.category] || component.category}
              </Link>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-emerald-700 font-bold font-mono">REF: {component.ref_code}</span>
            </nav>

            <Link
              to={DentalMapRoutes.partCategory(component.category)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>همه قطعات این دسته</span>
            </Link>
          </div>
        </div>

        {/* Detail Body */}
        <div className="max-w-5xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">
                    REF: {component.ref_code}
                  </span>
                  <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-lg">
                    {component.lot_number}
                  </span>
                  <span className="text-xs text-slate-500 font-bold mr-2">
                    {brand?.logo} {brand?.name}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {component.name_fa}
                </h1>
                <span className="text-xs font-mono text-slate-400 block mt-1">
                  {component.name_en}
                </span>
              </div>

              <div>
                <a
                  href="tel:02188001144"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>استعلام موجودی و سفارش انبار</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={component.image_url}
                  alt={component.name_fa}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">توضیحات فنی:</h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {component.description}
                  </p>
                </div>

                <div className="space-y-2 border border-slate-200 p-4 rounded-2xl">
                  <div className="flex justify-between">
                    <span className="text-slate-500">پلتفرم / هگز:</span>
                    <span className="font-mono font-bold text-slate-900">{component.hex_size || component.platform_size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">آلیاژ ساختاری:</span>
                    <span className="font-medium text-slate-900">{component.material}</span>
                  </div>
                  {component.torque_ncm && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">گشتاور بستن (تورک):</span>
                      <span className="font-mono font-bold text-emerald-700">{component.torque_ncm} Ncm</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">سازگاری:</span>
                    <span className="font-medium text-slate-800 text-left dir-ltr">{component.compatibility}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200 flex justify-between items-center">
                  <span className="font-bold">قیمت مصوب قطعه اصلی:</span>
                  <span className="font-mono font-black text-base text-slate-900">
                    {component.price_toman.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Category view (/parts/:categorySlug)
  const currentCat = categorySlug as ComponentCategory;
  const matchedParts = categorySlug ? components.filter((c) => c.category === currentCat) : components;
  const catTitle = categorySlug ? (CATEGORY_NAMES[categorySlug] || 'قطعات ایمپلنت دندان') : 'کاتالوگ جامع قطعات و کامپوننت‌های ایمپلنتولوژی';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href={`https://dentalmap.ir/parts/${categorySlug || 'fixture'}`} />

      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 transition-colors">
              صفحه اصلی
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              to={DentalMapRoutes.partsHub()}
              className="text-slate-500 hover:text-emerald-700 transition-colors"
            >
              کاتالوگ قطعات
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-emerald-700 font-bold">{catTitle}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
            <Layers className="w-3.5 h-3.5" />
            <span>کاتالوگ سئو رده‌های هشت‌گانه قطعات ایمپلنت</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">{catTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            بررسی کدهای رفرنس رسمی، ابعاد پلتفرم، تست‌های استریل کارخانه و استعلام قیمت مصوب روز.
          </p>
        </div>
      </div>

      {/* Parts Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedParts.map((item) => (
            <Link
              key={item.id}
              to={DentalMapRoutes.partByRef(item.ref_code)}
              className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/50 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    REF: {item.ref_code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.platform_size}</span>
                </div>

                <div className="aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 mb-4">
                  <img
                    src={item.image_url}
                    alt={item.name_fa}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors mb-1">
                  {item.name_fa}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 block truncate mb-3">
                  {item.name_en}
                </span>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-900">
                  {item.price_toman.toLocaleString('fa-IR')} تومان
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <span>مشاهده فنی</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
