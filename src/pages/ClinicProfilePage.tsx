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
  ArrowRight,
  Sparkles,
  Share2,
  ExternalLink,
  Image as ImageIcon,
  Check,
  PhoneCall,
  Navigation,
  X,
  Stethoscope,
  BadgePercent,
  Clock3
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

  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'gallery' | 'insurances'>('overview');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);

  // Clinic resolution by ID prefix, exact slug, or district slug
  const cleanSlug = (slug || '').toLowerCase().trim();
  const idPrefix = Number(cleanSlug.split('-')[0]);

  const clinic = clinics.find((c) => {
    const cSlug = (c.slug || '').toLowerCase();
    return (
      c.id === idPrefix ||
      cSlug === cleanSlug ||
      `${c.id}-${cSlug}` === cleanSlug ||
      cleanSlug.includes(cSlug) ||
      cSlug.includes(cleanSlug)
    );
  }) || clinics[0];

  if (!clinic) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs">
          <h2 className="font-bold text-slate-800 text-base mb-2">مرکز درمانی یافت نشد</h2>
          <p className="text-xs text-slate-500 mb-6">
            آدرس مورد نظر اصلاح شده است یا در فهرست مراکز فعال موجود نمی‌باشد.
          </p>
          <Link
            to="/clinics"
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block"
          >
            مشاهده دایرکتوری مراکز
          </Link>
        </div>
      </div>
    );
  }

  // Contracted Insurances for this clinic
  const clinicInsIds = clinicInsurances
    .filter((ci) => ci.clinic_id === clinic.id)
    .map((ci) => ci.insurance_id);
  const matchedInsurances = insurances.filter((ins) => clinicInsIds.includes(ins.id));

  // Doctors in this clinic
  const clinicDocRelations = clinicDoctors.filter((cd) => cd.clinic_id === clinic.id && cd.is_active);
  const docs = clinicDocRelations
    .map((cd) => {
      const doc = doctors.find((d) => d.id === cd.doctor_id);
      return doc ? { doc, shift: cd.shift_schedule } : null;
    })
    .filter(Boolean) as { doc: Doctor; shift?: Record<string, string> }[];

  // Fallback if no junction relation
  const displayDocs: { doc: Doctor; shift?: Record<string, string> }[] =
    docs.length > 0 ? docs : doctors.slice(0, 3).map((d) => ({ doc: d }));

  // Gallery Photos
  const galleryPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
      title: 'اتاق جراحی ایمپلنت استریل مجهز به یونیت‌های اروپایی',
      category: 'اتاق عمل'
    },
    {
      url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
      title: 'بخش رادیولوژی دیجیتال فک و صورت (CBCT سه‌بعدی)',
      category: 'تصویربرداری'
    },
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
      title: 'لابراتوار تخصصی دیجیتال CAD/CAM و پرینت ۳ بعدی سرامیک',
      category: 'لابراتوار اختصاصی'
    },
    {
      url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1200',
      title: 'سالن پذیرش مراجعین و استراحت بیماران VIP',
      category: 'پذیرش'
    }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    onRecordLead(clinic.id);
    const tracking = `CLN-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccessCode(tracking);
  };

  const canonicalUrl = `https://dentalmap.ir/clinic/${clinic.id}-${clinic.slug}`;

  // Schema.org MedicalClinic
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: clinic.name,
    telephone: clinic.phone || '021-88001144',
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address,
      addressLocality: 'تهران',
      addressCountry: 'IR'
    },
    openingHours: clinic.is_24_7 ? 'Mo-Su 00:00-24:00' : 'Sa-We 09:00-21:00'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700 transition-colors">
              صفحه اصلی
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <Link to={DentalMapRoutes.clinicsHub()} className="text-slate-500 hover:text-emerald-700 transition-colors">
              مراکز درمانی و کلینیک‌ها
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold truncate">{clinic.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('لینک مرکز درمانی کپی شد.');
              }}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title="اشتراک‌گذاری"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/clinics"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        {/* ============================================================ */}
        {/* 1. CLINIC MAIN HEADER CARD */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-800">
                  {clinic.center_type === 'clinic' && '🏥 کلینیک تخصصی و فوق‌تخصصی'}
                  {clinic.center_type === 'private_office' && '🏢 مطب شخصی جراح'}
                  {clinic.center_type === 'hospital' && '🏨 بخش دندانپزشکی بیمارستان'}
                </span>

                {clinic.is_24_7 ? (
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                    <Clock3 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>مرکز شبانه‌روزی ۲۴ ساعته (حتی روزهای تعطیل)</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-600">
                    فعالیت روزانه: ۰۹:۰۰ الی ۲۱:۰۰
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {clinic.name}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{clinic.address}</span>
              </div>
            </div>

            {/* Quick Contact & Booking CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
              <button
                onClick={() => {
                  setBookingSuccessCode(null);
                  setIsBookModalOpen(true);
                }}
                className="w-full px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4" />
                <span>درخواست رزرو نوبت ویزیت</span>
              </button>

              <a
                href={`tel:${clinic.phone || '02188001144'}`}
                onClick={() => onRecordLead(clinic.id)}
                className="w-full px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>تماس مستقیم: {clinic.phone || '۰۲۱-۸۸۰۰۱۱۴۴'}</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[11px] block mb-1">کادر جراحی مستقر:</span>
              <span className="font-black text-slate-900 text-sm">
                {displayDocs.length} جراح فک و متخصص پروتز
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[11px] block mb-1">بیمه‌های طرف قرارداد:</span>
              <span className="font-black text-teal-700 text-sm">
                {matchedInsurances.length > 0 ? `${matchedInsurances.length} بیمه پایه و تکمیلی` : 'تعرفه آزاد'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[11px] block mb-1">تجهیزات دیجیتال:</span>
              <span className="font-black text-slate-900 text-sm">
                اسکنر داخل دهانی + پرینتر ۳D
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[11px] block mb-1">استعلام اصالت قطعات:</span>
              <span className="font-black text-emerald-700 text-sm flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>پاسپورت رسمی ۳۲ دندان</span>
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. TABBED CONTENT: DOCTORS, GALLERY, INSURANCES */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 gap-6 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              کادر جراحان شیفت
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'gallery'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              تور تصویری کلینیک ({galleryPhotos.length} عکس)
            </button>
            <button
              onClick={() => setActiveTab('insurances')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'insurances'
                  ? 'border-emerald-600 text-emerald-700 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              بیمه‌ها و تعرفه‌های طرف قرارداد
            </button>
          </div>

          {/* TAB 1: DOCTORS BY SHIFT */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-600" />
                  <span>اسامی پزشکان و جراحان فعال در شیفت‌های درمانی:</span>
                </h2>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  دارای تاییدیه احراز هویت سازمان نظام پزشکی
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayDocs.map(({ doc, shift }) => {
                  const spec = specialties.find((s) => s.id === doc.specialty_id);
                  return (
                    <div
                      key={doc.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 hover:bg-white transition-all shadow-2xs flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={doc.avatar}
                          alt={doc.last_name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-xs"
                        />
                        <div className="space-y-1">
                          <Link
                            to={DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug)}
                            className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors block"
                          >
                            {doc.first_name} {doc.last_name}
                          </Link>
                          <span className="text-xs text-teal-700 font-medium block">
                            {spec?.title || 'متخصص جراحی دهان، فک و صورت'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 block">
                            کد نظام پزشکی: {doc.medical_council_code}
                          </span>
                        </div>
                      </div>

                      {/* Shift details */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
                        <span className="font-bold text-slate-700">شیفت حضور:</span>
                        <span className="font-mono text-emerald-700 font-bold">
                          {shift?.saturday || 'شنبه تا چهارشنبه (عصرها)'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <Link
                          to={DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug)}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          <span>مشاهده بیوگرافی و رزومه</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            setBookingSuccessCode(null);
                            setIsBookModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          نوبت با این جراح
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PHOTO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                  <span>فضای فیزیکی، استریلیزاسیون و اتاق‌های جراحی کلینیک:</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  برای مشاهده تصویر در اندازه اصلی روی آن کلیک فرمایید.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedGalleryImg(photo.url)}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs aspect-video"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">
                        {photo.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold mt-0.5">{photo.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INSURANCES */}
          {activeTab === 'insurances' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <BadgePercent className="w-5 h-5 text-teal-600" />
                  <span>قرارداد با بیمه‌های تکمیلی، بانک‌ها و سازمان‌ها:</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  پوشش جراحی ایمپلنت، پیوند استخوان فک، سینوس لیفت و روکش‌های زیرکونیا
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {matchedInsurances.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-4 rounded-2xl border border-teal-200 bg-teal-50/60 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                        {ins.name}
                      </span>
                      <span className="text-[11px] text-teal-700 font-medium block">
                        بیمه {ins.insurance_type === 'supplementary' ? 'تکمیلی درمان' : 'پایه درمانی'}
                      </span>
                    </div>
                    <span className="p-1.5 rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="w-4 h-4" />
                    </span>
                  </div>
                ))}

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-xs block">
                      صدور فاکتور رسمی معتبر
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      برای سایر بیمه‌ها با مهر پزشک
                    </span>
                  </div>
                  <span className="p-1.5 rounded-full bg-slate-200 text-slate-700">
                    <Check className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 3. LOCATION & ROUTING (نقشه و مسیریابی) */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-600" />
                <span>مسیریابی دقیق و پارکینگ کلینیک:</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                دسترسی آسان با وسایل نقلیه عمومی، مترو و خودروی شخصی با جای پارک مناسب
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 block">نشانی رسمی:</span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                {clinic.address}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/80">
              <span className="text-xs font-bold text-slate-700">مسیریابی با یک ضربه:</span>
              <a
                href={`https://nshn.ir`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition-colors"
              >
                مسیریابی در نشان
              </a>
              <a
                href={`https://balad.ir`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
              >
                مسیریابی در بلد
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(clinic.address)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors"
              >
                Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: IMAGE PREVIEW */}
      {/* ============================================================ */}
      {selectedGalleryImg && (
        <div
          onClick={() => setSelectedGalleryImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
        >
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden p-2">
            <button
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedGalleryImg}
              alt="کلینیک دندانپزشکی"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: BOOK APPOINTMENT */}
      {/* ============================================================ */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">درخواست نوبت در {clinic.name}</h3>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccessCode ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900">درخواست شما در سیستم ثبت شد</h4>
                  <p className="text-xs text-slate-500">
                    همکاران پذیرش کلینیک ظرف مدت ۳۰ دقیقه کاری جهت نهایی‌سازی ساعت نوبت با شما تماس خواهند گرفت.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800">
                  شناسه رهگیری پذیرش: <span className="text-emerald-700 text-sm">{bookingSuccessCode}</span>
                </div>
                <button
                  onClick={() => setIsBookModalOpen(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  بستن پنجره
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علیرضا حسینی"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">شماره تلفن همراه:</label>
                  <input
                    type="tel"
                    required
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    dir="ltr"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-[11px] text-teal-900 leading-relaxed">
                  🛡️ این مرکز متعهد به صدور شناسنامه اصالت قطعات ایمپلنت و ثبت کدهای LOT در پرونده درمانی می‌باشد.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
                  >
                    ثبت نوبت
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
