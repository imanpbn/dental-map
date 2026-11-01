import React from 'react';
import {
  BookOpen,
  Clock,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface BlogSectionProps {
  onOpenNaxisGuide: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenNaxisGuide }) => {
  const articles = [
    {
      id: 1,
      title: 'راهنمای جامع برند آلمانی ناکسیس (Naxis Germany): معماری اتصال دوگانه و سازگاری با استرا',
      category: 'بررسی تخصصی برند',
      readTime: '۷ دقیقه',
      date: '۱۰ آبان ۱۴۰۳',
      summary: 'تحلیل متالورژی تیتانیوم گرید ۴ سردکاری‌شده، سطح MPS نانوساختار، آزمون‌های خستگی DIN EN ISO 14801 و نمایندگی‌های معتبر در تهران و ایران.',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      onClick: onOpenNaxisGuide
    },
    {
      id: 2,
      title: 'اتصال مورس تیپر (Morse Taper) در برابر هگز مسطح: چرا میکروگپ عامل اصلی شکست ایمپلنت است؟',
      category: 'بیومکانیک و بافت نرم',
      readTime: '۵ دقیقه',
      date: '۰۵ آبان ۱۴۰۳',
      summary: 'بررسی نفوذ باکتری‌ها به فضای داخلی فیکسچر، پدیده پمپاژ باکتریایی و نحوه پیشگیری از تحلیل استخوان حاشیه‌ای (Crestal Bone Loss).',
      image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      onClick: () => {}
    },
    {
      id: 3,
      title: 'اهمیت پاسپورت دیجیتال و رهگیری کدهای رفرنس (REF) در بازسازی‌های دهان و دندان',
      category: 'حقوق بیمار و شفافیت',
      readTime: '۴ دقیقه',
      date: '۲۸ مهر ۱۴۰۳',
      summary: 'چگونه ثبت شماره لات (LOT) و کد رفرنس فیکسچر و اباتمنت در پاسپورت دنتال مپ، خدمات وارانتی بین‌المللی و تهیه قطعات یدکی را تضمین می‌کند.',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      onClick: () => {}
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>پایگاه دانش بالینی و مقالات تخصصی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              راهنماهای علمی، استانداردهای متالورژی و تحلیل برندها
            </h2>
          </div>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={art.onClick}
              className={`rounded-3xl border p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
                art.isFeatured
                  ? 'bg-gradient-to-b from-emerald-950 to-slate-900 text-white border-emerald-500/40 shadow-lg'
                  : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-white'
              }`}
            >
              <div>
                <div className="aspect-16/10 rounded-2xl overflow-hidden mb-4 bg-slate-200">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md ${
                      art.isFeatured
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3
                  className={`font-black text-sm sm:text-base leading-snug mb-2 ${
                    art.isFeatured ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {art.title}
                </h3>

                <p
                  className={`text-xs leading-relaxed line-clamp-3 mb-4 ${
                    art.isFeatured ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {art.summary}
                </p>
              </div>

              <div
                className={`pt-3 border-t flex items-center justify-between text-xs font-bold ${
                  art.isFeatured ? 'border-slate-800 text-emerald-400' : 'border-slate-200 text-emerald-700'
                }`}
              >
                <span>مطالعه متن کامل راهنما</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
