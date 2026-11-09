import React, { useEffect } from 'react';

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'دنتال مپ (Dental Map) | پلتفرم شفافیت، اصالت قطعات و دایرکتوری ایمپلنت دندان ایران';
const DEFAULT_DESC = 'سامانه جامع شفافیت و اصالت قطعات ایمپلنت دندان، دایرکتوری تخصصی جراحان فک و صورت و دندانپزشکان ایران، استعلام کد REF فیکسچر و شناسنامه دیجیتال ۳۲ دندان (FDI).';
const DEFAULT_IMAGE = 'https://dentalmap.ir/images/og-preview.png';
const BASE_URL = 'https://dentalmap.ir';

export const SEO: React.FC<SeoProps> = ({
  title,
  description = DEFAULT_DESC,
  keywords,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  jsonLd,
  noIndex = false
}) => {
  useEffect(() => {
    // 1. Title
    const formattedTitle = title
      ? title.includes('دنتال مپ') || title.includes('Dental Map')
        ? title
        : `${title} | دنتال مپ`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper: update or create meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper: update or create link tag
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Standard Meta
    setMeta('name', 'description', description);
    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // 3. Canonical
    const currentUrl = canonical
      ? canonical.startsWith('http')
        ? canonical
        : `${BASE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`
      : typeof window !== 'undefined'
      ? window.location.href.split('?')[0]
      : BASE_URL;
    setLink('canonical', currentUrl);

    // 4. Open Graph
    setMeta('property', 'og:title', formattedTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', currentUrl);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:locale', 'fa_IR');
    setMeta('property', 'og:site_name', 'دنتال مپ (Dental Map)');

    // 5. Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', formattedTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    const scriptId = 'dynamic-seo-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Cleanup custom JSON-LD when component unmounts
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [title, description, keywords, canonical, ogImage, ogType, jsonLd, noIndex]);

  return null;
};
