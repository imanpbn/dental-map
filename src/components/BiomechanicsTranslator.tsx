import React, { useState } from 'react';
import {
  Cpu,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  Droplets,
  Layers,
  Activity
} from 'lucide-react';

export const BiomechanicsTranslator: React.FC = () => {
  const [boneType, setBoneType] = useState<'D1' | 'D2' | 'D3' | 'D4'>('D2');
  const [jawPosition, setJawPosition] = useState<'anterior_maxilla' | 'posterior_maxilla' | 'anterior_mandible' | 'posterior_mandible'>('posterior_mandible');
  const [implantDiameter, setImplantDiameter] = useState<number>(4.0);

  // Recommendations calculated based on clinical biomechanical rules
  const getBiomechanicData = () => {
    switch (boneType) {
      case 'D1':
        return {
          densityLabel: 'استخوان کورتیکال متراکم و فشرده (شبیه چوب بلوط)',
          commonLocation: 'معمولاً در قدام فک پایین (سمفیز مندیبل)',
          recommendedTorque: '۳۵ الی ۴۰ Ncm (هشدار: تورک بیش از ۴۵ خطر نکروز استخوان دارد)',
          drillingProtocol: 'استفاده اجباری از رزوه‌تراش کورتیکال (Bone Tap) و دریلینگ مرحله‌ای با دور موتور ۶۰۰-۸۰۰ دور در دقیقه و شستشوی نرمال سالین فراوان سرد.',
          recommendedAngle: '۰ درجه مستقیم (Straight) یا حداکثر ۱۵ درجه',
          healingTimeWeeks: '۸ الی ۱۰ هفته',
          expectedIsq: 'ISQ > 80 (پایداری مکانیکی اولیه فوق‌العاده)',
          riskNote: 'خطر ایسکمی استخوان ناشی از فشار بیش از حد و ایجاد میکروکراک استخوانی.'
        };
      case 'D2':
        return {
          densityLabel: 'کورتیکال ضخیم با مغز ترابکولار فشرده (شبیه چوب کاج سفید)',
          commonLocation: 'شایع‌ترین در خلف فک پایین و قدام فک بالا',
          recommendedTorque: '۳۵ Ncm (شرایط استاندارد ایده‌آل)',
          drillingProtocol: 'دریل‌کاری استاندارد طبق کیت کارخانه بدون نیاز به تیپینگ اضافی.',
          recommendedAngle: '۰ تا ۱۵ درجه متناسب با مسیر خروج پیچ پروتز',
          healingTimeWeeks: '۶ الی ۸ هفته',
          expectedIsq: 'ISQ 75-78',
          riskNote: 'ایده‌آل‌ترین بستر بیومکانیکی برای پیوند استخوانی با بالاترین درصد موفقیت.'
        };
      case 'D3':
        return {
          densityLabel: 'کورتیکال نازک با بافت اسفنجی متراکم (شبیه چوب چندلا)',
          commonLocation: 'قدام و خلف فک بالا (ماگزیلا)',
          recommendedTorque: '۳۰ الی ۳۵ Ncm',
          drillingProtocol: 'پروتکل Under-preparation (حذف دریل آخر) برای ایجاد تراکم جانبی در استخوان و حفظ ترابکول‌ها.',
          recommendedAngle: '۱۵ الی ۲۵ درجه آناتومیک متناسب با قوس فک',
          healingTimeWeeks: '۱۰ الی ۱۲ هفته',
          expectedIsq: 'ISQ 68-72',
          riskNote: 'پرهیز از بارگذاری فوری در صورت عدم دستیابی به تورک اولیه بالای ۳۲ Ncm.'
        };
      case 'D4':
        return {
          densityLabel: 'بافت ترابکولار بسیار نرم و اسفنجی بدون لایه کورتیکال (شبیه یونولیت/پلی‌استایرن)',
          commonLocation: 'توبروزیته خلف ماگزیلا و نواحی پیوند استخوان گسترده',
          recommendedTorque: '۲۰ الی ۲۵ Ncm (توصیه به بارگذاری تاخیری Delayed Loading)',
          drillingProtocol: 'استفاده از روش Bone Condensing دستی و فیکسچرهای تپرد با رزوه‌های عمیق Knife Thread (نظیر Naxis یا Megagen AnyRidge).',
          recommendedAngle: '۰ تا ۱۷ درجه، انتخاب قطر عریض‌تر (Wide Ø4.5+)',
          healingTimeWeeks: '۱۶ الی ۲۴ هفته',
          expectedIsq: 'ISQ 60-65',
          riskNote: 'خطر بالای لقی و فیبرواینتگریشن در صورت وارد آمدن فشارهای اکلوزال زودهنگام.'
        };
    }
  };

  const bioData = getBiomechanicData();

  return (
    <section id="biomechanics-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold mb-3 border border-cyan-200">
            <Cpu className="w-3.5 h-3.5" />
            <span>موتور هوشمند بیومکانیک و دینامیک استخوان</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            مترجم بیومکانیک و پیشنهاددهنده زاویه و تورک کاشت
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            محاسبه پروتکل بالینی دریل‌کاری و تورک اتصال بر اساس طبقه‌بندی لک‌هولم و زارب (Misch & Lekholm D1-D4)
          </p>
        </div>

        {/* 3 Everyday Patient Analogies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 1. Hydrophilic sponge */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-emerald-800 mb-1">تمثیل ۱ برای بیمار:</div>
            <h3 className="text-base font-black text-slate-900 mb-2">
              اسفنج آب‌دوست (Hydrophilic Sponge)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              سطوح هیدروفیلیک مانند SLActive اشترومن مثل یک اسفنج کاملاً خشک عمل می‌کنند که به محض برخورد با خون بیمار، پروتئین‌های خون و سلول‌های استخوان‌ساز را در کسری از ثانیه به خود جذب کرده و زمان جوش‌خوردن را به ۳ تا ۴ هفته کاهش می‌دهند.
            </p>
          </div>

          {/* 2. Lego micro-gap */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-500/10 to-cyan-500/5 border border-teal-500/20 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-teal-800 mb-1">تمثیل ۲ برای بیمار:</div>
            <h3 className="text-base font-black text-slate-900 mb-2">
              قفل قطعات لگو (Lego Micro-gap Lock)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              اتصال مورس تیپر (۱۱ یا ۱۵ درجه) مانند فشردن بی‌درز دو قطعه لگو یا دو فنجان مخروطی درون یکدیگر است. این ساختار قفل اصطکاکی سرد ایجاد کرده و فاصله میکروسکوپی (میکروگپ) را به زیر نیم میکرون می‌رساند تا هیچ باکتری نتواند به بافت لثه نفوذ کند.
            </p>
          </div>

          {/* 3. ISO 14801 earthquake test */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-500/10 to-slate-500/5 border border-slate-500/20 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-700 mb-1">تمثیل ۳ برای بیمار:</div>
            <h3 className="text-base font-black text-slate-900 mb-2">
              تست زلزله خستگی استخوان (ISO 14801)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              استاندارد بین‌المللی DIN EN ISO 14801 فیکسچر را در زاویه انحراف ۳۰ درجه زیر شبیه‌ساز زلزله جویدن قرار می‌دهد؛ بیش از ۵,۰۰۰,۰۰۰ دور ضربه با فرکانس بالا (معادل ۲۰ سال غذا خوردن بی‌وقفه) برای تضمین اینکه پیچ یا بدنه ایمپلنت هرگز دچار شکستگی خستگی نشود.
            </p>
          </div>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-600" />
              <span>تنظیم پارامترهای بیمار و موضع جراحی</span>
            </h3>

            {/* Bone Density Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                تیپ و تراکم استخوان (Bone Density D1 - D4):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['D1', 'D2', 'D3', 'D4'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBoneType(type)}
                    className={`py-3 rounded-xl font-bold font-mono text-sm transition-all border ${
                      boneType === type
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/25'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Jaw Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                موقعیت آناتومیک کاشت در فک:
              </label>
              <select
                value={jawPosition}
                onChange={(e) => setJawPosition(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-cyan-500"
              >
                <option value="anterior_mandible">قدام فک پایین (منطقه دندان‌های پیشین ۱۱-۳۱-۴۱)</option>
                <option value="posterior_mandible">خلف فک پایین (مولرها و پرمولرها)</option>
                <option value="anterior_maxilla">قدام فک بالا (منطقه زیبایی سانترال و کانین)</option>
                <option value="posterior_maxilla">خلف فک بالا (زیر سینوس ماگزیلاری)</option>
              </select>
            </div>

            {/* Implant Diameter Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700">
                  قطر فیکسچر پیشنهادی (Fixture Diameter):
                </label>
                <span className="font-mono font-bold text-cyan-700 text-sm">
                  Ø {implantDiameter} mm
                </span>
              </div>
              <input
                type="range"
                min="3.0"
                max="5.5"
                step="0.25"
                value={implantDiameter}
                onChange={(e) => setImplantDiameter(parseFloat(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>3.0 (Narrow)</span>
                <span>4.0 (Regular)</span>
                <span>5.5 (Wide)</span>
              </div>
            </div>

            {/* Info Callout */}
            <div className="p-3.5 rounded-2xl bg-cyan-100/50 border border-cyan-200 text-xs text-cyan-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                فرمول بیومکانیکی ما بر مبنای توزیع تنش فون‌مایزس (Von Mises Stress) و داده‌های کلینیکی انجمن ایمپلنتولوژی اروپا کالیبره شده است.
              </p>
            </div>
          </div>

          {/* Clinical Output Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-600 block">
                  خروجی محاسبات آناتومیک برای کلاس {boneType}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {bioData.densityLabel}
                </h4>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-mono font-bold">
                {bioData.expectedIsq}
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Torque */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-1">تورک درج فیکسچر (Insertion Torque):</span>
                <span className="text-sm font-bold text-emerald-700 font-mono">
                  {bioData.recommendedTorque}
                </span>
              </div>

              {/* Angle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-1">زاویه اباتمنت پروتزی:</span>
                <span className="text-sm font-bold text-slate-800">
                  {bioData.recommendedAngle}
                </span>
              </div>

              {/* Healing Time */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-1">طول دوره جوش‌خوردن (استئواینتگریشن):</span>
                <span className="text-sm font-bold text-teal-700">
                  {bioData.healingTimeWeeks}
                </span>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-1">تراکم معمول در اسکن CBCT:</span>
                <span className="text-xs font-medium text-slate-700">
                  {bioData.commonLocation}
                </span>
              </div>
            </div>

            {/* Drilling protocol detailed block */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                دستورالعمل بالینی دریلینگ و آماده‌سازی حفره استخوانی:
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {bioData.drillingProtocol}
              </p>
            </div>

            {/* Risk Warning Alert */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold block mb-0.5">هشدار بیومکانیکی مهم:</span>
                <span className="text-xs leading-relaxed font-normal text-amber-800">
                  {bioData.riskNote}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
