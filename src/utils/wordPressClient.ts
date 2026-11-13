import { WordPressBlogPost, WordPressPage } from '../types';

export const WORDPRESS_API_BASE = (
  (import.meta.env?.VITE_WORDPRESS_URL as string) ||
  'https://cms.dentalmap.ir'
).replace(/\/+$/, '');

const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800';

/**
 * Strips HTML tags and normalizes whitespace
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Decodes standard HTML entities in strings from WordPress
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&hellip;/g, '…')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Formats an ISO date into a localized Persian date (e.g. ۲۶ مهر ۱۴۰۵)
 */
export function formatPersianWpDate(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return isoDate;
  }
}

/**
 * Calculates estimated read time in minutes
 */
export function calculateReadTimeMinutes(contentOrHtml: string): number {
  const plain = stripHtml(contentOrHtml);
  const wordCount = plain.split(/\s+/).filter(Boolean).length;
  // Average reading speed: ~150-180 words per minute for Persian
  return Math.max(2, Math.ceil(wordCount / 160));
}

/**
 * Normalizes WordPress slug (handles Persian URL encoded and decoded characters)
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  try {
    return decodeURIComponent(slug).trim().toLowerCase();
  } catch {
    return slug.trim().toLowerCase();
  }
}

/**
 * Maps a raw WordPress REST API post item into the DentalMap WordPressBlogPost model
 */
export function mapWordPressPost(p: any): WordPressBlogPost {
  const plainExcerpt = stripHtml(p.excerpt?.rendered || '');
  const plainContent = stripHtml(p.content?.rendered || '');
  const cleanTitle = decodeHtmlEntities(p.title?.rendered || 'بدون عنوان');

  // Extract author from _embedded if available
  const authorName =
    p._embedded?.author?.[0]?.name ||
    (typeof p.author === 'string' ? p.author : 'تحریریه دنتال مپ');

  // Extract primary category from _embedded if available
  const termArr = p._embedded?.['wp:term'];
  let categoryName = 'آموزش و مقالات';
  if (Array.isArray(termArr) && termArr.length > 0 && Array.isArray(termArr[0]) && termArr[0].length > 0) {
    categoryName = decodeHtmlEntities(termArr[0][0].name || 'آموزش و مقالات');
  }

  // Extract featured image from _embedded
  let featuredImage = DEFAULT_POST_IMAGE;
  const mediaArr = p._embedded?.['wp:featuredmedia'];
  if (Array.isArray(mediaArr) && mediaArr.length > 0 && mediaArr[0]?.source_url) {
    featuredImage = mediaArr[0].source_url;
  }

  const rawSlug = p.slug || String(p.id);
  const decodedSlug = normalizeSlug(rawSlug);

  return {
    id: p.id,
    title: cleanTitle,
    slug: decodedSlug,
    excerpt: plainExcerpt || plainContent.slice(0, 180) + '...',
    content: p.content?.rendered || '',
    category: categoryName,
    author: authorName,
    read_time_minutes: calculateReadTimeMinutes(p.content?.rendered || ''),
    published_at: formatPersianWpDate(p.date),
    featured_image: featuredImage,
    meta_robots: 'index, follow'
  };
}

/**
 * Maps a raw WordPress REST API page item into the DentalMap WordPressPage model
 */
export function mapWordPressPage(p: any): WordPressPage {
  const plainExcerpt = stripHtml(p.excerpt?.rendered || '');
  const cleanTitle = decodeHtmlEntities(p.title?.rendered || 'بدون عنوان');

  const authorName =
    p._embedded?.author?.[0]?.name ||
    (typeof p.author === 'string' ? p.author : 'دنتال مپ');

  let featuredImage: string | undefined = undefined;
  const mediaArr = p._embedded?.['wp:featuredmedia'];
  if (Array.isArray(mediaArr) && mediaArr.length > 0 && mediaArr[0]?.source_url) {
    featuredImage = mediaArr[0].source_url;
  }

  const rawSlug = p.slug || String(p.id);
  const decodedSlug = normalizeSlug(rawSlug);

  return {
    id: p.id,
    title: cleanTitle,
    slug: decodedSlug,
    excerpt: plainExcerpt || undefined,
    content: p.content?.rendered || '',
    author: authorName,
    status: p.status === 'draft' ? 'draft' : 'publish',
    published_at: formatPersianWpDate(p.date),
    featured_image: featuredImage,
    template: p.template === 'landing' ? 'landing' : 'default',
    meta_robots: 'index, follow'
  };
}

