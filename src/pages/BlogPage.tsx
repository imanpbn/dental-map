import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  Share2,
  Calendar,
  ShieldCheck,
  Search
} from 'lucide-react';
import { WordPressBlogPost } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface BlogPageProps {
  posts: WordPressBlogPost[];
}

export const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  const { postSlug } = useParams<{ postSlug?: string }>();

  // If a single post is requested
  if (postSlug) {
    const post = posts.find((p) => p.slug === postSlug);

    if (!post) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs">
            <h2 className="font-bold text-slate-800 text-base mb-2">مقاله مورد نظر یافت نشد</h2>
            <Link
              to="/blog"
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block"
            >
              بازگشت به وبلاگ
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Canonical meta simulation */}
        <link rel="canonical" href={`https://dentalmap.ir/blog/${post.slug}`} />

        {/* Top Breadcrumbs */}
        <div className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs truncate">
              <Link to="/" className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium">
                صفحه اصلی
              </Link>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              <Link to="/blog" className="text-slate-500 hover:text-emerald-700 font-medium">
                وبلاگ آموزشی
              </Link>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-700 font-bold truncate">{post.title}</span>
            </div>

            <Link
              to="/blog"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>همه مقالات</span>
            </Link>
          </div>
        </div>

        {/* Article Body */}
        <article className="max-w-4xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                {post.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.read_time_minutes} دقیقه مطالعه</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.published_at}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-600 mb-6 pb-6 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              <span>نویسنده: <strong>{post.author}</strong></span>
              <span className="text-slate-400 mr-2">(سامانه یکپارچه Headless WordPress)</span>
            </div>

            <div className="aspect-16/9 rounded-3xl overflow-hidden mb-8 bg-slate-100">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-700">
              {post.content.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="leading-loose">
                  {para.trim()}
                </p>
              ))}
            </div>

            {/* Back to Blog CTA */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/blog"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>بازگشت به آرشیو وبلاگ دنتال مپ</span>
              </Link>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Blog Archive Page (/blog)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <link rel="canonical" href="https://dentalmap.ir/blog" />

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/" className="hover:text-emerald-400">صفحه اصلی</Link>
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="text-white">وبلاگ آموزشی دنتال مپ</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>پایگاه دانش بالینی بر بستر Headless WordPress در ساب‌فولدر /blog</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white">
            دانشنامه تخصصی، راهنماهای ایمپلنت و بیومکانیک دهان و فک
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            مجموعه مقالات علمی تاییدشده توسط متخصصین جراحی فک و صورت در خصوص متالورژی تیتانیوم، استئواینتگریشن، کدهای رفرنس و پاسپورت اصالت.
          </p>
        </div>
      </div>

      {/* Post Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={DentalMapRoutes.blogPost(post.slug)}
              className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/50 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 mb-4">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{post.read_time_minutes} دقیقه</span>
                  </div>
                </div>

                <h2 className="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
                  {post.title}
                </h2>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>مطالعه مقاله کامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
