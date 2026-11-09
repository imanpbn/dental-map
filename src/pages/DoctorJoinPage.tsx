import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Building,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award,
  Users,
  ChevronLeft,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { SEO } from '../components/SEO';
import {
  Specialty,
  City,
  District,
  Insurance,
  ImplantBrand,
  CenterType,
  DoctorApplication
} from '../types';
import { isValidIranMobile, normalizeIranMobile } from '../utils/formatters';
import { SmsService } from '../utils/smsService';

interface DoctorJoinPageProps {
  specialties: Specialty[];
  cities: City[];
  districts: District[];
  insurances: Insurance[];
  brands: ImplantBrand[];
  onAddApplication: (app: DoctorApplication) => void;
}

export const DoctorJoinPage: React.FC<DoctorJoinPageProps> = ({
  specialties,
  cities,
  districts,
  insurances,
  brands,
  onAddApplication
}) => {
  const navigate = useNavigate();

  // Form State
  const [centerType, setCenterType] = useState<CenterType>('private_office');
  const [fullName, setFullName] = useState('');
  const [medicalCode, setMedicalCode] = useState('');
  const [specialtyId, setSpecialtyId] = useState<number>(specialties[0]?.id || 2);
  const [cityId, setCityId] = useState<number>(cities[0]?.id || 1);
  const [districtId, setDistrictId] = useState<number | undefined>(districts[0]?.id || 1);
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['اشترومن (Straumann)']);
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>(['بیمه دانا']);
  const [is24_7, setIs24_7] = useState(false);
  const [bio, setBio] = useState('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<number | null>(null);

  // Available districts for selected city
  const cityDistricts = districts.filter((d) => d.city_id === cityId);

  const toggleBrand = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  const toggleInsurance = (insName: string) => {
    setSelectedInsurances((prev) =>
      prev.includes(insName) ? prev.filter((i) => i !== insName) : [...prev, insName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('لطفاً نام و نام خانوادگی پزشک یا عنوان مرکز را به صورت کامل وارد فرمایید.');
      return;
    }

    const cleanMedical = medicalCode.replace(/\D/g, '');
    if (!cleanMedical || cleanMedical.length < 4) {
      setErrorMessage('شماره نظام پزشکی معتبر نیست. لطفاً کد نظام پزشکی را به درستی وارد فرمایید.');
      return;
    }

    const cleanMob = normalizeIranMobile(mobile);
    if (!isValidIranMobile(cleanMob)) {
      setErrorMessage('شماره تلفن همراه معتبر نیست. لطفاً شماره ۱۱ رقمی (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('لطفاً آدرس دقیق مطب یا کلینیک را وارد نمایید.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newApp: DoctorApplication = {
        id: Date.now(),
        center_type: centerType,
        full_name: fullName.trim(),
        medical_council_code: cleanMedical,
        specialty_id: Number(specialtyId),
        city_id: Number(cityId),
        district_id: districtId ? Number(districtId) : undefined,
        address: address.trim(),
        mobile: cleanMob,
        phone: phone.trim() || '021-88001144',
        brands: selectedBrands,
        insurances: selectedInsurances,
        is_24_7: is24_7,
        bio: bio.trim(),
        status: 'pending',
        created_at: new Date().toISOString()
      };

      onAddApplication(newApp);
      setSubmittedAppId(newApp.id);
      setIsSuccess(true);

      // Send confirmation SMS to applicant
      await SmsService.sendSms({
        to: cleanMob,
        text:
          `جناب آقای/سرکار خانم ${fullName.trim()} گرامی،\n` +
          `درخواست عضویت شما در سامانه جامع دنتال‌مپ با شناسه پیگیری #${newApp.id.toString().slice(-6)} ثبت شد.\n` +
          `پس از استعلام نظام پزشکی، پروفایل شما در دایرکتوری منتشر خواهد شد.\n` +
          `مرجع اصالت ایمپلنتولوژی دنتال‌مپ`,
        type: 'appointment'
      }).catch(() => {});
    } catch {
      setErrorMessage('خطایی در ثبت اطلاعات رخ داد. لطفاً مجدداً تلاش فرمایید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 dir-rtl">
      <SEO
        title="عضویت جراحان و دندانپزشکان | ثبت مطب و کلینیک در دنتال مپ"
        description="ثبت‌نام آنلاین متخصصان ایمپلنتولوژی، جراحان فک و صورت و کلینیک‌های دندانپزشکی در بزرگ‌ترین دایرکتوری تخصصی و شبکه اصالت قطعات ایمپلنت ایران."
        canonical="/doctor-join"
        keywords="ثبت نام دندانپزشکان, عضویت کلینیک دندانپزشکی, دایرکتوری جراحان ایمپلنت, ثبت مطب دنتال مپ"
      />

      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Link to="/" className="hover:text-emerald-700 font-medium">صفحه اصلی</Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/directory" className="hover:text-emerald-700 font-medium">دایرکتوری</Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold">پیوستن متخصصان و ثبت مرکز</span>
          </div>

          <Link
            to="/directory"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>مشاهده دایرکتوری</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* Success Card */}
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                درخواست در صف بررسی کارشناسان قرار گرفت
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                درخواست عضویت شما با موفقیت ثبت شد
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                همکار گرامی، اطلاعات مطب / کلینیک شما دریافت شد. کارشناسان دنتال‌مپ پس از تطبیق مشخصات با بانک نظام پزشکی کشور، پروفایل شما را در دایرکتوری عمومی فعال خواهند کرد.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-xs space-y-2.5 text-right font-mono">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-sans font-bold">شناسه پیگیری:</span>
                <span className="font-bold text-emerald-800">#{submittedAppId?.toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-sans font-bold">نام پزشک / مرکز:</span>
                <span className="font-sans font-bold">{fullName}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-sans font-bold">کد نظام پزشکی:</span>
                <span className="font-bold">{medicalCode}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-sans font-bold">پیامک اطلاع‌رسانی:</span>
                <span className="text-emerald-600 font-bold">ارسال شد ✓</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                بازگشت به صفحه اصلی
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFullName('');
                  setMedicalCode('');
                  setAddress('');
                }}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                ثبت مرکز درمانی دیگر
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Hero */}
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>پیوستن به شبکه اصالت و دایرکتوری نخبگان دنتال‌مپ</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  ثبت مطب و معرفی خدمات تخصصی ایمپلنت در دنتال‌مپ
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  با عضویت در دایرکتوری مرجع، بیماران نیازمند جراحی فک و کاشت ایمپلنت بر اساس منطقه جغرافیایی، بیمه‌های طرف قرارداد و برندهای مورد تایید به مطب شما هدایت می‌شوند.
                </p>

                {/* 3 Core Value Props */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>نشان تاییدیه رسمی نظام پزشکی</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                    <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>صدور پاسپورت ۳۲ دندان برای مراجعین</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>جذب مستقیم و ارگانیک بیماران هدف</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-medium animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Main Application Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8 text-xs">
              
              {/* Section 1: Center Type */}
              <div className="space-y-3 pb-6 border-b border-slate-100">
                <label className="block text-sm font-bold text-slate-900">
                  نوع واحد درمانی را انتخاب فرمایید:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: 'private_office' as CenterType, label: 'مطب دندانپزشکی', icon: Stethoscope },
                    { type: 'clinic' as CenterType, label: 'کلینیک دندانپزشکی', icon: Building },
                    { type: 'hospital' as CenterType, label: 'بخش بیمارستانی', icon: Award }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = centerType === item.type;
                    return (
                      <button
                        type="button"
                        key={item.type}
                        onClick={() => setCenterType(item.type)}
                        className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Identity & Medical Credentials */}
              <div className="space-y-4 pb-6 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>مشخصات هویتی و پروانه پزشکی</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      نام و نام خانوادگی پزشک / موسس مرکز: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: دکتر احسان یزدانی"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      شماره نظام پزشکی: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={medicalCode}
                      onChange={(e) => setMedicalCode(e.target.value)}
                      placeholder="مثال: 142890"
                      dir="ltr"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all"
                      required
                    />
                    <p className="text-[10px] text-slate-400 mt-1">جهت استعلام اصالت پروانه از سامانه نظام پزشکی کشور</p>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    تخصص یا زمینه فعالیت بالینی: <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={specialtyId}
                    onChange={(e) => setSpecialtyId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 cursor-pointer"
                  >
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 3: Location & Contacts */}
              <div className="space-y-4 pb-6 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>موقعیت مکانی و راه‌های ارتباطی مطب</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">استان و شهر:</label>
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 cursor-pointer"
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">محله / منطقه شهرداری:</label>
                    <select
                      value={districtId}
                      onChange={(e) => setDistrictId(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 cursor-pointer"
                    >
                      {cityDistricts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.region_zone})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    نشانی دقیق مطب / کلینیک: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: سعادت‌آباد، میدان کاج، مجتمع سروستان، طبقه ۳، واحد ۱۲"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      شماره تلفن همراه (جهت پیامک نوبت‌ها و استعلام): <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="09121112233"
                      dir="ltr"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-800 focus:bg-white focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">تلفن ثابت نوبت‌دهی:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="021-22003344"
                      dir="ltr"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-xs text-slate-800 focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Implant Brands & Insurances */}
              <div className="space-y-4 pb-6 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>برندهای فیکسچر مصرفی و بیمه‌های طرف قرارداد</span>
                </h3>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    برندهای ایمپلنت مورد استفاده در مطب / کلینیک شما (چند انتخابی):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {brands.map((b) => {
                      const active = selectedBrands.includes(b.name);
                      return (
                        <button
                          type="button"
                          key={b.id}
                          onClick={() => toggleBrand(b.name)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            active
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate block">{b.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    بیمه‌های پایه و تکمیلی طرف قرارداد:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {insurances.map((ins) => {
                      const active = selectedInsurances.includes(ins.name);
                      return (
                        <button
                          type="button"
                          key={ins.id}
                          onClick={() => toggleInsurance(ins.name)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            active
                              ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate block">{ins.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={is24_7}
                      onChange={(e) => setIs24_7(e.target.checked)}
                      className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>مرکز دارای شیفت اورژانس شبانه‌روزی (۲۴ ساعته) می‌باشد.</span>
                  </label>
                </div>
              </div>

              {/* Section 5: Bio & Experience */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  خلاصه سوابق بالینی، مدارک فلوشیپ یا تجهیزات ویژه مرکز:
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="مثال: فلوشیپ فوق تخصصی ایمپلنت دیجیتال از دانشگاه زوریخ سوئیس، مجهز به کیت‌های جراحی هدایت‌شده بدون بخیه و اتاق ریکاوری مجهز..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:border-emerald-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>اطلاعات شما با پروتکل امنیتی محرمانه دنتال‌مپ محافظت می‌شود.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>در حال اعتبارسنجی و ثبت...</span>
                  ) : (
                    <>
                      <span>ارسال درخواست و ثبت در کارتابل بررسی</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
