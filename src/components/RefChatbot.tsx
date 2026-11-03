import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';
import { DentalComponent, ImplantBrand } from '../types';

interface RefChatbotProps {
  components: DentalComponent[];
  brands: ImplantBrand[];
  onSelectComponent: (comp: DentalComponent) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  matchedComponent?: DentalComponent;
}

export const RefChatbot: React.FC<RefChatbotProps> = ({
  components,
  brands,
  onSelectComponent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'سلام! من دستیار هوشمند شناسایی کدهای رفرنس (REF) و سازگاری قطعات ایمپلنتولوژی دنتال مپ هستم. هر کد یا سوالی درباره سازگاری قطعات دارید بفرمایید.'
    }
  ]);

  const quickPrompts = [
    'استعلام کد رفرنس 021.4312',
    'فیکسچر ناکسیس آلمان NX-FX-4010',
    'کیت جراحی اشترومن VeloDrill',
    'بهترین ایمپلنت برای استخوان نرم D4'
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate response
    setTimeout(() => {
      const q = query.toLowerCase();

      // Check for component ref match
      const matchedComp = components.find(
        (c) =>
          c.ref_code.toLowerCase().includes(q) ||
          q.includes(c.ref_code.toLowerCase()) ||
          c.name_fa.toLowerCase().includes(q) ||
          c.name_en.toLowerCase().includes(q)
      );

      let reply = '';
      if (matchedComp) {
        reply = `قطعه با موفقیت شناسایی شد: ${matchedComp.name_fa} (کد رفرنس: ${matchedComp.ref_code}). پلتفرم: ${matchedComp.platform_size}، آلیاژ: ${matchedComp.material}، تورک پیشنهادی: ${matchedComp.torque_ncm || 35} Ncm. سازگاری: ${matchedComp.compatibility}.`;
      } else if (q.includes('d4') || q.includes('پوک') || q.includes('نرم')) {
        reply =
          'برای استخوان بسیار نرم و اسفنجی D4 (مانند توبروزیته ماگزیلا)، فیکسچرهای تپرد با رزوه‌های برنده عمیق Knife-Thread نظیر ناکسیس آلمان یا مگاژن AnyRidge پیشنهاد می‌شود تا با فشرده‌سازی استخوان (Bone Condensation) به پایداری اولیه ISQ بالای ۷۰ دست یابید.';
      } else if (q.includes('ناکسیس') || q.includes('naxis') || q.includes('آلمان')) {
        reply =
          'فیکسچرهای ناکسیس آلمان (Naxis Prime Hex) دارای اتصال دوگانه Dual Connection (هگز ۲.۱ + مورس تیپر ۱۱ درجه) هستند و سازگاری کامل با قطعات و آچارهای Astra Aqua دارند.';
      } else if (q.includes('استعلام') || q.includes('اصالت')) {
        reply =
          'تمام قطعات ثبت‌شده در دنتال مپ دارای شماره رفرنس (REF) رسمی و شماره لات ساخت (LOT) کارخانه مادر هستند که در پاسپورت ۳۲ دندان بیمار ثبت می‌شوند.';
      } else {
        reply =
          'کد یا سوال مورد نظر شما در پایگاه بالینی ثبت گردید. برای مشاهده مشخصات فنی دقیق، می‌توانید از منوی کاتالوگ قطعات در بالای صفحه یا جستجوی زنده استفاده فرمایید.';
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply,
        matchedComponent: matchedComp
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 max-w-[calc(100vw-2rem)]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl flex items-center gap-2 sm:gap-2.5 transition-all hover:scale-105 group border-2 border-white/20"
        >
          <Bot className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
          <span className="font-bold text-xs">دستیار هوشمند استعلام REF</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-96 max-w-[384px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">دستیار REF دنتال مپ</span>
                <span className="text-[10px] text-emerald-400">آنلاین | آماده شناسایی قطعه</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick prompt chips */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="px-2 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-lg text-[10px] whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {m.matchedComponent && (
                  <button
                    onClick={() => onSelectComponent(m.matchedComponent!)}
                    className="mt-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                  >
                    <span>مشاهده برگه مشخصات این قطعه</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="کد رفرنس یا سوال خود را تایپ کنید..."
              className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
