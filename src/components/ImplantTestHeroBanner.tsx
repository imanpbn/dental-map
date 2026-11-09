import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export const ImplantTestHeroBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="my-10" id="implant-test-section">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden">
        {/* Ambient Gradient Glows */}
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
                onClick={() => navigate('/quiz?start=true')}
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
              onClick={() => navigate('/quiz?demo=0')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
            >
              بیمار بودجه‌محور
            </button>
            <button
              onClick={() => navigate('/quiz?demo=1')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
            >
              بیمار تعادل‌گرا
            </button>
            <button
              onClick={() => navigate('/quiz?demo=2')}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-medium transition-colors border border-teal-200 cursor-pointer"
            >
              بیمار دقیق و آینده‌نگر
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
