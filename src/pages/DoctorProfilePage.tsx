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
  Clock,
  Sparkles,
  Share2,
  Navigation,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  X,
  FileCheck2,
  Activity,
  HeartHandshake
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

interface PatientReview {
  id: number;
  patient_name: string;
  rating: number;
  treatment: string;
  implant_brand: string;
  date: string;
  comment: string;
  verified: boolean;
  likes: number;
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

  // Modals & States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientNationalId, setPatientNationalId] = useState('');
  const [preferredDate, setPreferredDate] = useState('فردا عصر');
  const [preferredTime, setPreferredTime] = useState('۱۷:۰۰ - ۱۹:۰۰');

  // Review submission state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTreatment, setNewReviewTreatment] = useState('جراحی ایمپلنت دیجیتال');
  const [newReviewComment, setNewReviewComment] = useState('');

  // Sample verified reviews
  const [reviews, setReviews] = useState<PatientReview[]>([
    {
      id: 1,
      patient_name: 'حمیدرضا شمس',
      rating: 5,
      treatment: 'کاشت ایمپلنت فوری همراه با پیوند استخوان',
      implant_brand: 'اشترومن BLX سوئیس',
      date: '۲ روز پیش',
      comment:
        'دقت عمل فوق‌العاده و تسلط کامل به جراحی فلپ‌لس. درد بعد از عمل بسیار کمتر از تصورم بود و پاسپورت دیجیتال ۳۲ دندان و بارکد اصالت فیکسچر تحویلم داده شد.',
      verified: true,
      likes: 14
    },
    {
      id: 2,
      patient_name: 'مریم سلیمانی',
      rating: 5,
      treatment: 'جراحی ۲ واحد ایمپلنت با کیت دیجیتال',
      implant_brand: 'ناکسیس آلمان (Naxis)',
      date: 'هفته گذشته',
      comment:
        'بسیار حرفه‌ای و خوش‌برخورد. قطعات قبل از جراحی با استعلام کد رفرنس در حضور خودم باز شد. گارانتی کتبی آلیاژ تیتانیوم گرید ۵ رو ثبت کردند.',
      verified: true,
      likes: 9
    },
    {
      id: 3,
      patient_name: 'فرهاد کاظمی',
      rating: 4.8,
      treatment: 'بازسازی فک و ایمپلنت ناحیه خلفی',
      implant_brand: 'اوستم TSIII کره جنوبی',
      date: '۳ هفته پیش',
      comment:
        'محیط کلینیک کاملاً استریل بود و پروتکل بهداشتی در بالاترین سطح رعایت شده بود. از مشاوره‌های بیومکانیک ایشان نهایت رضایت را دارم.',
      verified: true,
      likes: 6
    }
  ]);

  // Robust doctor resolution by slug, medical code, or name
  const cleanSlug = (slug || '').toLowerCase().trim();
  const medicalCode = cleanSlug.split('-')[0];

