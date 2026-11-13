import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  BookOpen,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  Share2,
  Calendar,
  ShieldCheck,
  Search,
  ExternalLink,
  Sparkles,
  Loader2
} from 'lucide-react';
import { WordPressBlogPost } from '../types';
import { DentalMapRoutes } from '../utils/urlBuilder';
import { WordPressService, normalizeSlug } from '../utils/wordPressClient';

interface BlogPageProps {
  posts: WordPressBlogPost[];
}

const LEGACY_MOCK_SLUGS = new Set([
  'iso-14801-fatigue-test-earthquake-analogy',
  'morse-taper-vs-flat-hex-microgap',
  'implant-passport-guide'
]);

export const BlogPage: React.FC<BlogPageProps> = ({ posts }) => {
  const { postSlug } = useParams<{ postSlug?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [remotePost, setRemotePost] = useState<WordPressBlogPost | null>(null);
  const [isLoadingRemote, setIsLoadingRemote] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter out any legacy hardcoded mock posts
  const sanitizedPosts = posts.filter((p) => !LEGACY_MOCK_SLUGS.has(p.slug));
  const [livePosts, setLivePosts] = useState<WordPressBlogPost[]>(sanitizedPosts);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);

  useEffect(() => {
    setLivePosts(posts.filter((p) => !LEGACY_MOCK_SLUGS.has(p.slug)));
  }, [posts]);

  // If a single post is requested
  const targetSlug = normalizeSlug(postSlug || '');
  const localPost = targetSlug
    ? sanitizedPosts.find(
        (p) => normalizeSlug(p.slug) === targetSlug || String(p.id) === targetSlug
      )
    : null;

  const currentPost = localPost || remotePost;

  // If on listing page and posts are empty, fetch directly from WordPress REST API
  useEffect(() => {
    let isCancelled = false;
    if (!targetSlug && sanitizedPosts.length === 0) {
      setIsLoadingList(true);
      WordPressService.fetchPosts({ perPage: 50 })
        .then((fetched) => {
          if (!isCancelled && fetched && fetched.length > 0) {
            setLivePosts(fetched.filter((p) => !LEGACY_MOCK_SLUGS.has(p.slug)));
          }
        })
        .catch((err) => {
          console.warn('Error fetching live posts from WP:', err);
        })
        .finally(() => {
          if (!isCancelled) setIsLoadingList(false);
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [targetSlug, sanitizedPosts.length]);

  // If not found in local posts array, fetch directly from WordPress REST API
  useEffect(() => {
    let isCancelled = false;
    if (targetSlug && !localPost) {
      setIsLoadingRemote(true);
      WordPressService.fetchPostBySlug(targetSlug)
        .then((fetched) => {
          if (!isCancelled && fetched && !LEGACY_MOCK_SLUGS.has(fetched.slug)) {
            setRemotePost(fetched);
          }
        })
        .catch((err) => {
          console.warn('Error fetching single post from WP:', err);
        })
        .finally(() => {
          if (!isCancelled) setIsLoadingRemote(false);
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [targetSlug, localPost]);

  const handleShare = () => {
    if (navigator.share && currentPost) {
      navigator.share({
        title: currentPost.title,
        text: currentPost.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // -------------------------------------------------------------
  // SINGLE POST VIEW (/blog/:postSlug)
  // -------------------------------------------------------------
  if (postSlug) {
    if (isLoadingRemote) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <h2 className="font-bold text-slate-800 text-sm">در حال بارگذاری مقاله از وردپرس هدلس...</h2>
            <p className="text-xs text-slate-400 mt-1">لطفاً چند لحظه شکیبا باشید</p>
          </div>
        </div>
      );
    }

    if (!currentPost) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-xs">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="font-bold text-slate-800 text-base mb-2">مقاله مورد نظر یافت نشد</h2>
            <p className="text-xs text-slate-500 mb-6">
              ممکن است این مقاله در وردپرس حذف شده باشد یا آدرس آن تغییر کرده باشد.
            </p>
            <Link
              to="/blog"
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block hover:bg-slate-800 transition-colors"
            >
              بازگشت به دانشنامه وبلاگ
            </Link>
          </div>
        </div>
      );
    }

    const post = currentPost;
    const isHtmlContent = /<[a-z][\s\S]*>/i.test(post.content);

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        <SEO
          title={post.title}
          description={post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 160)}
          canonical={`/blog/${post.slug}`}
          ogImage={post.featured_image}
          ogType="article"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            image: post.featured_image,
            author: {
              '@type': 'Person',
              name: post.author
            },
            publisher: {
              '@type': 'Organization',
              name: 'دنتال مپ (Dental Map)',
              url: 'https://dentalmap.ir'
            },
            datePublished: post.published_at,
            description: post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 160)
          }}
        />

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

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="اشتراک‌گذاری مقاله"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'کپی شد!' : 'اشتراک'}</span>
              </button>

              <Link
                to="/blog"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>همه مقالات</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <article className="max-w-4xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                {post.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.read_time_minutes} دقیقه مطالعه</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.published_at}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>نویسنده: <strong>{post.author}</strong></span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>همگام‌سازی بلادرنگ از وردپرس هدلس (cms.dentalmap.ir)</span>
              </span>
            </div>

            {post.featured_image && (
              <div className="aspect-16/9 rounded-3xl overflow-hidden mb-8 bg-slate-100 border border-slate-100">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Excerpt callout if present */}
            {post.excerpt && (
              <div className="bg-emerald-50/70 border-r-4 border-emerald-600 p-4 rounded-xl text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed mb-6">
                {post.excerpt}
              </div>
            )}

            {/* Post Content */}
            {isHtmlContent ? (
              <div
                className="prose prose-slate max-w-none text-xs sm:text-sm leading-loose text-slate-700 space-y-4 font-normal [&_p]:leading-loose [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-800 [&_ul]:list-disc [&_ul]:pr-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pr-5 [&_ol]:space-y-1.5 [&_blockquote]:border-r-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pr-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:bg-slate-50 [&_blockquote]:rounded-l-lg [&_img]:rounded-2xl [&_img]:my-6 [&_a]:text-emerald-700 [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-700">
                {post.content.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="leading-loose">
                    {para.trim()}
                  </p>
                ))}
              </div>
            )}

            {/* Bottom Guarantee Banner */}
            <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>پلتفرم جامع شفافیت و اصالت قطعات ایمپلنت دنتال‌مپ</span>
              </div>

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

  // -------------------------------------------------------------
  // BLOG ARCHIVE VIEW (/blog)
  // -------------------------------------------------------------
  const categories = ['all', ...Array.from(new Set(livePosts.map((p) => p.category).filter(Boolean)))];

  const filteredPosts = livePosts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <SEO
        title="وبلاگ آموزشی و دانشنامه تخصصی ایمپلنت دندان"
        description="مجموعه مقالات علمی تاییدشده توسط متخصصین جراحی فک و صورت در خصوص متالورژی تیتانیوم، استئواینتگریشن، کدهای رفرنس و پاسپورت اصالت قطعات."
        canonical="/blog"
        keywords="مقالات ایمپلنت دندان, بیومکانیک فک, استاندارد ISO 14801, مورس تیپر"
      />

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

          {/* Search bar inside header */}
          <div className="mt-6 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مقالات و عناوین بالینی..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'همه مقالات' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        {isLoadingList ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">در حال دریافت مقالات از وردپرس...</h3>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm mb-1">مقاله‌ای یافت نشد</h3>
            <p className="text-xs text-slate-500">
              عبارت دیگری را جستجو کنید یا در پیشخوان وردپرس مقاله جدید منتشر نمایید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={DentalMapRoutes.blogPost(post.slug)}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/50 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
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
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-normal">
                    <Calendar className="w-3 h-3" />
                    <span>{post.published_at}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>مطالعه مقاله</span>
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
