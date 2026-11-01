import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Stethoscope,
  ChevronLeft,
  MapPin,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Doctor, City, District, Specialty, Clinic, ClinicDoctor } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface SpecialtyByLocationPageProps {
  doctors: Doctor[];
  specialties: Specialty[];
  cities: City[];
  districts: District[];
  clinics: Clinic[];
  clinicDoctors: ClinicDoctor[];
}

export const SpecialtyByLocationPage: React.FC<SpecialtyByLocationPageProps> = ({
  doctors,
  specialties,
  cities,
  districts,
  clinics,
  clinicDoctors
}) => {
  const { specialtySlug, citySlug, districtSlug } = useParams<{
    specialtySlug?: string;
    citySlug?: string;
    districtSlug?: string;
  }>();

  // 1. If at root /specialties:
  if (!specialtySlug) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        <link rel="canonical" href="https://dentalmap.ir/specialties" />

        {/* Top Breadcrumb */}
        <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs truncate">
              <Link to="/" className="text-slate-500 hover:text-emerald-700 font-medium">صفحه اصلی</Link>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-700 font-bold">تخصص‌های دندانپزشکی و ایمپلنتولوژی</span>
            </div>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>صفحه اصلی</span>
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold mb-3 border border-teal-500/30">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>دایرکتوری تخصص‌های مورد تایید سازمان نظام پزشکی</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">
              راهنمای انتخاب تخصص دندانپزشکی و جراحی‌های دهان و فک
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              تخصص مورد نظر خود را جهت مشاهده لیست جراحان معتبر، رزومه علمی و رزرو آنلاین در سراسر کشور انتخاب کنید.
            </p>
          </div>
        </div>

        {/* Specialties Grid */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((spec) => {
              const count = doctors.filter((d) => d.specialty_id === spec.id).length;
              return (
                <Link
                  key={spec.id}
                  to={DentalMapRoutes.specialtyHub(spec.slug)}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/50 p-6 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <h2 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">
                      {spec.title}
                    </h2>
                    <span className="text-xs text-slate-500 block mb-4">
                      {count} پزشک و جراح دارای کد نظام پزشکی در سامانه
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>مشاهده جراحان این تخصص</span>
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. Specific Specialty (/specialties/:specialtySlug or with city / district)
  const specialty = specialties.find((s) => s.slug === specialtySlug) || specialties[0];
  const city = citySlug ? cities.find((c) => c.slug === citySlug) : undefined;
  const district = districtSlug ? districts.find((d) => d.slug === districtSlug) : undefined;

  // Canonical path
  let canonicalPath = `https://dentalmap.ir/specialties/${specialty.slug}`;
  if (city) {
    canonicalPath += `/${city.slug}`;
    if (district) canonicalPath += `/${district.slug}`;
  }

  // Filter doctors
  let matchedDoctors = doctors.filter((d) => d.specialty_id === specialty.id);

  if (city) {
    const cityClinics = clinics.filter((c) => {
      if (c.city_id !== city.id) return false;
      if (district && c.district_id !== district.id) return false;
      return true;
    });
    const cityClinicIds = cityClinics.map((c) => c.id);

    const docIdsInCity = clinicDoctors
      .filter((cd) => cityClinicIds.includes(cd.clinic_id) && cd.is_active)
      .map((cd) => cd.doctor_id);

    if (cityClinicIds.length > 0) {
      matchedDoctors = matchedDoctors.filter((d) => docIdsInCity.includes(d.id));
    }
  }

  // Title for display
  let pageTitle = specialty.title;
  if (city) pageTitle += ` در ${city.name}`;
  if (district) pageTitle += ` (${district.name})`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href={canonicalPath} />

      {/* Breadcrumb Header - COMPLETE HIERARCHY WITH CLICKABLE LINKS */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs truncate">
            {/* 1. Home */}
            <Link to="/" className="text-slate-500 hover:text-emerald-700 font-medium transition-colors">
              صفحه اصلی
            </Link>

            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {/* 2. Specialty Hub (CLICKABLE when user is at city or district level) */}
            {city ? (
              <Link
                to={DentalMapRoutes.specialtyHub(specialty.slug)}
                className="text-slate-700 hover:text-emerald-700 font-bold transition-colors"
                title={`مشاهده همه پزشکان ${specialty.title}`}
              >
                {specialty.title}
              </Link>
            ) : (
              <span className="text-emerald-700 font-bold">{specialty.title}</span>
            )}

            {/* 3. City Link (CLICKABLE when district is selected) */}
            {city && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {district ? (
                  <Link
                    to={DentalMapRoutes.specialtyByLocation(specialty.slug, city.slug)}
                    className="text-slate-700 hover:text-emerald-700 font-bold transition-colors"
                  >
                    {city.name}
                  </Link>
                ) : (
                  <span className="text-emerald-700 font-bold">{city.name}</span>
                )}
              </>
            )}

            {/* 4. District Name */}
            {district && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-emerald-700 font-bold">{district.name}</span>
              </>
            )}
          </nav>

          <Link
            to={DentalMapRoutes.specialtiesHub()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>سایر تخصص‌ها</span>
          </Link>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold mb-3 border border-teal-500/30">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>تخصص دندانپزشکی و فلوشیپ بالینی</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">{pageTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            فهرست برترین پزشکان دارای بورد تخصصی {specialty.title} با تضمین کد نظام پزشکی معتبر و تعهد به صدور شناسنامه اصالت ایمپلنت دنتال مپ.
          </p>

          {/* Drill-down City Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="text-xs text-slate-400 ml-1">انتخاب شهر:</span>
            <Link
              to={DentalMapRoutes.specialtyHub(specialty.slug)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                !city ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              همه شهرها
            </Link>
            {cities.map((c) => (
              <Link
                key={c.id}
                to={DentalMapRoutes.specialtyByLocation(specialty.slug, c.slug)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  city?.slug === c.slug
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* If city is selected, show District Chips */}
          {city && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 ml-1">مناطق و محلات {city.name}:</span>
              <Link
                to={DentalMapRoutes.specialtyByLocation(specialty.slug, city.slug)}
                className={`px-3 py-0.5 rounded-lg text-xs font-medium transition-colors ${
                  !district ? 'bg-teal-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                تمام مناطق
              </Link>
              {districts
                .filter((d) => d.city_id === city.id)
                .map((d) => (
                  <Link
                    key={d.id}
                    to={DentalMapRoutes.specialtyByLocation(specialty.slug, city.slug, d.slug)}
                    className={`px-3 py-0.5 rounded-lg text-xs font-medium transition-colors ${
                      district?.slug === d.slug
                        ? 'bg-teal-600 text-white font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {d.name}
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Doctors List */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <span>
            نمایش <strong className="text-slate-900 font-bold font-mono">{matchedDoctors.length}</strong> جراح و متخصص در این شاخه
          </span>
        </div>

        {matchedDoctors.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <h3 className="font-bold text-slate-800 text-sm">پزشکی با این تخصص در این محدوده یافت نشد</h3>
            <p className="text-xs text-slate-500 mt-1">
              لطفاً فیلتر منطقه را حذف فرمایید یا سایر شهرهای همجوار را بررسی نمایید.
            </p>
            <div className="mt-4">
              <Link
                to={DentalMapRoutes.specialtyHub(specialty.slug)}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl inline-block"
              >
                مشاهده همه پزشکان {specialty.title} در کشور
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/50 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={doc.avatar}
                      alt={doc.last_name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/30"
                    />
                    <div>
                      <Link
                        to={DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug)}
                        className="font-bold text-slate-900 text-sm hover:text-emerald-700 block transition-colors"
                      >
                        {doc.first_name} {doc.last_name}
                      </Link>
                      <span className="text-[11px] text-teal-700 font-bold block">
                        {specialty.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        کد نظام: {doc.medical_council_code}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {doc.bio}
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-2xl mb-4">
                    <div className="flex justify-between">
                      <span>امتیاز مراجعین:</span>
                      <span className="font-bold text-amber-500 font-mono">★ {doc.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>سابقه تخصصی:</span>
                      <span className="font-bold text-slate-800">{doc.experience_years} سال</span>
                    </div>
                    {doc.passport_committed && (
                      <div className="text-emerald-700 font-bold text-[10px] pt-1">
                        ✓ متعهد به صدور شناسنامه اصالت ایمپلنت
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to={DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition-colors block"
                >
                  مشاهده کارنامه و رزرو نوبت
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
