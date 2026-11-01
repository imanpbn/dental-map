import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  CheckCircle,
  Tag,
  ShieldCheck,
  ChevronLeft,
  X,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { DentalComponent, ComponentCategory, ImplantBrand } from '../types';

interface PartsExplorerProps {
  components: DentalComponent[];
  brands: ImplantBrand[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectComponent: (comp: DentalComponent) => void;
}

export const PartsExplorer: React.FC<PartsExplorerProps> = ({
  components,
  brands,
  selectedCategory,
  onSelectCategory,
  onSelectComponent
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<number | 'all'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories: { id: string; label: string; sub: string }[] = [
    { id: 'all', label: 'همه قطعات', sub: 'مشاهده کل کاتالوگ' },
    { id: 'fixture', label: 'فیکسچر (Fixture)', sub: 'حیاتی / داخل استخوان' },
    { id: 'abutment', label: 'اباتمنت (Abutment)', sub: 'پروتزی / بافت نرم' },
    { id: 'healing', label: 'هیلینگ کپ (Healing)', sub: 'شکل‌دهنده لثه' },
    { id: 'impression_coping', label: 'ایمپرشن کوپینگ', sub: 'انتقال به لابراتوار' },
    { id: 'analog', label: 'آنالوگ کست (Analog)', sub: 'شبیه‌ساز فیکسچر در گچ' },
    { id: 'surgical_kit', label: 'کیت جراحی (Surgical)', sub: 'دریل، درایور و ترکمتر' },
    { id: 'scan_body', label: 'اسکن بادی (Scan Body)', sub: 'شاخص اسکن دیجیتال' },
    { id: 'digital_analog', label: 'آنالوگ ۳ بعدی', sub: 'پرینت رزینی دیجیتال' }
  ];

  // Filtering
  const filteredComponents = components.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedBrand !== 'all' && item.brand_id !== selectedBrand) {
      return false;
    }
    if (inStockOnly && !item.in_stock) {
      return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchRef = item.ref_code.toLowerCase().includes(q);
      const matchNameFa = item.name_fa.toLowerCase().includes(q);
      const matchNameEn = item.name_en.toLowerCase().includes(q);
      const matchLot = item.lot_number.toLowerCase().includes(q);
      const matchCompat = item.compatibility.toLowerCase().includes(q);
      return matchRef || matchNameFa || matchNameEn || matchLot || matchCompat;
    }
    return true;
  });

  return (
    <section id="parts-catalog" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>کاتالوگ جامع قطعات و سیستم‌های ایمپلنتولوژی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            کاوشگر و موتور جستجوی کدهای رفرنس (REF Code Explorer)
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            فیلتر قطعات بر اساس ۸ دسته استاندارد، برندهای سوئیسی، آلمانی، آمریکایی و کره‌ای، و ابعاد پلتفرم
          </p>
        </div>

        {/* 8 Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl shrink-0 text-right transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold">{cat.label}</div>
              <div
                className={`text-[10px] mt-0.5 ${
                  selectedCategory === cat.id ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {cat.sub}
              </div>
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="جستجو با کد REF، لات نامبر، سازگاری یا نام قطعه..."
                className="w-full pr-10 pl-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedBrand}
                onChange={(e) =>
                  setSelectedBrand(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
              >
                <option value="all">همه برندها (Straumann, Naxis, Osstem, Dentium, Zimmer, Megagen)</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Switch */}
            <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <span>فقط قطعات موجود در انبار</span>
              </label>

              <span className="text-[11px] font-medium text-slate-400">
                {filteredComponents.length} قطعه یافت شد
              </span>
            </div>
          </div>
        </div>

        {/* Components Grid */}
        {filteredComponents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-sm">هیچ قطعه‌ای با این مشخصات یافت نشد</h4>
            <p className="text-xs text-slate-500 mt-1">
              لطفاً عبارات جستجو را تغییر دهید یا فیلتر دسته‌بندی را روی همه تنظیم کنید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredComponents.map((item) => {
              const brand = brands.find((b) => b.id === item.brand_id);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectComponent(item)}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/50 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Chips */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300">
                        REF: {item.ref_code}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {brand?.logo} {brand?.name.split(' ')[0]}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-100 mb-4">
                      <img
                        src={item.image_url}
                        alt={item.name_fa}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Name & Desc */}
                    <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 group-hover:text-emerald-700 transition-colors">
                      {item.name_fa}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 mb-2 truncate">
                      {item.name_en}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Technical details badge grid */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                      <div>
                        <span className="text-slate-400 block text-[10px]">پلتفرم / هگز:</span>
                        <span className="font-mono font-medium text-slate-700">
                          {item.hex_size || item.platform_size}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">مورس تیپر:</span>
                        <span className="font-mono font-medium text-slate-700">
                          {item.morse_taper_angle || '—'}
                        </span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/50">
                        <span className="text-slate-400 block text-[10px]">سازگاری بالینی:</span>
                        <span className="text-slate-700 font-medium line-clamp-1">
                          {item.compatibility}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">قیمت مصرف‌کننده:</span>
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {item.price_toman.toLocaleString('fa-IR')}{' '}
                        <span className="text-[10px] font-normal text-slate-500">تومان</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectComponent(item);
                      }}
                      className="px-3 py-1.5 bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>بررسی فنی</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
