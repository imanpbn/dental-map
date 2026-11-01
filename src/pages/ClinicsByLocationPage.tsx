import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building,
  ChevronLeft,
  Clock,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Clinic, City, District, Insurance, ClinicInsurance } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface ClinicsByLocationPageProps {
  clinics: Clinic[];
  cities: City[];
  districts: District[];
  insurances: Insurance[];
  clinicInsurances: ClinicInsurance[];
  is24HourOnly?: boolean;
  onRecordLead: (clinicId: number) => void;
}

export const ClinicsByLocationPage: React.FC<ClinicsByLocationPageProps> = ({
  clinics,
  cities,
  districts,
  insurances,
  clinicInsurances,
  is24HourOnly = false,
  onRecordLead
}) => {
  const { citySlug, districtSlug, insuranceSlug } = useParams<{
    citySlug?: string;
    districtSlug?: string;
    insuranceSlug?: string;
  }>();

  const isAllCities = !citySlug;
  const city = citySlug ? cities.find((c) => c.slug === citySlug) || cities[0] : undefined;
  const district = districtSlug ? districts.find((d) => d.slug === districtSlug) : undefined;
  const insurance = insuranceSlug ? insurances.find((i) => i.slug === insuranceSlug) : undefined;

  let title = city ? `کلینیک‌ها و مراکز دندانپزشکی در ${city.name}` : 'بانک مراکز، بیمارستان‌ها و کلینیک‌های دندانپزشکی سراسر کشور';
  if (district && city) title += ` (${district.name})`;
  if (is24HourOnly && city) title = `کلینیک‌های شبانه‌روزی ۲۴ ساعته دندانپزشکی در ${city.name}`;
  if (insurance && city) title = `مراکز دندانپزشکی طرف قرارداد با ${insurance.name} در ${city.name}`;

  // Filter
  const matchedClinics = clinics.filter((c) => {
    if (city && c.city_id !== city.id) return false;
    if (district && c.district_id !== district.id) return false;
    if (is24HourOnly && !c.is_24_7) return false;
    if (insurance) {
      const hasIns = clinicInsurances.some(
        (ci) => ci.clinic_id === c.id && ci.insurance_id === insurance.id
      );
      if (!hasIns) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
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
                to={DentalMapRoutes.clinicsHub()}
                className="text-slate-600 hover:text-emerald-700 font-medium transition-colors"
              >
                مراکز درمانی
              </Link>
            ) : (
              <span className="text-emerald-700 font-bold">مراکز درمانی و کلینیک‌ها</span>
            )}

            {city && (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {district ? (
                  <Link
                    to={DentalMapRoutes.clinicsByLocation(city.slug)}
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

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
            <Building className="w-3.5 h-3.5" />
            <span>پرتال سئو جامع مراکز درمانی</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">{title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            استعلام تعرفه بیمه‌ها، ساعات کاری، بخش‌های جراحی فک و صورت و اتاق‌های عمل بیهوشی دندانپزشکی.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchedClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/50 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {clinic.center_type === 'clinic' && 'کلینیک تخصصی'}
                    {clinic.center_type === 'private_office' && 'مطب شخصی'}
                    {clinic.center_type === 'hospital' && 'بیمارستان و مرکز جراحی'}
                  </span>
                  {clinic.is_24_7 && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>شبانه‌روزی ۲۴ ساعته</span>
                    </span>
                  )}
                </div>

                <Link
                  to={DentalMapRoutes.clinicProfile(clinic.id, clinic.slug)}
                  className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors block mb-2"
                >
                  {clinic.name}
                </Link>

                <p className="text-xs text-slate-600 mb-4 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{clinic.address}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700 dir-ltr">{clinic.phone}</span>
                <Link
                  to={DentalMapRoutes.clinicProfile(clinic.id, clinic.slug)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  مشاهده مشخصات مرکز
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
