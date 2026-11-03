import React, { useState } from 'react';
import { ToothPassportRecord } from '../types';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface InteractiveJawChartProps {
  teeth: ToothPassportRecord[];
  selectedToothNum: number;
  onSelectTooth: (toothNum: number) => void;
}

interface ToothMeta {
  num: number;
  x: number;
  y: number;
  angle: number;
  type: 'central' | 'lateral' | 'canine' | 'premolar' | 'molar';
  width: number;
  height: number;
}

// 32 Anatomical Teeth Coordinates along Upper (Maxilla) & Lower (Mandible) Arches
const TEETH_DATA: ToothMeta[] = [
  // Upper Right (Q1: 18 -> 11)
  { num: 18, x: 138, y: 310, angle: -88, type: 'molar', width: 38, height: 35 },
  { num: 17, x: 156, y: 255, angle: -80, type: 'molar', width: 40, height: 36 },
  { num: 16, x: 182, y: 202, angle: -68, type: 'molar', width: 42, height: 38 },
  { num: 15, x: 215, y: 155, angle: -52, type: 'premolar', width: 33, height: 32 },
  { num: 14, x: 258, y: 118, angle: -38, type: 'premolar', width: 34, height: 32 },
  { num: 13, x: 304, y: 90, angle: -24, type: 'canine', width: 30, height: 34 },
  { num: 12, x: 350, y: 72, angle: -14, type: 'lateral', width: 28, height: 31 },
  { num: 11, x: 385, y: 65, angle: -4, type: 'central', width: 30, height: 33 },

  // Upper Left (Q2: 21 -> 28)
  { num: 21, x: 415, y: 65, angle: 4, type: 'central', width: 30, height: 33 },
  { num: 22, x: 450, y: 72, angle: 14, type: 'lateral', width: 28, height: 31 },
  { num: 23, x: 496, y: 90, angle: 24, type: 'canine', width: 30, height: 34 },
  { num: 24, x: 542, y: 118, angle: 38, type: 'premolar', width: 34, height: 32 },
  { num: 25, x: 585, y: 155, angle: 52, type: 'premolar', width: 33, height: 32 },
  { num: 26, x: 618, y: 202, angle: 68, type: 'molar', width: 42, height: 38 },
  { num: 27, x: 644, y: 255, angle: 80, type: 'molar', width: 40, height: 36 },
  { num: 28, x: 662, y: 310, angle: 88, type: 'molar', width: 38, height: 35 },

  // Lower Right (Q4: 48 -> 41)
  { num: 48, x: 140, y: 410, angle: 88, type: 'molar', width: 38, height: 35 },
  { num: 47, x: 158, y: 465, angle: 80, type: 'molar', width: 40, height: 36 },
  { num: 46, x: 182, y: 518, angle: 68, type: 'molar', width: 42, height: 38 },
  { num: 45, x: 215, y: 565, angle: 52, type: 'premolar', width: 32, height: 31 },
  { num: 44, x: 258, y: 602, angle: 38, type: 'premolar', width: 33, height: 31 },
  { num: 43, x: 304, y: 630, angle: 24, type: 'canine', width: 29, height: 33 },
  { num: 42, x: 350, y: 648, angle: 14, type: 'lateral', width: 26, height: 30 },
  { num: 41, x: 385, y: 655, angle: 4, type: 'central', width: 27, height: 32 },

  // Lower Left (Q3: 31 -> 38)
  { num: 31, x: 415, y: 655, angle: -4, type: 'central', width: 27, height: 32 },
  { num: 32, x: 450, y: 648, angle: -14, type: 'lateral', width: 26, height: 30 },
  { num: 33, x: 496, y: 630, angle: -24, type: 'canine', width: 29, height: 33 },
  { num: 34, x: 542, y: 602, angle: -38, type: 'premolar', width: 33, height: 31 },
  { num: 35, x: 585, y: 565, angle: -52, type: 'premolar', width: 32, height: 31 },
  { num: 36, x: 618, y: 518, angle: -68, type: 'molar', width: 42, height: 38 },
  { num: 37, x: 644, y: 465, angle: -80, type: 'molar', width: 40, height: 36 },
  { num: 38, x: 662, y: 410, angle: -88, type: 'molar', width: 38, height: 35 }
];

