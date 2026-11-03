import React, { useState } from 'react';
import { ToothPassportRecord } from '../types';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

interface InteractiveJawChartProps {
  teeth: ToothPassportRecord[];
  selectedToothNum: number;
  onSelectTooth: (toothNum: number) => void;
}

interface ToothCoordinate {
  num: number;
  x: number;
  y: number;
  name: string;
  quadrant: 1 | 2 | 3 | 4;
}

// Exact 32 Anatomical Teeth Coordinates mapped directly to the 3D Jaw Image (969 x 1024 px)
const TOOTH_COORDINATES: ToothCoordinate[] = [
  // Upper Right (Quadrant 1: Patient Right / Viewer Left - 18 down to 11)
  { num: 18, x: 55, y: 395, name: 'عقل بالا راست', quadrant: 1 },
  { num: 17, x: 80, y: 335, name: 'آسیاب دوم بالا راست', quadrant: 1 },
  { num: 16, x: 125, y: 295, name: 'آسیاب اول بالا راست', quadrant: 1 },
  { num: 15, x: 168, y: 258, name: 'پری‌مولر دوم بالا راست', quadrant: 1 },
  { num: 14, x: 222, y: 236, name: 'پری‌مولر اول بالا راست', quadrant: 1 },
  { num: 13, x: 278, y: 226, name: 'نیش بالا راست', quadrant: 1 },
  { num: 12, x: 345, y: 232, name: 'پیشین کناری بالا راست', quadrant: 1 },
  { num: 11, x: 418, y: 245, name: 'پیشین میانی بالا راست (سانترال)', quadrant: 1 },

  // Upper Left (Quadrant 2: Patient Left / Viewer Right - 21 up to 28)
  { num: 21, x: 532, y: 278, name: 'پیشین میانی بالا چپ (سانترال)', quadrant: 2 },
  { num: 22, x: 648, y: 312, name: 'پیشین کناری بالا چپ', quadrant: 2 },
  { num: 23, x: 742, y: 358, name: 'نیش بالا چپ', quadrant: 2 },
  { num: 24, x: 812, y: 412, name: 'پری‌مولر اول بالا چپ', quadrant: 2 },
  { num: 25, x: 868, y: 462, name: 'پری‌مولر دوم بالا چپ', quadrant: 2 },
  { num: 26, x: 912, y: 502, name: 'آسیاب اول بالا چپ', quadrant: 2 },
  { num: 27, x: 945, y: 532, name: 'آسیاب دوم بالا چپ', quadrant: 2 },
  { num: 28, x: 960, y: 560, name: 'عقل بالا چپ', quadrant: 2 },

  // Lower Right (Quadrant 4: Patient Right / Viewer Left - 48 down to 41)
  { num: 48, x: 165, y: 520, name: 'عقل پایین راست', quadrant: 4 },
  { num: 47, x: 140, y: 555, name: 'آسیاب دوم پایین راست', quadrant: 4 },
  { num: 46, x: 115, y: 605, name: 'آسیاب اول پایین راست', quadrant: 4 },
  { num: 45, x: 95, y: 655, name: 'پری‌مولر دوم پایین راست', quadrant: 4 },
  { num: 44, x: 110, y: 715, name: 'پری‌مولر اول پایین راست', quadrant: 4 },
  { num: 43, x: 145, y: 770, name: 'نیش پایین راست', quadrant: 4 },
  { num: 42, x: 245, y: 815, name: 'پیشین کناری پایین راست', quadrant: 4 },
  { num: 41, x: 360, y: 835, name: 'پیشین میانی پایین راست (سانترال)', quadrant: 4 },

  // Lower Left (Quadrant 3: Patient Left / Viewer Right - 31 up to 38)
  { num: 31, x: 465, y: 835, name: 'پیشین میانی پایین چپ (سانترال)', quadrant: 3 },
  { num: 32, x: 575, y: 815, name: 'پیشین کناری پایین چپ', quadrant: 3 },
  { num: 33, x: 675, y: 775, name: 'نیش پایین چپ', quadrant: 3 },
  { num: 34, x: 760, y: 735, name: 'پری‌مولر اول پایین چپ', quadrant: 3 },
  { num: 35, x: 825, y: 695, name: 'پری‌مولر دوم پایین چپ', quadrant: 3 },
  { num: 36, x: 875, y: 650, name: 'آسیاب اول پایین چپ', quadrant: 3 },
  { num: 37, x: 915, y: 610, name: 'آسیاب دوم پایین چپ', quadrant: 3 },
  { num: 38, x: 935, y: 575, name: 'عقل پایین چپ', quadrant: 3 }
];

