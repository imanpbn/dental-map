import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  Info,
  RefreshCw,
  X,
  FileCode,
  ShieldCheck,
  Database
} from 'lucide-react';
import { Doctor, Specialty } from '../../types';
import { DoctorImportService, ParseResult } from '../../utils/doctorImportService';
import { isSupabaseConfigured } from '../../utils/supabaseClient';

interface DoctorBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingDoctors: Doctor[];
  specialties: Specialty[];
  onImportComplete: (finalDoctors: Doctor[]) => void;
  showToast: (msg: string) => void;
}

export const DoctorBulkImportModal: React.FC<DoctorBulkImportModalProps> = ({
  isOpen,
  onClose,
  existingDoctors,
  specialties,
  onImportComplete,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [importMode, setImportMode] = useState<'upsert' | 'skip' | 'replace'>('upsert');
  const [syncToSupabase, setSyncToSupabase] = useState(isSupabaseConfigured());
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [completedStats, setCompletedStats] = useState<{ added: number; updated: number; total: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle file drop / select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setInputText(text);
        const result = DoctorImportService.parseDoctors(text, existingDoctors, specialties);
        setParseResult(result);
        setCompletedStats(null);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handlePasteChange = (text: string) => {
    setInputText(text);
    if (text.trim().length > 10) {
      const result = DoctorImportService.parseDoctors(text, existingDoctors, specialties);
      setParseResult(result);
      setCompletedStats(null);
    } else {
      setParseResult(null);
    }
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = DoctorImportService.generateSampleCsvTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_1500_doctors_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('فایل نمونه اکسل با پشتیبانی از حروف فارسی دانلود شد.');
  };

  const handleDownloadSampleJson = () => {
    const jsonContent = DoctorImportService.generateSampleJsonTemplate();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_doctors_template.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('فایل نمونه JSON دانلود شد.');
  };

  const handleExecuteImport = async () => {
    if (!parseResult || parseResult.validDoctors.length === 0) {
      showToast('هیچ رکورد معتبری برای ایمپورت شناسایی نشده است.');
      return;
    }

    setIsProcessing(true);
    setProgressPercent(10);
    setStatusMessage('در حال اعتبارسنجی و آماده‌سازی...');

    try {
      const { finalDoctors, addedCount, updatedCount } = await DoctorImportService.executeImport(
        parseResult.validDoctors,
        importMode,
        existingDoctors,
        syncToSupabase,
        (percent, status) => {
          setProgressPercent(percent);
          setStatusMessage(status);
        }
      );

      setCompletedStats({
        added: addedCount,
        updated: updatedCount,
        total: finalDoctors.length
      });

      onImportComplete(finalDoctors);
      showToast(`ایمپورت با موفقیت انجام شد: ${addedCount} پزشک افزوده و ${updatedCount} پزشک به‌روزرسانی شدند.`);
    } catch (err: any) {
      console.error('Import execution error:', err);
      showToast(`خطا در هنگام ایمپورت: ${err?.message || 'مشکل ناشناخته'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setInputText('');
    setFileName('');
    setParseResult(null);
    setCompletedStats(null);
    setProgressPercent(0);
    setStatusMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-right my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                ایمپورت دسته‌جمعی دندانپزشکان (پشتیبانی تا ۱۵۰۰+ پزشک)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ورود داده‌ها با فایل CSV اکسل، TSV یا فرمت JSON با اعتبارسنجی و پیش‌نمایش آنی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Quick Action: Download Sample Templates */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-emerald-900">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">دانلود قالب استاندارد آماده اکسل:</span>
                <span className="text-[11px] text-emerald-700">
                  فایل CSV با انکودینگ رسمی UTF-8 BOM جهت باز شدن صحیح حروف فارسی در نرم‌افزار Excel
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>قالب اکسل (CSV)</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSampleJson}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>قالب JSON</span>
              </button>
            </div>
          </div>

          {/* If import already completed */}
          {completedStats ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-black text-emerald-900">
                  عملیات ایمپورت با موفقیت انجام شد!
                </h3>
                <p className="text-xs text-emerald-700 mt-1">
                  پایگاه‌داده دندانپزشکان سایت با موفقیت به‌روزرسانی شد.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <div className="text-lg font-black text-emerald-700 font-mono">
                    {completedStats.added.toLocaleString('fa-IR')}
                  </div>
                  <div className="text-[10px] text-slate-500">پزشک جدید افزوده شد</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <div className="text-lg font-black text-teal-700 font-mono">
                    {completedStats.updated.toLocaleString('fa-IR')}
                  </div>
                  <div className="text-[10px] text-slate-500">پزشک به‌روزرسانی شد</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <div className="text-lg font-black text-slate-800 font-mono">
                    {completedStats.total.toLocaleString('fa-IR')}
                  </div>
                  <div className="text-[10px] text-slate-500">مجموع پزشکان دیتابیس</div>
                </div>
              </div>

              <div className="pt-3 flex justify-center gap-3">
                <button
                  onClick={resetAll}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  ایمپورت فایل دیگر
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer shadow-sm"
                >
                  بستن و مشاهده در پنل
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Input method tabs */}
              <div className="flex border-b border-slate-200 gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`pb-3 font-bold flex items-center gap-2 cursor-pointer transition-colors border-b-2 ${
                    activeTab === 'upload'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>آپلود فایل (CSV / TSV / JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`pb-3 font-bold flex items-center gap-2 cursor-pointer transition-colors border-b-2 ${
                    activeTab === 'paste'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>کپی و پیست مستقیم متنی / اکسل</span>
                </button>
              </div>

              {/* Upload Dropzone */}
              {activeTab === 'upload' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-emerald-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-sm">
                      {fileName ? `فایل انتخاب‌شده: ${fileName}` : 'برای انتخاب فایل کلیک کنید یا آن را به اینجا بکشید'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      پشتیبانی از فرمت‌های .csv, .tsv, .txt, .json تا ظرفیت بیش از ۱۵۰۰ رکورد
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.tsv,.json,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}

              {/* Direct Paste Area */}
              {activeTab === 'paste' && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">
                    محتوای جدول اکسل یا متن CSV / JSON را در کادر زیر جای‌گذاری (Paste) کنید:
                  </label>
                  <textarea
                    rows={6}
                    value={inputText}
                    onChange={(e) => handlePasteChange(e.target.value)}
                    placeholder="نام,نام خانوادگی,کد نظام پزشکی,جنسیت,تخصص,سابقه...&#10;دکتر رضا,محمدی,125430,آقا,متخصص جراحی دهان، فک و صورت,14..."
                    className="w-full p-3 border border-slate-300 rounded-xl font-mono text-[11px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none dir-ltr text-left"
                  />
                </div>
              )}

              {/* Step 2: Parsing & Validation Results */}
              {parseResult && (
                <div className="space-y-4 pt-2">
                  <div className="font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>نتیجه اعتبارسنجی و آنالیز اولیه فایل:</span>
                    </span>
                    <span className="text-slate-500 font-normal text-[11px]">
                      تعداد کل سطرها: <strong>{parseResult.totalRows.toLocaleString('fa-IR')}</strong>
                    </span>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center justify-between text-emerald-700 font-bold mb-1">
                        <span>معتبر و آماده</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="text-lg font-black text-emerald-800 font-mono">
                        {parseResult.validCount.toLocaleString('fa-IR')}
                      </div>
                      <div className="text-[10px] text-emerald-600">پزشک قابل ثبت</div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-center justify-between text-amber-700 font-bold mb-1">
                        <span>تکراری در سایت</span>
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div className="text-lg font-black text-amber-800 font-mono">
                        {parseResult.duplicateCodesWithExisting.length.toLocaleString('fa-IR')}
                      </div>
                      <div className="text-[10px] text-amber-600">کد نظام تکراری با دیتابیس</div>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="flex items-center justify-between text-purple-700 font-bold mb-1">
                        <span>تکرار در فایل</span>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="text-lg font-black text-purple-800 font-mono">
                        {parseResult.duplicateCodesInFile.length.toLocaleString('fa-IR')}
                      </div>
                      <div className="text-[10px] text-purple-600">تکراری درون فایل</div>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                      <div className="flex items-center justify-between text-rose-700 font-bold mb-1">
                        <span>ردیف‌های دارای خطا</span>
                        <XCircle className="w-4 h-4" />
                      </div>
                      <div className="text-lg font-black text-rose-800 font-mono">
                        {parseResult.invalidCount.toLocaleString('fa-IR')}
                      </div>
                      <div className="text-[10px] text-rose-600">نیازمند اصلاح</div>
                    </div>
                  </div>

                  {/* List of Invalid Rows if any */}
                  {parseResult.invalidRows.length > 0 && (
                    <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1.5 max-h-36 overflow-y-auto">
                      <div className="font-bold text-rose-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>خطاهای شناسایی شده ({parseResult.invalidRows.length} مورد):</span>
                      </div>
                      {parseResult.invalidRows.slice(0, 10).map((inv, i) => (
                        <div key={i} className="text-[11px] text-rose-700 flex items-start gap-1">
                          <span className="font-bold shrink-0">سطر {inv.row}:</span>
                          <span>{inv.errors.join(' | ')}</span>
                        </div>
                      ))}
                      {parseResult.invalidRows.length > 10 && (
                        <div className="text-[10px] text-rose-500 font-bold pt-1">
                          ... و {parseResult.invalidRows.length - 10} خطای دیگر
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preview Table of First 5 Valid Doctors */}
                  {parseResult.validDoctors.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-bold text-slate-700 block">
                        پیش‌نمایش داده‌ها (نمایش ۵ مورد اول از {parseResult.validCount.toLocaleString('fa-IR')} پزشک):
                      </span>
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-right text-[11px]">
                          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <tr>
                              <th className="p-2 font-bold">نام پزشک</th>
                              <th className="p-2 font-bold">کد نظام پزشکی</th>
                              <th className="p-2 font-bold">تخصص</th>
                              <th className="p-2 font-bold">جنسیت</th>
                              <th className="p-2 font-bold">سابقه</th>
                              <th className="p-2 font-bold">امتیاز</th>
                              <th className="p-2 font-bold">پاسپورت</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {parseResult.validDoctors.slice(0, 5).map((doc, i) => {
                              const spec = specialties.find((s) => s.id === doc.specialty_id)?.title || 'عمومی';
                              return (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="p-2 font-bold text-slate-800">
                                    {doc.first_name} {doc.last_name}
                                  </td>
                                  <td className="p-2 font-mono font-bold text-emerald-700">
                                    {doc.medical_council_code}
                                  </td>
                                  <td className="p-2 text-slate-600">{spec}</td>
                                  <td className="p-2 text-slate-500">{doc.gender === 'male' ? 'آقا' : 'خانم'}</td>
                                  <td className="p-2 font-mono">{doc.experience_years} سال</td>
                                  <td className="p-2 text-amber-500 font-mono font-bold">★ {doc.rating}</td>
                                  <td className="p-2">
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                      {doc.passport_committed ? '✓ بله' : 'خیر'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Conflict Resolution Mode Selection */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="font-bold text-slate-800 block">
                      استراتژی برخورد با کدهای نظام پزشکی تکراری و ثبت اطلاعات:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          importMode === 'upsert'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="radio"
                            name="importMode"
                            checked={importMode === 'upsert'}
                            onChange={() => setImportMode('upsert')}
                            className="text-emerald-600"
                          />
                          <span className="font-bold">به‌روزرسانی و افزودن (Upsert)</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          پزشکان جدید اضافه شوند و اطلاعات پزشکان موجود به‌روزرسانی گردد (پیشنهادی).
                        </span>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          importMode === 'skip'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="radio"
                            name="importMode"
                            checked={importMode === 'skip'}
                            onChange={() => setImportMode('skip')}
                            className="text-emerald-600"
                          />
                          <span className="font-bold">فقط افزودن جدیدها (Skip)</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          پزشکان با کد نظام موجود دست‌نخورده باقی می‌مانند و فقط موارد جدید ثبت می‌شوند.
                        </span>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          importMode === 'replace'
                            ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="radio"
                            name="importMode"
                            checked={importMode === 'replace'}
                            onChange={() => setImportMode('replace')}
                            className="text-rose-600"
                          />
                          <span className="font-bold text-rose-700">جایگزینی کامل (Replace)</span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          تمام پزشکان قبلی حذف شده و این لیست جایگزین کل بانک دندانپزشکان می‌شود.
                        </span>
                      </label>
                    </div>

                    {/* Supabase sync option */}
                    {isSupabaseConfigured() && (
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={syncToSupabase}
                            onChange={(e) => setSyncToSupabase(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-teal-600" />
                            <span>همگام‌سازی خودکار در پایگاه داده ابری Supabase PostgreSQL</span>
                          </span>
                        </label>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                          Connected
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar when processing */}
                  {isProcessing && (
                    <div className="space-y-2 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{statusMessage}</span>
                        <span className="font-mono text-emerald-700">{progressPercent}٪</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!completedStats && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
            >
              انصراف
            </button>

            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={isProcessing || !parseResult || parseResult.validDoctors.length === 0}
              className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                isProcessing || !parseResult || parseResult.validDoctors.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال ایمپورت اطلاعات...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>
                    تایید و ایمپورت نهایی {parseResult?.validCount ? `${parseResult.validCount.toLocaleString('fa-IR')} پزشک` : ''}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
