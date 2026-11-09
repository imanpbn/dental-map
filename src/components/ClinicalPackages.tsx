import React from 'react';
import {
  PackageCheck,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  FileCheck2,
  ArrowLeft,
  PhoneCall
} from 'lucide-react';
import { ClinicalPackage } from '../types';
import { formatNumber } from '../utils/formatters';

interface ClinicalPackagesProps {
  packages: ClinicalPackage[];
  onOrderPackage: (pkg: ClinicalPackage) => void;
}

export const ClinicalPackages: React.FC<ClinicalPackagesProps> = ({
  packages,
  onOrderPackage
}) => {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-3 border border-teal-200">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>پکیج‌های درمانی تجمیعی ۴ تکه بالینی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            کیت‌های جراحی و پروتزی یکپارچه (All-In-One Surgical Suites)
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            بسته‌های کامل شامل: فیکسچر اصلی + اباتمنت تیتانیومی + هیلینگ کپ شکل‌دهنده لثه + ایمپرشن کوپینگ تری باز
          </p>
        </div>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => {
            const isFeatured = idx === 1; // Naxis or Straumann
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-2xl border-2 border-emerald-500 scale-102'
                    : 'bg-slate-50 text-slate-900 border border-slate-200 hover:shadow-lg'
                }`}
              >
                {/* Floating Top Badge */}
                <div className="absolute -top-3.5 right-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      isFeatured
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {pkg.badge}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mb-1">
                    {pkg.brand_name}
                  </div>
                  <h3
                    className={`text-lg font-black leading-snug mb-3 ${
                      isFeatured ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {pkg.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed mb-6 ${
                      isFeatured ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {pkg.description}
                  </p>

                  {/* Bundled Parts Component Checklist */}
                  <div
                    className={`p-4 rounded-2xl mb-6 space-y-2 text-xs ${
                      isFeatured ? 'bg-slate-800/80 border border-slate-700' : 'bg-white border border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-[11px] text-emerald-500 mb-2">
                      محتویات ۴ تکه بسته استریل:
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={isFeatured ? 'text-slate-400' : 'text-slate-500'}>فیکسچر (REF):</span>
                      <span className="font-mono font-bold text-emerald-400">{pkg.fixture_ref}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={isFeatured ? 'text-slate-400' : 'text-slate-500'}>اباتمنت (REF):</span>
                      <span className="font-mono font-bold text-teal-400">{pkg.abutment_ref}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={isFeatured ? 'text-slate-400' : 'text-slate-500'}>هیلینگ کپ:</span>
                      <span className="font-mono text-xs">{pkg.healing_ref}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={isFeatured ? 'text-slate-400' : 'text-slate-500'}>ایمپرشن کوپینگ:</span>
                      <span className="font-mono text-xs">{pkg.impression_ref}</span>
                    </div>
                  </div>

                  {/* Included bullets */}
                  <ul className="space-y-2 mb-6 text-xs">
                    {pkg.items_included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isFeatured ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                        />
                        <span className={isFeatured ? 'text-slate-200' : 'text-slate-700'}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & CTA */}
                <div
                  className={`pt-5 border-t ${
                    isFeatured ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <div className="mb-4">
                    <span className="text-[11px] block text-slate-400">قیمت پکیج جامع ۴ تکه:</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black font-mono">
                        {formatNumber(pkg.price_toman)}
                      </span>
                      <span className="text-xs font-bold text-slate-400">تومان</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOrderPackage(pkg)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      isFeatured
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>سفارش پکیج و استعلام نمایندگی</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
