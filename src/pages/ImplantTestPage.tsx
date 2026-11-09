import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  Copy,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  Shield,
  HelpCircle,
  Stethoscope,
  Share2,
  AlertTriangle,
  Info,
  Send,
  Phone,
  Smartphone,
  KeyRound,
  ShieldCheck,
  Timer,
  Edit3,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmsService, normalizeIranMobile, isValidIranMobile } from '../utils/smsService';

const faNum = (n: number | string) =>
  String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

interface QuestionOption {
  e: string;
  t: string;
  pts: number;
  fb: string;
  badge?: string;
}

interface Question {
  cat: string;
  icon: string;
  level: string;
  q: string;
  opts: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    cat: 'اولویت تو',
    icon: '🎯',
    level: 'سطح آسان',
    q: 'مهم‌ترین چیز برات چیه؟',
    opts: [
      { e: '💰', t: 'کمترین قیمت ممکن', pts: 10, fb: 'اوکی، اولویت بودجه‌ای‌ات ثبت شد.' },
      { e: '⚖️', t: 'تعادل خوب قیمت و کیفیت', pts: 20, fb: 'هوشمندانه‌ست! تعادل همیشه جذاب‌ه.' },
      { e: '🛡️', t: 'بالاترین اطمینان بلندمدت و شواهد علمی', pts: 30, fb: 'آفرین! نگاهت به آینده‌ست.' }
    ]
  },
  {
    cat: 'شواهد علمی',
    icon: '🔬',
    level: 'سطح متوسط',
    q: 'چقدر برات مهمه که برند، مطالعات ۱۰ ساله و بیشتر داشته باشه؟',
    opts: [
      { e: '🤷', t: 'زیاد مهم نیست', pts: 10, fb: 'ثبت شد؛ ولی یادت باشه ایمپلنت همراه چند ده‌ساله‌ته.' },
      { e: '🧐', t: 'نسبتاً مهمه', pts: 20, fb: 'منطقیه! کم‌کم داری حرفه‌ای فکر می‌کنی.' },
      { e: '📊', t: 'خیلی مهمه؛ عدد واقعی می‌خوام', pts: 30, fb: 'دقیقاً همین نگاه درسته!', badge: 'agah' }
    ]
  },
  {
    cat: 'آینده و قطعات',
    icon: '🔩',
    level: 'سطح متوسط',
    q: 'اگه ۱۰ تا ۱۵ سال دیگه به قطعه یدکی نیاز پیدا کنی، چقدر مهمه که راحت پیدا بشه؟',
    opts: [
      { e: '😌', t: 'مهم نیست', pts: 10, fb: 'ثبت شد.' },
      { e: '🤔', t: 'نسبتاً مهمه', pts: 20, fb: 'خوبه؛ نیم‌نگاهی به آینده داری.' },
      { e: '🔭', t: 'خیلی مهمه؛ نمی‌خوام بعداً گیر کنم', pts: 30, fb: 'بلندمدت‌نگر واقعی!', badge: 'long' }
    ]
  },
  {
    cat: 'شرایط بالینی',
    icon: '🦴',
    level: 'سطح تخصصی',
    q: 'بر اساس نظر دندانپزشکت، وضعیت استخوان فک بیشتر شبیه کدومه؟',
    opts: [
      { e: '👍', t: 'استخوان خوب و مورد نسبتاً ساده', pts: 10, fb: 'عالی! دستت برای انتخاب بازتره.' },
      { e: '🌤️', t: 'استخوان متوسط یا احتمال پیوند پودر استخوان', pts: 20, fb: 'مهمه؛ توی نتیجه لحاظش می‌کنیم.' },
      { e: '⚠️', t: 'استخوان ضعیف، ناحیه زیبایی قدامی یا مورد پیچیده', pts: 30, fb: 'حساسه؛ پیشنهادمون دقیق‌تر می‌شه.' }
    ]
  },
  {
    cat: 'شفافیت و مستندات',
    icon: '📝',
    level: 'سطح حرفه‌ای',
    q: 'دوست داری اسم دقیق برند، مدل و شماره شناسنامه (LOT) فیکسچر رو مکتوب تحویل بگیری؟',
    opts: [
      { e: '🙃', t: 'خیلی لازم نیست', pts: 10, fb: 'اختیار با توئه؛ ولی پیشنهاد دنتال‌مپ اینه حتماً بگیری.' },
      { e: '🙂', t: 'اگه بدن که چه بهتر', pts: 20, fb: 'خوبه؛ ولی مطالبه‌گر باش!' },
      { e: '✅', t: 'بله، حتماً؛ می‌خوام در پاسپورت دنتال‌مپ ثبت بشه', pts: 30, fb: 'کاملاً حرفه‌ای! ایمپلنتت شناسنامه‌دار می‌شه.', badge: 'exact' }
    ]
  }
];

