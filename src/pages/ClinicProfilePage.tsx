import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building,
  ChevronLeft,
  Clock,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Clinic, Doctor, Specialty, Insurance, ClinicInsurance, ClinicDoctor } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface ClinicProfilePageProps {
  clinics: Clinic[];
  doctors: Doctor[];
  specialties: Specialty[];
  insurances: Insurance[];
  clinicInsurances: ClinicInsurance[];
  clinicDoctors: ClinicDoctor[];
  onRecordLead: (clinicId: number) => void;
}

export const ClinicProfilePage: React.FC<ClinicProfilePageProps> = ({
  clinics,
  doctors,
  specialties,
  insurances,
  clinicInsurances,
  clinicDoctors,
  onRecordLead
}) => {
  const { slug } = useParams<{ slug: string }>();
  const [booked, setBooked] = useState(false);

  // Extract ID from slug (e.g. "1-atiyeh-gharb-dental-clinic")
  const clinicId = Number(slug?.split('-')[0]);
  const clinic = clinics.find((c) => c.id === clinicId || c.slug === slug);

  if (!clinic) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs">
          <h2 className="font-bold text-slate-800 text-base mb-2">مرکز درمانی یافت نشد</h2>
          <Link
            to="/"
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block"
          >
            بازگشت به دایرکتوری
          </Link>
        </div>
      </div>
    );
  }

  // Insurances for this clinic
  const clinicInsIds = clinicInsurances
    .filter((ci) => ci.clinic_id === clinic.id)
    .map((ci) => ci.insurance_id);
  const matchedInsurances = insurances.filter((ins) => clinicInsIds.includes(ins.id));

  // Doctors in this clinic
  const docs = clinicDoctors
    .filter((cd) => cd.clinic_id === clinic.id && cd.is_active)
    .map((cd) => doctors.find((d) => d.id === cd.doctor_id))
    .filter(Boolean) as Doctor[];

  const handleBook = () => {
    onRecordLead(clinic.id);
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  const canonicalUrl = `https://dentalmap.ir/clinic/${clinic.id}-${clinic.slug}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href={canonicalUrl} />

      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 transition-colors">صفحه اصلی</Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <Link to={DentalMapRoutes.clinicsHub()} className="text-slate-500 hover:text-emerald-700 transition-colors">مراکز درمانی</Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold truncate">{clinic.name}</span>
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

      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {clinic.center_type === 'clinic' && 'کلینیک تخصصی'}
                  {clinic.center_type === 'private_office' && 'مطب شخصی'}
                  {clinic.center_type === 'hospital' && 'بیمارستان'}
                </span>
                {clinic.is_24_7 && (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>شبانه‌روزی ۲۴ ساعته</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug">
                {clinic.name}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{clinic.address}</span>
              </div>
            </div>

            <div>
              <button
                onClick={handleBook}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>{booked ? 'اطلاعات تماس ثبت شد ✓' : 'دریافت نوبت و تماس مستقیم'}</span>
              </button>
            </div>
          </div>

          {/* Insurances */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">بیمه‌های طرف قرارداد این مرکز:</h3>
            <div className="flex flex-wrap gap-2">
              {matchedInsurances.length > 0 ? (
                matchedInsurances.map((ins) => (
                  <span
                    key={ins.id}
                    className="px-3 py-1.5 bg-teal-50 text-teal-800 text-xs font-bold rounded-xl border border-teal-200"
                  >
                    ✓ {ins.name} ({ins.insurance_type === 'supplementary' ? 'تکمیلی' : 'پایه'})
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">صرفاً تعرفه آزاد</span>
              )}
            </div>
          </div>

          {/* Doctors in Clinic */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">پزشکان و جراحان مستقر:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map((doc) => {
                const spec = specialties.find((s) => s.id === doc.specialty_id);
                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.avatar}
                        alt={doc.last_name}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                      <div>
                        <Link
                          to={DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug)}
                          className="font-bold text-slate-900 text-xs sm:text-sm hover:text-emerald-700 block"
                        >
                          {doc.first_name} {doc.last_name}
                        </Link>
                        <span className="text-[11px] text-teal-700 font-medium block">
                          {spec?.title}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                    >
                      پروفایل
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
