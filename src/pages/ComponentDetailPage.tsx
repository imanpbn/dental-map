import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  Award,
  CheckCircle2,
  Tag,
  PhoneCall,
  QrCode,
  ChevronLeft,
  Share2,
  FileCheck2,
  Download,
  ExternalLink,
  Printer,
  Sparkles,
  Gauge,
  Compass,
  Building2,
  Phone,
  Check,
  MapPin,
  FileText,
  AlertCircle
} from 'lucide-react';
import { DentalComponent, ImplantBrand } from '../types';

interface ComponentDetailPageProps {
  components: DentalComponent[];
  brands: ImplantBrand[];
}

export const ComponentDetailPage: React.FC<ComponentDetailPageProps> = ({
  components,
  brands
}) => {
  const { refCode } = useParams<{ refCode: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'biomechanics' | 'compatibility' | 'vendors' | 'specs'>('biomechanics');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clean refCode parameter and find component
  const cleanRef = (refCode || '').trim();
  const component = components.find(
    (c) =>
      c.ref_code.toLowerCase() === cleanRef.toLowerCase() ||
      c.ref_code.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === cleanRef.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  ) || components[0];

  if (!component) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-sm">
          <h2 className="font-bold text-slate-800 text-base mb-2">قطعه مورد نظر یافت نشد</h2>
          <p className="text-xs text-slate-500 mb-6">
            کد رفرنس «{refCode}» در پایگاه داده قطعات ثبت نشده است یا تغییر یافته است.
          </p>
          <Link
            to="/parts"
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block"
          >
            مشاهده کاتالوگ قطعات ۸ گانه
          </Link>
        </div>
      </div>
    );
  }

  const brand = brands.find((b) => b.id === component.brand_id) || brands[0];

  // Verified Authorized Distributors / Vendors in Iran
  const authorizedVendors = [
    {
      id: 1,
      company_name: 'بازرگانی تجهیزات ایمپلنت نوین تهران (نمایندگی انحصاری پایتخت)',
      city: 'تهران',
      district: 'خیابان آزادی، بعد از اسکندری، مجتمع تخصصی دندانپزشکی',
      phone: '۰۲۱-۶۶۹۰۱۱۲۰',
      stock_status: 'موجود در انبار مرکزی (ارسال فوری ۲ ساعته در تهران)',
      warranty: 'ضمانت تعویض بلاشرط کد LOT در صورت بروز اشکال بستهبندی'
    },
    {
      id: 2,
      company_name: 'شرکت مهندسی پزشکی رازی (توزیع‌کننده رسمی شمال و شمال‌غرب)',
      city: 'تهران / تبریز',
      district: 'میدان ولیعصر، برج تجارت، طبقه ۵',
      phone: '۰۲۱-۸۸۹۴۲۲۰۱',
      stock_status: 'موجود (ارسال ۲۴ ساعته به سراسر کشور)',
      warranty: 'دارای هولوگرام اصالت سازمان غذا و دارو'
    },
    {
      id: 3,
      company_name: 'توزیع کالا و قطعات جراحی پارس دنتال (جنوب کشور)',
      city: 'شیراز / اصفهان',
      district: 'خیابان زند، نبش کوچه پزشکی',
      phone: '۰۷۱-۳۲۳۰۹۰۱۰',
      stock_status: 'موجود در انبار شیراز',
      warranty: 'همراه با فاکتور رسمی و گواهی نامه CE'
    }
  ];

  // Cross-brand compatibility matrix
  const compatibilityList = [
    {
      system: 'Astra Tech OsseoSpeed (Aqua / Lilac)',
      connection: '11° Conical Morse Taper + Internal Hex',
      compatibility_status: '۱۰۰٪ سازگاری کامل بیومکانیک و بدون Micro-gap',
      compatible_parts: 'اباتمنت، هیلینگ کپ و ایمپرشن کوپینگ'
    },
    {
      system: 'Straumann CrossFit Conical Connection (BL / BLX)',
      connection: 'CrossFit 15° Conical',
      compatibility_status: 'سازگاری مستقیم با درایورها و پیچ‌های استاندارد',
      compatible_parts: 'فیکسچر، هیلینگ کپ، آنالوگ دیجیتال'
    },
    {
      system: 'Osstem TSIII / Hiossen SA',
      connection: '11° Morse Taper + 1.25 Hex Regular/Mini',
      compatibility_status: 'سازگاری کامل پروتزی بر اساس استاندارد ISO 14801',
      compatible_parts: 'ترانسفر کوپینگ، آنالوگ ریخته‌گری، کیت جراحی'
    },
    {
      system: 'Dentium SuperLine / Implantium',
      connection: 'Internal Hex 2.5',
      compatibility_status: 'سازگار در پلتفرم‌های قطر ۴.۰ و ۴.۵',
      compatible_parts: 'اباتمنت مستقیم، لوکیتور اوردنچر'
    }
  ];

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(component.ref_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const canonicalUrl = `https://dentalmap.ir/component/${encodeURIComponent(component.ref_code)}`;

  // Schema.org MedicalDevice / Product
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: component.name_fa,
    alternateName: component.name_en,
    image: component.image_url,
    description: component.description,
    sku: component.ref_code,
    mpn: component.lot_number,
    brand: {
      '@type': 'Brand',
      name: brand?.name || 'Dental Map Component'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: (component.price_toman * 10).toString(),
      availability: component.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 transition-colors">
              صفحه اصلی
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/parts" className="text-slate-500 hover:text-emerald-700 transition-colors">
              کاتالوگ قطعات ۸ گانه
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 hidden sm:inline">{brand.name}</span>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <span className="text-emerald-700 font-bold font-mono truncate">REF: {component.ref_code}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('لینک صفحه شناسنامه فنی کپی شد.');
              }}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title="اشتراک‌گذاری"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/parts"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت به کاتالوگ</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        {/* ============================================================ */}
        {/* 1. COMPONENT HERO IDENTITY CARD */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Product Visual */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-slate-50 border border-slate-200/80 p-3 flex items-center justify-center shrink-0 shadow-inner">
                <img
                  src={component.image_url}
                  alt={component.name_fa}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
                {component.is_critical && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-black bg-rose-500 text-white uppercase tracking-wider shadow-sm">
                    حیاتی داخل استخوان
                  </span>
                )}
              </div>

              {/* Title & Codes */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                    REF: {component.ref_code}
                  </span>
                  <span className="font-mono text-xs text-slate-600 font-bold bg-slate-100 px-2.5 py-1 rounded-xl">
                    LOT: {component.lot_number}
                  </span>
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
                    {brand.name}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {component.name_fa}
                </h1>

                <span className="text-xs sm:text-sm font-mono text-slate-400 block dir-ltr text-right">
                  {component.name_en}
                </span>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                  <button
                    onClick={handleCopyRef}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 underline underline-offset-4"
                  >
                    <span>{copied ? 'کد کپی شد ✓' : 'کپی کد رفرنس جهت استعلام'}</span>
                  </button>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">
                    دسته: <strong className="text-slate-700">{component.category}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Primary CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-slate-400 text-[11px] block mb-1">تعرفه رسمی استعلام قطعه:</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  {component.price_toman.toLocaleString('fa-IR')}
                </span>
                <span className="text-xs text-slate-500 mr-1 font-bold">تومان</span>
              </div>

              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="w-full px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>دریافت کاتالوگ و دیتاشیت PDF</span>
              </button>

              <a
                href="tel:02188001144"
                className="w-full px-5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>استعلام موجودی بازرگانی: ۰۲۱-۸۸۰۰۱۱۴۴</span>
              </a>
            </div>
          </div>

          {/* Quick Specification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[11px] block mb-1">آلیاژ فلزی قطعه:</span>
              <span className="font-bold text-slate-900 text-sm">{component.material}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[11px] block mb-1">قطر و سایز پلتفرم:</span>
              <span className="font-bold text-slate-900 text-sm font-mono">{component.platform_size}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[11px] block mb-1">تکنولوژی سطح فعال:</span>
              <span className="font-bold text-emerald-700 text-sm">{component.surface || 'SLA / هایدروفیلیک'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[11px] block mb-1">گشتاور توصیه شده (Torque):</span>
              <span className="font-bold text-slate-900 text-sm font-mono">
                {component.torque_ncm ? `${component.torque_ncm} Ncm` : '۳۵ الی ۴۵ Ncm'}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. TABBED DEEP TECHNICAL SECTIONS */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('biomechanics')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'biomechanics'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              نمودار زاویه، تورک و بیومکانیک
            </button>
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'compatibility'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ماتریس سازگاری با سایر برندها
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'vendors'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              فروشندگان و بازرگانی‌های رسمی در ایران ({authorizedVendors.length})
            </button>
          </div>

          {/* TAB 1: BIOMECHANICS & TORQUE GAUGE */}
          {activeTab === 'biomechanics' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-emerald-600" />
                  <span>راهنمای گشتاور نشاندن (Insertion Torque) و زاویه اتصال:</span>
                </h2>
                <span className="text-xs text-slate-500 font-mono">ISO 14801 Dynamic Fatigue Standard</span>
              </div>

              {/* Visual Torque Range Gauge */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>حداقل گشتاور استخوان اسفنجی (D3-D4): ۲۰ Ncm</span>
                  <span className="text-emerald-700 font-black text-sm">محدوده ایده‌آل جراحی: ۳۵ الی ۵۰ Ncm</span>
                  <span>حداکثر آستانه تحمل آلیاژ: ۷۰ Ncm</span>
                </div>

                {/* Progress Visualizer */}
                <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="w-1/4 bg-amber-400" title="Low Torque Zone"></div>
                  <div className="w-2/4 bg-emerald-500" title="Optimal Insertion Torque"></div>
                  <div className="w-1/4 bg-rose-400" title="Over-Torque Risk Zone"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">زاویه اتصال مخروطی (Taper Angle):</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {component.morse_taper_angle || '۱۱ درجه مورس تیپر واقعی'}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      ایجاد قفل مکانیکی و مهار کامل نفوذ باکتری‌ها (Cold Welding Effect).
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">تراکم استخوانی مناسب:</span>
                    <span className="font-bold text-teal-800">کلاس استخوان D1, D2 و D3</span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      طراحی رزوه‌های متریک دوتایی با برش ملایم و حفظ ترابکول‌های خونی.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">فاصله میکروگپ (Micro-gap):</span>
                    <span className="font-mono text-emerald-700 font-bold">&lt; ۰.۳ میکرون (Zero Leakage)</span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      حداکثر محافظت از استخوان کورتیکال لبه‌ای و عدم تحلیل بافت نرم کرستال.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CROSS-BRAND COMPATIBILITY */}
          {activeTab === 'compatibility' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-teal-600" />
                  <span>جدول سازگاری متقابل با برندهای مطرح بازار ایران (Cross-Compatibility):</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  راهنمای جراحان و لابراتوارها جهت استفاده از قطعات پروتزی، درایورها و اسکن‌بادی‌های سازگار
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 font-bold">سیستم ایمپلنت مرجع</th>
                      <th className="pb-3 font-bold">هندسه اتصال (Connection)</th>
                      <th className="pb-3 font-bold">وضعیت انطباق بالینی</th>
                      <th className="pb-3 font-bold">قطعات با قابلیت جابجایی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {compatibilityList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 font-bold text-slate-900">{item.system}</td>
                        <td className="py-3.5 font-mono text-slate-600">{item.connection}</td>
                        <td className="py-3.5">
                          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.compatibility_status}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-600">{item.compatible_parts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AUTHORIZED VENDORS */}
          {activeTab === 'vendors' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>فروشندگان و بازرگانی‌های رسمی توزیع‌کننده در ایران:</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  خرید مستقیم توسط مراکز درمانی و جراحان با استعلام کتبی بارکد و هولوگرام وزارت بهداشت
                </p>
              </div>

              <div className="space-y-4">
                {authorizedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{vendor.company_name}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          نماینده تاییدشده
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{vendor.district}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium">
                        ✓ {vendor.stock_status}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${vendor.phone.replace(/[^0-9]/g, '')}`}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{vendor.phone}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: PDF TECHNICAL DATASHEET PREVIEW & PRINT */}
      {/* ============================================================ */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">
                  شناسنامه و برگه مشخصات فنی رسمی (Technical DataSheet)
                </h3>
              </div>
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Printable Technical Sheet */}
            <div className="p-6 rounded-2xl border border-slate-300 bg-white space-y-5 text-xs">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <span className="font-black text-slate-900 text-sm block">دنتال مپ (Dental Map)</span>
                  <span className="text-[10px] text-slate-400">سامانه شفافیت و اصالت قطعات ایمپلنت دندان ایران</span>
                </div>
                <div className="text-left font-mono text-[11px] text-slate-500">
                  <div>REF: {component.ref_code}</div>
                  <div>LOT: {component.lot_number}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">عنوان فارسی قطعه:</span>
                  <strong className="text-slate-800">{component.name_fa}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">عنوان لاتین و بین‌المللی:</span>
                  <strong className="text-slate-800 font-mono">{component.name_en}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">آلیاژ ساختاری:</span>
                  <strong className="text-slate-800">{component.material} (Grade 4/5 Medical)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">نوع اتصال (Connection):</span>
                  <strong className="text-slate-800 font-mono">{component.platform_size} / Internal Morse Taper</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">استاندارد تست خستگی:</span>
                  <strong className="text-emerald-700 font-mono">ISO 14801:2016 Certified</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">سازگاری بالینی:</span>
                  <strong className="text-slate-800">{component.compatibility}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 leading-relaxed border">
                ⚠️ تمامی قطعات ثبت‌شده در پلتفرم دنتال مپ دارای تعهدنامه اصالت کتبی جراح و گارانتی معتبر شرکتی
                می‌باشند. لطفاً قبل از خروج از کلینیک، از دریافت برچسب کد رفرنس اطمینان حاصل فرمایید.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ یا ذخیره به صورت PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 text-xs"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