const BADGE_INFO: Record<string, { n: string; e: string; d: string }> = {
  agah: { n: 'آگاه', e: '🔍', d: 'به شواهد علمی اهمیت می‌دی' },
  smart: { n: 'هوشمند', e: '⚖️', d: 'دنبال تعادل قیمت و کیفیتی' },
  long: { n: 'بلندمدت‌نگر', e: '🔭', d: 'آینده‌ی قطعات برات مهمه' },
  exact: { n: 'دقیق', e: '📝', d: 'مستندات مکتوب و LOT می‌خوای' },
  gold: { n: 'آینده‌نگر کامل', e: '🏆', d: 'بیشترین امتیاز ممکن' }
};

const PROFILES: Record<number, { e: string; t: string; body: string }> = {
  1: {
    e: '💰',
    t: 'تو آدم عملی و بودجه‌محوری!',
    body: 'برای شرایط ساده و وقتی اولویتت روی مهار هزینه‌ست، گزینه‌های اقتصادی و میان‌رده با سابقه قابل قبول (مانند برندهای معتبر کره‌ای) کاملاً پاسخگو هستند. شرط حیاتی اینه که برند، مدل و قطعات یدکی آن دارای نمایندگی فعال و ثبت‌شده در IMED باشد — نه صرفاً ادعای شفاهی.'
  },
  2: {
    e: '⚖️',
    t: 'تو دنبال تعادل هوشمندانه‌ای!',
    body: 'ترکیب سابقه علمی قابل قبول + قیمت منطقی برات اولویت داره. پیشنهاد می‌کنیم برندهای میان‌رده قوی بازار را با جدیت بررسی کنی و هم‌زمان نیم‌نگاهی هم به گزینه پریمیوم (سوئیسی) داشته باشی تا با مقایسه دقیق تصمیم نهایی را بگیری.'
  },
  3: {
    e: '🛡️',
    t: 'تو آدم دقیق و آینده‌نگری!',
    body: 'شواهد علمی بلندمدت، قطعات یدکی تا ۱۵ سال آینده و شناسنامه رسمی مکتوب برای تو بالاترین اولویت را دارند. در این صورت سراغ سیستم‌های پریمیوم جهانی با مطالعات ۲۰+ ساله (مانند اشترومن یا ناکسیس) برو و فاکتور اصلی‌ات تخصص جراح و اصالت قطعه باشد.'
  }
};

const CHECKS: Record<number, string[]> = {
  1: [
    'دقیقاً کدوم برند و مدل فیکسچر رو پیشنهاد می‌دید؟ (اسم کامل تجاری، نه فقط نام کشور)',
    'آیا این برند نمایندگی رسمی و فعال در ایران با کد ثبت IMED دارد؟',
    'قطعات یدکی آن (پیچ اباتمنت و آنالوگ) چند سال آینده هم به‌راحتی در دسترس خواهد بود؟',
    'هزینه اعلام شده شامل اباتمنت و روکش نهایی است یا مجزا محاسبه می‌شود؟',
    'در صورت شل شدن یا شکستن پیچ، فرایند تامین قطعه جایگزین به چه صورت است؟'
  ],
  2: [
    'آیا اسم دقیق برند، مدل و شماره سریال پوکه استریل (LOT Number) را مکتوب تحویل می‌دهید؟',
    'این سیستم ایمپلنت چه تعداد مطالعات کلینیکی بالای ۱۰ سال دارد؟',
    'با توجه به ضخامت استخوان من، ریسک این برند در مقایسه با اشترومن چقدر است؟',
    'آیا قطعات پروتزی سازگار با پلتفرم‌های مرسوم بازار ایران هستند؟',
    'خدمات گارانتی و وارانتی برند در صورت عدم جوش‌خوردن (Fail) چگونه است؟'
  ],
  3: [
    'آیا لیبل پوکه استریل جهت ثبت در پاسپورت سلامت دنتال‌مپ مکتوب ارائه می‌شود؟',
    'کدام تیپ سطحی فیکسچر (مثلاً SLActive یا Roxolid) برای تراکم استخوان من تجویز شده است؟',
    'آمار موفقیت ۱۰ تا ۲۰ ساله این برند در موارد مشابه بالینی من چه میزان است؟',
    'کانال زنجیره تامین رسمی قطعات یدکی اورجینال در ایران چیست؟',
    'پروتکل معاینه، چکاپ رادیوگرافی و نگهداری سالیانه به چه صورت برنامه‌ریزی می‌شود؟'
  ]
};

const TICKER = [
  'کشور ساخت ≠ تضمین کیفیت قطعه',
  'برند معتبر یعنی شواهد علمی ۱۰+ ساله',
  'دسترسی قطعه یدکی را از روز اول بپرسید',
  'شماره لات (LOT) = شناسنامه ایمپلنت شما',
  'نه به انتخاب چشم‌بسته ایمپلنت!',
  'ابتدا جراح متخصص، سپس برند معتبر',
  'سوئیسی یا کره‌ای؟ سوال اشتباه است! بپرسید: کدام مدل با چه سابقه بالینی؟',
  'اصالت قطعه را در دنتال‌مپ استعلام کنید'
];

