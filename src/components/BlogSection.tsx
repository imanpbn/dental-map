import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  ArrowLeft,
  Calendar,
  ChevronLeft
} from 'lucide-react';
import { WordPressBlogPost } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';

interface BlogSectionProps {
  posts?: WordPressBlogPost[];
  onOpenNaxisGuide?: () => void;
}

const DEFAULT_POST_IMAGE =
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600';

export const BlogSection: React.FC<BlogSectionProps> = ({ posts = [] }) => {
  const navigate = useNavigate();

  // Show only live posts from WordPress (up to 4 posts for homepage)
  const displayPosts = posts.slice(0, 4);

  // If there are no posts published yet in WordPress, render an informative banner
  if (displayPosts.length === 0) {
    return (
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  دانشنامه و وبلاگ تخصصی دنتال‌مپ (Headless WordPress)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  مقالات جدید از پیشخوان وردپرس به‌صورت خودکار در این بخش و ساب‌فولدر blog/ منتشر خواهند شد.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/blog')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
            >
              <span>مشاهده بخش وبلاگ</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>پایگاه دانش بالینی و مقالات وردپرس</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              راهنماهای علمی، استانداردهای متالورژی و مقالات سلامت
            </h2>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer self-start md:self-auto"
          >
            <span>مشاهده همه مقالات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic WordPress Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayPosts.map((post, idx) => {
            const isFeatured = idx === 0 && displayPosts.length > 1;
            const postImage = post.featured_image || DEFAULT_POST_IMAGE;
            const targetUrl = DentalMapRoutes.blogPost(post.slug);

            return (
              <div
                key={post.id}
                onClick={() => navigate(targetUrl)}
                className={`rounded-3xl border p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between ${
                  isFeatured
                    ? 'bg-gradient-to-b from-emerald-950 to-slate-900 text-white border-emerald-500/40 shadow-lg'
                    : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-white'
                }`}
              >
                <div>
                  <div className="aspect-16/10 rounded-2xl overflow-hidden mb-4 bg-slate-200">
                    <img
                      src={postImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md ${
                        isFeatured
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {post.category || 'آموزش و مقالات'}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{post.read_time_minutes || 5} دقیقه</span>
                    </div>
                  </div>

                  <h3
                    className={`font-black text-sm sm:text-base leading-snug mb-2 line-clamp-2 ${
                      isFeatured ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {post.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed line-clamp-3 mb-4 ${
                      isFeatured ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {post.excerpt}
                  </p>
                </div>

                <div
                  className={`pt-3 border-t flex items-center justify-between text-xs font-bold ${
                    isFeatured ? 'border-slate-800 text-emerald-400' : 'border-slate-200 text-emerald-700'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-normal">
                    <Calendar className="w-3 h-3" />
                    <span>{post.published_at || 'اخیر'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>مطالعه مقاله</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
