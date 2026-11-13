import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  ExternalLink,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Printer,
  Send,
  Trash2
} from 'lucide-react';
import { IssuedPassport } from '../../types';
import { OfficialPassportCertificate } from '../../components/OfficialPassportCertificate';

interface PassportsSectionProps {
  passports: IssuedPassport[];
  onTogglePassportStatus: (id: string) => void;
  onResendPassportSms: (p: IssuedPassport) => void;
  onDeletePassport: (id: string) => void;
}

export const PassportsSection: React.FC<PassportsSectionProps> = ({
  passports,
  onTogglePassportStatus,
  onResendPassportSms,
  onDeletePassport
}) => {
  const [passportSearch, setPassportSearch] = useState('');
  const [selectedPassportCertificate, setSelectedPassportCertificate] = useState<IssuedPassport | null>(null);

  const filtered = passports.filter((p) => {
    if (!passportSearch.trim()) return true;
    const q = passportSearch.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.patient_name.toLowerCase().includes(q) ||
      p.patient_national_id.includes(q) ||
      p.patient_mobile.includes(q) ||
      (p.surgeon_name && p.surgeon_name.toLowerCase().includes(q)) ||
      (p.clinic_name && p.clinic_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <FileCheck2 className="w-5 h-5" />
              </span>
              <h2 className="text-base font-black text-slate-900">
                سامانه مدیریت پاسپورت‌های دیجیتال ۳۲ دندان (FDI Digital Passports)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 mr-9">
              مشاهده، ردیابی، چاپ مجدد شناسنامه رسمی بیمار و ارسال پیامک حاوی لینک استعلام آنلاین
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to="/passport"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>پرتال صدور و استعلام پاسپورت در سایت</span>
            </Link>
          </div>
        </div>

        {/* Counter Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 text-teal-900">
            <span className="text-[11px] font-bold block mb-1">کل پاسپورت‌های صادرشده:</span>
            <span className="text-xl font-black font-mono text-teal-700">{passports.length}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-900">
            <span className="text-[11px] font-bold block mb-1">شناسنامه‌های فعال و معتبر:</span>
            <span className="text-xl font-black font-mono text-emerald-700">
              {passports.filter((p) => p.status === 'active').length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
            <span className="text-[11px] font-bold block mb-1">مجموع ایمپلنت‌های ثبت‌شده:</span>
            <span className="text-xl font-black font-mono text-slate-800">
              {passports.reduce((acc, p) => acc + (p.teeth?.length || 0), 0)} قطعه
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="جستجوی شماره پرونده (DMP)، نام بیمار، کدملی یا موبایل..."
              value={passportSearch}
              onChange={(e) => setPassportSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Passports List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">هیچ شناسنامه‌ای یافت نشد</p>
          <p className="text-xs text-slate-400 mt-1">
            با صدور پاسپورت در بخش /passport، مشخصات در این بخش نمایش داده خواهد شد.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs transition-all hover:border-slate-300 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="p-2.5 rounded-2xl bg-teal-50 text-teal-700">
                    <ShieldCheck className="w-5 h-5" />
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-black text-slate-900">{p.patient_name}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold border border-emerald-200">
                        {p.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px]">
                        کدملی: {p.patient_national_id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      جراح: <strong className="text-slate-700">{p.surgeon_name || 'نامشخص'}</strong> | مرکز: {p.clinic_name || 'نامشخص'}
                    </p>
                  </div>
                </div>

                <div>
                  {p.status === 'active' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      معتبر و فعال
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      <XCircle className="w-3.5 h-3.5" />
                      باطل شده
                    </span>
                  )}
                </div>
              </div>

              {/* Teeth summary */}
              <div className="p-3 bg-slate-50 rounded-2xl text-xs flex flex-wrap items-center gap-2">
                <span className="text-slate-500 font-bold">دندان‌های کاشته‌شده ({p.teeth?.length || 0}):</span>
                {p.teeth?.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-[11px] font-mono"
                  >
                    #{t.tooth_number} ({t.brand_name?.split(' ')[0] || 'Implant'} | REF: {t.fixture_ref})
                  </span>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  تاریخ صدور: {p.issue_date_shamsi} | شماره همراه: {p.patient_mobile}
                </span>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedPassportCertificate(p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>مشاهده و چاپ شناسنامه رسمی (PDF)</span>
                  </button>

                  <button
                    onClick={() => onResendPassportSms(p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-slate-500" />
                    <span>ارسال مجدد پیامک</span>
                  </button>

                  <button
                    onClick={() => onTogglePassportStatus(p.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    {p.status === 'active' ? 'لغو اعتبار' : 'فعال‌سازی مجدد'}
                  </button>

                  <button
                    onClick={() => onDeletePassport(p.id)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-700 transition-all cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Official Passport Certificate Preview & Print Modal */}
      {selectedPassportCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative max-w-4xl w-full my-8 bg-white rounded-3xl p-4 sm:p-6 shadow-2xl">
            <OfficialPassportCertificate
              passport={selectedPassportCertificate}
              onClose={() => setSelectedPassportCertificate(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