export const ImplantTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [screen, setScreen] = useState<'intro' | 'quiz' | 'analyze' | 'verify' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [rawScore, setRawScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedOptFeedback, setSelectedOptFeedback] = useState<{ text: string; pts: number } | null>(null);
  const [analyzeMsgIndex, setAnalyzeMsgIndex] = useState(0);
  const [animScore, setAnimScore] = useState(0);
  const [demoActive, setDemoActive] = useState(false);

  // Mobile Verification & OTP States
  const [mobileInput, setMobileInput] = useState(() => SmsService.getVerifiedMobile() || '');
  const [otpInput, setOtpInput] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [verifiedMobile, setVerifiedMobile] = useState<string | null>(() => SmsService.getVerifiedMobile());
  const [otpError, setOtpError] = useState<string | null>(null);
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const demoTimersRef = useRef<NodeJS.Timeout[]>([]);

  // OTP Resend Countdown
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Sound generator
  const playBeep = (freq = 600, duration = 0.09) => {
    if (!soundOn) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported or blocked
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Start test
  const startQuiz = () => {
    setCurrentQ(0);
    setRawScore(0);
    setAnswers([null, null, null, null, null]);
    setEarnedBadges([]);
    setIsLocked(false);
    setSelectedOptFeedback(null);
    setScreen('quiz');
    playBeep(520, 0.12);
  };

  // Demo auto-runner
  const startDemo = (profileIdx: number) => {
    demoTimersRef.current.forEach(clearTimeout);
    demoTimersRef.current = [];
    setDemoActive(true);
    startQuiz();

    const presets = [
      [0, 1, 1, 0, 1], // Budget
      [1, 2, 2, 1, 2], // Balanced
      [2, 2, 2, 2, 2]  // Premium
    ];
    const sequence = presets[profileIdx] || presets[1];

    sequence.forEach((optIdx, qIndex) => {
      const timer = setTimeout(() => {
        handleSelectOption(optIdx, qIndex);
      }, 700 + qIndex * 1600);
      demoTimersRef.current.push(timer);
    });
  };

  const stopDemo = () => {
    demoTimersRef.current.forEach(clearTimeout);
    demoTimersRef.current = [];
    setDemoActive(false);
  };

  // Auto-start or run demo when navigated from Homepage or direct links
  useEffect(() => {
    const start = searchParams.get('start');
    const demo = searchParams.get('demo');
    if (start === 'true') {
      startQuiz();
    } else if (demo !== null) {
      const idx = parseInt(demo, 10);
      if (!isNaN(idx)) {
        startDemo(idx);
      }
    }
  }, [searchParams]);

  // Handle option selection
  const handleSelectOption = (optIdx: number, overrideQIndex?: number) => {
    const qIndex = overrideQIndex !== undefined ? overrideQIndex : currentQ;
    if (isLocked && overrideQIndex === undefined) return;

    setIsLocked(true);
    const q = QUESTIONS[qIndex];
    const opt = q.opts[optIdx];

    setAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex] = optIdx;
      return copy;
    });

    setRawScore((prev) => prev + opt.pts);
    playBeep(500 + optIdx * 80, 0.1);

    setSelectedOptFeedback({ text: opt.fb, pts: opt.pts });

    if (opt.badge && !earnedBadges.includes(opt.badge)) {
      setEarnedBadges((prev) => [...prev, opt.badge!]);
      showToast(`🏅 نشان «${BADGE_INFO[opt.badge]?.n}» باز شد!`);
    }

    setTimeout(() => {
      if (qIndex < QUESTIONS.length - 1) {
        setCurrentQ(qIndex + 1);
        setIsLocked(false);
        setSelectedOptFeedback(null);
      } else {
        finishQuiz();
      }
    }, 1200);
  };

  // Finish quiz and animate analyze screen
  const finishQuiz = () => {
    setDemoActive(false);
    setScreen('analyze');
    setAnalyzeMsgIndex(0);

    const msgs = [
      'در حال بررسی الگوی پاسخ‌ها…',
      'وزن‌دهی به شرایط استخوان فک…',
      'مقایسه شواهد بالینی و رجیستری قطعات…',
      'شمارش نشان‌ها و طراحی چک‌لیست مشاوره…'
    ];

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % msgs.length;
      setAnalyzeMsgIndex(step);
    }, 650);

    setTimeout(() => {
      clearInterval(interval);
      const savedMobile = SmsService.getVerifiedMobile();
      if (savedMobile) {
        setVerifiedMobile(savedMobile);
        setScreen('result');
      } else {
        setScreen('verify');
      }
    }, 2600);
  };

  // OTP Request Handler
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOtpError(null);
    const clean = normalizeIranMobile(mobileInput);
    if (!isValidIranMobile(clean)) {
      setOtpError('لطفاً شماره تلفن همراه ۱۱ رقمی معتبر (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await SmsService.sendOtp(clean, 'اعتبارسنجی کارنامه آزمون ایمپلنت');
      if (res.success) {
        setOtpStep('code');
        setOtpTimer(60);
        if (res.code) setDemoCodeHint(res.code);
        showToast('کد تایید ۵ رقمی پیامک شد ✓');
      } else {
        setOtpError(res.message);
      }
    } catch {
      setOtpError('خطا در ارسال پیامک. لطفاً اتصال اینترنت خود را بررسی نمایید.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // OTP Verification Handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setIsVerifyingOtp(true);

    try {
      const res = SmsService.verifyOtp(mobileInput, otpInput);
      if (res.success) {
        const clean = normalizeIranMobile(mobileInput);
        setVerifiedMobile(clean);
        showToast(res.message);
        playBeep(750, 0.18);

        // Record verified lead locally for CRM
        try {
          const profile = PROFILES[calculatedProfile];
          const lead = {
            mobile: clean,
            score: normScore,
            profile: profile?.t,
            createdAt: new Date().toISOString()
          };
          const existingLeads = JSON.parse(localStorage.getItem('dentalmap_verified_leads') || '[]');
          existingLeads.unshift(lead);
          localStorage.setItem('dentalmap_verified_leads', JSON.stringify(existingLeads.slice(0, 100)));
        } catch {
          // ignore
        }

        // Send full result notification SMS
        const profile = PROFILES[calculatedProfile];
        await SmsService.sendQuizResultNotification({
          mobile: clean,
          score: normScore,
          profileTitle: profile.t
        });

        // Trigger confetti celebration and open results
        setScreen('result');
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      } else {
        setOtpError(res.message);
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Profile and normalized score calculation
  const normScore = Math.min(100, Math.round(rawScore / 1.5));
  let calculatedProfile = normScore >= 85 ? 3 : normScore >= 55 ? 2 : 1;
  // If bone condition was critical (question 4 option 3), upgrade minimum to profile 2
  if (calculatedProfile === 1 && answers[3] === 2) {
    calculatedProfile = 2;
  }

  // Final badges logic
  const allEarned = [...earnedBadges];
  if (calculatedProfile >= 2 && !allEarned.includes('smart')) allEarned.push('smart');
  if (calculatedProfile === 3 && !allEarned.includes('gold')) allEarned.push('gold');

  // Animate score dial
  useEffect(() => {
    if (screen === 'result') {
      let val = 0;
      const step = Math.max(1, Math.round(normScore / 35));
      const t = setInterval(() => {
        val = Math.min(normScore, val + step);
        setAnimScore(val);
        if (val >= normScore) clearInterval(t);
      }, 25);
      return () => clearInterval(t);
    }
  }, [screen, normScore]);

  // Copy helpers
  const copyChecklist = () => {
    const list = CHECKS[calculatedProfile] || CHECKS[2];
    const text = `📋 چک‌لیست سوالات هوشمند از دندانپزشک (تولیدشده در دنتال‌مپ):\n` +
      list.map((c, i) => `${faNum(i + 1)}. ${c}`).join('\n') +
      `\n\nسامانه اصالت و دایرکتوری ایمپلنت دنتال‌مپ: https://dentalmap.ir`;
    navigator.clipboard.writeText(text);
    showToast('چک‌لیست سوالات در کلیپ‌بورد کپی شد ✓');
  };

  const copyFullResult = () => {
    const profile = PROFILES[calculatedProfile];
    const list = CHECKS[calculatedProfile] || CHECKS[2];
    const text = `🦷 نتیجه آزمون هوشمند انتخاب ایمپلنت (دنتال‌مپ)
امتیاز آگاهی: ${faNum(normScore)} از ۱۰۰
پروفایل کاربری: ${profile.t}
نشان‌های کسب‌شده: ${allEarned.map((id) => BADGE_INFO[id]?.n).filter(Boolean).join('، ') || 'عملیاتی'}

📋 سوالاتی که از دندانپزشکم می‌پرسم:
${list.map((c, i) => `${faNum(i + 1)}. ${c}`).join('\n')}

توجه: بهترین برند دنیا هم بدون جراح باتجربه و بهداشت دهان مناسب نتیجه مطلوب نمی‌دهد.
مشاهده دایرکتوری پزشکان و استعلام قطعه: https://dentalmap.ir`;
    navigator.clipboard.writeText(text);
    showToast('خلاصه نتیجه برای ارائه به دندانپزشک کپی شد ✓');
  };

  const [smsPhoneInput, setSmsPhoneInput] = useState('');
  const [isSendingSmsResult, setIsSendingSmsResult] = useState(false);
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);

  const handleSendSmsToMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsPhoneInput || smsPhoneInput.length < 10) {
      alert('لطفاً شماره تلفن همراه ۱۱ رقمی خود را وارد فرمایید.');
      return;
    }

    setIsSendingSmsResult(true);
    const profile = PROFILES[calculatedProfile];

    const res = await SmsService.sendQuizResultNotification({
      mobile: smsPhoneInput,
      score: normScore,
      profileTitle: profile.t
    });

    setIsSendingSmsResult(false);
    if (res.success) {
      setSmsSentSuccess(true);
      showToast('پیامک نتیجه و چک‌لیست برای شما ارسال شد ✓');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-100 text-slate-800 dir-rtl pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title="بازگشت به خانه"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">🦷</span>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">
                  بازی انتخاب هوشمند ایمپلنت
                </h1>
                <p className="text-[11px] text-slate-500">
                  راهنمای تصمیم‌گیری آگاهانه و چک‌لیست سوال از متخصص
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold font-mono">
              ⭐ {faNum(Math.round(rawScore / 1.5))} امتیاز
            </div>

            <button
              onClick={() => setSoundOn(!soundOn)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              title={soundOn ? 'بی‌صدا کردن افکت‌ها' : 'فعال‌سازی افکت‌های صوتی'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-teal-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Ticker Strip */}
        <div className="bg-slate-900 text-teal-300 text-[11px] py-1 px-4 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block font-medium">
            {TICKER.join(' &nbsp; • &nbsp; ')}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* ========================================================= */}
        {/* SCREEN 1: INTRO */}
        {/* ========================================================= */}
        {screen === 'intro' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-200">
                    <span>🎮 آزمون ۲ دقیقه‌ای</span>
                    <span>•</span>
                    <span>بدون نیاز به ثبت‌نام</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                    کدام برند ایمپلنت واقعاً <span className="text-teal-600">به‌دردِ شرایط تو</span> می‌خوره؟
                  </h2>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    خیلی‌ها فقط می‌گویند «سوئیسی» یا «کره‌ای»! اما کیفیت درمان به پارامترهای مهم‌تری بستگی دارد:
                    <strong> اصالت برند، سابقه مطالعات ۱۰ ساله، دسترسی به قطعات یدکی آینده</strong> و مهارت جراح.
                    در ۵ قدم کوتاه، سطح آگاهی‌ات را بسنج و با یک چک‌لیست حرفه‌ای به جلسه مشاوره برو.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-start gap-2.5">
                      <span className="text-xl">🏅</span>
                      <div>
                        <div className="font-bold text-xs text-slate-800">امتیاز و نشان</div>
                        <div className="text-[11px] text-slate-500">کسب نشان آینده‌نگری</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-start gap-2.5">
                      <span className="text-xl">🧭</span>
                      <div>
                        <div className="font-bold text-xs text-slate-800">پروفایل شخصی</div>
                        <div className="text-[11px] text-slate-500">براساس بودجه و استخوان</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-start gap-2.5">
                      <span className="text-xl">📋</span>
                      <div>
                        <div className="font-bold text-xs text-slate-800">چک‌لیست دندانپزشک</div>
                        <div className="text-[11px] text-slate-500">سوالات شفاف و مکتوب</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={startQuiz}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-2xl font-black text-base shadow-lg shadow-teal-600/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>شروع آزمون و بازی تشخیص هوشمند</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Visual Graphic */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  <div className="relative w-64 h-72 bg-gradient-to-b from-teal-50 to-slate-100 rounded-3xl border border-teal-200 p-6 flex flex-col items-center justify-between shadow-inner">
                    <div className="absolute top-4 right-4 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-teal-700 border border-teal-200">
                      آناتومی ایمپلنتولوژی
                    </div>

                    {/* SVG Graphic */}
                    <div className="w-full flex-1 flex items-center justify-center">
                      <svg viewBox="0 0 160 220" className="w-36 h-48 drop-shadow-md">
                        {/* Bone */}
                        <rect x="20" y="110" width="120" height="95" rx="20" fill="#fde68a" opacity="0.6" />
                        <text x="80" y="195" textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="bold">
                          بستر استخوانی فک
                        </text>
                        {/* Crown */}
                        <path
                          d="M55 45 C55 20, 105 20, 105 45 L102 75 L58 75 Z"
                          fill="#ffffff"
                          stroke="#0d9488"
                          strokeWidth="2.5"
                        />
                        <text x="80" y="55" textAnchor="middle" fontSize="10" fill="#0f766e" fontWeight="bold">
                          روکش
                        </text>
                        {/* Abutment */}
                        <polygon points="65,75 95,75 90,110 70,110" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
                        {/* Fixture */}
                        <rect x="72" y="110" width="16" height="65" rx="3" fill="#64748b" />
                        <line x1="68" y1="120" x2="92" y2="120" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="69" y1="133" x2="91" y2="133" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="70" y1="146" x2="90" y2="146" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="72" y1="159" x2="88" y2="159" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div className="w-full bg-white rounded-xl p-2 border border-slate-200 text-center">
                      <span className="text-xs font-bold text-slate-800 block">پاسپورت رسمی قطعه</span>
                      <span className="text-[10px] text-slate-500">استعلام کد LOT و برند در دنتال‌مپ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo auto scenarios for clinics */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 font-medium">
                  🎬 پیش‌نمایش سریع برای نمایش در مانیتور مطب:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startDemo(0)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    بیمار بودجه‌محور
                  </button>
                  <button
                    onClick={() => startDemo(1)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    بیمار تعادل‌گرا
                  </button>
                  <button
                    onClick={() => startDemo(2)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-medium transition-colors border border-teal-200 cursor-pointer"
                  >
                    بیمار دقیق و آینده‌نگر
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: ACTIVE QUIZ */}
        {/* ========================================================= */}
        {screen === 'quiz' && (
          <div className="space-y-6">
            {demoActive && (
              <div className="bg-amber-500 text-slate-900 px-4 py-2 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md">
                <span>🎬 حالت پخش خودکار سناریو فعال است…</span>
                <button
                  onClick={stopDemo}
                  className="bg-slate-900 text-white px-3 py-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  ادامه به‌صورت دستی
                </button>
              </div>
            )}

            {/* Stepper Progress */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-slate-700">
                  سوال {faNum(currentQ + 1)} از ۵
                </span>
                <span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full font-medium">
                  {QUESTIONS[currentQ].level}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${((currentQ + 1) / 5) * 100}%` }}
                />
              </div>

              {/* Step dots */}
              <div className="flex justify-between mt-3 px-1">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < currentQ
                        ? 'bg-teal-600 text-white'
                        : i === currentQ
                        ? 'bg-teal-100 text-teal-800 ring-2 ring-teal-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {i < currentQ ? '✓' : faNum(i + 1)}
                  </div>
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center gap-2 text-teal-700 text-xs font-bold">
                <span className="text-xl">{QUESTIONS[currentQ].icon}</span>
                <span>بخش {QUESTIONS[currentQ].cat}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {QUESTIONS[currentQ].q}
              </h2>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {QUESTIONS[currentQ].opts.map((opt, idx) => {
                  const isSelected = answers[currentQ] === idx;
                  const isFaded = answers[currentQ] !== null && !isSelected;

                  return (
                    <button
                      key={idx}
                      disabled={isLocked}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-right p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500/20 shadow-md'
                          : isFaded
                          ? 'opacity-40 border-slate-200 bg-slate-50'
                          : 'border-slate-200 hover:border-teal-500 hover:bg-slate-50/80 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                          {opt.e}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-800">
                          {opt.t}
                        </span>
                      </div>

                      <span className="text-xs font-mono font-bold bg-teal-100/70 text-teal-800 px-2.5 py-1 rounded-xl">
                        +{faNum(opt.pts)} امتیاز
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Feedback Banner */}
              {selectedOptFeedback && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-medium animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{selectedOptFeedback.text}</span>
                  </div>
                  <span className="font-bold text-emerald-700 font-mono">
                    +{faNum(selectedOptFeedback.pts)} امتیاز
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: ANALYZE SCANNER */}
        {/* ========================================================= */}
        {screen === 'analyze' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl text-center space-y-6 my-10">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-teal-200 animate-ping opacity-75" />
              <div className="w-20 h-20 bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl">
                <Stethoscope className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                در حال تنظیم پرونده و شبیه‌سازی هوشمند…
              </h2>
              <p className="text-sm text-teal-700 font-medium transition-opacity duration-300">
                {
                  [
                    'در حال بررسی الگوی پاسخ‌ها…',
                    'وزن‌دهی به شرایط استخوان فک…',
                    'مقایسه شواهد بالینی و رجیستری قطعات…',
                    'شمارش نشان‌ها و طراحی چک‌لیست مشاوره…'
                  ][analyzeMsgIndex]
                }
              </p>
            </div>

            <div className="flex justify-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3.5: SMS MOBILE NUMBER VERIFICATION GATE */}
        {/* ========================================================= */}
        {screen === 'verify' && (
          <div className="max-w-xl mx-auto my-8 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 space-y-7 relative overflow-hidden">
              {/* Background Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100/60 to-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-100/50 to-teal-100/30 rounded-full blur-2xl -z-10 pointer-events-none" />

              {/* Header Badge */}
              <div className="text-center space-y-3">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-600/30">
                    <ShieldCheck className="w-9 h-9" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-sm ring-2 ring-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-bold text-teal-800">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  <span>پاسخ‌های شما آنالیز شدند (شاخص آگاهی: {faNum(normScore)} از ۱۰۰)</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  اعتبارسنجی پیامکی شماره همراه
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  جهت ثبت رسمی کارنامه در سامانه دنتال‌مپ و ارسال آنی پیامک چک‌لیست سوالات مشاوره با جراح، شماره همراه خود را تایید فرمایید.
                </p>
              </div>

              {/* OTP Step 1: Request OTP Code */}
              {otpStep === 'phone' && (
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-teal-600" />
                        <span>شماره تلفن همراه شما:</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">ارسال کد یکبار مصرف ۵ رقمی</span>
                    </label>

                    <div className="relative">
                      <input
                        type="tel"
                        dir="ltr"
                        value={mobileInput}
                        onChange={(e) => {
                          setMobileInput(e.target.value);
                          if (otpError) setOtpError(null);
                        }}
                        placeholder="09123456789"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white rounded-2xl px-4 py-3.5 pl-12 text-sm sm:text-base font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                        autoFocus
                      />
                      <div className="absolute left-3.5 top-3.5 text-slate-400 flex items-center gap-1 text-xs font-mono">
                        <Phone className="w-4 h-4 text-teal-600" />
                      </div>
                    </div>
                  </div>

                  {otpError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingOtp || !mobileInput.trim()}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSendingOtp ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>در حال ارسال پیامک تایید…</span>
                      </span>
                    ) : (
                      <>
                        <span>ارسال کد اعتبارسنجی پیامکی</span>
                        <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-500 text-center leading-relaxed">
                    🔒 حریم خصوصی محفوظ است. شماره شما تنها برای ارسال نسخه کارنامه بالینی و اعتبارسنجی قطعات استعلام‌شده استفاده می‌شود.
                  </div>
                </form>
              )}

              {/* OTP Step 2: Enter Verification Code */}
              {otpStep === 'code' && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-teal-900">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>
                        کد تایید ۵ رقمی به شماره <span className="font-mono font-bold text-teal-950 dir-ltr inline-block">{mobileInput}</span> پیامک شد.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep('phone');
                        setOtpError(null);
                      }}
                      className="text-[11px] text-teal-700 hover:text-teal-900 font-bold underline flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>ویرایش شماره</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-teal-600" />
                        <span>کد تایید پیامک شده را وارد کنید:</span>
                      </span>
                      {otpTimer > 0 ? (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          <Timer className="w-3.5 h-3.5 text-teal-600" />
                          <span>ارسال مجدد تا {faNum(otpTimer)} ثانیه دیگر</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRequestOtp()}
                          className="text-[11px] text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer"
                        >
                          ارسال مجدد کد پیامکی
                        </button>
                      )}
                    </label>

                    <input
                      type="text"
                      dir="ltr"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => {
                        setOtpInput(e.target.value);
                        if (otpError) setOtpError(null);
                      }}
                      placeholder="• • • • •"
                      className="w-full text-center bg-slate-50 border-2 border-slate-300 focus:border-teal-500 focus:bg-white rounded-2xl py-3.5 text-2xl font-mono font-black tracking-widest text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                      autoFocus
                    />
                  </div>

                  {demoCodeHint && (
                    <div className="text-[10px] text-slate-500 bg-slate-100 p-2.5 rounded-xl text-center font-mono">
                      کد تایید ارسال شده جهت تست: <span className="font-bold text-teal-700">{demoCodeHint}</span>
                    </div>
                  )}

                  {otpError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpInput.trim().length < 4}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isVerifyingOtp ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>در حال اعتبارسنجی شماره…</span>
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-emerald-200" />
                        <span>تایید شماره و مشاهده کارنامه تخصصی</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: RESULTS & DOCTOR CHECKLIST */}
        {/* ========================================================= */}
        {screen === 'result' && (
          <div className="space-y-6">
            {/* Verified Mobile Number Banner */}
            {verifiedMobile && (
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-200">هویت بالینی تایید شد:</span>
                      <span className="font-mono font-black text-sm dir-ltr tracking-wider">{verifiedMobile}</span>
                    </div>
                    <p className="text-xs text-white/90 mt-0.5">
                      پیامک کارنامه و چک‌لیست مشاوره‌ای با موفقیت برای این شماره ارسال شد ✓
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-white/20 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>شماره معتبر</span>
                  </span>
                </div>
              </div>
            )}
            {/* Header Score Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Dial Score Gauge */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="text-slate-100"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#gradientDial)"
                      strokeWidth="10"
                      strokeDasharray={314.15}
                      strokeDashoffset={314.15 * (1 - animScore / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradientDial" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0d9488" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {faNum(animScore)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">از ۱۰۰</span>
                  </div>
                </div>

                {/* Profile Overview */}
                <div className="flex-1 text-center sm:text-right space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                    <span>پروفایل {faNum(calculatedProfile)} از ۳</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                    <span>{PROFILES[calculatedProfile].e}</span>
                    <span>{PROFILES[calculatedProfile].t}</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {PROFILES[calculatedProfile].body}
                  </p>

                  {/* Badges List */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                    {Object.entries(BADGE_INFO).map(([badgeKey, b]) => {
                      const hasEarned = allEarned.includes(badgeKey);
                      return (
                        <div
                          key={badgeKey}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            hasEarned
                              ? badgeKey === 'gold'
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                                : 'bg-teal-50 text-teal-800 border border-teal-200'
                              : 'bg-slate-100 text-slate-400 opacity-40 grayscale'
                          }`}
                        >
                          <span>{hasEarned ? b.e : '🔒'}</span>
                          <span>{b.n}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Special Clinical Bone Note */}
              {answers[3] === 2 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>هشدار مهم شرایط بالینی استخوان:</strong> به دلیل اعلام وضعیت استخوان ضعیف یا نیاز به پیوند در ناحیه قدامی، پیشنهاد می‌شود حتماً از جراح بخواهید فیکسچرهایی با سطح آب‌دوست فعال (Hydrophilic) و درصد موفقیت بالا در استخوان‌های D3 و D4 تجویز نماید.
                  </div>
                </div>
              )}
            </div>

            {/* Smart 3-Rule Compass */}
            <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧭</span>
                <h3 className="text-base sm:text-lg font-bold">
                  قطب‌نمای دنتال‌مپ: به جای کشور ساخت، این ۳ سوال اصلی را بپرسید:
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="font-bold text-teal-300">۱. نام دقیق تجاری و مدل فیکسچر</div>
                  <div className="text-slate-300 text-xs">
                    نگویید «سوئیسی است یا کره‌ای؟» بپرسید: نام دقیق برند چیست و چه کاتالوگی دارد؟
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="font-bold text-amber-300">۲. سابقه بالینی و مطالعات ۱۰ ساله</div>
                  <div className="text-slate-300 text-xs">
                    آیا داده‌های مستند بلندمدت از موفقیت این سیستم در مراکز دانشگاهی وجود دارد؟
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="font-bold text-emerald-300">۳. دسترسی به قطعات یدکی تا ۱۵ سال بعد</div>
                  <div className="text-slate-300 text-xs">
                    اگر در سفر یا ۱۰ سال دیگر اباتمنت شل شد، آیا قطعه در بازار ایران فوراً یافت می‌شود؟
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Brands Comparison Matrix */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>مقایسه اجمالی برندهای پیشنهادی برای این پروفایل</span>
                </h3>
                <span className="text-xs text-slate-500">منطبق بر داده‌های دنتال‌مپ</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">برند تجاری</th>
                      <th className="p-3">کشور</th>
                      <th className="p-3">رده بازار</th>
                      <th className="p-3">شواهد بالینی بلندمدت</th>
                      <th className="p-3">دسترسی قطعات در ایران</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span>🏆</span>
                        <span>اشترومن (Straumann)</span>
                      </td>
                      <td className="p-3">سوئیس 🇨🇭</td>
                      <td className="p-3 text-amber-700 font-bold">پریمیوم جهانی</td>
                      <td className="p-3 text-emerald-700 font-medium">بسیار قوی (مطالعات ۲۵+ ساله)</td>
                      <td className="p-3 text-emerald-700 font-medium">عالی (نمایندگی رسمی)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span>🇩🇪</span>
                        <span>ناکسیس (Naxis)</span>
                      </td>
                      <td className="p-3">آلمان 🇩🇪</td>
                      <td className="p-3 text-teal-700 font-bold">مهندسی دقیق اروپایی</td>
                      <td className="p-3 text-teal-700 font-medium">قوی (تایتانیوم گرید ۴)</td>
                      <td className="p-3 text-emerald-700 font-medium">پشتیبانی کامل در کشور</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <span>⚖️</span>
                        <span>اوستم / بیوتک (Osstem / Biotech)</span>
                      </td>
                      <td className="p-3">کره جنوبی / فرانسه</td>
                      <td className="p-3 text-slate-700 font-bold">میان‌رده اقتصادی و استاندارد</td>
                      <td className="p-3 text-slate-600">خوب و میان‌مدت</td>
                      <td className="p-3 text-teal-700 font-medium">در دسترس در اکثر شهرها</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-2">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  نکته: جدول فوق صرفاً جنبه آموزشی دارد. بررسی دقیق ابعاد استخوان و فیکسچر متناسب با آن بر عهده جراح متخصص است.
                </span>
              </p>
            </div>

            {/* Checklist for Dentist Consultation */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    چک‌لیست سوالات هوشمند از دندانپزشک (دست‌پر بروید)
                  </h3>
                </div>

                <button
                  onClick={copyChecklist}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold border border-teal-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>کپی چک‌لیست سوالات</span>
                </button>
              </div>

              <div className="space-y-3">
                {(CHECKS[calculatedProfile] || CHECKS[2]).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 flex items-start gap-3 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5">
                      {faNum(idx + 1)}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SMS Delivery Card */}
            <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      ارسال چک‌لیست و خلاصه کارنامه به موبایل شما (پیامک رایگان)
                    </h4>
                    <p className="text-xs text-teal-200/80 mt-0.5">
                      شماره خود را وارد کنید تا سوالات جلسه مشاوره با دندانپزشک فوراً برایتان پیامک شود.
                    </p>
                  </div>
                </div>
              </div>

              {smsSentSuccess ? (
                <div className="p-4 bg-teal-800/50 border border-teal-400/40 rounded-2xl text-xs sm:text-sm text-teal-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>پیامک کارنامه با موفقیت برای شماره {smsPhoneInput} ارسال شد. در مطب همراه داشته باشید!</span>
                </div>
              ) : (
                <form onSubmit={handleSendSmsToMe} className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={smsPhoneInput}
                      onChange={(e) => setSmsPhoneInput(e.target.value)}
                      placeholder="0912*******"
                      dir="ltr"
                      className="w-full bg-slate-900/80 border border-teal-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-teal-300/40 font-mono focus:outline-none focus:border-teal-400"
                      required
                    />
                    <Phone className="w-4 h-4 text-teal-400 absolute right-3 top-3" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingSmsResult}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSendingSmsResult ? (
                      <span>در حال ارسال پیامک…</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>ارسال پیامک چک‌لیست</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Final Action Buttons */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-center sm:text-right">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-teal-400" />
                    <span>مرحله بعد: جستجوی متخصص و کلینیک‌های معتبر</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    نتایج را در دست بگیرید و کارنامه پزشکان فوق‌تخصص ایمپلنت دنتال‌مپ را بررسی کنید.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={copyFullResult}
                    className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>کپی کل کارنامه برای دکتر</span>
                  </button>

                  <button
                    onClick={startQuiz}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>شروع مجدد آزمون</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span>یادآوری: این آزمون صرفاً جهت شفافیت و توانمندسازی آگاهانه بیمار طراحی شده است.</span>
                <button
                  onClick={() => navigate('/passport')}
                  className="text-teal-400 hover:text-teal-300 underline font-medium cursor-pointer"
                >
                  ثبت قطعات در پاسپورت ۳۲ دندان دنتال‌مپ ←
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
