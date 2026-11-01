import React from 'react';
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
  FileCheck2
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

  const component = components.find(
    (c) => c.ref_code.toLowerCase() === refCode?.toLowerCase()
  );

  if (!component) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-sm">
          <h2 className="font-bold text-slate-800 text-base mb-2">قطعه مورد نظر یافت نشد</h2>
          <p className="text-xs text-slate-500 mb-6">
            کد رفرنس «{refCode}» در پایگاه داده قطعات ثبت نشده است یا تغییر یافته است.
          </p>
          <Link
            to="/"
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
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium">
              <span>صفحه اصلی دنتال مپ</span>
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/#parts-catalog" className="text-slate-500 hover:text-emerald-700">
              کاتالوگ قطعات
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold font-mono">REF: {component.ref_code}</span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
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
              <h1 className="text-xl sm:text-3xl font-black text-slate-900">
                {component.name_fa}
              </h1>
              <span className="text-xs sm:text-sm font-mono text-slate-400 block mt-1">
                {component.name_en}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:02188001144"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>استعلام موجودی و سفارش انبار</span>
              </a>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Image Column */}
            <div className="lg:col-span-5">
              <div className="aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 mb-4 shadow-inner">
                <img
                  src={component.image_url}
                  alt={component.name_fa}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">قیمت مصوب قطعه اصلی:</span>
                  <span className="font-mono font-black text-base text-slate-900">
                    {component.price_toman.toLocaleString('fa-IR')}{' '}
                    <span className="text-xs font-normal text-slate-500">تومان</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-emerald-700">
                  <span>وضعیت انبار:</span>
                  <span className="font-bold">موجود و آماده تحویل فوری استریل</span>
                </div>
              </div>
            </div>

            {/* Technical Specs Column */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">توضیحات بالینی و کاربرد:</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  {component.description}
                </p>
              </div>

              {/* Specs Table */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">مشخصات مهندسی و متالورژی:</h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <div className="divide-y divide-slate-100">
                    <div className="p-3.5 flex justify-between bg-white">
                      <span className="text-slate-500 font-medium">پلتفرم اتصال (Platform Size):</span>
                      <span className="font-mono font-bold text-slate-900">{component.platform_size}</span>
                    </div>

                    {component.hex_size && (
                      <div className="p-3.5 flex justify-between bg-slate-50/50">
                        <span className="text-slate-500 font-medium">اندازه و نوع هگز (Hex Size):</span>
                        <span className="font-mono font-bold text-emerald-700">{component.hex_size}</span>
                      </div>
                    )}

                    {component.morse_taper_angle && (
                      <div className="p-3.5 flex justify-between bg-white">
                        <span className="text-slate-500 font-medium">زاویه مخروطی مورس تیپر:</span>
                        <span className="font-mono font-bold text-teal-700">{component.morse_taper_angle}</span>
                      </div>
                    )}

                    <div className="p-3.5 flex justify-between bg-slate-50/50">
                      <span className="text-slate-500 font-medium">آلیاژ ساختاری:</span>
                      <span className="font-medium text-slate-900">{component.material}</span>
                    </div>

                    {component.surface && (
                      <div className="p-3.5 flex justify-between bg-white">
                        <span className="text-slate-500 font-medium">فناوری سطح بیواکتیو:</span>
                        <span className="font-medium text-slate-900">{component.surface}</span>
                      </div>
                    )}

                    {component.torque_ncm && (
                      <div className="p-3.5 flex justify-between bg-slate-50/50">
                        <span className="text-slate-500 font-medium">گشتاور مجاز بستن پیچ (Insertion Torque):</span>
                        <span className="font-mono font-bold text-slate-900">{component.torque_ncm} Ncm</span>
                      </div>
                    )}

                    <div className="p-3.5 flex justify-between bg-white">
                      <span className="text-slate-500 font-medium">سازگاری با کیت‌ها و ابزارها:</span>
                      <span className="font-medium text-slate-800 text-left dir-ltr">{component.compatibility}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passport Assurance */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">ثبت رسمی در شناسنامه دیجیتال ۳۲ دندان دنتال مپ:</span>
                  <span className="text-slate-600 leading-relaxed text-[11px]">
                    این قطعه دارای بارکد اصالت رسمی است و پس از جراحی، شماره سریال و لات آن در شناسنامه اختصاصی بیمار ثبت می‌گردد.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
