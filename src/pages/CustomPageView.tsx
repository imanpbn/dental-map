import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  Share2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { WordPressPage } from '../types';

interface CustomPageViewProps {
  pages: WordPressPage[];
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ pages }) => {
  const { pageSlug } = useParams<{ pageSlug: string }>();
  const navigate = useNavigate();

  const cleanSlug = (pageSlug || '').toLowerCase().trim();
  const page = pages.find((p) => p.slug.toLowerCase() === cleanSlug) || pages[0];

  if (!page) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 dir-rtl">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-black text-slate-800">برگه مورد نظر یافت نشد</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            ممکن است آدرس برگه تغییر کرده باشد یا هنوز منتشر نشده باشد.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: page.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('پیوند برگه در کلیپ‌بورد کپی شد.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dir-rtl pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-emerald-700 font-medium">خانه</Link>
            <span>/</span>
            <span className="text-slate-400">برگه‌ها</span>
            <span>/</span>
            <span className="text-slate-800 font-bold truncate max-w-xs">{page.title}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
            title="اشتراک‌گذاری برگه"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">اشتراک‌گذاری</span>
          </button>
        </div>
      </div>

      {/* Main Page Container */}
      <main className="max-w-4xl mx-auto px-4 pt-8">
        <article className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
          {/* Header Metadata */}
          <header className="space-y-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                برگه رسمی سامانه
              </span>
              <span className="text-xs text-slate-400 font-mono">
                /{page.slug}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {page.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>نویسنده: <b>{page.author}</b></span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>تاریخ انتشار: <b className="font-mono">{page.published_at}</b></span>
              </div>
            </div>
          </header>

          {/* Featured Image if present */}
          {page.featured_image && (
            <div className="rounded-2xl overflow-hidden max-h-96 border border-slate-100 shadow-inner">
              <img
                src={page.featured_image}
                alt={page.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt Summary if present */}
          {page.excerpt && (
            <div className="bg-emerald-50/60 border-r-4 border-emerald-500 p-4 rounded-xl text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
              {page.excerpt}
            </div>
          )}

          {/* Page Body Content */}
          <div
            className="prose prose-slate max-w-none text-xs sm:text-sm leading-loose text-slate-700 space-y-4 font-normal"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Footer Call to Action */}
          <footer className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>پلتفرم جامع شفافیت، اصالت قطعات و دایرکتوری ایمپلنت دنتال‌مپ</span>
            </div>

            <Link
              to="/passport"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>ثبت و استعلام پاسپورت قطعه ←</span>
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
};
