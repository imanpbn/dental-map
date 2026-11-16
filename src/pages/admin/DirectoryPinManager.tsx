import React, { useState, useMemo } from 'react';
import {
  Pin,
  Sparkles,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  Save,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Info,
  UserCheck
} from 'lucide-react';
import { Doctor, Specialty, PinnedDoctorsConfig } from '../../types';
import { useData } from '../../context/DataContext';

interface DirectoryPinManagerProps {
  doctors: Doctor[];
  specialties: Specialty[];
  showToast: (msg: string) => void;
}

export const DirectoryPinManager: React.FC<DirectoryPinManagerProps> = ({
  doctors,
  specialties,
  showToast
}) => {
  const { pinnedDoctorsConfig, setPinnedDoctorsConfig } = useData();

  // Local state for draft configuration
  const [isActive, setIsActive] = useState<boolean>(pinnedDoctorsConfig?.is_active ?? false);
  const [topIds, setTopIds] = useState<number[]>(pinnedDoctorsConfig?.top_doctor_ids ?? []);
  const [bottomIds, setBottomIds] = useState<number[]>(pinnedDoctorsConfig?.bottom_doctor_ids ?? []);

  // Modal / selector state
  const [activePickerSlot, setActivePickerSlot] = useState<{
    type: 'top' | 'bottom';
    index: number;
  } | null>(null);
  const [pickerSearchQuery, setPickerSearchQuery] = useState('');

  // Save handler
  const handleSave = () => {
    const updated: PinnedDoctorsConfig = {
      is_active: isActive,
      top_doctor_ids: topIds.slice(0, 3),
      bottom_doctor_ids: bottomIds.slice(0, 2)
    };
    setPinnedDoctorsConfig(updated);
    showToast('تنظیمات پزشکان پین‌شده در دایرکتوری با موفقیت ذخیره شد.');
  };

  // Toggle active master switch
  const handleToggleActive = () => {
    const nextActive = !isActive;
    setIsActive(nextActive);
    const updated: PinnedDoctorsConfig = {
      is_active: nextActive,
      top_doctor_ids: topIds.slice(0, 3),
      bottom_doctor_ids: bottomIds.slice(0, 2)
    };
    setPinnedDoctorsConfig(updated);
    showToast(
      nextActive
        ? 'پین کردن پزشکان در دایرکتوری فعال شد.'
        : 'پین کردن پزشکان غیرفعال شد (تمام نتایج طبیعی خواهند بود).'
    );
  };

  // Assign doctor to slot
  const handleAssignDoctor = (doctorId: number, type: 'top' | 'bottom', index: number) => {
    // Remove doctor from both arrays first to prevent duplicates
    let newTop = topIds.filter((id) => id !== doctorId);
    let newBottom = bottomIds.filter((id) => id !== doctorId);

    if (type === 'top') {
      newTop[index] = doctorId;
      newTop = newTop.filter(Boolean).slice(0, 3);
      setTopIds(newTop);
    } else {
      newBottom[index] = doctorId;
      newBottom = newBottom.filter(Boolean).slice(0, 2);
      setBottomIds(newBottom);
    }

    setActivePickerSlot(null);
    setPickerSearchQuery('');
  };

  // Remove doctor from slot
  const handleRemoveDoctor = (type: 'top' | 'bottom', index: number) => {
    if (type === 'top') {
      const next = [...topIds];
      next.splice(index, 1);
      setTopIds(next);
    } else {
      const next = [...bottomIds];
      next.splice(index, 1);
      setBottomIds(next);
    }
  };

  // Filtered doctors for picker modal
  const filteredPickerDoctors = useMemo(() => {
    const query = pickerSearchQuery.trim().toLowerCase();
    const alreadyPinnedIds = new Set([...topIds, ...bottomIds]);

    return doctors.filter((doc) => {
      // Exclude already pinned doctors
      if (alreadyPinnedIds.has(doc.id)) return false;

      if (!query) return true;
      const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase();
      const code = doc.medical_council_code.toLowerCase();
      return fullName.includes(query) || code.includes(query);
    });
  }, [doctors, pickerSearchQuery, topIds, bottomIds]);

  // Helper to get doctor by ID
  const getDoctor = (id?: number) => {
    if (!id) return undefined;
    return doctors.find((d) => d.id === id);
  };

  // Helper to get specialty title
  const getSpecialtyTitle = (specId?: number) => {
    if (!specId) return 'دندانپزشک';
    return specialties.find((s) => s.id === specId)?.title || 'دندانپزشک';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
            <Pin className="w-5 h-5 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                مدیریت پزشکان پین‌شده در دایرکتوری (حداکثر ۳ بالا و ۲ پایین)
              </h2>
              {isActive ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  فعال
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold">
                  غیرفعال (۱۰۰٪ ارگانیک)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ۳ نتیجه ابتدا و ۲ نتیجه انتهای دایرکتوری را شخصی‌سازی کنید. نتایج میانی کاملاً طبیعی (Organic) باقی می‌مانند.
            </p>
          </div>
        </div>

        {/* Master Switch & Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/directory"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>مشاهده صفحه دایرکتوری</span>
          </a>

          <button
            onClick={handleToggleActive}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-400'}`}
            />
            <span>{isActive ? 'قابلیت فعال است' : 'فعال‌سازی این قابلیت'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره تغییرات</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">قوانین نمایش پین دایرکتوری:</p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800 text-[11px] leading-relaxed">
            <li>
              اگر تیک قابلیت فعال باشد و پزشکانی را انتخاب کرده باشید، تا ۳ پزشک در بالای صفحه و تا ۲ پزشک در انتهای صفحه سنجاق (Pin) خواهند شد.
            </li>
            <li>
              پزشکان پین‌شده به صورت خودکار از لیست میانی حذف می‌شوند تا از تکرار مجدد نام آن‌ها در نتایج طبیعی جلوگیری شود.
            </li>
            <li>
              در صورتی که تیک غیرفعال باشد یا جایگاهی خالی بماند، کلیه نتایج به صورت طبیعی (ارگانیک) و بر اساس فیلتر کاربر چیده می‌شوند.
            </li>
          </ul>
        </div>
      </div>

      {/* Slots Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP SLOTS (Up to 3) */}
        <div className="bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent border border-amber-300/60 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                <ArrowUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span>پزشکان ابتدای لیست دایرکتوری</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  حداکثر ۳ جایگاه طلایی در صدر نتایج
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              {topIds.length} از ۳ جایگاه
            </span>
          </div>

          <div className="space-y-3">
            {[0, 1, 2].map((slotIndex) => {
              const docId = topIds[slotIndex];
              const doc = getDoctor(docId);

              return (
                <div
                  key={`top-slot-${slotIndex}`}
                  className="bg-white rounded-2xl border border-amber-200/80 p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-amber-400 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {slotIndex + 1}
                    </span>

                    {doc ? (
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={doc.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-amber-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 truncate">
                            {doc.first_name} {doc.last_name}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                            <span>کد نظام: {doc.medical_council_code}</span>
                            <span>•</span>
                            <span className="text-amber-700 font-medium">
                              {getSpecialtyTitle(doc.specialty_id)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        جایگاه {slotIndex + 1} خالی است (نمایش ارگانیک)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {doc ? (
                      <button
                        onClick={() => handleRemoveDoctor('top', slotIndex)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف از این جایگاه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setActivePickerSlot({ type: 'top', index: slotIndex })}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>انتخاب پزشک</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SLOTS (Up to 2) */}
        <div className="bg-gradient-to-br from-teal-500/5 via-teal-500/10 to-transparent border border-teal-300/60 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                <ArrowDown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <span>پزشکان انتهای لیست دایرکتوری</span>
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  حداکثر ۲ جایگاه ویژه در انتهای صفحه دایرکتوری
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
              {bottomIds.length} از ۲ جایگاه
            </span>
          </div>

          <div className="space-y-3">
            {[0, 1].map((slotIndex) => {
              const docId = bottomIds[slotIndex];
              const doc = getDoctor(docId);

              return (
                <div
                  key={`bottom-slot-${slotIndex}`}
                  className="bg-white rounded-2xl border border-teal-200/80 p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-teal-400 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {slotIndex + 1}
                    </span>

                    {doc ? (
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={doc.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-teal-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 truncate">
                            {doc.first_name} {doc.last_name}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                            <span>کد نظام: {doc.medical_council_code}</span>
                            <span>•</span>
                            <span className="text-teal-700 font-medium">
                              {getSpecialtyTitle(doc.specialty_id)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        جایگاه {slotIndex + 1} خالی است (نمایش ارگانیک)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {doc ? (
                      <button
                        onClick={() => handleRemoveDoctor('bottom', slotIndex)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف از این جایگاه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setActivePickerSlot({ type: 'bottom', index: slotIndex })}
                        className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>انتخاب پزشک</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Doctor Picker Modal */}
      {activePickerSlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  انتخاب پزشک برای{' '}
                  {activePickerSlot.type === 'top'
                    ? `جایگاه طلایی ${activePickerSlot.index + 1} (ابتدا)`
                    : `جایگاه ویژه ${activePickerSlot.index + 1} (انتها)`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  پزشک مورد نظر را جستجو کرده و روی آن کلیک کنید.
                </p>
              </div>
              <button
                onClick={() => {
                  setActivePickerSlot(null);
                  setPickerSearchQuery('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={pickerSearchQuery}
                  onChange={(e) => setPickerSearchQuery(e.target.value)}
                  placeholder="جستجوی نام پزشک یا کد نظام پزشکی..."
                  className="w-full pr-9 pl-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:border-emerald-500 outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Doctor List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-slate-100">
              {filteredPickerDoctors.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  هیچ پزشکی با این مشخصات یافت نشد یا قبلاً پین شده است.
                </div>
              ) : (
                filteredPickerDoctors.slice(0, 50).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() =>
                      handleAssignDoctor(doc.id, activePickerSlot.type, activePickerSlot.index)
                    }
                    className="pt-2 flex items-center justify-between gap-3 p-2 hover:bg-emerald-50/60 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={doc.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {doc.first_name} {doc.last_name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <span>کد نظام: {doc.medical_council_code}</span>
                          <span>•</span>
                          <span>{getSpecialtyTitle(doc.specialty_id)}</span>
                        </div>
                      </div>
                    </div>

                    <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shrink-0">
                      انتخاب
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => {
                  setActivePickerSlot(null);
                  setPickerSearchQuery('');
                }}
                className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
