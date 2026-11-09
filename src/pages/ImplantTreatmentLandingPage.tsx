import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
  Phone,
  Clock,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Activity,
  Layers,
  FileCheck2,
  Heart,
  Smile,
  Zap,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmsService, normalizeIranMobile, isValidIranMobile } from '../utils/smsService';

const faNum = (n: number | string) =>
  String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export const ImplantTreatmentLandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Interactive Slider State (Number of Teeth to Implant)
  const [teethCount, setTeethCount] = useState<number>(3);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'info' | 'otp' | 'success'>('info');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);

  // Dynamic calculations based on teethCount
  const chewingRestoration = Math.min(99, 90 + Math.floor(teethCount * 0.9));
  const estimatedWeeks = teethCount <= 2 ? '۴ الی ۶ هفته' : teethCount <= 5 ? '۶ الی ۸ هفته' : '۸ الی ۱۰ هفته';
  const estimatedSessions = teethCount <= 3 ? '۲ جلسه' : teethCount <= 6 ? '۳ جلسه' : '۳ الی ۴ جلسه';

  // Open booking modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setStep('info');
    setModalError(null);
  };

  // Request SMS OTP in modal
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    const clean = normalizeIranMobile(mobileNumber);
    if (!fullName.trim()) {
      setModalError('لطفاً نام و نام‌خانوادگی خود را وارد فرمایید.');
      return;
    }
    if (!isValidIranMobile(clean)) {
      setModalError('لطفاً شماره تلفن همراه ۱۱ رقمی معتبر (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await SmsService.sendOtp(clean, 'رزرو مشاوره تخصصی و استعلام اصالت ایمپلنت');
      if (res.success) {
        setStep('otp');
        if (res.code) setDemoOtpHint(res.code);
      } else {
        setModalError(res.message);
      }
    } catch {
      setModalError('خطا در ارسال پیامک. لطفاً اتصال اینترنت خود را بررسی نمایید.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify SMS OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setIsVerifying(true);
    try {
      const res = SmsService.verifyOtp(mobileNumber, otpCode);
      if (res.success) {
        setStep('success');
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      } else {
        setModalError(res.message);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // FAQ Data
  const faqs = [
    {
      q: 'آیا مشاوره اولیه، بررسی عکس OPG و تست آنلاین کاملاً رایگان است؟',
      a: 'بله، تمامی مراحل ارزیابی آنلاین اولیه، تطبیق شرایط استخوان فک با رفرنس‌های استاندارد و مشاوره مقدماتی در پلتفرم دنتال‌مپ به‌صورت ۱۰۰٪ رایگان و بدون هیچ‌گونه تعهد مالی برای بیمار انجام می‌شود.'
    },
    {
      q: 'روند استعلام کد LOT و دریافت پاسپورت ۳۲ دندان چگونه است؟',
      a: 'پس از جراحی کاشت، پوکه استریل فیکسچر همراه با لیبل بارکد رسمی و شماره بهر ساخت (LOT Number) به شما تحویل داده می‌شود. جراح کد را در سامانه ثبت می‌کند و پاسپورت دیجیتال ضدجعل با کد QR اختصاصی صادر و در پنل شما ذخیره می‌گردد.'
    },
    {
      q: 'اگر تحلیل شدید استخوان داشته باشم، آیا باز هم می‌توانم ایمپلنت بکارم؟',
      a: 'بله، با استفاده از تکنیک‌های نوین پیوند استخوان (Bone Graft)، سینوس لیفت و فیکسچرهای پیشرفته هایدروفیلیک (مانند سطوح SLActive و رزوه‌های عمیق نکسیس آلمان)، حتی در افراد با تراکم استخوان بسیار نرم D4 نیز امکان کاشت موفق با نرخ بالای ۹۵٪ فراهم است.'
    },
    {
      q: 'تفاوت اساسی سیستم‌های سوئیسی، آلمانی و کره‌ای در چیست؟',
      a: 'تفاوت در متالورژی تیتانیوم (گرید ۴ سردکاری‌شده در برابر آلیاژهای نرم‌تر)، نوع کانکشن (مورس تیپر ضد باکتری در برابر هگز تخت) و سابقه مطالعات بالینی بلندمدت ۱۵ الی ۲۰ ساله است. در تست هوشمند، ما بر اساس بودجه و شرایط استخوان، بهترین سیستم را به شما پیشنهاد می‌دهیم.'
    },
    {
      q: 'طول دوره درمان و زمان جوش‌خوردن فیکسچر به استخوان چقدر است؟',
      a: 'در سیستم‌های پریمیوم هایدروفیلیک، به لطف جذب فوری پروتئین‌های خون، جوش‌خوردن استخوان (استئواینتگریشن) به ۳ الی ۴ هفته کاهش می‌یابد. در سیستم‌های استاندارد، این مدت بین ۶ الی ۸ هفته است.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dir-rtl selection:bg-teal-500 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER NOTIFICATION STRIP */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 text-white py-2 px-4 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <span className="font-medium">
              مشاوره تخصصی و استعلام آنلاین اصالت قطعات ایمپلنتولوژی دنتال‌مپ
            </span>
          </div>
          <button
            onClick={handleOpenModal}
            className="hidden sm:inline-flex items-center gap-1 font-bold text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <span>شروع مشاوره رایگان</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. STICKY SUB-NAVBAR */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900 text-base leading-tight block">
                  دنتال‌مپ
                </span>
                <span className="text-[10px] text-teal-700 font-bold block">
                  مرجع اصالت ایمپلنت
                </span>
              </div>
            </Link>

            {/* Menu Links */}
            <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-600">
              <a href="#results" className="hover:text-teal-700 transition-colors">
                نتایج درمان
              </a>
              <a href="#simulator" className="hover:text-teal-700 transition-colors">
                تخمین هوشمند
              </a>
              <a href="#process" className="hover:text-teal-700 transition-colors">
                مراحل کاشت
              </a>
              <a href="#comparison" className="hover:text-teal-700 transition-colors">
                مقایسه اصالت
              </a>
              <a href="#faq" className="hover:text-teal-700 transition-colors">
                پرسش‌های متداول
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/quiz')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              ورود به آزمون کامل
            </button>
            <button
              onClick={handleOpenModal}
              className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-teal-600/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>رزرو مشاوره رایگان</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 3. HERO SECTION (Matching Attached Page 1) */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-8 sm:pt-14 pb-12 sm:pb-16 bg-gradient-to-b from-white via-teal-50/20 to-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Right Text Column */}
            <div className="lg:col-span-7 space-y-5 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>کلینیک تخصصی و مرجع اصالت ایمپلنت دندان</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight sm:leading-snug">
                کاشت تضمینی دندان با{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700">
                  شناسنامه اصالت قطعات
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
                درمان شخصی‌سازی‌شده زیر نظر جراحان فوق‌تخصص متعهد به ارائه پاسپورت ۳۲ دندان (FDI)،
                استعلام کد رفرنس (REF) و شماره لات (LOT) با تضمین گارانتی رسمی شرکت‌های مادر سوئیس، آلمان و کره.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={handleOpenModal}
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-teal-600/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>رزرو مشاوره رایگان</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <a
                  href="#simulator"
                  className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-2xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>تخمین شرایط و جلسات درمان</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 text-right">
                <div>
                  <div className="text-lg sm:text-2xl font-black text-teal-700 font-mono">۲,۴۵۰+</div>
                  <div className="text-[11px] text-slate-500 font-medium">پاسپورت ثبت‌شده</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-black text-emerald-700 font-mono">۹۹.۱٪</div>
                  <div className="text-[11px] text-slate-500 font-medium">موفقیت استئواینتگریشن</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-black text-slate-800 font-mono">۲۰+ سال</div>
                  <div className="text-[11px] text-slate-500 font-medium">ماندگاری با استاندارد ISO</div>
                </div>
              </div>
            </div>

            {/* Left Doctor Graphic Showcase (Matching PDF Doctor with badges) */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Background Aura */}
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/20 to-emerald-300/30 rounded-3xl blur-2xl -z-10" />

                {/* Main Doctor Frame */}
                <div className="bg-white rounded-3xl p-3 border border-slate-200/90 shadow-2xl overflow-hidden relative group">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=700"
                    alt="جراح فوق‌تخصص ایمپلنتولوژی دنتال‌مپ"
                    className="w-full h-80 sm:h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Floating Badge 1: Top Right */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-lg flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>درمان تحت نظارت مستقیم جراح</span>
                  </div>

                  {/* Floating Badge 2: Top Left */}
                  <div className="absolute top-6 left-6 bg-slate-900/90 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تاییدیه نظام پزشکی</span>
                  </div>

                  {/* Floating Bottom Card: Passport Commit */}
                  <div className="absolute bottom-5 inset-x-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block">
                          شناسنامه دیجیتال ۳۲ دندان
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          استعلام کد LOT و بارکد روی پوکه استریل
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      گارانتی مادام‌العمر
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. STATISTICAL RESULTS SECTION (Matching PDF Results Chart) */}
      {/* ------------------------------------------------------------- */}
      <section id="results" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              کاربران دنتال‌مپ چه نتایجی گرفته‌اند؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              تا امروز بیش از ۲,۴۵۰ نفر مسیر درمان را در شبکه کلینیک‌های منتخب دنتال‌مپ تکمیل کرده‌اند.
              این افراد به‌طور میانگین موفقیت ۹۹.۱٪ استئواینتگریشن و صفر درصد پس‌زدگی ایمپلنت داشته‌اند.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
            {/* Left 4-Month Integration Chart */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 mb-6 flex items-center justify-between">
                <span>نمودار مراحل استئواینتگریشن (جوش‌خوردن ایمپلنت به استخوان)</span>
                <span className="text-[11px] text-teal-700 font-mono font-bold">شاخص ISQ &gt; 80</span>
              </h3>

              {/* Simulated Bar Chart (Month 1 to 4) */}
              <div className="grid grid-cols-4 gap-4 h-48 items-end border-b border-slate-200 pb-3">
                {/* Month 1 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-600">۴۵ ISQ</span>
                  <div className="w-full bg-teal-100 rounded-t-xl h-16 transition-all" />
                  <span className="text-[11px] text-slate-500 font-medium">ماه اول</span>
                </div>

                {/* Month 2 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-600">۶۵ ISQ</span>
                  <div className="w-full bg-teal-200 rounded-t-xl h-24 transition-all" />
                  <span className="text-[11px] text-slate-500 font-medium">ماه دوم</span>
                </div>

                {/* Month 3 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-teal-800">۷۸ ISQ</span>
                  <div className="w-full bg-teal-400 rounded-t-xl h-36 transition-all" />
                  <span className="text-[11px] text-slate-500 font-medium">ماه سوم</span>
                </div>

                {/* Month 4 */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono font-black text-emerald-800">۸۵+ ISQ</span>
                  <div className="w-full bg-gradient-to-t from-teal-600 to-emerald-500 rounded-t-xl h-44 shadow-md transition-all" />
                  <span className="text-[11px] text-slate-900 font-bold">ماه چهارم</span>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-slate-500 flex items-center justify-between">
                <span>تثبیت مکانیکی اولیه</span>
                <span className="text-emerald-700 font-bold">قفل نهایی اصطکاکی مورس تیپر (۱۰۰٪ صلب)</span>
              </div>
            </div>

            {/* Right Two Big Stats (Matching PDF 7/0 and 20/0kg) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-2">
                <div className="text-3xl sm:text-4xl font-black text-teal-700 font-mono">۹۹.۱٪</div>
                <div className="text-xs font-bold text-slate-800">نرخ پایداری بافت استخوان</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  حفظ استخوان حاشیه‌ای (Crestal Bone) در پنج سال اول پس از کاشت.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center space-y-2">
                <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">۲۰+ سال</div>
                <div className="text-xs font-bold text-slate-800">تست خستگی ISO 14801</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  تحمل ۵ میلیون دور جویدن مداوم تحت زاویه انحراف ۳۰ درجه.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. INTERACTIVE ESTIMATION TOOL (Matching Slider on Page 1) */}
      {/* ------------------------------------------------------------- */}
      <section id="simulator" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                شبیه‌ساز آنلاین ارزیابی بالینی
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                تخمین هوشمند شرایط و طول دوره درمان شما
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                با تنظیم تعداد دندان‌ها، شاخص بازیابی توان جویدن و مدت دوره کاشت را تخمین بزنید:
              </p>
            </div>

            {/* Slider Control */}
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                <span>تعداد دندان‌های نیازمند کاشت:</span>
                <span className="font-mono text-2xl font-black text-teal-700 bg-teal-50 px-4 py-1 rounded-xl border border-teal-200">
                  {faNum(teethCount)} دندان
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="14"
                value={teethCount}
                onChange={(e) => setTeethCount(Number(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>۱ دندان تکی</span>
                <span>فک کامل (All-on-4 / All-on-6)</span>
              </div>
            </div>

            {/* Dynamic Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
                <span className="text-[11px] text-slate-500 font-medium block">
                  بازیابی توان جویدن غذا
                </span>
                <span className="text-2xl font-black text-teal-700 font-mono">
                  {faNum(chewingRestoration)}٪
                </span>
                <span className="text-[10px] text-slate-400 block">معادل دندان طبیعی</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
                <span className="text-[11px] text-slate-500 font-medium block">
                  تخمین طول دوره جوش‌خوردن
                </span>
                <span className="text-lg font-black text-slate-800 block">
                  {estimatedWeeks}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">با سطوح هایدروفیلیک</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center space-y-1">
                <span className="text-[11px] text-slate-500 font-medium block">
                  تعداد جلسات جراحی و قالب‌گیری
                </span>
                <span className="text-lg font-black text-slate-800 block">
                  {estimatedSessions}
                </span>
                <span className="text-[10px] text-slate-400 block">بدون درد و بی‌هوشی سبک</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleOpenModal}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/25 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>رزرو مشاوره رایگان بر اساس این تخمین</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. PATIENT REVIEWS (Matching Bottom of Page 1) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              کاربران از مسیر درمان می‌گویند
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              تجربه‌های واقعی کسانی که کاشت دندان را با استعلام اصالت دنتال‌مپ پشت سر گذاشته‌اند:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Review 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">۳ هفته پیش</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  «برای دندان آسیاب عقب ایمپلنت اشترومن انتخاب کردم. بارکد روی پوکه رو اسکن کردم و مشخصات کامل با سوئیس تطبیق داشت. بعد از دو ماه روکش گذاشتم و الان عین دندان خودم غذا می‌خورم.»
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">مریم رضایی</span>
                <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-mono font-bold">
                  اشترومن سوئیس
                </span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">۱ ماه پیش</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  «پاسپورت ۳۲ دندان که دادن فوق‌العاده بود. تمام جزئیات از برند فیکسچر تا تورک اتصال ۳۵ نیوتن دقیقاً ثبت شده. جراحی بدون هیچ درد و خونریزی انجام شد.»
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">مهندس علیرضا س.</span>
                <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-mono font-bold">
                  ناکسیس آلمان
                </span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">۲ ماه پیش</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  «اولین بار بود که دندانپزشک پوکه پلمپ ایمپلنت رو جلوی چشمم باز کرد و گفت کُدش رو تو دنتال‌مپ استعلام بگیرم. این شفافیت بالاترین ارزش رو برام داشت.»
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">سید رضا حسینی</span>
                <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-mono font-bold">
                  دنتیوم کره
                </span>
              </div>
            </div>

            {/* Review 4 */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">۳ ماه پیش</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  «سه تا دندان جلو رو با هدایت جراحی دیجیتال ایمپلنت کردم. لبخندم کاملاً طبیعی شده و حتی متوجه تفاوتش با دندان‌های کناری نمیشید.»
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">سمیرا کمالی</span>
                <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-mono font-bold">
                  مگاژن AnyRidge
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. STEP-BY-STEP PROCESS (Matching Top of Page 2) */}
      {/* ------------------------------------------------------------- */}
      <section id="process" className="py-16 bg-gradient-to-b from-teal-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              درمان چطور شروع می‌شود؟
            </h2>
            <p className="text-xs sm:text-sm text-teal-200/80">
              در کلینیک‌های طرف قرارداد دنتال‌مپ، درمان تنها پس از تجویز دقیق و احراز اصالت انجام می‌شود:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-right space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white font-mono font-black text-base flex items-center justify-center shadow-lg">
                ۱
              </div>
              <h3 className="font-black text-base text-white">
                ارزیابی اولیه و تست رایگان
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                پاسخ به سوالات کوتاه بالینی و بررسی شرایط فک و تراکم استخوان توسط سامانه هوشمند.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-right space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white font-mono font-black text-base flex items-center justify-center shadow-lg">
                ۲
              </div>
              <h3 className="font-black text-base text-white">
                ویزیت و معاینه جراح
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                معاینه حضوری توسط متخصص جراحی فک و صورت و تعیین دقیق سایز فیکسچر و زاویه کاشت.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-right space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-white font-mono font-black text-base flex items-center justify-center shadow-lg">
                ۳
              </div>
              <h3 className="font-black text-base text-white">
                صدور پاسپورت و کاشت قطعه
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                جراحی کاشت با گشتاور کالیبره‌شده، ثبت بارکد پوکه استریل و صدور رسمی پاسپورت ۳۲ دندان.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-right space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-400 text-slate-900 font-mono font-black text-base flex items-center justify-center shadow-lg">
                ۴
              </div>
              <h3 className="font-black text-base text-white">
                نصب روکش و وارانتی دائمی
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                قالب‌گیری دیجیتال، تحویل روکش تمام‌سرامیک زیرکونیا و پوشش گارانتی معتبر قطعات.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. COMPARISON OF METHODS (Matching Middle of Page 2) */}
      {/* ------------------------------------------------------------- */}
      <section id="comparison" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              چرا روش‌های سنتی و ایمپلنت ارزان به‌تنهایی کافی نیستند؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              کیفیت درمان به اصالت قطعات و پایداری بیومکانیکی مورس تیپر بستگی دارد:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Method 1: Dentures */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-right space-y-4">
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">دست دندان متحرک</span>
                <span className="text-2xl font-black text-slate-700 font-mono">۱۵٪</span>
                <span className="text-[11px] text-slate-400 block">احتمال رضایت پایدار</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="font-bold text-slate-800">چالش‌های این روش:</div>
                <div className="flex items-start gap-2 text-rose-700">
                  <X className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>تحلیل دائمی و غیرقابل بازگشت استخوان فک</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <X className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>لقی هنگام تکلم و غذا خوردن</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <X className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>کاهش چشمگیر توان گاز زدن مواد غذایی سفت</span>
                </div>
              </div>
            </div>

            {/* Method 2: Cheap Fake Implants */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-right space-y-4">
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">ایمپلنت ارزان بدون شناسنامه</span>
                <span className="text-2xl font-black text-amber-600 font-mono">۳۵٪</span>
                <span className="text-[11px] text-slate-400 block">احتمال موفقیت ۵ ساله</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="font-bold text-slate-800">چالش‌های این روش:</div>
                <div className="flex items-start gap-2 text-rose-700">
                  <X className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>ایجاد میکروگپ و نفوذ باکتری‌ها (بوی بد دهان)</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <X className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>خطر شکستن پیچ اباتمنت و لقی روکش</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <X className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>عدم دسترسی به قطعات یدکی در ۱۰ سال آینده</span>
                </div>
              </div>
            </div>

            {/* Method 3: Dental Map Certified Implants (Highlighted Blue/Teal) */}
            <div className="bg-gradient-to-b from-teal-700 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border-2 border-teal-400 shadow-2xl text-right space-y-4 relative">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                پیشنهاد استاندارد بالینی
              </div>
              <div className="text-center pb-4 border-b border-teal-600/50">
                <span className="text-xs font-bold text-teal-200 block mb-1">کاشت اصیل با پاسپورت دنتال‌مپ</span>
                <span className="text-3xl font-black text-white font-mono">تا ۹۹٪</span>
                <span className="text-[11px] text-teal-200 block">احتمال موفقیت دائمی</span>
              </div>
              <div className="space-y-2.5 text-xs text-teal-100">
                <div className="font-bold text-white">چرا احتمال موفقیت بالاست؟</div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>اتصال مورس تیپر کاملاً نفوذناپذیر و حذف میکروگپ</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>تحویل کد LOT و بارکد رسمی کارخانه به بیمار</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>گارانتی بین‌المللی و تضمین قطعات یدکی تا ۲۰ سال آینده</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>جراحی توسط متخصصین دارای تاییدیه سازمان نظام پزشکی</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. CLINICAL BENEFITS (Matching Bottom of Page 2) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ایمپلنت اصیل، درمانی فراتر از پر کردن جای دندان
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              کاشت اصیل ایمپلنت با تحریک بیومکانیکی استخوان، سلامت و جوانی فک شما را بازیابی می‌کند:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">حفظ استخوان و فرم صورت</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                انتقال نیرو به استخوان فک مانع از فرورفتگی گونه‌ها و پیری زودرس چهره می‌شود.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">قدرت جویدن ۱۰۰٪</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                غذا خوردن لذت‌بخش و هضم کامل خوراکی‌ها بدون ترس از لقی یا شکستن دندان.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">حفظ دندان‌های سالم مجاور</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                برخلاف بریج‌های قدیمی، هیچ نیازی به تراشیدن مینای دندان‌های سالم کناری نیست.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">طول عمر مادام‌العمر</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                با رعایت بهداشت و داشتن پاسپورت رسمی، این دندان تا پایان عمر همراه شماست.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 10. TWO-WAY COMPARISON (Matching Top of Page 3) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              دنتال‌مپ؛ مسیر امن و استاندارد کاشت ایمپلنت
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              مقایسه شفاف درمان در مراکز بدون استعلام با کلینیک‌های متعهد به پاسپورت دنتال‌مپ:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Non-verified clinics */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200/80 text-right space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-rose-100 text-rose-800">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-black text-base">کاشت در مراکز متفرقه و بدون استعلام</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center gap-2 text-rose-800">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>عدم تحویل پوکه پلمپ و شماره لات به بیمار</span>
                </li>
                <li className="flex items-center gap-2 text-rose-800">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>احتمال استفاده از قطعات پروتزی فیک یا کپی</span>
                </li>
                <li className="flex items-center gap-2 text-rose-800">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>عدم ثبت پرونده رسمی در فدراسیون دندانپزشکی FDI</span>
                </li>
                <li className="flex items-center gap-2 text-rose-800">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>قطع ارتباط کلینیک با بیمار در صورت بروز عوارض</span>
                </li>
              </ul>
              <div className="pt-2 text-center text-rose-600 font-bold text-xs">
                ⚠️ مسیر پرریسک و بدون گارانتی
              </div>
            </div>

            {/* DentalMap Verified Clinics */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-teal-500 text-right space-y-4 shadow-xl relative">
              <div className="flex items-center gap-2 pb-3 border-b border-teal-100 text-teal-900">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-base">درمان زیر نظر متخصصین دنتال‌مپ</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>صدور شناسنامه رسمی ۳۲ دندان با کد QR استعلام</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>استعلام ۱۰۰٪ آنلاین کد رفرنس و بارکد روی جعبه</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>جراحان دارای تاییدیه احراز صلاحیت نظام پزشکی</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>پیگیری مستمر روند درمان و پشتیبانی سلامت</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={handleOpenModal}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  رزرو مشاوره در این مسیر امن
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 11. FAQ ACCORDION (Matching Middle of Page 3) */}
      {/* ------------------------------------------------------------- */}
      <section id="faq" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              پرسش‌های پرتکرار بیماران
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              پاسخ به متداول‌ترین سوالات درباره کاشت ایمپلنت و استعلام اصالت:
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-50/70 hover:bg-slate-50 cursor-pointer"
                  >
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 12. BOTTOM HIGH-CONVERTING CTA BANNER (Matching Page 3) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                آماده‌ی شروع مسیر درمان هستید؟
              </h2>
              <p className="text-xs sm:text-sm text-teal-200/90 leading-relaxed">
                اولین قدم یک مشاوره رایگان با جراح فوق‌تخصص و ارزیابی شرایط استخوان فک است.
              </p>
            </div>

            <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleOpenModal}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>رزرو مشاوره رایگان</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/quiz')}
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-colors"
              >
                شروع آزمون کامل بالینی
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 13. MINIMAL FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-white border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">دنتال‌مپ</span>
            <span>•</span>
            <span>پلتفرم مرجع شفافیت و اصالت ایمپلنتولوژی کشور</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/page/about-us" className="hover:text-teal-700">
              درباره ما
            </Link>
            <Link to="/page/terms" className="hover:text-teal-700">
              قوانین و تعهدات
            </Link>
            <Link to="/page/contact" className="hover:text-teal-700">
              تماس با ما
            </Link>
          </div>

          <div className="text-[11px] text-slate-400">
            © ۱۴۰۳ دنتال‌مپ. تمامی حقوق برای بیماران و جامعه دندانپزشکی محفوظ است.
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* 14. BOOKING & SMS VERIFICATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {step === 'info' && (
              <form onSubmit={handleRequestOtp} className="space-y-5 text-right">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    مشاوره تخصصی رایگان
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    درخواست نوبت و استعلام اصالت
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    جهت تایید نوبت با جراح متخصص و ارسال پیامک هماهنگی، اطلاعات خود را وارد فرمایید:
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      نام و نام‌خانوادگی:
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: علی احمدی"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      شماره تلفن همراه (جهت پیامک تایید):
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="09123456789"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
                      required
                    />
                  </div>
                </div>

                {modalError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{modalError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSendingOtp ? 'در حال ارسال پیامک…' : 'ارسال کد تایید پیامکی'}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5 text-right">
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-slate-900">
                    اعتبارسنجی شماره همراه
                  </h3>
                  <p className="text-xs text-slate-500">
                    کد تایید ۵ رقمی به شماره <span className="font-mono font-bold text-slate-800 dir-ltr inline-block">{mobileNumber}</span> ارسال شد:
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    dir="ltr"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="• • • • •"
                    className="w-full text-center bg-slate-50 border-2 border-teal-500 rounded-xl py-3 text-2xl font-mono font-bold tracking-widest text-slate-900 outline-none"
                    autoFocus
                  />
                  {demoOtpHint && (
                    <span className="text-[10px] text-slate-400 block text-center mt-1">
                      کد تستی ارسالی: <strong className="text-teal-700 font-mono">{demoOtpHint}</strong>
                    </span>
                  )}
                </div>

                {modalError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{modalError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || otpCode.trim().length < 4}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'در حال تایید…' : 'تایید و ثبت نهایی درخواست مشاوره'}
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  درخواست شما با موفقیت ثبت شد ✓
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {fullName} گرامی، اطلاعات و نوبت مشاوره شما در سامانه ثبت گردید. پیامک تایید برای شماره شما ارسال شد و کارشناس کلینیک جهت هماهنگی با شما تماس خواهد گرفت.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  متوجه شدم، بستن
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
