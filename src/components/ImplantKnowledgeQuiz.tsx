import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const ImplantKnowledgeQuiz: React.FC = () => {
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: 'مزیت بیومکانیکی کلیدی اتصال مخروطی مورس تیپر (Morse Taper) نسبت به اتصالات فلت هگز چیست؟',
      options: [
        'کاهش هزینه‌های ساخت در کارخانه',
        'حذف میکروگپ (Micro-gap) و قفل اصطکاکی نفوذناپذیر جهت جلوگیری از پری‌ایمپلنتیت',
        'نیاز به تورک بستن کمتر از ۱۰ نیوتن',
        'امکان شل شدن آسان پیچ پروتز توسط بیمار'
      ],
      correctIndex: 1,
      explanation: 'اتصال مورس تیپر با زاویه مخروطی باریک (مانند ۱۱ یا ۱۵ درجه) قفل فیزیکی سرد ایجاد کرده و نشت باکتری به داخل محفظه فیکسچر را مسدود می‌کند.'
    },
    {
      id: 2,
      question: 'در استخوان‌های بسیار متراکم نوع D1، به چه دلیل باید از رزوه‌تراش استخوان (Bone Tap) استفاده شود؟',
      options: [
        'برای گشاد کردن بیش از حد حفره',
        'برای افزایش خونریزی موضعی',
        'برای پیشگیری از ایجاد فشار بیش از ۴۵ Ncm و جلوگیری از نکروز ایسکمیک استخوان',
        'جهت تسریع دوره کشیدن دندان'
      ],
      correctIndex: 2,
      explanation: 'استخوان D1 بدون رگ‌های فراوان است و فشار مکانیکی بیش از حد منجر به مردگی سلول‌های استئوبلاست و رد پیوند فیکسچر می‌شود.'
    },
    {
      id: 3,
      question: 'آلیاژ انحصاری Roxolid در ایمپلنت‌های پیشرفته اشترومن سوئیس از ترکیب چه موادی ساخته شده است؟',
      options: [
        '۱۰۰٪ طلای ۲۴ عیار پزشکی',
        '۸۵٪ تیتانیوم خالص و ۱۵٪ زیرکونیوم با مقاومت کششی بالا',
        'تیتانیوم گرید ۲ با پوشش نقره',
        'فولاد ضد زنگ ارتوپدی'
      ],
      correctIndex: 1,
      explanation: 'راکسولید با افزودن ۱۵٪ زیرکونیوم به تیتانیوم، مقاومت مکانیکی را تا ۳۵٪ افزایش داده و امکان استفاده از فیکسچرهای باریک‌تر را فراهم می‌آورد.'
    },
    {
      id: 4,
      question: 'کاربرد شاخص اسکن دیجیتال (Scan Body) در دندانپزشکی دیجیتال چیست؟',
      options: [
        'شکل‌دهی بافت لثه به مدت ۳ ماه',
        'انتقال موقعیت دقیق ۳ بعدی و زاویه فیکسچر در دهان به نرم‌افزارهای طراحی کامپیوتری (CAD)',
        'استریل کردن ایمپلنت قبل از جراحی',
        'محافظت از دندان‌های مجاور در برابر ضربه'
      ],
      correctIndex: 1,
      explanation: 'اسکن بادی قطعه‌ای با هندسه مشخص و مات است که اسکنر داخل دهانی با شناسایی آن، فایل دیجیتال کادکم را در نرم‌افزارهایی چون Exocad بازسازی می‌کند.'
    },
    {
      id: 5,
      question: 'شاخص سنجش پایداری اولیه فیکسچر به روش تحلیل فرکانس تشدید (RFA) چه نام دارد؟',
      options: [
        'شاخص BMI',
        'ضریب مقاومت کششی هاردنس (HRC)',
        'عدد ISQ (Implant Stability Quotient)',
        'شاخص ویسکوزیته بزاق'
      ],
      correctIndex: 2,
      explanation: 'دستگاه‌های Osstell با ارسال امواج مغناطیسی به اسمارت‌پگ عدد ISQ بین ۱ تا ۱۰۰ را گزارش می‌دهند که اعداد بالای ۷۰ شرایط ایده‌آل لودینگ هستند.'
    },
    {
      id: 6,
      question: 'سیستم دوگانه کانکشن (Dual Connection) در فیکسچرهای نکسیس آلمان شامل چه ساختاری است؟',
      options: [
        'دو رزوه بیرونی جداگانه',
        'هگز داخلی ۲.۱ میلی‌متر ضدچرخش به همراه مورس تیپر ۱۱ درجه نفوذناپذیر',
        'فقط رزوه استوانه‌ای بدون تیپر',
        'سیستم مگنتی بدون پیچ'
      ],
      correctIndex: 1,
      explanation: 'این ترکیب هوشمند هگز را برای جایگذاری مطمئن درایور و اباتمنت و تیپر ۱۱ درجه را برای هوابندی نهایی و تحمل بارهای جانبی ترکیب می‌کند.'
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIdx];
  const isAnswered = selectedAnswers[currentIdx] !== undefined;

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    const newAnswers = { ...selectedAnswers, [currentIdx]: optIdx };
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);

    // If last question, finish
    if (currentIdx === questions.length - 1) {
      setTimeout(() => {
        setQuizFinished(true);
        // Confetti!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }, 1500);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setShowExplanation(selectedAnswers[currentIdx + 1] !== undefined);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setShowExplanation(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  // Calculate score
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ans]) => questions[Number(qIdx)].correctIndex === ans
  ).length;

  return (
    <section className="py-16 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>آزمون سنجش دانش ایمپلنتولوژی و بیومکانیک بالینی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            کوییز بالینی: چقدر در مورد قطعات و اصول علمی ایمپلنت می‌دانید؟
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            ۶ پرسش کلیدی از اتصالات مورس تیپر، انواع آلیاژها تا پروتکل‌های جراحی
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
          {!quizFinished ? (
            <div>
              {/* Progress Bar & Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  پرسش {currentIdx + 1} از {questions.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i === currentIdx
                          ? 'w-6 bg-emerald-600'
                          : selectedAnswers[i] !== undefined
                          ? 'w-2 bg-emerald-300'
                          : 'w-2 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentIdx] === idx;
                  const isCorrect = currentQ.correctIndex === idx;

                  let style = 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800';

                  if (isAnswered) {
                    if (isCorrect) {
                      style = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      style = 'bg-rose-50 border-rose-500 text-rose-900 line-through';
                    } else {
                      style = 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-right p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation box */}
              {showExplanation && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs mb-6 leading-relaxed">
                  <span className="font-bold block mb-1">توضیح علمی بالینی:</span>
                  {currentQ.explanation}
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                >
                  پرسش قبلی
                </button>

                {currentIdx < questions.length - 1 && isAnswered && (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>پرسش بعدی</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                نتیجه آزمون شما
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                شما به <span className="font-bold text-emerald-700 font-mono text-base">{correctCount}</span> پرسش از {questions.length} پرسش پاسخ صحیح دادید.
              </p>

              <div className="inline-block p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-8 max-w-md mx-auto text-right leading-relaxed">
                {correctCount >= 5 ? (
                  <span className="text-emerald-800 font-bold">
                    عالی! تسلط شما به متالورژی تیتانیوم، استانداردهای مورس تیپر و پروتکل‌های جراحی در حد یک متخصص بالینی است.
                  </span>
                ) : correctCount >= 3 ? (
                  <span>
                    خوب! آشنایی مناسبی با قطعات ایمپلنت دارید. پیشنهاد می‌کنیم راهنمای فنی برند ناکسیس و ماتریس مقایسه را نیز مطالعه فرمایید.
                  </span>
                ) : (
                  <span>
                    برای انتخاب مطمئن ایمپلنت، مرور کاتالوگ قطعات و مطالعه مقالات بخش وبلاگ به شما کمک خواهد کرد.
                  </span>
                )}
              </div>

              <div>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تکرار آزمون</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
