import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ArrowRight, FileCheck2 } from 'lucide-react';
import { PassportSimulator } from '../components/PassportSimulator';
import { ToothPassportRecord } from '../types';

interface PassportPageProps {
  teeth: ToothPassportRecord[];
  onUpdateTooth: (updated: ToothPassportRecord) => void;
}

export const PassportPage: React.FC<PassportPageProps> = ({
  teeth,
  onUpdateTooth
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href="https://dentalmap.ir/passport" />

      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link to="/" className="text-slate-500 hover:text-emerald-700">صفحه اصلی</Link>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-700 font-bold">شناسنامه و پاسپورت دیجیتال فک ۳۲ دندان (FDI)</span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به پرتال اصلی</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <PassportSimulator
          teeth={teeth}
          onUpdateTooth={onUpdateTooth}
        />
      </div>
    </div>
  );
};
