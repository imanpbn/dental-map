import React from 'react';
import {
  Send,
  Settings,
  Save,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { SmsSettings, SmsLogRecord } from '../../types';

interface SmsSectionProps {
  smsConfig: SmsSettings;
  setSmsConfig: React.Dispatch<React.SetStateAction<SmsSettings>>;
  smsCredit: { amount?: number; status?: string } | null;
  smsLogs: SmsLogRecord[];
  testSmsPhone: string;
  setTestSmsPhone: (phone: string) => void;
  testSmsMessage: string;
  setTestSmsMessage: (msg: string) => void;
  isSendingTestSms: boolean;
  testSmsResult: { success: boolean; message: string; recId?: string } | null;
  onSaveSmsSettings: (e: React.FormEvent) => void;
  onSendTestSms: (e: React.FormEvent) => void;
  onClearSmsLogs: () => void;
}

export const SmsSection: React.FC<SmsSectionProps> = ({
  smsConfig,
  setSmsConfig,
  smsCredit,
  smsLogs,
  testSmsPhone,
  setTestSmsPhone,
  testSmsMessage,
  setTestSmsMessage,
  isSendingTestSms,
  testSmsResult,
  onSaveSmsSettings,
  onSendTestSms,
  onClearSmsLogs
}) => {
  return (
    <div className="space-y-6">
      {/* Header Box */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>سامانه پیامک ملی‌پیامک (MeliPayamak)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                REST API v2
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ارسال آنی پیامک‌های رزرو نوبت، استعلام پاسپورت و کارنامه آزمون با پترن خدماتی
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {smsCredit && typeof smsCredit.amount === 'number' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-center">
              <div className="text-[10px] text-slate-400">اعتبار حساب ملی‌پیامک:</div>
              <div className="text-sm font-black text-emerald-400 font-mono">
                {Math.floor(smsCredit.amount).toLocaleString('fa-IR')} پیامک
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              توکن فعال: {smsConfig.apiKey ? `${smsConfig.apiKey.substring(0, 8)}...` : 'تنظیم نشده'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Config Settings */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>تنظیمات احراز هویت و الگوهای ملی‌پیامک</span>
          </h3>

          <form onSubmit={onSaveSmsSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                کلید وب‌سرویس / توکن کنسول (API Key):
              </label>
              <input
                type="text"
                value={smsConfig.apiKey}
                onChange={(e) => setSmsConfig({ ...smsConfig, apiKey: e.target.value })}
                placeholder="کلید وب‌سرویس سرورلس (خالی = پیش‌فرض امن سرور)..."
                dir="ltr"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                کلید در گیت‌وی سرورلس محافظت می‌شود؛ در صورت خالی بودن، متغیر محیطی MELIPAYAMAK_API_KEY سرور استفاده می‌شود.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  شماره خط فرستنده (اختصاصی / اشتراکی):
                </label>
                <input
                  type="text"
                  value={smsConfig.senderNumber}
                  onChange={(e) => setSmsConfig({ ...smsConfig, senderNumber: e.target.value })}
                  placeholder="50004001"
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  وضعیت ارسال پیامک در کل سایت:
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsConfig.isSmsActive}
                      onChange={(e) => setSmsConfig({ ...smsConfig, isSmsActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="mr-3 text-xs font-semibold text-slate-700">
                      {smsConfig.isSmsActive ? 'فعال و عملیاتی' : 'غیرفعال'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="font-bold text-slate-800 block">
                شناسه الگوهای خدماتی (عبور از بلک‌لیست مخابرات - Shared BodyId):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">کد پترن نوبت‌دهی:</label>
                  <input
                    type="text"
                    value={smsConfig.patternAppointment}
                    onChange={(e) => setSmsConfig({ ...smsConfig, patternAppointment: e.target.value })}
                    placeholder="245890"
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">کد پترن پاسپورت:</label>
                  <input
                    type="text"
                    value={smsConfig.patternPassport}
                    onChange={(e) => setSmsConfig({ ...smsConfig, patternPassport: e.target.value })}
                    placeholder="245891"
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">کد پترن آزمون:</label>
                  <input
                    type="text"
                    value={smsConfig.patternQuiz}
                    onChange={(e) => setSmsConfig({ ...smsConfig, patternQuiz: e.target.value })}
                    placeholder="245892"
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تنظیمات ملی‌پیامک</span>
              </button>
            </div>
          </form>
        </div>

        {/* Column 2: Live Test Box */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>ارسال پیامک آزمایشی زنده</span>
            </h3>

            <form onSubmit={onSendTestSms} className="space-y-3 mt-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  شماره موبایل گیرنده جهت تست:
                </label>
                <input
                  type="text"
                  value={testSmsPhone}
                  onChange={(e) => setTestSmsPhone(e.target.value)}
                  placeholder="09121234567"
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  متن پیامک آزمایشی:
                </label>
                <textarea
                  rows={3}
                  value={testSmsMessage}
                  onChange={(e) => setTestSmsMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSendingTestSms}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md disabled:opacity-50"
              >
                {isSendingTestSms ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>در حال برقراری ارتباط با وب‌سرویس…</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>ارسال پیامک آزمایشی</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {testSmsResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                testSmsResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {testSmsResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{testSmsResult.message}</span>
              </div>
              {testSmsResult.recId && (
                <div className="text-[11px] font-mono text-slate-600">
                  کد رهگیری سامانه (recId): <b>{testSmsResult.recId}</b>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SMS Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              تاریخچه و لاگ پیامک‌های ارسالی سیستم ({smsLogs.length} پیامک)
            </h3>
          </div>

          {smsLogs.length > 0 && (
            <button
              onClick={onClearSmsLogs}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
            >
              پاک‌سازی لاگ‌ها
            </button>
          )}
        </div>

        {smsLogs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            تاکنون هیچ پیامکی از سامانه ارسال نشده است. برای اولین تست از فرم بالا اقدام فرمایید.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-3">شماره گیرنده</th>
                  <th className="p-3">نوع پیامک</th>
                  <th className="p-3">متن ارسالی</th>
                  <th className="p-3">شناسه رهگیری (recId)</th>
                  <th className="p-3">زمان ثبت</th>
                  <th className="p-3">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {smsLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-800 dir-ltr text-right">
                      {log.to}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.type === 'appointment'
                            ? 'bg-blue-100 text-blue-800'
                            : log.type === 'passport'
                            ? 'bg-purple-100 text-purple-800'
                            : log.type === 'quiz'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {log.type === 'appointment'
                          ? 'رزرو نوبت'
                          : log.type === 'passport'
                          ? 'پاسپورت'
                          : log.type === 'quiz'
                          ? 'آزمون'
                          : 'سیستمی'}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate text-slate-600 font-mono">
                      {log.text}
                    </td>
                    <td className="p-3 font-mono text-slate-500">
                      {log.recId || '—'}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                      {new Date(log.created_at).toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'sent'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {log.status === 'sent' ? 'ارسال شد ✓' : 'ناموفق'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
