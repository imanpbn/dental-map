import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
  ShieldCheck
} from 'lucide-react';
import { ImplantBrand, ImplantType } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface BrandComparisonPageProps {
  brands: ImplantBrand[];
  implantTypes: ImplantType[];
}

export const BrandComparisonPage: React.FC<BrandComparisonPageProps> = ({
  brands,
  implantTypes
}) => {
  const { compareSlug } = useParams<{ compareSlug: string }>();

  // Extract both slugs: "megagen-vs-straumann"
  const parts = compareSlug?.split('-vs-') || [];
  const slugA = parts[0];
  const slugB = parts[1];

  const brandA = brands.find((b) => b.slug === slugA) || brands[0];
  const brandB = brands.find((b) => b.slug === slugB) || brands[1];

  const typesA = implantTypes.filter((t) => t.brand_id === brandA.id);
  const typesB = implantTypes.filter((t) => t.brand_id === brandB.id);

  const canonicalUrl = `https://dentalmap.ir${DentalMapRoutes.compareBrands(brandA.slug, brandB.slug)}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href={canonicalUrl} />

      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700">صفحه اصلی</Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">مقایسه تخصصی برندها</span>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold">
              {brandA.name} در برابر {brandB.name}
            </span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold mb-3 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ماتریس مقایسه بالینی و مهندسی مواد</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white">
            مقایسه جامع ایمپلنت {brandA.name} با {brandB.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            بررسی تخصصی تفاوت‌های اتصال مورس تیپر، پایداری استخوان، سرعت استئواینتگریشن و شرایط گارانتی مادام‌العمر.
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand A Column */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{brandA.logo}</span>
              <div>
                <h2 className="text-lg font-black text-slate-900">{brandA.name}</h2>
                <span className="text-xs text-slate-500">{brandA.warranty_description}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              {typesA.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">{t.model_name}</span>
                  <div><strong>آلیاژ:</strong> {t.material}</div>
                  <div><strong>تکنولوژی سطح:</strong> {t.surface_technology}</div>
                  <div><strong>اتصال:</strong> {t.extra_specs.connection_type || 'مورس تیپر'}</div>
                  <div className="text-emerald-700 font-bold mt-1">طول عمر تضمینی: {t.avg_lifespan_years} سال</div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand B Column */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{brandB.logo}</span>
              <div>
                <h2 className="text-lg font-black text-slate-900">{brandB.name}</h2>
                <span className="text-xs text-slate-500">{brandB.warranty_description}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              {typesB.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">{t.model_name}</span>
                  <div><strong>آلیاژ:</strong> {t.material}</div>
                  <div><strong>تکنولوژی سطح:</strong> {t.surface_technology}</div>
                  <div><strong>اتصال:</strong> {t.extra_specs.connection_type || 'مورس تیپر'}</div>
                  <div className="text-teal-700 font-bold mt-1">طول عمر تضمینی: {t.avg_lifespan_years} سال</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