export const InteractiveJawChart: React.FC<InteractiveJawChartProps> = ({
  teeth,
  selectedToothNum,
  onSelectTooth
}) => {
  const [hoveredToothNum, setHoveredToothNum] = useState<number | null>(null);
  const [showAllNumbers, setShowAllNumbers] = useState<boolean>(true);

  // Fast tooth record lookup map
  const teethMap = React.useMemo(() => {
    const map = new Map<number, ToothPassportRecord>();
    teeth.forEach((t) => map.set(t.tooth_number, t));
    return map;
  }, [teeth]);

  const activeToothRecord = teethMap.get(selectedToothNum);
  const hoveredToothRecord = hoveredToothNum ? teethMap.get(hoveredToothNum) : null;

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-slate-900 rounded-3xl p-3 sm:p-5 text-white shadow-2xl border border-slate-800 overflow-hidden select-none">
      {/* Top Bar: Controls & Legend */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-100">
            مدل سه‌بعدی فک و ۳۲ دندان (FDI Digital Passport)
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Toggle All Numbers on Image */}
          <button
            type="button"
            onClick={() => setShowAllNumbers(!showAllNumbers)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-300 transition-colors border border-slate-700 cursor-pointer"
          >
            {showAllNumbers ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{showAllNumbers ? 'پنهان کردن شماره‌ها' : 'نمایش شماره همه دندان‌ها'}</span>
          </button>

          {/* Color legend */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400 inline-block" />
              <span>طبیعی</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300 inline-block" />
              <span className="text-emerald-300">ایمپلنت 🔩</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-200 ring-2 ring-amber-400/50 inline-block" />
              <span className="text-amber-300 font-bold">انتخاب‌شده ⭐</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Photographic Interactive 3D Model with SVG Overlay */}
      <div className="relative w-full aspect-[969/1024] rounded-2xl overflow-hidden bg-slate-950 shadow-inner border border-slate-800">
        {/* Exact User Uploaded 3D Jaw Image */}
        <img
          src="/images/dental-jaw-3d.jpg"
          alt="مدل آناتومیک فک ۳۲ دندان دنتال‌مپ"
          className="w-full h-full object-cover block select-none pointer-events-none"
        />

        {/* SVG Interactive Overlay using 1:1 image viewBox (969 x 1024) */}
        <svg
          viewBox="0 0 969 1024"
          className="absolute inset-0 w-full h-full pointer-events-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pulsing Glow Filter for Selected Tooth */}
            <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Upper / Lower Labels subtle overlay */}
          <text x="484" y="90" fill="#ffffff" opacity="0.6" fontSize="20" fontWeight="bold" textAnchor="middle">
            فک بالا (Maxilla)
          </text>
          <text x="484" y="980" fill="#ffffff" opacity="0.6" fontSize="20" fontWeight="bold" textAnchor="middle">
            فک پایین (Mandible)
          </text>

          {/* Orientation tags */}
          <text x="40" y="220" fill="#cbd5e1" opacity="0.8" fontSize="16" fontWeight="bold" textAnchor="start">
            راست (R)
          </text>
          <text x="930" y="220" fill="#cbd5e1" opacity="0.8" fontSize="16" fontWeight="bold" textAnchor="end">
            چپ (L)
          </text>

          {/* 32 Interactive Pins on Teeth */}
          {TOOTH_COORDINATES.map((t) => {
            const toothRecord = teethMap.get(t.num);
            const isSelected = selectedToothNum === t.num;
            const isImplanted = !!toothRecord?.is_implanted;
            const isHovered = hoveredToothNum === t.num;

            // Pin dimensions
            const radius = isSelected ? 24 : isHovered ? 20 : 16;

            return (
              <g
                key={t.num}
                transform={`translate(${t.x}, ${t.y})`}
                onClick={() => onSelectTooth(t.num)}
                onMouseEnter={() => setHoveredToothNum(t.num)}
                onMouseLeave={() => setHoveredToothNum(null)}
                className="cursor-pointer transition-all duration-150 focus:outline-hidden"
                role="button"
                tabIndex={0}
                aria-label={`دندان ${t.num} - ${t.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTooth(t.num);
                  }
                }}
              >
                {/* Large clickable invisible hit area */}
                <circle r={32} fill="transparent" />

                {/* Animated Pulsing Radar Rings for Selected Tooth */}
                {isSelected && (
                  <>
                    <circle
                      r={38}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      opacity="0.8"
                      className="animate-ping"
                      style={{ animationDuration: '2s' }}
                    />
                    <circle
                      r={30}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '6s' }}
                    />
                  </>
                )}

                {/* Outer Shadow */}
                <circle
                  cx="0"
                  cy="2"
                  r={radius}
                  fill="#000000"
                  opacity={isSelected ? '0.7' : '0.45'}
                />

                {/* Main Pin Circle */}
                <circle
                  cx="0"
                  cy="0"
                  r={radius}
                  fill={
                    isSelected
                      ? '#f59e0b'
                      : isImplanted
                      ? '#10b981'
                      : isHovered
                      ? '#0284c7'
                      : showAllNumbers
                      ? 'rgba(15, 23, 42, 0.75)'
                      : 'rgba(255, 255, 255, 0.4)'
                  }
                  stroke={
                    isSelected
                      ? '#ffffff'
                      : isImplanted
                      ? '#6ee7b7'
                      : isHovered
                      ? '#ffffff'
                      : '#cbd5e1'
                  }
                  strokeWidth={isSelected ? '3' : isHovered ? '2.5' : '1.5'}
                  filter={isSelected ? 'url(#activeGlow)' : undefined}
                />

                {/* Tooth Number Text */}
                {(showAllNumbers || isSelected || isHovered || isImplanted) && (
                  <text
                    x="0"
                    y={isImplanted && !isSelected ? '4' : '5'}
                    fill="#ffffff"
                    fontSize={isSelected ? '14' : '12'}
                    fontWeight="900"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                  >
                    {t.num}
                  </text>
                )}

                {/* Implant Screw Emoji Marker */}
                {isImplanted && (
                  <text
                    x="0"
                    y={-radius - 4}
                    fontSize="13"
                    textAnchor="middle"
                    className="select-none pointer-events-none drop-shadow-md"
                  >
                    🔩
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Live Hover Tooltip floating above tooth */}
        {hoveredToothRecord && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white text-xs px-4 py-2 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-3 z-30 pointer-events-none animate-fadeIn">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black text-sm flex items-center justify-center border border-emerald-500/30">
              #{hoveredToothRecord.tooth_number}
            </span>
            <div>
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <span>{hoveredToothRecord.tooth_name_fa}</span>
                {hoveredToothRecord.is_implanted ? (
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded-sm font-semibold">
                    ایمپلنت فعال 🔩
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded-sm">
                    طبیعی
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {hoveredToothRecord.is_implanted
                  ? `${hoveredToothRecord.brand_name || 'ایمپلنت'} (REF: ${hoveredToothRecord.fixture_ref || '-'})`
                  : 'جهت انتخاب و ثبت در شناسنامه کلیک فرمایید'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hint Banner */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>
            دندان فعال:{' '}
            <strong className="text-amber-300 font-bold font-mono text-sm">
              #{selectedToothNum}
            </strong>{' '}
            - {activeToothRecord?.tooth_name_fa}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          کلیک روی دندان در تصویر ⇄ انتخاب متقابل در کادر زیر
        </span>
      </div>
    </div>
  );
};
