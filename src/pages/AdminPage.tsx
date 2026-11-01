import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Link2,
  CheckCircle,
  XCircle,
  Building,
  PhoneCall,
  ChevronLeft
} from 'lucide-react';
import {
  Doctor,
  Clinic,
  Insurance,
  ClinicInsurance,
  LeadValuationRecord
} from '../types';

interface AdminPageProps {
  doctors: Doctor[];
  clinics: Clinic[];
  insurances: Insurance[];
  clinicInsurances: ClinicInsurance[];
  leadValuations: Record<number, LeadValuationRecord>;
  onToggleDoctorVerification: (doctorId: number) => void;
  onToggleClinicInsurance: (clinicId: number, insuranceId: number) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  doctors,
  clinics,
  insurances,
  clinicInsurances,
  leadValuations,
  onToggleDoctorVerification,
  onToggleClinicInsurance
}) => {
  const [adminTab, setAdminTab] = useState<'leads' | 'verification' | 'insurances'>('leads');

  const totalValuation = Object.values(leadValuations).reduce(
    (acc, curr) => acc + curr.total_valuation_toman,
    0
  );
  const totalLeads = Object.values(leadValuations).reduce(
    (acc, curr) => acc + curr.lead_count,
    0
  );

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
            <span className="text-emerald-700 font-bold">پنل مدیریت و ارزیابی اقتصادی لید (Admin Panel)</span>
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

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                پنل مدیریت و مانیتورینگ سلامت دنتال مپ
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                احراز هویت و بررسی کدهای نظام پزشکی، اتصال بیمه‌ها و ارزیابی ارزش مالی ارجاع بیماران
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
              دسترسی سطح ادمین فعال است
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setAdminTab('leads')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'leads'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>ارزیابی لیدها (M&A Lead Engine)</span>
          </button>

          <button
            onClick={() => setAdminTab('verification')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'verification'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span>احراز هویت جراحان و کد نظام پزشکی</span>
          </button>

          <button
            onClick={() => setAdminTab('insurances')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              adminTab === 'insurances'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>مدیریت قراردادهای کلینیک و بیمه‌ها</span>
          </button>
        </div>

        {/* Tab 1: Leads & Valuation */}
        {adminTab === 'leads' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 font-bold block mb-1">
                  ارزش کل لیدهای جذب‌شده (Valuation):
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-950">
                  {totalValuation.toLocaleString('fa-IR')}{' '}
                  <span className="text-xs font-sans font-normal">تومان</span>
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-teal-50 border border-teal-200">
                <span className="text-xs text-teal-800 font-bold block mb-1">
                  مجموع تماس و رزرو بیمار (Leads):
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-teal-950">
                  {totalLeads.toLocaleString('fa-IR')}{' '}
                  <span className="text-xs font-sans font-normal">ارجاع کلینیکی</span>
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200">
                <span className="text-xs text-slate-600 font-bold block mb-1">
                  فرمول ارزش‌گذاری اقتصادی:
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono block">
                  New Valuation = Leads × 350,000 Tomans
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  مبنای ارزش‌گذاری استاندارد ارزش دوره عمر بیمار (LTV) در ایمپلنتولوژی
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                جدول گزارش تفکیکی لیدها بر اساس مراکز درمانی و مطب‌ها:
              </h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-right">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">نام مرکز درمانی</th>
                      <th className="p-3.5">نوع مرکز</th>
                      <th className="p-3.5">تعداد کلیک و ارجاع</th>
                      <th className="p-3.5">ارزش ریالی خلق‌شده</th>
                      <th className="p-3.5">آخرین لید ثبت‌شده</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clinics.map((c) => {
                      const record = leadValuations[c.id] || {
                        lead_count: 0,
                        total_valuation_toman: 0,
                        last_lead_at: '—'
                      };
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                          <td className="p-3.5 text-slate-600">
                            {c.center_type === 'clinic' && 'کلینیک تخصصی'}
                            {c.center_type === 'private_office' && 'مطب شخصی'}
                            {c.center_type === 'hospital' && 'بیمارستان'}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-800">
                            {record.lead_count} بیمار
                          </td>
                          <td className="p-3.5 font-mono text-emerald-700 font-bold">
                            {record.total_valuation_toman.toLocaleString('fa-IR')} تومان
                          </td>
                          <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                            {record.last_lead_at}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Doctor Verification */}
        {adminTab === 'verification' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              فهرست جراحان و تایید صلاحیت نظام پزشکی:
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-right">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">نام جراح</th>
                    <th className="p-3.5">کد نظام پزشکی</th>
                    <th className="p-3.5">جنسیت</th>
                    <th className="p-3.5">رده سنی مراجعین</th>
                    <th className="p-3.5">پاسپورت اصالت</th>
                    <th className="p-3.5">وضعیت تایید</th>
                    <th className="p-3.5">عملیات ادمین</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        {d.first_name} {d.last_name}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 font-bold">
                        {d.medical_council_code}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {d.gender === 'female' ? 'خانم' : 'آقا'}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {d.patient_age_group === 'adults' && 'بزرگسالان'}
                        {d.patient_age_group === 'children' && 'کودکان'}
                        {d.patient_age_group === 'both' && 'همه سنین'}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.passport_committed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {d.passport_committed ? 'متعهد به صدور' : 'عادی'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {d.verified ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>تایید رسمی سازمان نظام</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>در انتظار تایید مدارک</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => onToggleDoctorVerification(d.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                            d.verified
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                          }`}
                        >
                          {d.verified ? 'لغو تاییدیه' : 'تایید صلاحیت جراح'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Insurances */}
        {adminTab === 'insurances' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                جدول واسط رابطه‌ای کلینیک‌ها و بیمه‌ها (Clinic_Insurances M:N):
              </h3>
              <p className="text-xs text-slate-500">
                جهت فعال‌سازی یا لغو قرارداد بیمه با هر مرکز درمانی، روی نشانگر بیمه مورد نظر کلیک نمایید.
              </p>
            </div>

            <div className="space-y-4">
              {clinics.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm mb-3">
                    {c.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {insurances.map((ins) => {
                      const isLinked = clinicInsurances.some(
                        (ci) => ci.clinic_id === c.id && ci.insurance_id === ins.id
                      );
                      return (
                        <button
                          key={ins.id}
                          onClick={() => onToggleClinicInsurance(c.id, ins.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            isLinked
                              ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {isLinked ? '✓ ' : '+ '}
                          {ins.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