export const InteractiveJawChart: React.FC<InteractiveJawChartProps> = ({
  teeth,
  selectedToothNum,
  onSelectTooth
}) => {
  const [hoveredTooth, setHoveredTooth] = useState<ToothPassportRecord | null>(null);

  // Map teeth data for O(1) lookup
  const teethMap = React.useMemo(() => {
    const map = new Map<number, ToothPassportRecord>();
    teeth.forEach((t) => map.set(t.tooth_number, t));
    return map;
  }, [teeth]);

  const activeToothRecord = teethMap.get(selectedToothNum);

  return (
    <div className="relative w-full bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-slate-800 overflow-hidden select-none">
      {/* Background Subtle Grid / Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none" />

      {/* Top Bar inside Jaw Card: Quick Status & Legend */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-200">
            چارت آناتومیک فک ۳۲ دندان (FDI Dental Arch)
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            (کلیک روی هر دندان برای مشاهده یا ثبت مشخصات)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-100 border border-slate-300 shadow-2xs inline-block" />
            <span>دندان طبیعی</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 border border-emerald-300 shadow-2xs inline-block" />
            <span className="text-emerald-300 font-medium">دارای ایمپلنت 🔩</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-400 border border-amber-200 shadow-2xs ring-2 ring-amber-400/50 inline-block" />
            <span className="text-amber-300 font-bold">انتخاب‌شده ⭐</span>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center">
        <svg
          viewBox="0 0 800 720"
          className="w-full h-auto max-h-[580px] drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Natural Tooth Enamel Gradient */}
            <linearGradient id="enamelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>

            {/* Natural Tooth Hover Gradient */}
            <linearGradient id="enamelHoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Implanted Tooth Titanium/Emerald Gradient */}
            <linearGradient id="implantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Selected Tooth Gold Glow Gradient */}
            <linearGradient id="selectedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Gum Arch Aesthetic Path Gradient */}
            <radialGradient id="gumArchGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
            </radialGradient>

            {/* Glowing filter for selected tooth */}
            <filter id="glowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* ARCH BACKGROUNDS & GUM SILHOUETTES */}
          {/* ======================================================== */}
          {/* Upper Jaw Gum Horseshoe */}
          <path
            d="M 125,320 C 130,130 260,35 400,35 C 540,35 670,130 675,320 C 630,320 600,160 400,95 C 200,160 170,320 125,320 Z"
            fill="url(#gumArchGrad)"
            stroke="#1e293b"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Lower Jaw Gum Horseshoe */}
          <path
            d="M 125,400 C 130,590 260,685 400,685 C 540,685 670,590 675,400 C 630,400 600,560 400,625 C 200,560 170,400 125,400 Z"
            fill="url(#gumArchGrad)"
            stroke="#1e293b"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Midline & Orientation Guides */}
          {/* Vertical Midline */}
          <line
            x1="400"
            y1="40"
            x2="400"
            y2="680"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* Horizontal Midline */}
          <line
            x1="120"
            y1="360"
            x2="680"
            y2="360"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* Quadrant / Dental Arch Text Labels */}
          {/* Right vs Left Patient Markers */}
          <text x="130" y="355" fill="#94a3b8" fontSize="13" fontWeight="bold" textAnchor="start">
            راست بیمار (R)
          </text>
          <text x="670" y="355" fill="#94a3b8" fontSize="13" fontWeight="bold" textAnchor="end">
            چپ بیمار (L)
          </text>

          {/* Quadrants Markers */}
          <text x="260" y="240" fill="#475569" fontSize="11" fontWeight="bold" textAnchor="middle">
            فک بالا راست (Q1)
          </text>
          <text x="540" y="240" fill="#475569" fontSize="11" fontWeight="bold" textAnchor="middle">
            فک بالا چپ (Q2)
          </text>
          <text x="260" y="480" fill="#475569" fontSize="11" fontWeight="bold" textAnchor="middle">
            فک پایین راست (Q4)
          </text>
          <text x="540" y="480" fill="#475569" fontSize="11" fontWeight="bold" textAnchor="middle">
            فک پایین چپ (Q3)
          </text>

          {/* Center Dental Federation Seal */}
          <g transform="translate(400, 360)">
            <circle r="36" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" opacity="0.9" />
            <text y="-8" fill="#10b981" fontSize="10" fontWeight="900" textAnchor="middle">
              FDI 32
            </text>
            <text y="8" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
              چارت استاندارد
            </text>
            <text y="20" fill="#64748b" fontSize="7" textAnchor="middle">
              {activeToothRecord ? `فعال: #${activeToothRecord.tooth_number}` : 'کلیک کنید'}
            </text>
          </g>

          {/* ======================================================== */}
          {/* 32 INTERACTIVE ANATOMICAL TEETH */}
          {/* ======================================================== */}
          {TEETH_DATA.map((t) => {
            const toothRecord = teethMap.get(t.num);
            const isSelected = selectedToothNum === t.num;
            const isImplanted = !!toothRecord?.is_implanted;
            const isHovered = hoveredTooth?.tooth_number === t.num;

            // Geometry calculations
            const rx = t.width / 2;
            const ry = t.height / 2;

            return (
              <g
                key={t.num}
                transform={`translate(${t.x}, ${t.y}) rotate(${t.angle})`}
                onClick={() => onSelectTooth(t.num)}
                onMouseEnter={() => toothRecord && setHoveredTooth(toothRecord)}
                onMouseLeave={() => setHoveredTooth(null)}
                className="cursor-pointer transition-transform duration-200 focus:outline-hidden"
                role="button"
                tabIndex={0}
                aria-label={`دندان ${t.num} - ${toothRecord?.tooth_name_fa || ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTooth(t.num);
                  }
                }}
              >
                {/* Selected Pulsing Aura Ring */}
                {isSelected && (
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={rx + 8}
                    ry={ry + 8}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3.5"
                    strokeDasharray="4 2"
                    filter="url(#glowFilter)"
                    className="animate-spin"
                    style={{ transformOrigin: '0 0', animationDuration: '8s' }}
                  />
                )}

                {/* Outer Shadow / Elevation */}
                <ellipse
                  cx="0"
                  cy="2"
                  rx={rx + 1}
                  ry={ry + 1}
                  fill="#020617"
                  opacity={isSelected ? '0.7' : '0.4'}
                />

                {/* Main Tooth Crown Shape */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={rx}
                  ry={ry}
                  fill={
                    isSelected
                      ? 'url(#selectedGrad)'
                      : isImplanted
                      ? 'url(#implantGrad)'
                      : isHovered
                      ? 'url(#enamelHoverGrad)'
                      : 'url(#enamelGrad)'
                  }
                  stroke={
                    isSelected
                      ? '#ffffff'
                      : isImplanted
                      ? '#6ee7b7'
                      : isHovered
                      ? '#38bdf8'
                      : '#cbd5e1'
                  }
                  strokeWidth={isSelected ? '2.5' : isImplanted ? '2' : '1.2'}
                  filter={isSelected ? 'url(#glowFilter)' : undefined}
                />

                {/* Anatomical Grooves / Fissures (خصوصاً برای دندان‌های آسیاب و پری‌مولر) */}
                {t.type === 'molar' && (
                  <path
                    d={`M ${-rx * 0.45},0 L ${rx * 0.45},0 M 0,${-ry * 0.45} L 0,${ry * 0.45}`}
                    stroke={isSelected ? '#78350f' : isImplanted ? '#064e3b' : '#94a3b8'}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                )}

                {t.type === 'premolar' && (
                  <path
                    d={`M ${-rx * 0.35},0 L ${rx * 0.35},0`}
                    stroke={isSelected ? '#78350f' : isImplanted ? '#064e3b' : '#94a3b8'}
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                )}

                {/* Implant Screw Hex / Indicator */}
                {isImplanted && !isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r={Math.min(rx, ry) * 0.42}
                    fill="#047857"
                    stroke="#a7f3d0"
                    strokeWidth="1.5"
                  />
                )}

                {/* Tooth Number Text (Counter-rotated so text is always horizontal and easily readable!) */}
                <g transform={`rotate(${-t.angle})`}>
                  <text
                    x="0"
                    y="3.5"
                    fill={isSelected ? '#ffffff' : isImplanted ? '#ffffff' : '#0f172a'}
                    fontSize={t.type === 'molar' ? '12' : '10.5'}
                    fontWeight="900"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                    style={{ textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.5)' : undefined }}
                  >
                    {t.num}
                  </text>

                  {/* Implant Tiny Icon Marker */}
                  {isImplanted && (
                    <text
                      x="0"
                      y={-ry - 4}
                      fontSize="9"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      🔩
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip upon Hover */}
        {hoveredTooth && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white text-xs px-4 py-2 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-3 z-30 pointer-events-none animate-fadeIn">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black text-sm flex items-center justify-center border border-emerald-500/30">
              #{hoveredTooth.tooth_number}
            </span>
            <div>
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <span>{hoveredTooth.tooth_name_fa}</span>
                {hoveredTooth.is_implanted ? (
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded-sm font-semibold">
                    ایمپلنت فعال
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded-sm">
                    طبیعی
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {hoveredTooth.is_implanted
                  ? `${hoveredTooth.brand_name || 'ایمپلنت'} (REF: ${hoveredTooth.fixture_ref || '-'})`
                  : 'جهت ثبت قطعه یا صدور پاسپورت کلیک کنید'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hint Strip */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            دندان فعال در کادر شناسنامه:{' '}
            <strong className="text-amber-300 font-bold font-mono">
              #{selectedToothNum}
            </strong>{' '}
            - {activeToothRecord?.tooth_name_fa}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          استاندارد ISO 3950 / FDI دو رقمی (رقم اول ربع فک، رقم دوم موقعیت از خط وسط)
        </span>
      </div>
    </div>
  );
};
