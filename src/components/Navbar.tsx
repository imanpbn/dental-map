import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  ShieldCheck,
  Stethoscope,
  BookOpen,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  Settings,
  UserCheck,
  Home,
  Building2,
  Phone,
  Info,
  FileText
} from 'lucide-react';
import { DentalComponent, Doctor, ImplantBrand } from '../types';
import { formatPrice } from '../utils/formatters';

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
  const [isBrandsMenuOpen, setIsBrandsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileBrandsOpen, setIsMobileBrandsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const brandsMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
          } else if (diff > 6 && currentScrollY > 70 && !isMobileMenuOpen) {
            // User scrolled down -> hide header and dismiss active dropdowns
            setIsVisible(false);
            setIsBrandsMenuOpen(false);
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
  }, [isMobileMenuOpen]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (brandsMenuRef.current && !brandsMenuRef.current.contains(event.target as Node)) {
        setIsBrandsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const matchedComponents = query
    ? components
        .filter(
          (c) =>
            c.ref_code.toLowerCase().includes(query) ||
            c.name_fa.toLowerCase().includes(query) ||
            c.name_en.toLowerCase().includes(query)
        )
        .slice(0, 4)
    : [];

  const matchedDoctors = query
    ? doctors
        .filter(
          (d) =>
            `${d.first_name} ${d.last_name}`.toLowerCase().includes(query) ||
            d.medical_council_code.toLowerCase().includes(query)
        )
        .slice(0, 3)
    : [];

  const matchedBrands = query
    ? brands.filter((b) => b.name.toLowerCase().includes(query)).slice(0, 3)
    : [];

  const hasResults =
    query.length > 0 &&
    (matchedComponents.length > 0 || matchedDoctors.length > 0 || matchedBrands.length > 0);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all duration-300 ease-in-out ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Main Navbar Top Row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Right: Hamburger button (Mobile only) + Brand Logo */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Hamburger Button (Mobile only) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="باز کردن منو"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand Logo & Name */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                      دنتال مَپ
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-[11px] text-slate-500 -mt-0.5 font-medium">
                    شفافیت، اصالت قطعات و دایرکتوری ایمپلنت
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Live Search Bar */}
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
                  className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-3 focus:ring-emerald-500/15 transition-all truncate"
                />
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute right-2.5 sm:right-3.5 top-2.5 sm:top-3 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                          className="w-full text-right px-2.5 py-1.5 hover:bg-emerald-50/70 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{comp.name_fa}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              REF: {comp.ref_code} | {comp.platform_size}
                            </span>
                          </div>
                          <span className="text-emerald-700 font-bold font-mono">
                            {formatPrice(comp.price_toman)}
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
                          className="w-full text-right px-2.5 py-1.5 hover:bg-teal-50/70 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer"
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
                        <Link
                          key={brand.id}
                          to={brand.slug === 'naxis' ? '/naxis-guide' : `/brands/${brand.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="px-2.5 py-1.5 flex items-center justify-between text-xs text-slate-700 hover:bg-amber-50/60 rounded-lg transition-colors"
                        >
                          <span className="font-medium">
                            {brand.logo} {brand.name}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {brand.warranty_description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Left: Quick Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Doctor Registration (Desktop/Tablet) */}
              <Link
                to="/doctor-join"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-all whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ثبت‌نام پزشکان</span>
              </Link>

              {/* Quiz Button (Visible on all sizes, compact on mobile) */}
              <Link
                to="/quiz"
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:scale-105 transition-all whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">آزمون ایمپلنت</span>
                <span className="xs:hidden">آزمون</span>
              </Link>

              {/* Admin Toggle */}
              <button
                onClick={onToggleAdmin}
                className={`p-1.5 sm:p-2 rounded-xl border text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  isAdminOpen
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title="پنل مدیریت و ارزیابی لید"
                aria-label="پنل مدیریت"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Menu Bar (Hidden on Mobile) */}
        <nav className="hidden md:block bg-white border-t border-slate-200 text-xs sm:text-sm font-semibold relative z-40">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-2 py-1 overflow-visible">
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative overflow-visible">
              {/* 1. برندها (منوی آبشاری) */}
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

                {/* منوی بازشونده برندها */}
                {isBrandsMenuOpen && (
                  <div className="absolute right-0 top-full mt-0.5 w-76 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 animate-fadeIn">
                    <Link
                      to="/naxis-guide"
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
                    </Link>

                    {brands &&
                      brands.length > 0 &&
                      brands.map((brand) => (
                        <Link
                          key={brand.id}
                          to={brand.slug === 'naxis' ? '/naxis-guide' : `/brands/${brand.slug}`}
                          onClick={() => {
                            if (brand.slug === 'naxis') {
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
                        </Link>
                      ))}

                    <Link
                      to="/brands"
                      onClick={() => setIsBrandsMenuOpen(false)}
                      className="block text-center px-4 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/80 transition-colors cursor-pointer"
                    >
                      <span>مشاهده همه برندها و سازندگان ←</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. دندانپزشکان و جراحان */}
              <Link
                to="/directory"
                className="px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>دندانپزشکان و جراحان سراسر کشور</span>
              </Link>

              {/* 3. دانشنامه و وبلاگ */}
              <Link
                to="/blog"
                className="px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>مقالات و دانشنامه</span>
              </Link>

              {/* 4. درباره دنتال‌مپ */}
              <Link
                to="/page/about-us"
                className="hidden lg:inline-flex px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                درباره ما
              </Link>

              {/* 5. قوانین و مقررات */}
              <Link
                to="/page/terms"
                className="hidden xl:inline-flex px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                قوانین
              </Link>

              {/* 6. تماس با ما */}
              <Link
                to="/page/contact"
                className="hidden xl:inline-flex px-3.5 py-2.5 text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Dynamic Spacer for fixed header */}
      <div style={{ height: headerHeight }} className="shrink-0" aria-hidden="true" />

      {/* =================================================================== */}
      {/* Mobile Hamburger Drawer (منوی همبرگری موبایل) */}
      {/* =================================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Menu Body */}
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-black text-slate-900 block leading-tight">
                    دنتال مَپ
                  </span>
                  <span className="text-[10px] text-slate-500 block">شفافیت ایمپلنتولوژی</span>
                </div>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="بستن منو"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action CTA Buttons */}
            <div className="p-3.5 bg-emerald-50/40 border-b border-emerald-100/60 space-y-2">
              <Link
                to="/quiz"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>آزمون هوشمند ایمپلنت</span>
              </Link>

              <Link
                to="/doctor-join"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>ثبت‌نام پزشکان و کلینیک‌ها</span>
              </Link>
            </div>

            {/* Navigation Links Scrollable List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-100 text-xs font-semibold">
              <div className="space-y-1 pb-2">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <Home className="w-4 h-4 text-emerald-600" />
                  <span>صفحه اصلی</span>
                </Link>

                <Link
                  to="/directory"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span>دندانپزشکان و جراحان سراسر کشور</span>
                </Link>

                <Link
                  to="/clinics"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>کلینیک‌ها و مراکز درمانی</span>
                </Link>

                <Link
                  to="/parts"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>کاتالوگ قطعات و استعلام رفرنس</span>
                </Link>

                <Link
                  to="/passport"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>پاسپورت ۳۲ دندان (شناسنامه)</span>
                </Link>
              </div>

              {/* Accordion: برندها و سازندگان */}
              <div className="py-2">
                <button
                  type="button"
                  onClick={() => setIsMobileBrandsOpen(!isMobileBrandsOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>برندها و سیستم‌های ایمپلنت</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isMobileBrandsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isMobileBrandsOpen && (
                  <div className="pr-6 pl-2 py-1 space-y-1 text-slate-600">
                    <Link
                      to="/naxis-guide"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenNaxisGuide();
                      }}
                      className="flex items-center gap-2 py-2 px-2.5 text-emerald-800 font-bold hover:bg-emerald-50 rounded-lg text-xs"
                    >
                      <span>🇩🇪</span>
                      <span>راهنمای ناکسیس آلمان (Naxis)</span>
                    </Link>

                    {brands &&
                      brands.map((brand) => (
                        <Link
                          key={brand.id}
                          to={brand.slug === 'naxis' ? '/naxis-guide' : `/brands/${brand.slug}`}
                          onClick={() => {
                            if (brand.slug === 'naxis') onOpenNaxisGuide();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-between py-1.5 px-2.5 hover:text-emerald-700 hover:bg-slate-50 rounded-lg text-xs"
                        >
                          <span className="flex items-center gap-2">
                            <span>{brand.logo || '🦷'}</span>
                            <span>{brand.name}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">مشاهده ←</span>
                        </Link>
                      ))}

                    <Link
                      to="/brands"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center py-2 px-2 text-[11px] font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 rounded-lg"
                    >
                      مشاهده همه برندها ←
                    </Link>
                  </div>
                )}
              </div>

              {/* Articles & Static Pages */}
              <div className="pt-2 space-y-1">
                <Link
                  to="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>مقالات و دانشنامه</span>
                </Link>

                <Link
                  to="/page/about-us"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>درباره ما</span>
                </Link>

                <Link
                  to="/page/terms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>قوانین و مقررات</span>
                </Link>

                <Link
                  to="/page/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>تماس با ما</span>
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
              <span>دنتال‌مپ • نسخه ۳.۰</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onToggleAdmin();
                }}
                className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 font-bold cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>ورود مدیریت</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