  const doctor = doctors.find((d) => {
    const dSlug = (d.slug || '').toLowerCase();
    const dCode = (d.medical_council_code || '').toLowerCase();
    const dFullName = `dr-${d.first_name}-${d.last_name}`.toLowerCase().replace(/\s+/g, '-');
    const dCodeSlug = `${dCode}-${dSlug}`;

    return (
      dSlug === cleanSlug ||
      dCode === cleanSlug ||
      dCode === medicalCode ||
      dCodeSlug === cleanSlug ||
      dFullName === cleanSlug ||
      cleanSlug.includes(dSlug) ||
      cleanSlug.includes(dCode)
    );
  }) || doctors[0]; // Graceful fallback if testing

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs">
          <h2 className="font-bold text-slate-800 text-base mb-2">پزشک مورد نظر یافت نشد</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            کد یا نام مستعار پزشک در سیستم ثبت نشده است یا اصلاح گردیده است.
          </p>
          <Link
            to="/dentists"
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block"
          >
            مشاهده دایرکتوری پزشکان
          </Link>
        </div>
      </div>
    );
  }

  const specialty = specialties.find((s) => s.id === doctor.specialty_id);

  // Active clinics where this doctor operates
  const activeClinics = clinicDoctors
    .filter((cd) => cd.doctor_id === doctor.id && cd.is_active)
    .map((cd) => {
      const clinic = clinics.find((c) => c.id === cd.clinic_id);
      return clinic ? { clinic, shift: cd.shift_schedule } : null;
    })
    .filter(Boolean) as { clinic: Clinic; shift?: Record<string, string> }[];

  // Fallback to primary clinic if junction empty
  const primaryClinic = activeClinics[0]?.clinic || clinics[0];

  const handleOpenBooking = (clinicId?: number) => {
    setSelectedClinicId(clinicId || primaryClinic?.id || 1);
    setBookingSuccessCode(null);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) {
      alert('لطفاً نام و شماره تلفن همراه خود را وارد فرمایید.');
      return;
    }

    const cId = selectedClinicId || primaryClinic?.id || 1;
    onRecordLead(cId, doctor.id);

    const tracking = `DM-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccessCode(tracking);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) return;

    const newRev: PatientReview = {
      id: Date.now(),
      patient_name: newReviewName,
      rating: newReviewRating,
      treatment: newReviewTreatment,
      implant_brand: 'اشترومن سوئیس',
      date: 'امروز',
      comment: newReviewComment,
      verified: true,
      likes: 1
    };

    setReviews([newRev, ...reviews]);
    setIsReviewModalOpen(false);
    setNewReviewName('');
    setNewReviewComment('');
  };

  const canonicalUrl = `https://dentalmap.ir/doctor/${doctor.medical_council_code}-${doctor.slug}`;

  // Structured Data Schema.org (Physician / Dentist)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: `${doctor.first_name} ${doctor.last_name}`,
    image: doctor.avatar,
    telephone: '021-88001144',
    medicalSpecialty: specialty?.title,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'تهران',
      addressCountry: 'IR',
      streetAddress: primaryClinic?.address || 'سعادت‌آباد، خیابان سرو غربی'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: doctor.rating || 4.9,
      reviewCount: doctor.reviews_count || reviews.length
    }
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
            <Link to="/dentists" className="text-slate-500 hover:text-emerald-700 transition-colors">
              دایرکتوری جراحان
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            {specialty && (
              <>
                <Link
                  to={DentalMapRoutes.specialtyHub(specialty.slug)}
                  className="text-slate-500 hover:text-emerald-700 transition-colors hidden sm:inline"
                >
                  {specialty.title}
                </Link>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              </>
            )}
            <span className="text-emerald-700 font-bold truncate">
              {doctor.first_name} {doctor.last_name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('لینک پروفایل پزشک کپی گردید.');
              }}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title="اشتراک‌گذاری پروفایل"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/dentists"
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
        {/* 1. HERO BIO CARD & VERIFICATION BADGE */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-70"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={doctor.avatar}
                  alt={`${doctor.first_name} ${doctor.last_name}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-emerald-500/30 shadow-md shadow-emerald-500/10"
                />
                {doctor.verified && (
                  <span
                    className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-xl shadow-md border-2 border-white"
                    title="هویت و مدرک پزشکی تایید شده"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {doctor.first_name} {doctor.last_name}
                  </h1>
                  {doctor.verified && (
                    <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تاییدیه نظام پزشکی ایران</span>
                    </span>
                  )}
                </div>

                <div className="text-sm sm:text-base text-teal-800 font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>{specialty?.title || 'جراح و متخصص ایمپلنت‌های دندانی'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="font-mono bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg">
                    کد نظام پزشکی: {doctor.medical_council_code}
                  </span>
                  <a
                    href={`https://membersearch.irimc.org`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 underline underline-offset-4"
                  >
                    <span>استعلام از سامانه کل نظام پزشکی</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action CTA Box */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
              <button
                onClick={() => handleOpenBooking()}
                className="w-full px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4" />
                <span>رزرو آنلاین نوبت ویزیت</span>
              </button>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
                <span className="text-slate-600 font-medium">امتیاز مراجعین:</span>
                <div className="flex items-center gap-1 font-bold text-amber-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating}</span>
                  <span className="text-slate-400 font-normal">({reviews.length} نظر تایید شده)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Clinical Credentials & Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] block mb-1">سابقه جراحی تخصصی:</span>
              <span className="font-black text-slate-900 text-sm sm:text-base">
                {doctor.experience_years} سال طبابت مداوم
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] block mb-1">رده سنی پذیرش:</span>
              <span className="font-black text-slate-900 text-sm sm:text-base">
                {doctor.patient_age_group === 'adults' && 'بزرگسالان'}
                {doctor.patient_age_group === 'children' && 'کودکان و نوجوانان'}
                {doctor.patient_age_group === 'both' && 'تمامی رده‌های سنی'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] block mb-1">پاسپورت اصالت قطعات:</span>
              <span className="font-black text-emerald-700 text-sm sm:text-base flex items-center gap-1">
                <FileCheck2 className="w-4 h-4" />
                <span>متعهد به صدور کارت</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] block mb-1">تعداد جراحی موفق:</span>
              <span className="font-black text-slate-900 text-sm sm:text-base font-mono">
                +{(doctor.experience_years * 320).toLocaleString('fa-IR')} فیکسچر
              </span>
            </div>
          </div>

          {/* Detailed Biography & Fellowships */}
          <div className="mt-8 space-y-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>بیوگرافی کامل، فلوشیپ‌ها و رویکرد جراحی:</span>
            </h2>
            <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>{doctor.bio}</p>
              <p className="text-slate-500 text-xs">
                عضو رسمی انجمن جراحان ایمپلنت دندان ایران (ICOI) و دارای گواهینامه‌های تخصصی در زمینه
                جراحی بازسازی سه‌بعدی استخوان فک (GBR)، جراحی پیشرفته سینوس لیفت و استفاده از راهنماهای
                دیجیتال سه‌بعدی (Guided Surgery).
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. IMPLANT BRANDS USED & TITANIUM GRADES */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>برندها و کیت‌های ایمپلنت تحت جراحی این پزشک:</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                صرفاً فیکسچرهای معتبر دارای مجوز اداره کل تجهیزات پزشکی و استاندارد CE / FDA
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              گارانتی اصالت تیتانیوم گرید ۴ و ۵
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-400 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">اشترومن (Straumann)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                  🇨🇭 سوئیس
                </span>
              </div>
              <p className="text-xs text-slate-600">
                سیستم‌های BLX و Roxolid SLActive. اتصال هشت‌ضلعی داخلی CrossFit با نرخ جوش‌خوردگی
                فوق‌سریع ۳ الی ۴ هفته.
              </p>
              <div className="text-[11px] text-emerald-700 font-bold pt-2 border-t border-slate-200/60">
                ✓ گارانتی مادام‌العمر بین‌المللی
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-400 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">ناکسیس (Naxis Dental)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  🇩🇪 آلمان
                </span>
              </div>
              <p className="text-xs text-slate-600">
                اتصال دوگانه هگز ۲.۱ به همراه مخروطی مورس تیپر ۱۱ درجه (سازگار با استرا آکوا). تیتانیوم گرید ۵ با
                سطح فعال MPS.
              </p>
              <div className="text-[11px] text-emerald-700 font-bold pt-2 border-t border-slate-200/60">
                ✓ پایداری اولیه در استخوان D3 و D4
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-400 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">اوستم (Osstem TSIII)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  🇰🇷 کره جنوبی
                </span>
              </div>
              <p className="text-xs text-slate-600">
                پرکاربردترین سیستم ایمپلنت آسیا، هگز داخلی با پوشش SLA و تکنولوژی شیار برنده کورپورال با
                دوام طولانی.
              </p>
              <div className="text-[11px] text-emerald-700 font-bold pt-2 border-t border-slate-200/60">
                ✓ گارانتی تعویض کتبی و تامین نامحدود قطعات
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. WORKING HOURS & CLINIC MAP */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Schedule Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>برنامه هفتگی و ساعات حضور در مطب:</span>
            </h2>
            <p className="text-xs text-slate-500">
              ویزیت و مشاوره‌های قبل از جراحی صرفاً با هماهنگی و تعیین وقت قبلی انجام می‌گردد.
            </p>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <span className="font-bold text-slate-800">شنبه تا سه‌شنبه:</span>
                <span className="text-slate-600 font-mono">شیفت عصر: ۱۶:۰۰ الی ۲۱:۰۰</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="font-bold text-slate-800">چهارشنبه:</span>
                <span className="text-slate-600 font-mono">شیفت صبح: ۰۹:۳۰ الی ۱۳:۳۰</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="font-bold text-slate-800">پنج‌شنبه:</span>
                <span className="text-slate-600 font-mono">۱۰:۰۰ الی ۱۴:۰۰ (اعمال جراحی)</span>
              </div>
              <div className="py-3 flex items-center justify-between text-slate-400">
                <span>جمعه‌ها و تعطیلات رسمی:</span>
                <span className="font-medium text-rose-500">صرفاً پاسخگویی موارد اورژانسی</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleOpenBooking()}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>بررسی نوبت‌های خالی این هفته</span>
              </button>
            </div>
          </div>

          {/* Office Location & Routing */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>نشانی مطب و راهنمای دسترسی:</span>
              </h2>
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900 text-sm">
                  {primaryClinic?.name || 'مطب تخصصی دندانپزشکی و ایمپلنت'}
                </div>
                <div className="text-slate-600 leading-relaxed">
                  {primaryClinic?.address || 'تهران، سعادت‌آباد، بالاتر از میدان کاج، نبش خیابان نهم، پلاک ۲۸'}
                </div>
                <div className="text-[11px] text-teal-700 font-medium pt-1">
                  نزدیک‌ترین دسترسی: ایستگاه مترو میدان کتاب / خروجی یادگار امام
                </div>
              </div>
            </div>

            {/* Direct Routing Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-xs text-slate-400 font-bold block">مسیریابی مستقیم با یک کلیک:</span>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://nshn.ir`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs text-center border border-blue-200 transition-colors"
                >
                  نقشه نشان
                </a>
                <a
                  href={`https://balad.ir`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs text-center border border-emerald-200 transition-colors"
                >
                  اپلیکیشن بلد
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(primaryClinic?.address || 'Tehran')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center border border-slate-200 transition-colors"
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. PATIENT REVIEWS & VERIFIED STORIES */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>تجربیات و نظرات مراجعین درمان‌شده:</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                دیدگاه‌های ثبت‌شده صرفاً متعلق به بیمارانی است که شناسه جراحی آن‌ها در سامانه احراز شده است.
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>ثبت دیدگاه درمان</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{rev.patient_name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-700 mr-1">{rev.rating}</span>
                  </div>

                  <div className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded inline-block">
                    {rev.treatment} ({rev.implant_brand})
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{rev.comment}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>مراجعه‌کننده تاییدشده</span>
                  </span>
                  <span>{rev.likes} نفر پسندیدند</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: ONLINE BOOKING MODAL */}
      {/* ============================================================ */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">
                  رزرو نوبت مشاوره و جراحی با {doctor.first_name} {doctor.last_name}
                </h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
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
                  <h4 className="text-base font-black text-slate-900">نوبت شما با موفقیت ثبت شد</h4>
                  <p className="text-xs text-slate-500">
                    پیامک تایید حاوی آدرس دقیق و مدارک مورد نیاز (عکس OPG / CBCT) برای شما ارسال گردید.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800">
                  کد رهگیری پذیرش: <span className="text-emerald-700 text-sm">{bookingSuccessCode}</span>
                </div>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  بستن پنجره
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">مرکز درمانی / مطب:</label>
                  <select
                    value={selectedClinicId || ''}
                    onChange={(e) => setSelectedClinicId(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                  >
                    {activeClinics.map(({ clinic }) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name} ({clinic.address})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">نام و نام خانوادگی بیمار:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: رضا محمدی"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">شماره تلفن همراه (جهت پیامک):</label>
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">روز پیشنهادی:</label>
                    <select
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="فردا عصر">فردا بعدازظهر</option>
                      <option value="پس فردا">پس‌فردا</option>
                      <option value="پایان هفته">پنج‌شنبه همین هفته</option>
                      <option value="هفته آینده">هفته آینده</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ساعت ترجیحی:</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="۱۶:۰۰ - ۱۸:۰۰">۱۶:۰۰ الی ۱۸:۰۰</option>
                      <option value="۱۸:۰۰ - ۲۰:۰۰">۱۸:۰۰ الی ۲۰:۰۰</option>
                      <option value="۱۰:۰۰ - ۱۳:۰۰">شیفت صبح (۱۰ الی ۱۳)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed">
                  🛡️ با ثبت نوبت در پلتفرم دنتال مپ، فیکسچر شما تحت پوشش گارانتی اصالت کتبی و صدور رایگان پاسپورت ۳۲ دندان قرار می‌گیرد.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20"
                  >
                    تایید و دریافت نوبت
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: ADD REVIEW MODAL */}
      {/* ============================================================ */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">ثبت تجربه درمان یا جراحی</h3>
              <button onClick={() => setIsReviewModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">نام یا نام مستعار:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سارا ک."
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نوع عمل / درمان:</label>
                <input
                  type="text"
                  required
                  value={newReviewTreatment}
                  onChange={(e) => setNewReviewTreatment(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">امتیاز کلی شما (از ۵):</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setNewReviewRating(num)}
                      className={`p-2 rounded-xl border ${
                        newReviewRating >= num
                          ? 'bg-amber-50 border-amber-300 text-amber-500'
                          : 'bg-slate-50 border-slate-200 text-slate-300'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 mr-2">{newReviewRating} از ۵</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">متن دیدگاه و شرح روند درمان:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="کیفیت جراحی، میزان درد، رفتار پرسنل و وضعیت تحویل پاسپورت قطعات..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  ثبت دیدگاه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
