import React from 'react';
import {
  Quote,
  Star,
  ShieldCheck,
  CheckCircle2,
  Heart
} from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      patientName: 'مهندس کامران رستگار',
      age: 48,
      location: 'تهران (سعادت‌آباد)',
      brandUsed: 'Straumann BLX سوئیس',
      surgeon: 'دکتر علیرضا صالحی‌راد',
      text: 'پیش از کاشت ایمپلنت نگران اصل بودن قطعات و مشکلات پس‌زدن استخوان بودم. با دریافت شناسنامه دنتال مپ و ثبت شماره لات فیکسچر در سامانه رسمی، روکش زیرکونیایی با تورک ۳۵ نیوتن تحویل شد و بعد از ۹ ماه هیچ‌گونه تحلیل لثه یا دردی ندارم.',
      rating: 5,
      date: 'شهریور ۱۴۰۳'
    },
    {
      id: 2,
      patientName: 'دکتر زهرا هدایتی',
      age: 39,
      location: 'شیراز',
      brandUsed: 'Naxis Prime Hex آلمان',
      surgeon: 'دکتر مریم کریمی‌تبار',
      text: 'به عنوان داروساز، متالورژی تیتانیوم گرید ۴ و اتصال مورس تیپر برایم حیاتی بود. ایمپلنت ناکسیس آلمان با کانکشن دوگانه کاشته شد و فرآیند جوش‌خوردن در استخوان فک بالا فقط ۶ هفته طول کشید. قابلیت دانلود پاسپورت دیجیتال فوق‌العاده است.',
      rating: 5,
      date: 'مهر ۱۴۰۳'
    },
    {
      id: 3,
      patientName: 'حاج‌محمد تهرانی',
      age: 62,
      location: 'تهران (مرکز جراحی نیلوفر)',
      brandUsed: 'Osstem TSIII کره جنوبی',
      surgeon: 'دکتر نیما فرهمند',
      text: 'بازسازی کامل هر دو فک با ۱۰ واحد فیکسچر انجام شد. پشتیبانی بیمه دانا و محاسبه دقیق هزینه‌ها بر اساس دایرکتوری مراکز دنتال مپ، بیش از ۴۰ میلیون تومان از هزینه‌های من را از طریق بیمه تکمیلی پوشش داد.',
      rating: 5,
      date: 'مرداد ۱۴۰۳'
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Heart className="w-3.5 h-3.5 fill-emerald-600" />
            <span>تجربه بیماران و اطمینان از اصالت</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            داستان اعتماد بیماران به شفافیت اصالت قطعات دنتال مپ
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            بیمارانی که شناسنامه دندانپزشکی خود را دریافت کرده و با آرامش خاطر درمان شدند
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-200" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 font-normal">
                  «{item.text}»
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-sm">{item.patientName}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
                </div>
                <div className="space-y-0.5 text-[11px] text-slate-500">
                  <div>برند کاشته‌شده: <strong className="text-slate-700">{item.brandUsed}</strong></div>
                  <div>جراح معالج: <span className="text-teal-700 font-medium">{item.surgeon}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
