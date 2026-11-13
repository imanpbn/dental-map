import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Smartphone,
  PhoneCall,
  ExternalLink,
  Eye,
  Trash2,
  Search
} from 'lucide-react';
import { DoctorApplication } from '../../types';
import { initialCities, initialSpecialties } from '../../initialData';

interface DoctorApplicationsSectionProps {
  applications: DoctorApplication[];
  onApproveApplication: (app: DoctorApplication) => void;
  onRejectApplication: (app: DoctorApplication) => void;
  onDeleteApplication: (id: number) => void;
}

export const DoctorApplicationsSection: React.FC<DoctorApplicationsSectionProps> = ({
  applications,
  onApproveApplication,
  onRejectApplication,
  onDeleteApplication
}) => {
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplications = applications.filter((app) => {
    if (appFilter !== 'all' && app.status !== appFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.full_name.toLowerCase().includes(q) ||
      app.medical_council_code.toLowerCase().includes(q) ||
      app.mobile.toLowerCase().includes(q) ||
      app.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <UserCheck className="w-5 h-5" />
              </span>
              <h2 className="text-base font-black text-slate-900">
                کارتابل درخواست‌های ثبت‌نام پزشکان و کلینیک‌ها
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 mr-9">
              بررسی اطلاعات هویتی، استعلام شماره نظام پزشکی و تایید انتشار در دایرکتوری عمومی دنتال‌مپ
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="https://membersearch.irimc.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>سامانه جستجوی نظام پزشکی (IRIMC)</span>
            </a>
          </div>
        </div>

        {/* Counter Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div
            onClick={() => setAppFilter('pending')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              appFilter === 'pending'
                ? 'bg-amber-500/10 border-amber-400 text-amber-900 ring-2 ring-amber-400/20'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold block mb-1">در انتظار بررسی</span>
            <span className="text-xl font-black font-mono text-amber-600">
              {applications.filter((a) => a.status === 'pending').length}
            </span>
          </div>

          <div
            onClick={() => setAppFilter('approved')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              appFilter === 'approved'
                ? 'bg-emerald-500/10 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400/20'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold block mb-1">تایید شده (فعال)</span>
            <span className="text-xl font-black font-mono text-emerald-600">
              {applications.filter((a) => a.status === 'approved').length}
            </span>
          </div>

          <div
            onClick={() => setAppFilter('rejected')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              appFilter === 'rejected'
                ? 'bg-rose-500/10 border-rose-400 text-rose-900 ring-2 ring-rose-400/20'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold block mb-1">رد شده</span>
            <span className="text-xl font-black font-mono text-rose-600">
              {applications.filter((a) => a.status === 'rejected').length}
            </span>
          </div>

          <div
            onClick={() => setAppFilter('all')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              appFilter === 'all'
                ? 'bg-teal-500/10 border-teal-400 text-teal-900 ring-2 ring-teal-400/20'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-[11px] font-bold block mb-1">کل درخواست‌ها</span>
            <span className="text-xl font-black font-mono text-slate-800">
              {applications.length}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAppFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  appFilter === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'all' && 'همه'}
                {tab === 'pending' && 'در انتظار'}
                {tab === 'approved' && 'تایید شده'}
                {tab === 'rejected' && 'رد شده'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="جستجوی نام، کد نظام یا موبایل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">هیچ درخواستی در این بخش یافت نشد</p>
          <p className="text-xs text-slate-400 mt-1">
            با ارسال فرم از سوی دندانپزشکان، درخواست‌ها در این کارتابل نمایش داده می‌شوند.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const cityName = initialCities.find((c) => c.id === app.city_id)?.name || 'نامشخص';
            const specialtyName = initialSpecialties.find((s) => s.id === app.specialty_id)?.title || 'ایمپلنتولوژی دندان';

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`p-2.5 rounded-2xl ${
                        app.center_type === 'clinic'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {app.center_type === 'clinic' ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <Users className="w-5 h-5" />
                      )}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-black text-slate-900">{app.full_name}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                          کد نظام: {app.medical_council_code}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold">
                          {specialtyName}
                        </span>
                        {app.is_24_7 && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold">
                            شبانه روزی ۲۴ ساعته
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        شهر: <strong className="text-slate-700">{cityName}</strong> | نشانی: {app.address}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {app.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        در انتظار بررسی
                      </span>
                    )}
                    {app.status === 'approved' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        تایید و منتشر شده
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                        <XCircle className="w-3.5 h-3.5" />
                        رد شده
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Row: Contact, Brands, Insurances */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block mb-1">راه‌های ارتباطی:</span>
                    <div className="space-y-1">
                      <a
                        href={`tel:${app.mobile}`}
                        className="flex items-center gap-1.5 font-mono text-slate-800 hover:text-emerald-600 font-bold"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        <span>موبایل: {app.mobile}</span>
                      </a>
                      {app.phone && (
                        <a
                          href={`tel:${app.phone}`}
                          className="flex items-center gap-1.5 font-mono text-slate-700 hover:text-emerald-600"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                          <span>مطب: {app.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block mb-1">برندهای ایمپلنت مورد استفاده:</span>
                    <div className="flex flex-wrap gap-1">
                      {app.brands && app.brands.length > 0 ? (
                        app.brands.map((b) => (
                          <span key={b} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px] font-mono">
                            {b}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px]">برندی ثبت نشده</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-bold block mb-1">بیمه‌های طرف قرارداد:</span>
                    <div className="flex flex-wrap gap-1">
                      {app.insurances && app.insurances.length > 0 ? (
                        app.insurances.map((ins) => (
                          <span key={ins} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[10px]">
                            {ins}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px]">فاقد بیمه تکمیلی</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio preview if any */}
                {app.bio && (
                  <div className="p-3 bg-teal-50/50 rounded-xl text-xs text-slate-700 border border-teal-100">
                    <span className="font-bold text-teal-900 block mb-0.5">بیوگرافی و سوابق:</span>
                    <p className="line-clamp-2">{app.bio}</p>
                  </div>
                )}

                {/* Rejection Reason if any */}
                {app.rejection_reason && (
                  <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-800 border border-rose-200">
                    <span className="font-bold block mb-0.5">علت رد درخواست:</span>
                    <p>{app.rejection_reason}</p>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    تاریخ ثبت: {new Date(app.created_at).toLocaleDateString('fa-IR')}
                    {app.reviewed_at && ` | بررسی: ${new Date(app.reviewed_at).toLocaleDateString('fa-IR')}`}
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`https://membersearch.irimc.org`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>استعلام کد نظام</span>
                    </a>

                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApproveApplication(app)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تایید و انتشار در دایرکتوری</span>
                        </button>

                        <button
                          onClick={() => onRejectApplication(app)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-all border border-rose-200 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>رد درخواست</span>
                        </button>
                      </>
                    )}

                    {app.status === 'approved' && (
                      <Link
                        to={`/doctor/dr-${app.medical_council_code}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-all border border-emerald-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده پروفایل در سایت</span>
                      </Link>
                    )}

                    <button
                      onClick={() => onDeleteApplication(app.id)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-700 transition-all cursor-pointer"
                      title="حذف از کارتابل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
