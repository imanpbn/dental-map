import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://dentalmap.ir';
const TODAY = new Date().toISOString().split('T')[0];

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

async function generate() {
  console.log('Generating dynamic SEO Sitemap for DentalMap...');

  // Dynamically import initialData
  const {
    initialDoctors,
    initialClinics,
    initialBrands,
    initialImplantTypes,
    initialComponents,
    initialPages,
    initialBlogPosts
  } = await import('../src/initialData.js').catch(async () => {
    return await import('../src/initialData.ts');
  });

  const urls: SitemapUrl[] = [
    // Core Platform Portals
    { loc: `${BASE_URL}/`, priority: 1.0, changefreq: 'daily', lastmod: TODAY },
    { loc: `${BASE_URL}/directory`, priority: 0.95, changefreq: 'daily', lastmod: TODAY },
    { loc: `${BASE_URL}/passport`, priority: 0.95, changefreq: 'weekly', lastmod: TODAY },
    { loc: `${BASE_URL}/quiz`, priority: 0.9, changefreq: 'weekly', lastmod: TODAY },
    { loc: `${BASE_URL}/brands`, priority: 0.85, changefreq: 'weekly', lastmod: TODAY },
    { loc: `${BASE_URL}/parts`, priority: 0.85, changefreq: 'weekly', lastmod: TODAY },
    { loc: `${BASE_URL}/dentists`, priority: 0.85, changefreq: 'weekly', lastmod: TODAY },
    { loc: `${BASE_URL}/clinics`, priority: 0.85, changefreq: 'weekly', lastmod: TODAY },
    { loc: `${BASE_URL}/specialties`, priority: 0.8, changefreq: 'monthly', lastmod: TODAY },
    { loc: `${BASE_URL}/join-doctor`, priority: 0.75, changefreq: 'monthly', lastmod: TODAY },
    { loc: `${BASE_URL}/blog`, priority: 0.85, changefreq: 'daily', lastmod: TODAY }
  ];

  // Location Hubs
  const cities = ['tehran', 'shiraz', 'isfahan', 'mashhad', 'tabriz', 'karaj', 'ahvaz'];
  cities.forEach((city) => {
    urls.push({ loc: `${BASE_URL}/dentists/${city}`, priority: 0.8, changefreq: 'weekly', lastmod: TODAY });
    urls.push({ loc: `${BASE_URL}/clinics/${city}`, priority: 0.8, changefreq: 'weekly', lastmod: TODAY });
    urls.push({ loc: `${BASE_URL}/specialties/oral-maxillofacial-surgery/${city}`, priority: 0.75, changefreq: 'monthly', lastmod: TODAY });
    urls.push({ loc: `${BASE_URL}/specialties/implantology/${city}`, priority: 0.75, changefreq: 'monthly', lastmod: TODAY });
  });

  // Doctor Profiles
  initialDoctors.forEach((doc: any) => {
    const slug = `${doc.medical_council_code}-${doc.slug}`;
    urls.push({
      loc: `${BASE_URL}/doctor/${slug}`,
      priority: 0.85,
      changefreq: 'weekly',
      lastmod: TODAY
    });
  });

  // Clinic Profiles
  initialClinics.forEach((clinic: any) => {
    const slug = `${clinic.id}-${clinic.slug}`;
    urls.push({
      loc: `${BASE_URL}/clinic/${slug}`,
      priority: 0.8,
      changefreq: 'weekly',
      lastmod: TODAY
    });
  });

  // Brands Hub & Models
  initialBrands.forEach((b: any) => {
    urls.push({
      loc: `${BASE_URL}/brands/${b.slug}`,
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: TODAY
    });
  });

  initialImplantTypes.forEach((t: any) => {
    const brand = initialBrands.find((b: any) => b.id === t.brand_id);
    if (brand) {
      urls.push({
        loc: `${BASE_URL}/brands/${brand.slug}/${t.model_slug || t.id}`,
        priority: 0.75,
        changefreq: 'monthly',
        lastmod: TODAY
      });
    }
  });

  // Part Categories & Components by Ref
  const categories = [
    'fixtures',
    'abutments',
    'cover-screws',
    'healing-caps',
    'impression-copings',
    'analogs',
    'screws',
    'surgical-kits'
  ];
  categories.forEach((cat) => {
    urls.push({ loc: `${BASE_URL}/parts/${cat}`, priority: 0.75, changefreq: 'monthly', lastmod: TODAY });
  });

  initialComponents.forEach((comp: any) => {
    urls.push({
      loc: `${BASE_URL}/parts/ref/${encodeURIComponent(comp.ref_code)}`,
      priority: 0.75,
      changefreq: 'monthly',
      lastmod: TODAY
    });
  });

  // Comparisons
  urls.push({ loc: `${BASE_URL}/compare/straumann-vs-megagen`, priority: 0.8, changefreq: 'monthly', lastmod: TODAY });
  urls.push({ loc: `${BASE_URL}/compare/osstem-vs-neobiotech`, priority: 0.8, changefreq: 'monthly', lastmod: TODAY });
  urls.push({ loc: `${BASE_URL}/compare/naxis-vs-straumann`, priority: 0.8, changefreq: 'monthly', lastmod: TODAY });

  // Blog Posts
  const defaultBlogSlugs = [
    'implant-passport-guide',
    'morse-taper-vs-flat-hex-microgap',
    'iso-14801-fatigue-test-earthquake-analogy'
  ];
  defaultBlogSlugs.forEach((slug) => {
    urls.push({
      loc: `${BASE_URL}/blog/${slug}`,
      priority: 0.75,
      changefreq: 'monthly',
      lastmod: TODAY
    });
  });

  if (Array.isArray(initialBlogPosts)) {
    initialBlogPosts.forEach((post: any) => {
      if (post.slug && !defaultBlogSlugs.includes(post.slug)) {
        urls.push({
          loc: `${BASE_URL}/blog/${post.slug}`,
          priority: 0.75,
          changefreq: 'monthly',
          lastmod: TODAY
        });
      }
    });
  }

  // Institutional Pages
  initialPages.forEach((p: any) => {
    urls.push({
      loc: `${BASE_URL}/page/${p.slug}`,
      priority: 0.65,
      changefreq: 'monthly',
      lastmod: TODAY
    });
  });

  // Deduplicate URLs
  const uniqueMap = new Map<string, SitemapUrl>();
  urls.forEach((u) => uniqueMap.set(u.loc, u));
  const uniqueUrls = Array.from(uniqueMap.values());

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(2)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const publicSitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xmlContent.trim(), 'utf-8');

  console.log(`Successfully generated public/sitemap.xml with ${uniqueUrls.length} canonical URLs!`);
}

generate().catch(console.error);
