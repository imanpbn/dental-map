import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Building, Stethoscope, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { DoctorDirectory } from '../components/DoctorDirectory';
import {
  Doctor,
  Clinic,
  Specialty,
  City,
  District,
  Insurance,
  ImplantBrand,
  ImplantType,
  ClinicDoctor,
  ClinicInsurance,
  DoctorImplantType,
  LeadValuationRecord
} from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface DirectoryPageProps {
  doctors: Doctor[];
  clinics: Clinic[];
  specialties: Specialty[];
  cities: City[];
  districts: District[];
  insurances: Insurance[];
  brands: ImplantBrand[];
  implantTypes: ImplantType[];
  clinicDoctors: ClinicDoctor[];
  clinicInsurances: ClinicInsurance[];
  doctorImplantTypes: DoctorImplantType[];
  leadValuations: Record<number, LeadValuationRecord>;
  onRecordLead: (clinicId: number, doctorId?: number) => void;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  doctors,
  clinics,
  specialties,
  cities,
  districts,
  insurances,
  brands,
  implantTypes,
  clinicDoctors,
  clinicInsurances,
  doctorImplantTypes,
  leadValuations,
  onRecordLead
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href="https://dentalmap.ir/directory" />

      {/* Top Breadcrumb & Quick Bar with 10% Horizontal Padding */}
      <div className="w-full px-4 sm:px-6 md:px-[8%] lg:px-[10%] pt-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl py-3 px-4 sm:px-6 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 font-medium">
              صفحه اصلی
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold">
              دایرکتوری جراحان فک و صورت، کلینیک‌ها و مراکز شبانه‌روزی
            </span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به پرتال اصلی</span>
          </Link>
        </div>
      </div>

      {/* Dedicated Page Hero Banner with 10% Left & Right Padding (px-[10%]) */}
      <div className="w-full px-4 sm:px-6 md:px-[8%] lg:px-[10%] my-4">
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-10 sm:py-12 px-6 sm:px-10 rounded-2xl md:rounded-3xl border border-slate-800/80 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مرجع رسمی دایرکتوری درمانی ایمپلنتولوژی و جراحی فک و صورت کشور</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-3">
              دایرکتوری جامع جراحان فک و صورت، کلینیک‌ها و مراکز شبانه‌روزی
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed mb-6 font-normal">
              جستجوی پیشرفته و چندبعدی بر اساس شماره نظام پزشکی تاییدشده، منطقه شهرداری و شهرها، پوشش بیمه‌های طرف قرارداد
              (دانا، البرز، ایران، تامین اجتماعی)، وضعیت شبانه‌روزی ۲۴ ساعته و برندهای ایمپلنت مورد استفاده.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>
                  تعداد جراحان و متخصصان فعال:{' '}
                  <strong className="text-white font-mono font-bold">{doctors.length}</strong> پزشک
                </span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-400" />
                <span>
                  کلینیک‌ها و مراکز تخصصی:{' '}
                  <strong className="text-white font-mono font-bold">{clinics.length}</strong> مرکز
                </span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>پوشش کلیه مناطق تهران، مشهد، اصفهان، شیراز و تبریز</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory Component */}
      <div className="mt-2">
        <DoctorDirectory
          doctors={doctors}
          clinics={clinics}
          specialties={specialties}
          cities={cities}
          districts={districts}
          insurances={insurances}
          brands={brands}
          implantTypes={implantTypes}
          clinicDoctors={clinicDoctors}
          clinicInsurances={clinicInsurances}
          doctorImplantTypes={doctorImplantTypes}
          leadValuations={leadValuations}
          onRecordLead={onRecordLead}
          onSelectDoctor={(doc) =>
            navigate(DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug))
          }
        />
      </div>
    </div>
  );
};
