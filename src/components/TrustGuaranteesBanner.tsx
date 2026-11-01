import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  BadgeCheck,
  Flame,
  Award
} from 'lucide-react';

export const TrustGuaranteesBanner: React.FC = () => {
  const guarantees = [
    {
      icon: ShieldCheck,
      title: 'تاییدیه رسمی CE & MDR 2017/745',
      desc: 'مطابق استانداردهای سختگیرانه تجهیزات پزشکی کلاس IIb و III اتحادیه اروپا'
    },
    {
      icon: Award,
      title: 'آلیاژ تیتانیوم خالص پزشکی Grade 4 & 5',
      desc: 'حداکثر زیست‌سازگاری، استئواینتگریشن پایدار و مقاومت تسلیم بالای ۸۰۰ مگاپاسکال'
    },
    {
      icon: Cpu,
      title: 'فناوری نانو سطحی بیواکتیو (SLActive / MPS)',
      desc: 'سرعت بخشیدن به فرآیند جذب استخوان و امکان پروتز فوری در شرایط کلینیکی'
    },
    {
      icon: BadgeCheck,
      title: 'شناسنامه دیجیتال و گارانتی اصالت تعویض',
      desc: 'ردیابی بارکد جهانی، استعلام سامانه رفرنس IMED و گارانتی تعویض فیکسچر'
    }
  ];

  return (
    <section className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white py-8 border-y border-emerald-700/50 shadow-inner">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/10 text-emerald-300 border border-white/10 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-100 mb-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
