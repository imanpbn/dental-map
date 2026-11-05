import React from 'react';
import {
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Tag,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { DentalComponent } from '../types';

interface FeaturedComponentsShowcaseProps {
  components: DentalComponent[];
  onSelectComponent: (comp: DentalComponent) => void;
}

export const FeaturedComponentsShowcase: React.FC<FeaturedComponentsShowcaseProps> = ({
  components,
  onSelectComponent
}) => {
  // Top 5 critical items
  const featured = components.filter((c) => c.is_critical).slice(0, 5);

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>قطعات حیاتی و تکنولوژی‌های استراتژیک دندانپزشکی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ویترین ۵ قطعه برتر ایمپلنت، اباتمنت و ملزومات جراحی
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              قطعات دارای بالاترین نرخ استئواینتگریشن، تست خستگی داینامیک و استاندارد کانکشن مورس تیپر
            </p>
          </div>

          <a
            href="#parts-catalog"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            مشاهده کاتالوگ جامع قطعات &larr;
          </a>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {featured.map((comp) => (
            <div
              key={comp.id}
              onClick={() => onSelectComponent(comp)}
              className="group cursor-pointer rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-500/50 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Image & Category Pill */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 mb-3">
                  <img
                    src={comp.image_url}
                    alt={comp.name_fa}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      {comp.category === 'fixture' && 'فیکسچر استخوانی'}
                      {comp.category === 'abutment' && 'اباتمنت پروتزی'}
                      {comp.category === 'healing' && 'هیلینگ لثه'}
                      {comp.category === 'surgical_kit' && 'کیت جراحی'}
                    </span>
                  </div>
                </div>

                {/* REF Code chip */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    REF: {comp.ref_code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {comp.platform_size}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 mb-1 group-hover:text-emerald-700 transition-colors">
                  {comp.name_fa}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {comp.description}
                </p>

                {/* Key Specs */}
                <div className="space-y-1 text-[10px] text-slate-600 bg-slate-100/70 p-2 rounded-lg mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">آلیاژ:</span>
                    <span className="font-medium truncate max-w-[120px]">{comp.material}</span>
                  </div>
                  {comp.torque_ncm && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">تورک توصیه شده:</span>
                      <span className="font-mono font-bold text-slate-700">{comp.torque_ncm} Ncm</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">قیمت مصوب:</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                    {comp.price_toman.toLocaleString('fa-IR')}
                    <span className="text-[10px] text-slate-500 mr-1 font-sans">تومان</span>
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
