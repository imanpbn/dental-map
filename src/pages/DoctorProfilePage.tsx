import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Phone,
  Award,
  Building,
  ChevronLeft,
  MapPin,
  Clock
} from 'lucide-react';
import { Doctor, Specialty, Clinic, ImplantBrand, ClinicDoctor } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface DoctorProfilePageProps {
  doctors: Doctor[];
  specialties: Specialty[];
  clinics: Clinic[];
  brands: ImplantBrand[];
  clinicDoctors: ClinicDoctor[];
  onRecordLead: (clinicId: number, doctorId?: number) => void;
}

export const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({
  doctors,
  specialties,
  clinics,
  brands,
  clinicDoctors,
  onRecordLead
}) => {
  const { slug } = useParams<{ slug: string }>();
  const [booked, setBooked] = useState(false);

  // Extract medical code or slug prefix
  const medicalCode = slug?.split('-')[0];
  const doctor = doctors.find(
    (d) =>
      d.medical_council_code === medicalCode ||
      d.slug === slug ||
      `${d.medical_council_code}-${d.slug}` === slug
  );

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs">
          <h2 className="font-bold text-slate-800 text-base mb-2">پزشک مورد نظر یافت نشد</h2>
          <Link
            to="/"
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block"
          >
            بازگشت به دایرکتوری پزشکان
          </Link>
        </div>
      </div>
    );
  }

  const specialty = specialties.find((s) => s.id === doctor.specialty_id);

  // Active clinics
  const activeClinics = clinicDoctors
    .filter((cd) => cd.doctor_id === doctor.id && cd.is_active)
    .map((cd) => {
      const clinic = clinics.find((c) => c.id === cd.clinic_id);
      return clinic ? { clinic, shift: cd.shift_schedule } : null;
    })
    .filter(Boolean) as { clinic: Clinic; shift?: Record<string, string> }[];

  const handleBook = (clinicId: number) => {
    onRecordLead(clinicId, doctor.id);
    setBooked(true);
    setTimeout(() => setBooked(false), 3000);
  };

  const canonicalUrl = `https://dentalmap.ir/doctor/${doctor.medical_council_code}-${doctor.slug}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href={canonicalUrl} />

      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 transition-colors">صفحه اصلی</Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            {specialty ? (
              <Link
                to={DentalMapRoutes.specialtyHub(specialty.slug)}
                className="text-slate-500 hover:text-emerald-700 font-medium transition-colors"
                title={`مشاهده سایر متخصصین ${specialty.title}`}
              >
                {specialty.title}
              </Link>
            ) : (
              <span className="text-slate-500">پزشکان</span>
            )}
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold">{doctor.first_name} {doctor.last_name}</span>
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

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <img
                src={doctor.avatar}
                alt={doctor.last_name}
                className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500/30 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {doctor.first_name} {doctor.last_name}
                  </h1>
                  {doctor.verified && (
                    <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تاییدیه نظام پزشکی</span>
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-teal-700 font-bold">
                  {specialty?.title}
                </div>

                <div className="text-xs font-mono text-slate-400 mt-1">
                  کد یکتای نظام پزشکی: {doctor.medical_council_code}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-amber-500 flex items-center gap-1 text-sm font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 text-xs font-normal">({doctor.reviews_count} نظر)</span>
              </span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px] mb-1">سابقه طبابت تخصصی:</span>
              <span className="font-bold text-slate-900 text-sm">{doctor.experience_years} سال جراحی فعال</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px] mb-1">رده سنی پذیرش بیماران:</span>
              <span className="font-bold text-slate-900 text-sm">
                {doctor.patient_age_group === 'adults' && 'فقط بزرگسالان'}
                {doctor.patient_age_group === 'children' && 'کودکان و نوجوانان'}
                {doctor.patient_age_group === 'both' && 'تمامی رده‌های سنی'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[11px] mb-1">تعهد اصالت قطعات:</span>
              <span className="font-bold text-emerald-700 text-sm">
                {doctor.passport_committed ? 'متعهد به صدور پاسپورت ۳۲ دندان' : 'عادی'}
              </span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">بیوگرافی، دوره‌های فلوشیپ و سوابق:</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {doctor.bio}
            </p>
          </div>

          {/* Clinics where doctor operates */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">مراکز درمانی و مطب‌های محل حضور:</h3>
            <div className="space-y-4">
              {activeClinics.map(({ clinic, shift }) => (
                <div
                  key={clinic.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 shadow-2xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{clinic.name}</span>
                      {clinic.is_24_7 && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                          ۲۴/۷ شبانه‌روزی
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{clinic.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleBook(clinic.id)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{booked ? 'نوبت ثبت شد ✓' : 'درخواست نوبت در این مرکز'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
