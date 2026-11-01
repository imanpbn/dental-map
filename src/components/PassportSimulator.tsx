import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Building,
  Sparkles,
  Info,
  X,
  Edit3,
  Check,
  RotateCcw
} from 'lucide-react';
import { ToothPassportRecord } from '../types';

interface PassportSimulatorProps {
  teeth: ToothPassportRecord[];
  onUpdateTooth: (updated: ToothPassportRecord) => void;
}

export const PassportSimulator: React.FC<PassportSimulatorProps> = ({
  teeth,
  onUpdateTooth
}) => {
  const [selectedToothNum, setSelectedToothNum] = useState<number>(16);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Current selected tooth
  const selectedTooth = teeth.find((t) => t.tooth_number === selectedToothNum) || teeth[0];

  // Form edit states
  const [editFixtureRef, setEditFixtureRef] = useState(selectedTooth.fixture_ref || '');
  const [editLotNumber, setEditLotNumber] = useState(selectedTooth.lot_number || '');
  const [editBrandName, setEditBrandName] = useState(selectedTooth.brand_name || 'Straumann (سوئیس)');
  const [editSurgeon, setEditSurgeon] = useState(selectedTooth.surgeon_name || 'دکتر علیرضا صالحی‌راد');
  const [editClinic, setEditClinic] = useState(selectedTooth.clinic_name || 'کلینیک جراحی آتیه غرب');
  const [editTorque, setEditTorque] = useState(selectedTooth.abutment_torque_ncm || 35);
  const [editCrown, setEditCrown] = useState(selectedTooth.crown_type || 'زیرکونیا تمام‌سرامیک');
  const [editNotes, setEditNotes] = useState(selectedTooth.notes || '');

  const handleSelectTooth = (num: number) => {
    setSelectedToothNum(num);
    const tooth = teeth.find((t) => t.tooth_number === num);
    if (tooth) {
      setEditFixtureRef(tooth.fixture_ref || '');
      setEditLotNumber(tooth.lot_number || '');
      setEditBrandName(tooth.brand_name || 'Straumann (سوئیس)');
      setEditSurgeon(tooth.surgeon_name || 'دکتر علیرضا صالحی‌راد');
      setEditClinic(tooth.clinic_name || 'کلینیک جراحی آتیه غرب');
      setEditTorque(tooth.abutment_torque_ncm || 35);
      setEditCrown(tooth.crown_type || 'زیرکونیا تمام‌سرامیک');
      setEditNotes(tooth.notes || '');
      setIsEditing(false);
    }
  };

  const handleSaveTooth = () => {
    const updated: ToothPassportRecord = {
      ...selectedTooth,
      is_implanted: true,
      fixture_ref: editFixtureRef || 'REF-STANDARD-4010',
      lot_number: editLotNumber || `LOT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      brand_name: editBrandName,
      implant_model: `${editBrandName} Ø4.0 L10mm`,
      implant_date: selectedTooth.implant_date || '۱۴۰۳/۰۸/۰۱',
      surgeon_name: editSurgeon,
      clinic_name: editClinic,
      abutment_torque_ncm: editTorque,
      crown_type: editCrown,
      qr_code_hash: `DM-IR-PASSPORT-${selectedTooth.tooth_number}-${Date.now().toString().slice(-6)}`,
      notes: editNotes
    };
    onUpdateTooth(updated);
    setIsEditing(false);
  };

  const handleRemoveImplant = () => {
    const updated: ToothPassportRecord = {
      ...selectedTooth,
      is_implanted: false,
      fixture_ref: undefined,
      lot_number: undefined,
      brand_name: undefined,
      implant_model: undefined,
      implant_date: undefined,
      surgeon_name: undefined,
      clinic_name: undefined,
      abutment_torque_ncm: undefined,
      crown_type: undefined,
      qr_code_hash: undefined,
      notes: undefined
    };
    onUpdateTooth(updated);
    setIsEditing(false);
  };

  // Quadrants
  // Q1: 18 down to 11
  const q1 = teeth.filter((t) => t.quadrant === 1).sort((a, b) => b.tooth_number - a.tooth_number);
  // Q2: 21 up to 28
  const q2 = teeth.filter((t) => t.quadrant === 2).sort((a, b) => a.tooth_number - b.tooth_number);
  // Q4: 48 down to 41
  const q4 = teeth.filter((t) => t.quadrant === 4).sort((a, b) => b.tooth_number - a.tooth_number);
  // Q3: 31 up to 38
  const q3 = teeth.filter((t) => t.quadrant === 3).sort((a, b) => a.tooth_number - b.tooth_number);

  const implantedTeethCount = teeth.filter((t) => t.is_implanted).length;

  return (
    <section id="passport-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>استاندارد جهانی فدراسیون بین‌المللی دندانپزشکی (FDI World Dental Federation)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              شناسنامه دیجیتال فک ۳۲ دندان (Digital Implant Passport)
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              کلیک روی هر دندان برای مشاهده کد رفرنس فیکسچر، شماره لات استریل، تورک پیچ اباتمنت و صدور گواهی PDF
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              دندان‌های ثبت‌شده:{' '}
              <strong className="text-emerald-700 font-mono text-sm">{implantedTeethCount}</strong> از ۳۲
            </span>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ و دانلود شناسنامه رسمی (PDF)</span>
            </button>
          </div>
        </div>

        {/* 32 Tooth Chart Container */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              نقشه دندانی فک بالا و پایین (Maxilla & Mandible Chart)
            </span>
          </div>

          {/* Upper Jaw (Maxilla): Q1 (Right) | Q2 (Left) */}
          <div className="mb-4">
            <div className="text-[11px] font-bold text-slate-400 text-center mb-2">
              قوس فک بالا (Maxillary Arch)
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              {/* Q1: 18 to 11 */}
              <div className="flex justify-end gap-1 sm:gap-2 overflow-x-auto pb-1">
                {q1.map((t) => (
                  <button
                    key={t.tooth_number}
                    onClick={() => handleSelectTooth(t.tooth_number)}
                    className={`w-9 sm:w-12 h-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1.5 transition-all text-center border ${
                      selectedToothNum === t.tooth_number
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-105'
                        : t.is_implanted
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">{t.tooth_number}</span>
                    <span className="text-[10px]">
                      {t.is_implanted ? '🔩' : '🦷'}
                    </span>
                    <span className="text-[9px] truncate w-full text-slate-400">
                      {t.is_implanted ? 'کاشت' : 'طبیعی'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Q2: 21 to 28 */}
              <div className="flex justify-start gap-1 sm:gap-2 overflow-x-auto pb-1">
                {q2.map((t) => (
                  <button
                    key={t.tooth_number}
                    onClick={() => handleSelectTooth(t.tooth_number)}
                    className={`w-9 sm:w-12 h-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1.5 transition-all text-center border ${
                      selectedToothNum === t.tooth_number
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-105'
                        : t.is_implanted
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">{t.tooth_number}</span>
                    <span className="text-[10px]">
                      {t.is_implanted ? '🔩' : '🦷'}
                    </span>
                    <span className="text-[9px] truncate w-full text-slate-400">
                      {t.is_implanted ? 'کاشت' : 'طبیعی'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Jaw (Mandible): Q4 (Right) | Q3 (Left) */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 text-center mb-2">
              قوس فک پایین (Mandibular Arch)
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              {/* Q4: 48 to 41 */}
              <div className="flex justify-end gap-1 sm:gap-2 overflow-x-auto pb-1">
                {q4.map((t) => (
                  <button
                    key={t.tooth_number}
                    onClick={() => handleSelectTooth(t.tooth_number)}
                    className={`w-9 sm:w-12 h-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1.5 transition-all text-center border ${
                      selectedToothNum === t.tooth_number
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-105'
                        : t.is_implanted
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">{t.tooth_number}</span>
                    <span className="text-[10px]">
                      {t.is_implanted ? '🔩' : '🦷'}
                    </span>
                    <span className="text-[9px] truncate w-full text-slate-400">
                      {t.is_implanted ? 'کاشت' : 'طبیعی'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Q3: 31 to 38 */}
              <div className="flex justify-start gap-1 sm:gap-2 overflow-x-auto pb-1">
                {q3.map((t) => (
                  <button
                    key={t.tooth_number}
                    onClick={() => handleSelectTooth(t.tooth_number)}
                    className={`w-9 sm:w-12 h-14 sm:h-16 rounded-xl flex flex-col items-center justify-between p-1.5 transition-all text-center border ${
                      selectedToothNum === t.tooth_number
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-105'
                        : t.is_implanted
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">{t.tooth_number}</span>
                    <span className="text-[10px]">
                      {t.is_implanted ? '🔩' : '🦷'}
                    </span>
                    <span className="text-[9px] truncate w-full text-slate-400">
                      {t.is_implanted ? 'کاشت' : 'طبیعی'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Tooth Detail Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-mono font-black text-xl flex items-center justify-center">
                #{selectedTooth.tooth_number}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  دندان {selectedTooth.tooth_name_fa} (شماره {selectedTooth.tooth_number})
                </h3>
                <span className="text-xs text-slate-500">
                  ربع فک: {selectedTooth.quadrant} | وضعیت:{' '}
                  {selectedTooth.is_implanted ? (
                    <span className="text-emerald-700 font-bold">ایمپلنت ثبت‌شده در پاسپورت</span>
                  ) : (
                    <span className="text-slate-500">دندان طبیعی / فاقد ایمپلنت</span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{selectedTooth.is_implanted ? 'ویرایش مشخصات ایمپلنت' : 'ثبت ایمپلنت جدید برای این دندان'}</span>
                  </button>
                  {selectedTooth.is_implanted && (
                    <button
                      onClick={handleRemoveImplant}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                    >
                      حذف از پاسپورت
                    </button>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveTooth}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>ذخیره در پاسپورت</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details or Edit Form */}
          {!isEditing ? (
            selectedTooth.is_implanted ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-0.5">کد رفرنس فیکسچر (REF):</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {selectedTooth.fixture_ref}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-0.5">شماره لات کارخانه (LOT):</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {selectedTooth.lot_number}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-0.5">برند و سیستم:</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedTooth.brand_name}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-0.5">تورک بستن اباتمنت:</span>
                  <span className="font-mono font-bold text-teal-700 text-sm">
                    {selectedTooth.abutment_torque_ncm} Ncm
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-0.5">جراح معالج:</span>
                  <span className="font-medium text-slate-800 text-xs">
                    {selectedTooth.surgeon_name}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-0.5">مرکز جراحی:</span>
                  <span className="font-medium text-slate-800 text-xs">
                    {selectedTooth.clinic_name}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-0.5">نوع روکش پروتزی:</span>
                  <span className="font-medium text-slate-800 text-xs">
                    {selectedTooth.crown_type}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5">هش استعلام QR:</span>
                    <span className="font-mono text-[10px] text-slate-600 truncate block max-w-[120px]">
                      {selectedTooth.qr_code_hash}
                    </span>
                  </div>
                  <QrCode className="w-8 h-8 text-slate-700" />
                </div>

                {selectedTooth.notes && (
                  <div className="md:col-span-2 lg:col-span-4 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950">
                    <span className="font-bold block mb-1">یادداشت‌های بالینی جراحی:</span>
                    {selectedTooth.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 text-xs mb-3">
                  برای دندان شماره {selectedTooth.tooth_number} هنوز ایمپلنتی ثبت نشده است.
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  ثبت قطعات ایمپلنت این دندان
                </button>
              </div>
            )
          ) : (
            /* Editing form */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">کد رفرنس فیکسچر (REF):</label>
                <input
                  type="text"
                  value={editFixtureRef}
                  onChange={(e) => setEditFixtureRef(e.target.value)}
                  placeholder="مثال: 021.4312 یا NX-FX-4010"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شماره ساخت کارخانه (LOT):</label>
                <input
                  type="text"
                  value={editLotNumber}
                  onChange={(e) => setEditLotNumber(e.target.value)}
                  placeholder="مثال: LOT-CH2026-8891"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">برند سازنده:</label>
                <select
                  value={editBrandName}
                  onChange={(e) => setEditBrandName(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Straumann (سوئیس)">Straumann (سوئیس)</option>
                  <option value="Naxis (آلمان)">Naxis (آلمان)</option>
                  <option value="Osstem (کره جنوبی)">Osstem (کره جنوبی)</option>
                  <option value="Dentium (کره جنوبی)">Dentium (کره جنوبی)</option>
                  <option value="Zimmer Biomet (آمریکا)">Zimmer Biomet (آمریکا)</option>
                  <option value="Megagen (کره جنوبی)">Megagen (کره جنوبی)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نام جراح و کد نظام:</label>
                <input
                  type="text"
                  value={editSurgeon}
                  onChange={(e) => setEditSurgeon(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">کلینیک یا مرکز جراحی:</label>
                <input
                  type="text"
                  value={editClinic}
                  onChange={(e) => setEditClinic(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">تورک بستن اباتمنت (Ncm):</label>
                <input
                  type="number"
                  value={editTorque}
                  onChange={(e) => setEditTorque(Number(e.target.value))}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع روکش دندان:</label>
                <input
                  type="text"
                  value={editCrown}
                  onChange={(e) => setEditCrown(e.target.value)}
                  placeholder="مثال: تمام سرامیک زیرکونیا کادکم"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">یادداشت‌های بالینی جراحی:</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="مثال: پیوند پودر استخوان، ثبات اولیه ISQ 80"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Printable PDF Modal */}
        {isPrintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative my-8 border border-slate-300">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="absolute left-6 top-6 text-slate-400 hover:text-slate-600 no-print"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Official Certificate Header */}
              <div className="text-center pb-6 border-b-2 border-emerald-600 mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  <span className="text-2xl font-black text-slate-900">
                    گذرنامه رسمی اصالت و سلامت ایمپلنت دندان ایران
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  IRAN OFFICIAL DENTAL IMPLANT & BIOMATERIAL PASSPORT
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  سامانه ملی شفافیت قطعات و تجهیزات پزشکی دنتال مپ (Dental Map)
                </div>
              </div>

              {/* Patient and Certificate Meta */}
              <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">شماره پرونده پاسپورت:</span>
                  <span className="font-mono font-bold text-slate-800">DMP-2026-98104</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">تاریخ صدور شناسنامه:</span>
                  <span className="font-bold text-slate-800">۱۴۰۳/۰۸/۱۰</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">وضعیت اعتبارسنجی:</span>
                  <span className="text-emerald-700 font-bold">تایید اصالت IMED و CE</span>
                </div>
              </div>

              {/* Implanted teeth list in Passport */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  جدول ثبت موقعیت‌های کاشت فک و قطعات مصرفی:
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-right">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">دندان</th>
                        <th className="p-2.5">برند / مدل</th>
                        <th className="p-2.5">کد رفرنس (REF)</th>
                        <th className="p-2.5">شماره لات (LOT)</th>
                        <th className="p-2.5">تورک اباتمنت</th>
                        <th className="p-2.5">جراح معالج</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teeth
                        .filter((t) => t.is_implanted)
                        .map((t) => (
                          <tr key={t.tooth_number}>
                            <td className="p-2.5 font-bold font-mono">#{t.tooth_number}</td>
                            <td className="p-2.5">{t.brand_name}</td>
                            <td className="p-2.5 font-mono text-emerald-800 font-bold">{t.fixture_ref}</td>
                            <td className="p-2.5 font-mono text-slate-600">{t.lot_number}</td>
                            <td className="p-2.5 font-mono">{t.abutment_torque_ncm} Ncm</td>
                            <td className="p-2.5">{t.surgeon_name}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QR verification representation */}
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-6">
                <div className="text-xs">
                  <div className="font-bold text-emerald-900 mb-1">
                    بارکد QR رمزنگاری‌شده استعلام بین‌المللی
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed max-w-md">
                    این بارکد حاوی هش دیجیتال رمزنگاری‌شده قطعات بوده و توسط هر مرکز دندانپزشکی در ایران یا خارج از کشور جهت ردیابی قطعات یدکی قابل اسکن است.
                  </p>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-300">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 no-print">
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  بستن
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>پرینت رسمی / ذخیره به عنوان PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
