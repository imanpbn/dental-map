import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Search,
  Send,
  Plus,
  Trash2,
  ExternalLink,
  Award,
  Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToothPassportRecord, IssuedPassport, IssuedPassportTooth } from '../types';
import { InteractiveJawChart } from './InteractiveJawChart';
import { OfficialPassportCertificate } from './OfficialPassportCertificate';
import { CmsStorageService } from '../utils/cmsStorage';
import { SmsService } from '../utils/smsService';
import { generateQrDataUrl } from '../utils/qrGenerator';

interface PassportSimulatorProps {
  teeth: ToothPassportRecord[];
  onUpdateTooth: (updated: ToothPassportRecord) => void;
}

export const PassportSimulator: React.FC<PassportSimulatorProps> = ({
  teeth,
  onUpdateTooth
}) => {
  const [searchParams] = useSearchParams();
  const queryCode = searchParams.get('code');

  // Main Tabs: 'simulator' | 'issue' | 'verify'
  const [activeTab, setActiveTab] = useState<'simulator' | 'issue' | 'verify'>(() =>
    queryCode ? 'verify' : 'simulator'
  );

  // Simulator State
  const [selectedToothNum, setSelectedToothNum] = useState<number>(16);
  const [chartViewMode, setChartViewMode] = useState<'jaw' | 'grid'>('jaw');
  const [isEditing, setIsEditing] = useState(false);

  // Current selected tooth
  const selectedTooth = teeth.find((t) => t.tooth_number === selectedToothNum) || teeth[0];

  // Tooth Form Edit States
  const [editFixtureRef, setEditFixtureRef] = useState(selectedTooth.fixture_ref || '');
  const [editLotNumber, setEditLotNumber] = useState(selectedTooth.lot_number || '');
  const [editBrandName, setEditBrandName] = useState(selectedTooth.brand_name || 'Straumann (سوئیس)');
  const [editSurgeon, setEditSurgeon] = useState(selectedTooth.surgeon_name || 'دکتر علیرضا صالحی‌راد');
  const [editClinic, setEditClinic] = useState(selectedTooth.clinic_name || 'کلینیک جراحی آتیه غرب');
  const [editTorque, setEditTorque] = useState(selectedTooth.abutment_torque_ncm || 35);
  const [editCrown, setEditCrown] = useState(selectedTooth.crown_type || 'زیرکونیا تمام‌سرامیک');
  const [editNotes, setEditNotes] = useState(selectedTooth.notes || '');

  // Issue Passport Form States
  const [patientName, setPatientName] = useState('');
  const [patientNationalId, setPatientNationalId] = useState('');
  const [patientMobile, setPatientMobile] = useState('');
  const [issueSurgeon, setIssueSurgeon] = useState('دکتر علیرضا صالحی‌راد');
  const [issueClinic, setIssueClinic] = useState('کلینیک جراحی ایمپلنت آتیه غرب');
  const [issueNotes, setIssueNotes] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedResult, setIssuedResult] = useState<IssuedPassport | null>(null);

  // Verification State
  const [verifyQuery, setVerifyQuery] = useState(queryCode || '');
  const [verifiedPassport, setVerifiedPassport] = useState<IssuedPassport | null>(null);
  const [verifySearched, setVerifySearched] = useState(false);

  // Certificate Modal State
  const [activeCertificate, setActiveCertificate] = useState<IssuedPassport | null>(null);

  // Auto-verify if code exists in URL
  useEffect(() => {
    if (queryCode) {
      const found = CmsStorageService.findPassport(queryCode);
      if (found) {
        setVerifiedPassport(found);
        setActiveCertificate(found);
        setActiveTab('verify');
        setVerifySearched(true);
      }
    }
  }, [queryCode]);

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
      implant_date: selectedTooth.implant_date || new Date().toLocaleDateString('fa-IR'),
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
  const q1 = teeth.filter((t) => t.quadrant === 1).sort((a, b) => b.tooth_number - a.tooth_number);
  const q2 = teeth.filter((t) => t.quadrant === 2).sort((a, b) => a.tooth_number - b.tooth_number);
  const q4 = teeth.filter((t) => t.quadrant === 4).sort((a, b) => b.tooth_number - a.tooth_number);
  const q3 = teeth.filter((t) => t.quadrant === 3).sort((a, b) => a.tooth_number - b.tooth_number);

  const implantedTeeth = teeth.filter((t) => t.is_implanted);
  const implantedTeethCount = implantedTeeth.length;

  // Handle Switch to Issue Tab
  const handleOpenIssueTab = () => {
    setActiveTab('issue');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Handle Issue Official Passport
  const handleIssuePassportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      alert('لطفاً نام و نام خانوادگی بیمار را وارد فرمایید.');
      return;
    }
    if (!patientNationalId.trim()) {
      alert('لطفاً کد ملی یا شماره گذرنامه بیمار را وارد فرمایید.');
      return;
    }
    if (!patientMobile.trim() || patientMobile.replace(/\D/g, '').length < 11) {
      alert('لطفاً شماره موبایل ۱۱ رقمی معتبر جهت ارسال پیامک وارد نمایید.');
      return;
    }

    // Must have at least 1 tooth implanted
    if (implantedTeeth.length === 0) {
      alert('حداقل باید یک دندان در چارت فک به عنوان کاشت‌شده ثبت شده باشد.');
      return;
    }

    setIsIssuing(true);

    try {
      const trackingSuffix = Math.floor(10000 + Math.random() * 90000).toString();
      const passportId = `DMP-${new Date().getFullYear()}-${trackingSuffix}`;
      const verifyUrl = `https://dentalmap.ir/passport?code=${passportId}`;
      const shamsiDate = new Date().toLocaleDateString('fa-IR');

      const teethList: IssuedPassportTooth[] = implantedTeeth.map((t) => ({
        tooth_number: t.tooth_number,
        brand_name: t.brand_name || 'اشترومن (Straumann)',
        implant_model: t.implant_model || `${t.brand_name || 'Straumann'} SLA Active`,
        fixture_ref: t.fixture_ref || `REF-4010-${t.tooth_number}`,
        lot_number: t.lot_number || `LOT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        abutment_type: 'Straight Titanium Custom Abutment',
        abutment_torque_ncm: t.abutment_torque_ncm || 35,
        crown_type: t.crown_type || 'زیرکونیا تمام‌سرامیک',
        implant_date: t.implant_date || shamsiDate,
        surgeon_name: t.surgeon_name || issueSurgeon,
        clinic_name: t.clinic_name || issueClinic,
        notes: t.notes
      }));

      // Generate QR Code data URL
      const qrDataUrl = await generateQrDataUrl(verifyUrl);

      const newPassport: IssuedPassport = {
        id: passportId,
        tracking_code: trackingSuffix,
        patient_name: patientName.trim(),
        patient_national_id: patientNationalId.trim(),
        patient_mobile: patientMobile.trim(),
        teeth: teethList,
        clinic_name: issueClinic,
        surgeon_name: issueSurgeon,
        issue_date_shamsi: shamsiDate,
        issue_date_iso: new Date().toISOString(),
        qr_code_data_url: qrDataUrl,
        verification_url: verifyUrl,
        notes: issueNotes.trim() || 'کاشت ایمپلنت تحت شرایط استریل و با گارانتی اصالت قطعات انجام گرفت.',
        status: 'active'
      };

      // Save to CMS storage
      CmsStorageService.issuePassport(newPassport);

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Dispatch Confirmation SMS to Patient
      try {
        await SmsService.sendSms({
          to: newPassport.patient_mobile,
          text: `بیمار گرامی ${newPassport.patient_name}، شناسنامه و پاسپورت دیجیتال اصالت ایمپلنت دندان شما با شماره پرونده ${newPassport.id} صادر گردید.\nمشاهده آنلاین و دانلود گواهی:\n${verifyUrl}\nمرجع ایمپلنتولوژی دنتال‌مپ`,
          type: 'passport'
        });
      } catch (err) {
        console.warn('SMS dispatch failed:', err);
      }

      setIssuedResult(newPassport);
      setActiveCertificate(newPassport);
    } catch (err) {
      console.error('Error issuing passport:', err);
      alert('خطا در صدور شناسنامه. لطفاً مجدداً تلاش فرمایید.');
    } finally {
      setIsIssuing(false);
    }
  };

  // Handle Online Verification Lookup
  const handleVerifySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!verifyQuery.trim()) return;

    setVerifySearched(true);
    const found = CmsStorageService.findPassport(verifyQuery.trim());
    setVerifiedPassport(found);
  };

  return (
    <section id="passport-section" className="py-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>استاندارد فدراسیون بین‌المللی دندانپزشکی (FDI World Dental Federation)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              سامانه رسمی صدور و استعلام پاسپورت دیجیتال ایمپلنت
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              ثبت آنلاین قطعات، ردیابی شماره لات ساخت (LOT) و کد رفرنس فیکسچر (REF)، استعلام اصالت بین‌المللی و صدور گواهی رسمی ضدجعل برای بیماران
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="text-xs font-medium text-slate-500">
              دندان‌های کاشته‌شده در چارت:{' '}
              <strong className="text-emerald-700 font-mono text-sm">{implantedTeethCount}</strong> از ۳۲
            </span>
            <button
              onClick={handleOpenIssueTab}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>صدور شناسنامه رسمی (PDF)</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TOP LEVEL NAVIGATION TABS                                     */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-slate-100 p-1 sm:p-1.5 rounded-2xl mb-8 border border-slate-200 max-w-xl mx-auto">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center ${
              activeTab === 'simulator'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🦷 <span className="hidden sm:inline">نقشه و </span>شبیه‌ساز</span>
          </button>

          <button
            onClick={() => setActiveTab('issue')}
            className={`py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center ${
              activeTab === 'issue'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
            <span>صدور شناسنامه</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`py-2 sm:py-2.5 px-1 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer text-center ${
              activeTab === 'verify'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 shrink-0" />
            <span>استعلام آنلاین</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: FDI JAW & 32-TOOTH SIMULATOR                           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'simulator' && (
          <div>
            {/* View Mode Switcher: Graphic Jaw Arch vs Matrix Grid */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setChartViewMode('jaw')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    chartViewMode === 'jaw'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>🦷 نمای آناتومیک فک</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartViewMode('grid')}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    chartViewMode === 'grid'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>📊 چارت ماتریسی (Grid)</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[11px] sm:text-xs">کلیک روی هر دندان ⇄ مشاهده یا ویرایش شماره رفرنس و لات</span>
              </div>
            </div>

            {/* Jaw Graphic or Matrix View */}
            {chartViewMode === 'jaw' ? (
              <div className="mb-8">
                <InteractiveJawChart
                  teeth={teeth}
                  selectedToothNum={selectedToothNum}
                  onSelectTooth={handleSelectTooth}
                />
              </div>
            ) : (
              /* 32 Tooth Matrix Grid */
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-xs">
                <div className="text-center mb-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    نقشه دندانی فک بالا و پایین (Maxilla & Mandible Chart)
                  </span>
                </div>

                {/* Upper Jaw (Maxilla): Q1 | Q2 */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-slate-400 text-center mb-2">
                    قوس فک بالا (Maxillary Arch)
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-6 bg-white p-2 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs min-w-0">
                    {/* Q1: 18 to 11 */}
                    <div className="flex justify-end gap-1 sm:gap-2 overflow-x-auto pb-1 min-w-0 scrollbar-none">
                      {q1.map((t) => (
                        <button
                          key={t.tooth_number}
                          onClick={() => handleSelectTooth(t.tooth_number)}
                          className={`w-8 sm:w-12 h-13 sm:h-16 shrink-0 rounded-xl flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all text-center border cursor-pointer ${
                            selectedToothNum === t.tooth_number
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-105'
                              : t.is_implanted
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-mono text-[10px] sm:text-xs font-bold">{t.tooth_number}</span>
                          <span className="text-[10px]">{t.is_implanted ? '🔩' : '🦷'}</span>
                          <span className="text-[8px] sm:text-[9px] truncate w-full text-slate-400">
                            {t.is_implanted ? 'کاشت' : 'طبیعی'}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Q2: 21 to 28 */}
                    <div className="flex justify-start gap-1 sm:gap-2 overflow-x-auto pb-1 min-w-0 scrollbar-none">
                      {q2.map((t) => (
                        <button
                          key={t.tooth_number}
                          onClick={() => handleSelectTooth(t.tooth_number)}
                          className={`w-8 sm:w-12 h-13 sm:h-16 shrink-0 rounded-xl flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all text-center border cursor-pointer ${
                            selectedToothNum === t.tooth_number
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-105'
                              : t.is_implanted
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-mono text-[10px] sm:text-xs font-bold">{t.tooth_number}</span>
                          <span className="text-[10px]">{t.is_implanted ? '🔩' : '🦷'}</span>
                          <span className="text-[8px] sm:text-[9px] truncate w-full text-slate-400">
                            {t.is_implanted ? 'کاشت' : 'طبیعی'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lower Jaw (Mandible): Q4 | Q3 */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 text-center mb-2">
                    قوس فک پایین (Mandibular Arch)
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-6 bg-white p-2 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs min-w-0">
                    {/* Q4: 48 to 41 */}
                    <div className="flex justify-end gap-1 sm:gap-2 overflow-x-auto pb-1 min-w-0 scrollbar-none">
                      {q4.map((t) => (
                        <button
                          key={t.tooth_number}
                          onClick={() => handleSelectTooth(t.tooth_number)}
                          className={`w-8 sm:w-12 h-13 sm:h-16 shrink-0 rounded-xl flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all text-center border cursor-pointer ${
                            selectedToothNum === t.tooth_number
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-105'
                              : t.is_implanted
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-mono text-[10px] sm:text-xs font-bold">{t.tooth_number}</span>
                          <span className="text-[10px]">{t.is_implanted ? '🔩' : '🦷'}</span>
                          <span className="text-[8px] sm:text-[9px] truncate w-full text-slate-400">
                            {t.is_implanted ? 'کاشت' : 'طبیعی'}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Q3: 31 to 38 */}
                    <div className="flex justify-start gap-1 sm:gap-2 overflow-x-auto pb-1 min-w-0 scrollbar-none">
                      {q3.map((t) => (
                        <button
                          key={t.tooth_number}
                          onClick={() => handleSelectTooth(t.tooth_number)}
                          className={`w-8 sm:w-12 h-13 sm:h-16 shrink-0 rounded-xl flex flex-col items-center justify-between p-1 sm:p-1.5 transition-all text-center border cursor-pointer ${
                            selectedToothNum === t.tooth_number
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-105'
                              : t.is_implanted
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold hover:bg-emerald-100'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-mono text-[10px] sm:text-xs font-bold">{t.tooth_number}</span>
                          <span className="text-[10px]">{t.is_implanted ? '🔩' : '🦷'}</span>
                          <span className="text-[8px] sm:text-[9px] truncate w-full text-slate-400">
                            {t.is_implanted ? 'کاشت' : 'طبیعی'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Tooth Detail & Editor Card */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-sm">
                    #{selectedTooth.tooth_number}
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      مشخصات شناسنامه دندان #{selectedTooth.tooth_number} ({selectedTooth.tooth_name_fa})
                    </h3>
                    <span className="text-xs text-slate-500">
                      وضعیت کنونی: {selectedTooth.is_implanted ? '🔩 دارای ایمپلنت فعال' : '🦷 بدون کاشت'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ویرایش مشخصات قطعه</span>
                      </button>

                      {selectedTooth.is_implanted && (
                        <button
                          onClick={handleRemoveImplant}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف ایمپلنت</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveTooth}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ذخیره در چارت</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                      >
                        انصراف
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!isEditing ? (
                selectedTooth.is_implanted ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[11px] text-slate-400 block mb-0.5">سیستم و برند:</span>
                      <strong className="text-slate-900 block">{selectedTooth.brand_name}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">{selectedTooth.implant_model}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[11px] text-slate-400 block mb-0.5">کد رفرنس فیکسچر (REF):</span>
                      <strong className="font-mono text-emerald-800 text-sm">{selectedTooth.fixture_ref}</strong>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">✓ تایید در کاتالوگ</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[11px] text-slate-400 block mb-0.5">شماره لات کارخانه (LOT):</span>
                      <strong className="font-mono text-slate-800 text-xs">{selectedTooth.lot_number}</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">بچ استریل استخوان</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[11px] text-slate-400 block mb-0.5">گشتاور اباتمنت (Torque):</span>
                      <strong className="font-mono text-slate-800 text-xs">{selectedTooth.abutment_torque_ncm} N.cm</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">روکش: {selectedTooth.crown_type}</span>
                    </div>

                    {selectedTooth.notes && (
                      <div className="sm:col-span-2 lg:col-span-4 p-3.5 rounded-2xl bg-teal-50 border border-teal-100 text-teal-950">
                        <span className="font-bold block mb-0.5">یادداشت‌های بالینی:</span>
                        <p>{selectedTooth.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-500 mb-3">
                      برای دندان شماره {selectedTooth.tooth_number} هنوز قطعه‌ای ثبت نشده است.
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      ثبت و افزودن قطعات ایمپلنت این دندان
                    </button>
                  </div>
                )
              ) : (
                /* Inline Editor Form */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">کد رفرنس فیکسچر (REF):</label>
                    <input
                      type="text"
                      value={editFixtureRef}
                      onChange={(e) => setEditFixtureRef(e.target.value)}
                      placeholder="مثال: 021.4312 یا NX-FX-4010"
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">شماره ساخت کارخانه (LOT):</label>
                    <input
                      type="text"
                      value={editLotNumber}
                      onChange={(e) => setEditLotNumber(e.target.value)}
                      placeholder="مثال: LOT-CH2026-8891"
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">برند سازنده:</label>
                    <select
                      value={editBrandName}
                      onChange={(e) => setEditBrandName(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">تورک بستن اباتمنت (N.cm):</label>
                    <input
                      type="number"
                      value={editTorque}
                      onChange={(e) => setEditTorque(Number(e.target.value))}
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">نوع روکش پروتزی:</label>
                    <input
                      type="text"
                      value={editCrown}
                      onChange={(e) => setEditCrown(e.target.value)}
                      placeholder="مثال: تمام‌سرامیک زیرکونیا سمان‌شونده"
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">یادداشت‌های بالینی:</label>
                    <input
                      type="text"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="مثال: پیوند استخوان، پودر Bio-Oss"
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: ISSUE OFFICIAL PASSPORT FOR PATIENT                    */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'issue' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 text-xs text-emerald-950 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-black mb-1">
                  راهنمای صدور گذرنامه رسمی و ارسال پیامک به بیمار:
                </strong>
                <p className="leading-relaxed">
                  اطلاعات هویتی بیمار را وارد نمایید. پس از فشردن دکمه صدور، یک شماره پرونده یکتا (Tracking ID) و بارکد QR رمزنگاری‌شده استعلام بین‌المللی تولید شده و پیامک حاوی لینک اختصاصی گواهی بلافاصله به شماره همراه بیمار ارسال می‌گردد.
                </p>
              </div>
            </div>

            <form onSubmit={handleIssuePassportSubmit} className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>۱. مشخصات هویتی و ارتباطی بیمار</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نام و نام خانوادگی بیمار <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="مثال: محمدحسین رضایی"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    کد ملی یا شماره گذرنامه <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={patientNationalId}
                    onChange={(e) => setPatientNationalId(e.target.value)}
                    placeholder="مثال: 0012345678"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    شماره موبایل جهت پیامک لینک <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={patientMobile}
                    onChange={(e) => setPatientMobile(e.target.value)}
                    placeholder="09121234567"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <h3 className="text-base font-black text-slate-900 border-b border-slate-200 pb-3 pt-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>۲. پزشک و مرکز جراحی صادرکننده</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">پزشک / جراح معالج:</label>
                  <input
                    type="text"
                    value={issueSurgeon}
                    onChange={(e) => setIssueSurgeon(e.target.value)}
                    placeholder="نام و کد نظام پزشکی پزشک"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">کلینیک یا مرکز درمانی:</label>
                  <input
                    type="text"
                    value={issueClinic}
                    onChange={(e) => setIssueClinic(e.target.value)}
                    placeholder="نام کلینیک یا بیمارستان"
                    className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <h3 className="text-base font-black text-slate-900 border-b border-slate-200 pb-3 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>۳. قطعات و دندان‌های انتخاب‌شده برای درج در شناسنامه</span>
                </div>
                <span className="text-xs text-emerald-700 font-bold">
                  {implantedTeethCount} موقعیت کاشت آماده صدور
                </span>
              </h3>

              {implantedTeethCount === 0 ? (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center text-xs text-amber-900">
                  <p className="font-bold mb-2">هنوز هیچ دندانی در چارت فک به عنوان کاشت‌شده ثبت نشده است.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('simulator')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    بازگشت به چارت و انتخاب دندان‌ها
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-3">دندان</th>
                        <th className="p-3">برند / مدل</th>
                        <th className="p-3">کد رفرنس (REF)</th>
                        <th className="p-3">شماره لات (LOT)</th>
                        <th className="p-3">تورک</th>
                        <th className="p-3">روکش</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {implantedTeeth.map((t) => (
                        <tr key={t.tooth_number}>
                          <td className="p-3 font-bold font-mono text-emerald-800 text-sm">
                            #{t.tooth_number}
                          </td>
                          <td className="p-3 font-medium text-slate-800">
                            {t.brand_name || 'اشترومن'}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-800">
                            {t.fixture_ref || 'REF-STANDARD-4010'}
                          </td>
                          <td className="p-3 font-mono text-slate-600">
                            {t.lot_number || 'LOT-2026-9810'}
                          </td>
                          <td className="p-3 font-mono text-slate-700">
                            {t.abutment_torque_ncm || 35} N.cm
                          </td>
                          <td className="p-3 text-slate-600">
                            {t.crown_type || 'زیرکونیا تمام‌سرامیک'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  یادداشت‌های بالینی و شرایط ضمانت قطعات:
                </label>
                <textarea
                  rows={3}
                  value={issueNotes}
                  onChange={(e) => setIssueNotes(e.target.value)}
                  placeholder="مثال: کاشت با ثبات اولیه مطلوب ISQ 80. گارانتی مادام‌العمر فیکسچر کارخانه. مراجعه بعدی جهت چک‌آپ ۶ ماه دیگر."
                  className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  با فشردن دکمه زیر، شناسنامه رسمی ثبت شده و پیامک فعال‌سازی به موبایل بیمار ارسال می‌گردد.
                </span>

                <button
                  type="submit"
                  disabled={isIssuing || implantedTeethCount === 0}
                  className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>{isIssuing ? 'در حال صدور و ارسال پیامک...' : 'صدور رسمی شناسنامه و ارسال پیامک'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: ONLINE PASSPORT VERIFICATION & LOOKUP                  */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'verify' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="text-center max-w-lg mx-auto mb-4">
                <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-base font-black text-slate-900">استعلام برخط شناسنامه ایمپلنت</h3>
                <p className="text-xs text-slate-500 mt-1">
                  شماره پرونده پاسپورت (مثلاً DMP-2026-98104)، کد ملی یا شماره همراه بیمار را وارد نمایید:
                </p>
              </div>

              <form onSubmit={handleVerifySearch} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    value={verifyQuery}
                    onChange={(e) => setVerifyQuery(e.target.value)}
                    placeholder="شماره پرونده (DMP-xxxx) / کد ملی / موبایل..."
                    className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  استعلام و بررسی
                </button>
              </form>

              {/* Sample Quick Lookup Badges */}
              <div className="flex items-center justify-center gap-2 flex-wrap pt-2 text-[11px] text-slate-500">
                <span>نمونه‌های آزمایشی جهت بررسی سریع:</span>
                <button
                  type="button"
                  onClick={() => {
                    setVerifyQuery('DMP-2026-98104');
                    const found = CmsStorageService.findPassport('DMP-2026-98104');
                    setVerifiedPassport(found);
                    setVerifySearched(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  DMP-2026-98104 (اشترومن)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVerifyQuery('DMP-2026-44120');
                    const found = CmsStorageService.findPassport('DMP-2026-44120');
                    setVerifiedPassport(found);
                    setVerifySearched(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 font-mono font-bold hover:bg-teal-100 transition-colors cursor-pointer"
                >
                  DMP-2026-44120 (ناکسیس)
                </button>
              </div>
            </div>

            {/* Verification Result Card */}
            {verifySearched && (
              verifiedPassport ? (
                <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">گذرنامه اصالت معتبر است</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                            {verifiedPassport.id}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          بیمار: {verifiedPassport.patient_name} | تاریخ صدور: {verifiedPassport.issue_date_shamsi}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveCertificate(verifiedPassport)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>مشاهده و چاپ شناسنامه کامل</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block">پزشک معالج:</span>
                      <strong className="text-slate-800">{verifiedPassport.surgeon_name || 'متخصص ایمپلنت'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">مرکز درمانی:</span>
                      <strong className="text-slate-800">{verifiedPassport.clinic_name || 'کلینیک دندانپزشکی'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">تعداد دندان‌های کاشت:</span>
                      <strong className="font-mono text-emerald-800">{verifiedPassport.teeth.length} قطعه</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">اعتبار سند:</span>
                      <strong className="text-emerald-700">تایید IMED مادام‌العمر</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-dashed border-rose-300 p-8 text-center text-xs text-rose-800">
                  <ShieldCheck className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                  <p className="font-bold">شناسنامه‌ای با مشخصات واردشده در سامانه یافت نشد.</p>
                  <p className="text-slate-500 mt-1">
                    لطفاً شماره پرونده پاسپورت یا کد ملی را مجدداً بررسی فرمایید.
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* OFFICIAL CERTIFICATE FULL PREVIEW MODAL                       */}
        {/* ------------------------------------------------------------- */}
        {activeCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative max-w-4xl w-full my-8 bg-white rounded-3xl p-4 sm:p-6 shadow-2xl">
              <OfficialPassportCertificate
                passport={activeCertificate}
                onClose={() => setActiveCertificate(null)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
