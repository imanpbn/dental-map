import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  Cpu,
  Layers,
  Award,
  CheckCircle2,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { ImplantBrand, ImplantType, Manufacturer, Country, DentalComponent, Doctor, City } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface BrandHubPageProps {
  brands: ImplantBrand[];
  implantTypes: ImplantType[];
  manufacturers: Manufacturer[];
  countries: Country[];
  components: DentalComponent[];
  doctors: Doctor[];
  cities: City[];
}

export const BrandHubPage: React.FC<BrandHubPageProps> = ({
  brands,
  implantTypes,
  manufacturers,
  countries,
  components,
  doctors,
  cities
}) => {
  const { brandSlug, modelSlug, countrySlug, citySlug } = useParams<{
    brandSlug?: string;
    modelSlug?: string;
    countrySlug?: string;
    citySlug?: string;
  }>();

  const isAllBrands = !brandSlug && !countrySlug;
  let brand: ImplantBrand | undefined;
  let country: Country | undefined;

  if (countrySlug) {
    country = countries.find((c) => c.slug === countrySlug) || countries[0];
  } else if (brandSlug) {
    brand = brands.find((b) => b.slug === brandSlug) || brands[0];
  } else {
    brand = undefined;
  }

  const brandTypes = brand ? implantTypes.filter((t) => t.brand_id === brand.id) : [];
  const brandComponents = brand ? components.filter((c) => c.brand_id === brand.id) : [];
  const manufacturer = brand ? manufacturers.find((m) => m.id === brand.manufacturer_id) : undefined;

  // Selected specific model if requested
  const selectedModel = modelSlug ? brandTypes.find((t) => t.slug === modelSlug) : undefined;

  let title = brand
    ? `هاب رسمی ایمپلنت ${brand.name}`
    : country
    ? `ایمپلنت‌های کشور ${country?.name}`
    : 'دانشنامه و هاب برندهای معتبر ایمپلنت دندان';
  if (selectedModel) title += ` - مدل ${selectedModel.model_name}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 transition-colors">
              صفحه اصلی
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {!isAllBrands ? (
              <Link
                to={DentalMapRoutes.brandsHub()}
                className="text-slate-600 hover:text-emerald-700 font-medium transition-colors"
              >
                برندهای ایمپلنت
              </Link>
            ) : (
              <span className="text-emerald-700 font-bold">برندهای ایمپلنتولوژی</span>
            )}

            {brand && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {selectedModel ? (
                  <Link
                    to={DentalMapRoutes.brandHub(brand.slug)}
                    className="text-slate-700 hover:text-emerald-700 font-bold transition-colors"
                  >
                    {brand.name}
                  </Link>
                ) : (
                  <span className="text-emerald-700 font-bold">{brand.name}</span>
                )}
              </>
            )}

            {selectedModel && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-emerald-700 font-bold">{selectedModel.model_name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{brand?.logo || '🌐'}</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>هاب تخصصی متالورژی و کاتالوگ قطعات برند</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white">{title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {brand?.warranty_description || 'بررسی استانداردهای تولید، گارانتی تعویض و جراحان مجرب در ایران.'}
          </p>

          {/* Quick city links for this brand */}
          {brand && (
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="text-xs text-slate-400 flex items-center pl-2">جراحان این برند در:</span>
              {cities.slice(0, 3).map((c) => (
                <Link
                  key={c.id}
                  to={DentalMapRoutes.brandDentistsInCity(brand!.slug, c.slug)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        {/* Models list */}
        {brandTypes.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <span>مدل‌ها و سیستم‌های فیکسچر این برند:</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brandTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    selectedModel?.id === type.id
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">{type.model_name}</span>
                    <span className="text-[11px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                      طول عمر: {type.avg_lifespan_years} سال
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">
                    <strong>آلیاژ:</strong> {type.material} | <strong>سطح:</strong> {type.surface_technology}
                  </p>

                  <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <div>نوع اتصال: <strong>{type.extra_specs.connection_type || 'مورس تیپر'}</strong></div>
                    <div>پایداری اولیه: <strong>{type.extra_specs.isq_stability}</strong></div>
                    <div>ریسک میکروگپ: <strong className="text-emerald-700">{type.extra_specs.microgap_risk}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand Components */}
        {brandComponents.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>قطعات فابریک ثبت‌شده در سامانه:</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brandComponents.map((comp) => (
                <Link
                  key={comp.id}
                  to={DentalMapRoutes.partByRef(comp.ref_code)}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-emerald-800">REF: {comp.ref_code}</span>
                    <span className="font-mono text-slate-400">{comp.lot_number}</span>
                  </div>
                  <span className="font-bold text-slate-900 block truncate">{comp.name_fa}</span>
                  <span className="font-mono font-bold text-slate-700 mt-2 block">
                    {comp.price_toman.toLocaleString('fa-IR')} تومان
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
