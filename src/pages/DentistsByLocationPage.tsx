import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  MapPin,
  ChevronLeft,
  Star,
  CheckCircle2,
  Calendar,
  Building,
  Filter,
  ShieldCheck,
  User
} from 'lucide-react';
import { Doctor, City, District, Specialty, Clinic, ClinicDoctor } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface DentistsByLocationPageProps {
  doctors: Doctor[];
  cities: City[];
  districts: District[];
  specialties: Specialty[];
  clinics: Clinic[];
  clinicDoctors: ClinicDoctor[];
  onRecordLead: (clinicId: number, doctorId?: number) => void;
}

export const DentistsByLocationPage: React.FC<DentistsByLocationPageProps> = ({
  doctors,
  cities,
  districts,
  specialties,
  clinics,
  clinicDoctors,
  onRecordLead
}) => {
  const { citySlug, districtSlug } = useParams<{ citySlug: string; districtSlug?: string }>();
  const [searchParams] = useSearchParams();

  const isAllCities = !citySlug;
  const city = citySlug ? cities.find((c) => c.slug === citySlug) || cities[0] : undefined;
  const district = districtSlug ? districts.find((d) => d.slug === districtSlug) : undefined;

  // Canonical base path
  const canonicalPath = isAllCities
    ? 'https://dentalmap.ir/dentists'
    : districtSlug
    ? `https://dentalmap.ir/dentists/${city?.slug}/${district?.slug || districtSlug}`
    : `https://dentalmap.ir/dentists/${city?.slug}`;

  // Faceted query filters
  const genderFilter = searchParams.get('gender');
  const ageFilter = searchParams.get('age');
  const passportFilter = searchParams.get('passport');

  // Filter clinics in this city / district
  const matchedClinics = clinics.filter((c) => {
    if (city && c.city_id !== city.id) return false;
    if (district && c.district_id !== district.id) return false;
    return true;
  });

  const clinicIds = matchedClinics.map((c) => c.id);

  // Doctors practicing in these clinics
  const matchedDoctorIds = clinicDoctors
    .filter((cd) => clinicIds.includes(cd.clinic_id) && cd.is_active)
    .map((cd) => cd.doctor_id);

  const matchedDoctors = doctors.filter((doc) => {
    // If city has doctors linked
    if (city && clinicIds.length > 0 && !matchedDoctorIds.includes(doc.id)) {
      return false;
    }
    if (genderFilter && doc.gender !== genderFilter) return false;
    if (ageFilter && doc.patient_age_group !== ageFilter && doc.patient_age_group !== 'both') return false;
    if (passportFilter === 'verified' && !doc.passport_committed) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Canonical link */}
      <link rel="canonical" href={canonicalPath} />

      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 transition-colors">
              صفحه اصلی
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {city ? (
              <Link
                to={DentalMapRoutes.dentistsHub()}
                className="text-slate-600 hover:text-emerald-700 font-medium transition-colors"
              >
                دندانپزشکان
              </Link>
            ) : (
              <span className="text-emerald-700 font-bold">دندانپزشکان و جراحان سراسر کشور</span>
            )}

            {city && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {district ? (
                  <Link
                    to={DentalMapRoutes.dentistsByLocation(city.slug)}
                    className="text-slate-700 hover:text-emerald-700 font-bold transition-colors"
                  >
                    {city.name}
                  </Link>
                ) : (
                  <span className="text-emerald-700 font-bold">{city.name}</span>
                )}
              </>
            )}

            {district && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-emerald-700 font-bold">{district.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
            <MapPin className="w-3.5 h-3.5" />
            <span>مسیر دسته‌بندی سئو محلی (Local SEO Silo)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {city
              ? `بهترین دندانپزشکان و جراحان ایمپلنت در ${city.name} ${district ? `(محله ${district.name})` : ''}`
              : 'بانک جامع دندانپزشکان و متخصصین ایمپلنتولوژی ایران'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            {city
              ? `فهرست متخصصین دارای استعلام کد نظام پزشکی و تاییدیه اصالت قطعات ایمپلنت دنتال مپ در منطقه ${district?.name || city.name}.`
              : 'جستجو و فیلتر متخصصین جراحی فک و صورت، پروتز، پریودنتیکس و اطفال با گواهی شناسنامه اصالت قطعات.'}
          </p>

          {/* Quick Local District / City Chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            <Link
              to={DentalMapRoutes.dentistsHub()}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                isAllCities ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              همه شهرها
            </Link>
            {cities.map((c) => (
              <Link
                key={c.id}
                to={DentalMapRoutes.dentistsByLocation(c.slug)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  city?.slug === c.slug && !districtSlug
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {city && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 ml-1">محلات {city.name}:</span>
              <Link
                to={DentalMapRoutes.dentistsByLocation(city.slug)}
                className={`px-3 py-0.5 rounded-lg text-xs font-medium transition-colors ${
                  !districtSlug ? 'bg-teal-600 text-white font-bold' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                همه محلات
              </Link>
              {districts
                .filter((d) => d.city_id === city.id)
                .map((d) => (
                  <Link
                    key={d.id}
                    to={DentalMapRoutes.dentistsByLocation(city.slug, d.slug)}
                    className={`px-3 py-0.5 rounded-lg text-xs font-medium transition-colors ${
                      districtSlug === d.slug
                        ? 'bg-teal-600 text-white font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {d.name} ({d.region_zone})
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <span>
            نمایش <strong className="text-slate-900 font-bold">{matchedDoctors.length}</strong> جراح و متخصص در این موقعیت
          </span>
        </div>

        {matchedDoctors.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <h3 className="font-bold text-slate-800 text-sm">پزشکی با این شرایط در این محله یافت نشد</h3>
            <p className="text-xs text-slate-500 mt-1">
              پیشنهاد می‌شود محله‌های مجاور یا کل شهر {city?.name || 'مورد نظر'} را جستجو فرمایید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedDoctors.map((doc) => {
              const spec = specialties.find((s) => s.id === doc.specialty_id);
              return (
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
                          className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors block"
                        >
                          {doc.first_name} {doc.last_name}
                        </Link>
                        <span className="text-[11px] text-teal-700 font-bold block">
                          {spec?.title}
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
                    مشاهده پروفایل و دریافت نوبت
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
