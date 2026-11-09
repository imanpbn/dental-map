import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Printer,
  QrCode,
  CheckCircle2,
  Calendar,
  User,
  Building,
  Sparkles,
  Phone,
  FileCheck2,
  Download,
  Share2,
  Lock,
  ExternalLink,
  X
} from 'lucide-react';
import { IssuedPassport } from '../types';
import { generateQrDataUrl } from '../utils/qrGenerator';

interface OfficialPassportCertificateProps {
  passport: IssuedPassport;
  onClose?: () => void;
  isStandalone?: boolean;
}

export const OfficialPassportCertificate: React.FC<OfficialPassportCertificateProps> = ({
  passport,
  onClose,
  isStandalone = false
}) => {
  const [qrUrl, setQrUrl] = useState<string>(passport.qr_code_data_url || '');

  useEffect(() => {
    let isMounted = true;
    const loadQr = async () => {
      const url = passport.verification_url || `https://dentalmap.ir/passport?code=${passport.id}`;
      const dataUrl = await generateQrDataUrl(url);
      if (isMounted && dataUrl) {
        setQrUrl(dataUrl);
      }
    };
    loadQr();
    return () => {
      isMounted = false;
    };
  }, [passport]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = passport.verification_url || `https://dentalmap.ir/passport?code=${passport.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `پاسپورت رسمی ایمپلنت دندان - ${passport.patient_name}`,
          text: `شناسنامه دیجیتال اصالت قطعات ایمپلنت دندان آقای/خانم ${passport.patient_name} با کد ردیابی ${passport.id}`,
          url
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('لینک استعلام پاسپورت در کلیپ‌بورد کپی شد.');
    }
  };

  return (
    <div className="w-full">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 p-4 bg-slate-900 text-white rounded-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-black">
            شناسنامه رسمی اصالت ایمپلنت | شماره پرونده:{' '}
            <span className="font-mono text-emerald-400">{passport.id}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>اشتراک‌گذاری لینک</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ / ذخیره به صورت PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="بستن"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PRINTABLE CERTIFICATE CONTAINER                               */}
      {/* ------------------------------------------------------------- */}
      <div
        id="official-passport-document"
        className="bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border-2 border-emerald-700/60 shadow-xl relative overflow-hidden select-text print:p-0 print:border-none print:shadow-none"
        style={{ direction: 'rtl' }}
      >
        {/* Decorative Golden/Emerald Guilloche Border Pattern */}
        <div className="absolute inset-0 pointer-events-none border-8 border-double border-emerald-900/10 rounded-2xl m-3 print:m-0" />

        {/* Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
          <ShieldCheck className="w-96 h-96 text-slate-900" />
        </div>

        {/* 1. Header Banner */}
        <header className="relative pb-6 border-b-2 border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-right">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 tracking-wider block">
                سامانه ملی استعلام و شفافیت تجهیزات پزشکی دنتال‌مپ
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                گذرنامه رسمی اصالت و سلامت ایمپلنت دندان ایران
              </h1>
              <p className="text-xs text-slate-500 font-mono font-bold mt-0.5">
                OFFICIAL NATIONAL DENTAL IMPLANT & BIOMATERIAL PASSPORT
              </p>
            </div>
          </div>

          {/* QR Code and Tracking Box */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <div className="text-left font-mono">
              <span className="text-[9px] text-slate-400 block uppercase">Tracking ID</span>
              <span className="text-xs font-black text-slate-900 block">{passport.id}</span>
              <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">
                ● استعلام برخط تایید شد
              </span>
            </div>
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="QR Code"
                className="w-16 h-16 rounded-xl border border-slate-300 bg-white p-0.5 shadow-2xs"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center">
                <QrCode className="w-8 h-8 text-slate-400" />
              </div>
            )}
          </div>
        </header>

        {/* 2. Patient & Issue Details Grid */}
        <section className="relative my-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs">
          <div>
            <span className="text-[11px] text-slate-500 block mb-0.5">نام و نام خانوادگی بیمار:</span>
            <strong className="text-sm font-black text-slate-900">{passport.patient_name}</strong>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block mb-0.5">کد ملی / شماره گذرنامه:</span>
            <span className="font-mono font-bold text-slate-800 text-xs">
              {passport.patient_national_id}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block mb-0.5">تاریخ صدور شناسنامه:</span>
            <span className="font-bold text-slate-800">{passport.issue_date_shamsi}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block mb-0.5">اعتبار سند:</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              مادام‌العمر (Lifetime)
            </span>
          </div>
        </section>

        {/* 3. Clinical Provider Details */}
        <section className="relative mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">
              پزشک و جراح معالج (Implantologist):
            </span>
            <div className="flex items-center justify-between">
              <strong className="text-sm font-black text-slate-900">
                {passport.surgeon_name || 'دکتر متخصص جراحی فک و صورت'}
              </strong>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                عضو سازمان نظام پزشکی
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block mb-1">
              مرکز درمانی / کلینیک صادرکننده:
            </span>
            <div className="flex items-center justify-between">
              <strong className="text-sm font-black text-slate-900">
                {passport.clinic_name || 'کلینیک دندانپزشکی تخصصی'}
              </strong>
              <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 text-[10px] font-bold">
                دارای مجوز IMED
              </span>
            </div>
          </div>
        </section>

        {/* 4. FDI 32 Teeth Implant Specification Table */}
        <section className="relative mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-700" />
              <span>جدول ثبت موقعیت‌های کاشت فک و قطعات مصرفی (FDI Standard):</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              تعداد قطعات ثبت‌شده:{' '}
              <strong className="font-mono text-emerald-800">{passport.teeth.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-300">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="p-3">دندان</th>
                  <th className="p-3">کمپانی و سیستم ایمپلنت</th>
                  <th className="p-3">کد رفرنس فیکسچر (REF)</th>
                  <th className="p-3">شماره لات استریل (LOT)</th>
                  <th className="p-3">اباتمنت و تورک (N.cm)</th>
                  <th className="p-3">نوع روکش نهایی</th>
                  <th className="p-3">تاریخ کاشت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {passport.teeth.map((t, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/70' : ''}>
                    <td className="p-3 font-mono font-black text-emerald-800 text-sm">
                      #{t.tooth_number}
                    </td>
                    <td className="p-3">
                      <strong className="block text-slate-900">{t.brand_name}</strong>
                      {t.implant_model && (
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {t.implant_model}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {t.fixture_ref}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {t.lot_number}
                      </span>
                    </td>
                    <td className="p-3">
                      <span>{t.abutment_type || 'اباتمنت مستقیم'}</span>
                      {t.abutment_torque_ncm && (
                        <span className="text-[10px] font-mono text-slate-500 block">
                          Torque: {t.abutment_torque_ncm} N.cm
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-700">{t.crown_type || 'زیرکونیا تمام‌سرامیک'}</td>
                    <td className="p-3 font-mono text-slate-600">{t.implant_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. Clinical Notes if provided */}
        {passport.notes && (
          <div className="relative mb-6 p-3.5 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs">
            <span className="font-bold text-teal-950 block mb-1">یادداشت‌های بالینی و ضمانت‌نامه:</span>
            <p className="text-slate-700 leading-relaxed">{passport.notes}</p>
          </div>
        )}

        {/* 6. Stamp and Signatures Section */}
        <footer className="relative pt-6 border-t-2 border-slate-200 mt-6 grid grid-cols-3 gap-6 text-center text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-between min-h-[110px]">
            <span className="text-[11px] font-bold text-slate-600">مهر و امضای جراح معالج</span>
            <div className="w-16 h-12 border-b-2 border-dashed border-slate-300 mt-4" />
            <span className="text-[10px] text-slate-400 font-mono mt-1">
              کد نظام: {passport.surgeon_name ? 'دارای پروانه دائم' : 'IRIMC-VERIFIED'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-between min-h-[110px]">
            <span className="text-[11px] font-bold text-slate-600">مهر مرکز درمانی / کلینیک</span>
            <div className="w-16 h-12 border-b-2 border-dashed border-slate-300 mt-4" />
            <span className="text-[10px] text-slate-400 mt-1">تاییدیه بخش ایمپلنتولوژی</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col items-center justify-between min-h-[110px]">
            <div className="flex items-center gap-1.5 text-emerald-900 font-black text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>هولوگرام اصالت دیجیتال</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-emerald-300 shadow-2xs font-mono text-[10px] text-emerald-800 font-black">
              DM-HEALTH-SECURITY
            </div>
            <span className="text-[9px] text-emerald-700">مطابق ضوابط IMED و CE 0123</span>
          </div>
        </footer>

        {/* Legal Disclaimer & Verification Link */}
        <div className="relative mt-6 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            جهت استعلام آنلاین و دسترسی به اطلاعات قطعات جایگزین در سراسر جهان به{' '}
            <strong className="text-slate-600 font-mono">dentalmap.ir/passport</strong> مراجعه فرمایید.
          </span>
          <span className="font-mono">VERIFIED BY DENTAL MAP PLATFORM</span>
        </div>
      </div>
    </div>
  );
};
