import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  LayoutGrid,
  FileCheck2,
  Stethoscope,
  BookOpen,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  Settings,
  Building,
  Activity,
  ArrowLeftRight
} from 'lucide-react';
import { DentalComponent, Doctor, ImplantBrand } from '../types';

interface NavbarProps {
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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const brandsMenuRef = useRef<HTMLDivElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  // Measure header height for smooth spacer rendering
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Smart Header Scroll Effect: Hide on scroll down, show immediately on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY;

          // Always visible near top of page
          if (currentScrollY <= 15) {
            setIsVisible(true);
          } else if (diff > 6 && currentScrollY > 70) {
            // User scrolled down -> hide header and dismiss active dropdowns
            setIsVisible(false);
            setIsCategoryMenuOpen(false);
            setIsBrandsMenuOpen(false);
            setIsServicesMenuOpen(false);
            setIsSearchOpen(false);
          } else if (diff < -6) {
            // User scrolled up -> reveal header immediately
            setIsVisible(true);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
      if (brandsMenuRef.current && !brandsMenuRef.current.contains(event.target as Node)) {
        setIsBrandsMenuOpen(false);
      }
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setIsServicesMenuOpen(false);
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
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">دنتال مَپ</span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                      Dental Map
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-[11px] text-slate-500 -mt-0.5 font-medium">
                    شفافیت، اصالت قطعات و دایرکتوری ایمپلنت
                  </span>
                </div>
              </a>
            </div>

            {/* Live Search Bar for REF, Brand, Doctor */}
            <div className="flex-1 max-w-xl min-w-0 relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="جستجوی کد REF، برند یا پزشک..."
                  className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-3 focus:ring-emerald-500/15 transition-all truncate"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-2.5 sm:right-3.5 top-2.5 sm:top-3 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600"
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
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href="/passport"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg shrink-0"
            >
              <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">پاسپورت</span>
              <span className="hidden sm:inline"> ایمپلنت</span>
            </a>

            {/* Admin Toggle */}
            <button
              onClick={onToggleAdmin}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors shrink-0 ${
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

      {/* Navigation Menu Bar with Dropdowns */}
      <nav className="bg-white border-t border-slate-200 text-xs sm:text-sm font-semibold relative z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2 py-1 overflow-visible">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative overflow-visible">
            {/* 1. دسته‌بندی‌های ۸ گانه قطعات (منوی بازشونده زیر هم مطابق عکس) */}
            <div
              className="relative"
              ref={categoryMenuRef}
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isCategoryMenuOpen
                    ? 'text-emerald-700 bg-emerald-50 font-bold shadow-xs'
                    : 'text-slate-800 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-emerald-600" />
                <span>دسته‌بندی قطعات</span>
                <span className="text-[10px] text-slate-400 font-mono">▼</span>
              </button>

              {/* منوی آبشاری عمودی زیر هم (مطابق با عکس ارسالی) */}
              {isCategoryMenuOpen && (
                <div className="absolute right-0 top-full mt-0.5 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 animate-fadeIn">
                  {categories.map((cat, idx) => (
                    <a
                      key={cat.id}
                      href={`/parts/${cat.id}`}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setIsCategoryMenuOpen(false);
                      }}
                      className="w-full text-right px-5 py-3 text-xs sm:text-sm font-medium text-slate-800 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-500 transition-colors" />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono group-hover:text-emerald-600 transition-colors">
                        #۰{idx + 1}
                      </span>
                    </a>
                  ))}
                  <a
                    href="/parts"
                    onClick={() => setIsCategoryMenuOpen(false)}
                    className="block text-center px-4 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/80 transition-colors cursor-pointer"
                  >
                    <span>کاتالوگ جامع همه قطعات (REF) ←</span>
                  </a>
                </div>
              )}
            </div>

