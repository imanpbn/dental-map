import React from 'react';
import {
  Table,
  Check,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ImplantBrand, ImplantType } from '../types';

interface ComparisonMatrixProps {
  brands: ImplantBrand[];
  implantTypes: ImplantType[];
  onOpenNaxisGuide: () => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  brands,
  implantTypes,
  onOpenNaxisGuide
}) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ماتریس مقایسه بالینی و متالورژی برندها</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              جدول مقایسه فنی شاخص‌های پایداری، متریال و ریسک میکروگپ
            </h2>
          </div>

          <button
            onClick={onOpenNaxisGuide}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 self-start md:self-auto shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>مطالعه راهنمای تخصصی برند ناکسیس آلمان (Naxis Guide)</span>
          </button>
        </div>

        {/* Matrix Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white border-b border-slate-800">
                  <th className="p-4 font-bold">برند و کشور</th>
                  <th className="p-4 font-bold">مدل فیکسچر</th>
                  <th className="p-4 font-bold">آلیاژ ساختاری</th>
                  <th className="p-4 font-bold">تکنولوژی سطح (Surface)</th>
                  <th className="p-4 font-bold">اتصال و زاویه تیپر</th>
                  <th className="p-4 font-bold text-center">پایداری اولیه (ISQ)</th>
                  <th className="p-4 font-bold text-center">ریسک نشت باکتری (Micro-gap)</th>
                  <th className="p-4 font-bold">گارانتی و وارانتی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {implantTypes.map((type) => {
                  const brand = brands.find((b) => b.id === type.brand_id);
                  const isNaxis = brand?.name.includes('Naxis');
                  return (
                    <tr
                      key={type.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isNaxis ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{brand?.logo}</span>
                          <div>
                            <span className="font-bold text-slate-900 block">{brand?.name}</span>
                            {isNaxis && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] rounded font-semibold">
                                پیشنهاد بهینه بالینی
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-medium text-slate-800">
                        {type.model_name}
                      </td>
                      <td className="p-4 text-slate-700 max-w-[140px] leading-relaxed">
                        {type.material}
                      </td>
                      <td className="p-4 text-slate-700 max-w-[140px] leading-relaxed">
                        {type.surface_technology}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-700">
                        {type.extra_specs.connection_type || 'Conical Morse Taper'}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 font-mono font-bold text-[11px]">
                          {type.extra_specs.isq_stability?.split(' ')[0] || 'ISQ > 70'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            type.extra_specs.microgap_risk === 'خیلی پایین'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {type.extra_specs.microgap_risk || 'پایین'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 text-[11px] max-w-[160px] leading-relaxed">
                        {brand?.warranty_description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