export const WordPressService = {
  baseUrl: WORDPRESS_API_BASE,

  /**
   * Health-check connection to WordPress REST API
   */
  async testConnection(): Promise<{ ok: boolean; message: string; totalPosts?: number }> {
    try {
      const res = await fetch(`${WORDPRESS_API_BASE}/wp-json/wp/v2/posts?per_page=1`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) {
        return {
          ok: false,
          message: `پاسخ ناموفق از وردپرس با کد وضعیت ${res.status}`
        };
      }
      const totalHeader = res.headers.get('X-WP-Total');
      const totalPosts = totalHeader ? parseInt(totalHeader, 10) : undefined;
      return {
        ok: true,
        message: 'اتصال به سامانه وردپرس هدلس (cms.dentalmap.ir) با موفقیت برقرار است.',
        totalPosts
      };
    } catch (err: any) {
      return {
        ok: false,
        message: `خطای اتصال به وردپرس: ${err.message || 'شبکه در دسترس نیست'}`
      };
    }
  },

  /**
   * Fetch list of blog posts with embedded media, taxonomy, and TTL caching (10 minutes)
   */
  async fetchPosts(params?: {
    page?: number;
    perPage?: number;
    categoryId?: number;
    search?: string;
    forceRefresh?: boolean;
  }): Promise<WordPressBlogPost[]> {
    const page = params?.page || 1;
    const perPage = params?.perPage || 20;
    const CACHE_KEY = `dentalmap_wp_posts_cache_p${page}_pp${perPage}`;
    const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL

    // Check localStorage cache if not forced and not a specific search/category query
    if (!params?.forceRefresh && !params?.categoryId && !params?.search) {
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (
            parsed &&
            parsed.timestamp &&
            Date.now() - parsed.timestamp < CACHE_TTL &&
            Array.isArray(parsed.posts) &&
            parsed.posts.length > 0
          ) {
            return parsed.posts;
          }
        }
      } catch {
        // Fallback to network fetch
      }
    }

    const url = new URL(`${WORDPRESS_API_BASE}/wp-json/wp/v2/posts`);
    url.searchParams.set('_embed', '1');
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('status', 'publish');

    if (params?.categoryId) {
      url.searchParams.set('categories', String(params.categoryId));
    }
    if (params?.search) {
      url.searchParams.set('search', params.search);
    }

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`WordPress API returned status ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const mapped = data.map(mapWordPressPost);

    // Save to cache
    if (!params?.categoryId && !params?.search) {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            posts: mapped
          })
        );
      } catch {
        // Safe to ignore quota errors
      }
    }

    return mapped;
  },

  /**
   * Fetch a single blog post by its slug
   */
  async fetchPostBySlug(slug: string): Promise<WordPressBlogPost | null> {
    if (!slug) return null;
    const cleanSlug = normalizeSlug(slug);

    // Try fetching with encoded slug
    const url = new URL(`${WORDPRESS_API_BASE}/wp-json/wp/v2/posts`);
    url.searchParams.set('_embed', '1');
    url.searchParams.set('slug', encodeURIComponent(cleanSlug));

    try {
      let res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        // Fallback without extra encoding if necessary
        url.searchParams.set('slug', cleanSlug);
        res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
      }

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return mapWordPressPost(data[0]);
        }
      }

      // If by slug not found, let's fetch recent 20 posts and find locally
      const recent = await this.fetchPosts({ perPage: 20 });
      const found = recent.find(
        (p) => normalizeSlug(p.slug) === cleanSlug || String(p.id) === cleanSlug
      );
      return found || null;
    } catch (err) {
      console.warn(`Error fetching WordPress post slug "${slug}":`, err);
      return null;
    }
  },

  /**
   * Fetch all published pages from WordPress
   */
  async fetchPages(): Promise<WordPressPage[]> {
    try {
      const url = new URL(`${WORDPRESS_API_BASE}/wp-json/wp/v2/pages`);
      url.searchParams.set('_embed', '1');
      url.searchParams.set('per_page', '50');
      url.searchParams.set('status', 'publish');

      const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' }
      });

      if (!res.ok) return [];
      const data = await res.json();
      if (!Array.isArray(data)) return [];

      return data.map(mapWordPressPage);
    } catch (err) {
      console.warn('Error fetching WordPress pages:', err);
      return [];
    }
  },

  /**
   * Fetch a single page by its slug
   */
  async fetchPageBySlug(slug: string): Promise<WordPressPage | null> {
    if (!slug) return null;
    const cleanSlug = normalizeSlug(slug);

    try {
      const url = new URL(`${WORDPRESS_API_BASE}/wp-json/wp/v2/pages`);
      url.searchParams.set('_embed', '1');
      url.searchParams.set('slug', encodeURIComponent(cleanSlug));

      const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return mapWordPressPage(data[0]);
        }
      }
      return null;
    } catch {
      return null;
    }
  }
};