            {/* 2. برندها (منوی آبشاری شامل راهنمای ناکسیس آلمان و همه برندها) */}
            <div
              className="relative"
              ref={brandsMenuRef}
              onMouseEnter={() => setIsBrandsMenuOpen(true)}
              onMouseLeave={() => setIsBrandsMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsBrandsMenuOpen(!isBrandsMenuOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isBrandsMenuOpen
                    ? 'text-emerald-700 bg-emerald-50 font-bold shadow-xs'
                    : 'text-slate-800 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <span>برندها</span>
                <span className="text-[10px] text-slate-400 font-mono">▼</span>
              </button>

              {/* منوی بازشونده زیر برندها */}
              {isBrandsMenuOpen && (
                <div className="absolute right-0 top-full mt-0.5 w-76 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 animate-fadeIn">
                  {/* راهنمای ناکسیس آلمان زیر منوی برندها */}
                  <a
                    href="/naxis-guide"
                    onClick={() => {
                      setIsBrandsMenuOpen(false);
                      onOpenNaxisGuide();
                    }}
                    className="block px-5 py-3 text-xs sm:text-sm bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold flex items-center gap-2 text-emerald-900 group-hover:text-emerald-700">
                        <span className="text-base">🇩🇪</span>
                        <span>راهنمای ناکسیس آلمان (Naxis)</span>
                      </div>
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                        کاتالوگ کامل
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600 block leading-relaxed">
                      تایتانیوم گرید ۴، استانداردهای صنعتی و جدول قطعات
                    </span>
                  </a>

                  {/* فهرست برندهای همکار با لینک مستقیم به صفحه هر برند */}
                  {brands && brands.length > 0 && brands.map((brand) => (
                    <a
                      key={brand.id}
                      href={brand.slug === 'naxis' ? '/naxis-guide' : `/brands/${brand.slug}`}
                      onClick={() => {
                        if (brand.slug === 'naxis' || brand.name.toLowerCase().includes('naxis')) {
                          onOpenNaxisGuide();
                        }
                        setIsBrandsMenuOpen(false);
                      }}
                      className="w-full text-right px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 hover:text-emerald-700 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>{brand.logo || '🦷'}</span>
                        <span className="font-medium">{brand.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-emerald-600">
                        مشاهده سیستم و قطعات ←
                      </span>
                    </a>
                  ))}

                  <a
                    href="/brands"
                    onClick={() => setIsBrandsMenuOpen(false)}
                    className="block text-center px-4 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/80 transition-colors cursor-pointer"
                  >
                    <span>مشاهده همه برندها و سازندگان ←</span>
                  </a>
                </div>
              )}
            </div>

            {/* 3. خدمات و ابزارها (منوی آبشاری کامل خدمات و زیرمجموعه‌ها) */}
            <div
              className="relative"
              ref={servicesMenuRef}
              onMouseEnter={() => setIsServicesMenuOpen(true)}
              onMouseLeave={() => setIsServicesMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isServicesMenuOpen
                    ? 'text-emerald-700 bg-emerald-50 font-bold shadow-xs'
                    : 'text-slate-800 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <span>خدمات و ابزارها</span>
                <span className="text-[10px] text-slate-400 font-mono">▼</span>
              </button>

              {/* زیرمنوی آبشاری عمودی خدمات و ابزارها */}
              {isServicesMenuOpen && (
                <div className="absolute right-0 top-full mt-0.5 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 animate-fadeIn max-h-[85vh] overflow-y-auto">
                  {/* 1. پاسپورت سلامت */}
                  <a
                    href="/passport"
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-5 py-3 text-xs sm:text-sm text-slate-800 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors cursor-pointer"
                  >
                    <div className="font-bold flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>پاسپورت سلامت ۳۲ دندان (FDI)</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      ثبت شماره لات، سریال و نسخه چاپی رسمی PDF
                    </span>
                  </a>

                  {/* 2. آزمون انتخاب ایمپلنت */}
                  <a
                    href="/quiz"
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-5 py-3 text-xs sm:text-sm text-slate-800 hover:text-amber-700 hover:bg-amber-50/60 transition-colors cursor-pointer"
                  >
                    <div className="font-bold flex items-center gap-2 text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>آزمون هوشمند انتخاب ایمپلنت</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      ارزیابی استخوان و چک‌لیست سوال از متخصص
                    </span>
                  </a>

                  {/* 3. دندانپزشکان سراسر کشور */}
                  <a
                    href="/dentists"
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-5 py-3 text-xs sm:text-sm text-slate-800 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors cursor-pointer"
                  >
                    <div className="font-bold flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-emerald-600" />
                      <span>دندانپزشکان و جراحان سراسر کشور</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      فهرست استانی و شهری جراحان فک و صورت و متخصصان
                    </span>
                  </a>

                  {/* 4. دایرکتوری چندمتغیره */}
                  <a
                    href="/directory"
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-5 py-3 text-xs sm:text-sm text-slate-800 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors cursor-pointer"
                  >
                    <div className="font-bold flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-600" />
                      <span>دایرکتوری چندمتغیره کلینیک‌ها و مراکز ۲۴/۷</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      مراکز شبانه‌روزی، بیمه‌های طرف قرارداد و رزرو نوبت
                    </span>
                  </a>

                  {/* 5. مترجم بیومکانیک استخوان */}
                  <a
                    href="/#biomechanics-section"
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-5 py-3 text-xs sm:text-sm text-slate-800 hover:text-cyan-700 hover:bg-cyan-50/60 transition-colors cursor-pointer"
                  >
                    <div className="font-bold flex items-center gap-2 text-cyan-900">
                      <Activity className="w-4 h-4 text-cyan-600" />
                      <span>مترجم بیومکانیک تراکم استخوان (D1 تا D4)</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      پیشنهاددهنده تورک و زاویه کاشت بر اساس بافت استخوانی
                    </span>
                  </a>

                  {/* 6. بسته‌های جراحی ۴ در ۱ */}
                  <a
                    href="/#packages-section"
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-5 py-3 text-xs sm:text-sm text-slate-800 hover:text-indigo-700 hover:bg-indigo-50/60 transition-colors cursor-pointer"
                  >
                    <div className="font-bold flex items-center gap-2 text-indigo-900">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>بسته‌های ترکیبی جراحی و پروتز (۴ در ۱)</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      پکیج‌های جامع ایمپلنت، اباتمنت، هیلینگ و کوپینگ
                    </span>
                  </a>

                  {/* 7. ماتریس مقایسه سیستم‌های ایمپلنت */}
                  <a
                    href="/#comparison-section"
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-5 py-3 text-xs sm:text-sm text-slate-800 hover:text-purple-700 hover:bg-purple-50/60 transition-colors cursor-pointer"
                  >
                    <div className="font-bold flex items-center gap-2 text-purple-900">
                      <ArrowLeftRight className="w-4 h-4 text-purple-600" />
                      <span>ماتریس مقایسه سیستم‌های ایمپلنت و میکروگپ</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      مقایسه علمی آلیاژها و اتصال کونیکال مورس تیپر
                    </span>
                  </a>

                  {/* 8. استعلام کد REF قطعات */}
                  <a
                    href="/#parts-catalog"
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-5 py-3 text-xs sm:text-sm text-slate-800 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors cursor-pointer"
                  >
                    <div className="font-bold flex items-center gap-2">
                      <Search className="w-4 h-4 text-emerald-600" />
                      <span>استعلام اصالت و کاتالوگ قطعات (REF Code)</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      جستجوی ۱۲,۰۰۰ قطعه تاییدشده وزارت بهداشت و IMED
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* 3. دندانپزشکان و جراحان سراسر کشور */}
            <a
              href="/dentists"
              className="px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>دندانپزشکان و جراحان سراسر کشور</span>
            </a>

            {/* 4. دانشنامه و وبلاگ */}
            <a
              href="/blog"
              className="px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>مقالات و دانشنامه</span>
            </a>

            {/* 4. درباره دنتال‌مپ */}
            <a
              href="/about-us"
              className="hidden md:inline-flex px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              درباره ما
            </a>

            {/* 5. قوانین و مقررات */}
            <a
              href="/terms"
              className="hidden lg:inline-flex px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              قوانین
            </a>

            {/* 6. تماس با ما */}
            <a
              href="/contact"
              className="hidden lg:inline-flex px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors"
            >
              تماس با ما
            </a>
          </div>

          {/* سمت چپ نوار ناوبری: دکمه هدایت سریع به آزمون یا استعلام */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/quiz"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:scale-105 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>آزمون هوشمند ایمپلنت</span>
            </a>
          </div>
        </div>
      </nav>
    </header>

    {/* Dynamic Spacer for fixed header */}
    <div style={{ height: headerHeight }} className="shrink-0" aria-hidden="true" />
  </>
  );
};
