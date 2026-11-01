import React, { useState, useRef, useEffect } from 'react';
import {
  PhoneCall,
  Search,
  ShieldCheck,
  Type,
  LayoutGrid,
  FileCheck2,
  Stethoscope,
  BookOpen,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  Settings
} from 'lucide-react';
import { DentalComponent, Doctor, ImplantBrand } from '../types';

interface NavbarProps {
  currentFont: 'vazirmatn' | 'estedad';
  onFontChange: (font: 'vazirmatn' | 'estedad') => void;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
  onOpenNaxisGuide: () => void;
  components: DentalComponent[];
  doctors: Doctor[];
  brands: ImplantBrand[];
  onSelectComponent: (comp: DentalComponent) => void;
  onSelectDoctor: (doc: Doctor) => void;
  onSelectCategory: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentFont,
  onFontChange,
  isAdminOpen,
  onToggleAdmin,
  onOpenNaxisGuide,
  components,
  doctors,
  brands,
  onSelectComponent,
  onSelectDoctor,
  onSelectCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const matchedComponents = query
    ? components.filter(
        (c) =>
          c.ref_code.toLowerCase().includes(query) ||
          c.name_fa.toLowerCase().includes(query) ||
          c.name_en.toLowerCase().includes(query)
      ).slice(0, 4)
    : [];

  const matchedDoctors = query
    ? doctors.filter(
        (d) =>
          `${d.first_name} ${d.last_name}`.toLowerCase().includes(query) ||
          d.medical_council_code.toLowerCase().includes(query)
      ).slice(0, 3)
    : [];

  const matchedBrands = query
    ? brands.filter((b) => b.name.toLowerCase().includes(query)).slice(0, 3)
    : [];

  const hasResults =
    query.length > 0 &&
    (matchedComponents.length > 0 || matchedDoctors.length > 0 || matchedBrands.length > 0);

  const categories = [
    { id: 'fixture', name: 'فیکسچر استخوانی' },
    { id: 'abutment', name: 'اباتمنت پروتزی' },
    { id: 'healing', name: 'هیلینگ کپ' },
    { id: 'impression_coping', name: 'ایمپرشن کوپینگ' },
    { id: 'analog', name: 'آنالوگ کست' },
    { id: 'surgical_kit', name: 'کیت جراحی' },
    { id: 'scan_body', name: 'اسکن بادی' },
    { id: 'digital_analog', name: 'آنالوگ ۳ بعدی' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Hotline & Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              مرجع رسمی استعلام کد قطعات و پاسپورت ایمپلنتولوژی ایران
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block text-slate-300">
              استعلام اصالت بیش از ۱۲,۰۰۰ قطعه تاییدشده وزارت بهداشت و IMED
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Font Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-slate-300">قلم:</span>
              <button
                onClick={() => onFontChange('vazirmatn')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentFont === 'vazirmatn'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                وزیرمتن
              </button>
              <button
                onClick={() => onFontChange('estedad')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentFont === 'estedad'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                استعداد
              </button>
            </div>

            {/* Hotline */}
            <a
              href="tel:02188001144"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-bold font-mono tracking-wider dir-ltr"
            >
              <span>021-88001144</span>
              <PhoneCall className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-slate-900 tracking-tight">دنتال مَپ</span>
                  <span className="text-[10px] uppercase font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                    Dental Map
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 -mt-0.5 font-medium">
                  شفافیت، اصالت قطعات و دایرکتوری ایمپلنت
                </span>
              </div>
            </a>
          </div>

          {/* Live Search Bar for REF, Brand, Doctor */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="جستجوی زنده کد رفرنس (REF)، برند یا نام پزشک (مثلاً: 021.4312 یا اشترومن)..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm focus:outline-hidden focus:ring-3 focus:ring-emerald-500/15 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {isSearchOpen && hasResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100">
                {matchedComponents.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-bold text-slate-400 px-2 py-1 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-emerald-500" />
                      قطعات و فیکسچرهای ایمپلنت
                    </div>
                    {matchedComponents.map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => {
                          onSelectComponent(comp);
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-right px-2.5 py-1.5 hover:bg-emerald-50/70 rounded-lg flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{comp.name_fa}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            REF: {comp.ref_code} | {comp.platform_size}
                          </span>
                        </div>
                        <span className="text-emerald-700 font-bold font-mono">
                          {comp.price_toman.toLocaleString('fa-IR')} تومان
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedDoctors.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-bold text-slate-400 px-2 py-1 flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-teal-500" />
                      پزشکان و جراحان
                    </div>
                    {matchedDoctors.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          onSelectDoctor(doc);
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-right px-2.5 py-1.5 hover:bg-teal-50/70 rounded-lg flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-slate-800">
                            {doc.first_name} {doc.last_name}
                          </span>
                          <span className="text-[10px] text-slate-500 mr-2">
                            (کد نظام: {doc.medical_council_code})
                          </span>
                        </div>
                        <span className="text-teal-700 text-[11px] font-medium">مشاهده کارنامه</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedBrands.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-bold text-slate-400 px-2 py-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      برندها و کمپانی‌های سازنده
                    </div>
                    {matchedBrands.map((brand) => (
                      <div
                        key={brand.id}
                        className="px-2.5 py-1.5 flex items-center justify-between text-xs text-slate-700"
                      >
                        <span className="font-medium">
                          {brand.logo} {brand.name}
                        </span>
                        <span className="text-[11px] text-slate-500">{brand.warranty_description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Nav Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNaxisGuide}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
            >
              <span>🇩🇪 راهنمای ناکسیس آلمان</span>
            </button>

            <a
              href="/blog"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>وبلاگ و دانشنامه</span>
            </a>

            <a
              href="/passport"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>پاسپورت ایمپلنت</span>
            </a>

            {/* Admin Toggle */}
            <button
              onClick={onToggleAdmin}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                isAdminOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="پنل مدیریت و ارزیابی لید"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Strip */}
      <div className="bg-slate-100/70 border-t border-slate-200 overflow-x-auto scrollbar-none py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap pl-2 flex items-center gap-1">
            <LayoutGrid className="w-3.5 h-3.5" />
            دسته‌بندی‌های ۸ گانه:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors whitespace-nowrap text-xs font-medium"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
