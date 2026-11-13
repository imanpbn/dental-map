import {
  Doctor,
  Clinic,
  DentalComponent,
  WordPressBlogPost,
  WordPressPage,
  ClinicalPackage,
  ImplantBrand,
  SiteSettings,
  DoctorApplication,
  IssuedPassport
} from '../types';

import {
  initialDoctors,
  initialClinics,
  initialComponents,
  initialBlogPosts,
  initialPages,
  initialClinicalPackages,
  initialBrands,
  initialDoctorApplications,
  initialIssuedPassports
} from '../initialData';

const KEYS = {
  DOCTORS: 'dentalmap_cms_doctors_v1',
  CLINICS: 'dentalmap_cms_clinics_v1',
  COMPONENTS: 'dentalmap_cms_components_v1',
  BLOG_POSTS: 'dentalmap_cms_blog_posts_v2',
  PAGES: 'dentalmap_cms_pages_v1',
  PACKAGES: 'dentalmap_cms_packages_v1',
  BRANDS: 'dentalmap_cms_brands_v1',
  SETTINGS: 'dentalmap_cms_settings_v1',
  APPLICATIONS: 'dentalmap_cms_applications_v1',
  PASSPORTS: 'dentalmap_cms_passports_v1'
};

export const defaultSiteSettings: SiteSettings = {
  hotline: '021-88001144',
  site_title: 'دنتال مپ (Dental Map) | پلتفرم اصالت قطعات و دایرکتوری ایمپلنت دندان ایران',
  announcement: 'سامانه استعلام اصالت کد رفرنس و گارانتی اصالت ایمپلنت در سراسر کشور فعال است.',
  meta_description: 'نخستین سامانه شفافیت قطعات ایمپلنت، صدور پاسپورت دیجیتال ۳۲ دندان، کاتالوگ ۸ گانه و دایرکتوری جراحان دارای کد نظام پزشکی ایران.',
  canonical_domain: 'https://dentalmap.ir',
  is_lead_engine_active: true
};

export const CmsStorageService = {
  // Doctors
  getDoctors(): Doctor[] {
    try {
      const data = localStorage.getItem(KEYS.DOCTORS);
      return data ? JSON.parse(data) : initialDoctors;
    } catch {
      return initialDoctors;
    }
  },
  saveDoctors(doctors: Doctor[]): void {
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(doctors));
  },

  // Clinics
  getClinics(): Clinic[] {
    try {
      const data = localStorage.getItem(KEYS.CLINICS);
      return data ? JSON.parse(data) : initialClinics;
    } catch {
      return initialClinics;
    }
  },
  saveClinics(clinics: Clinic[]): void {
    localStorage.setItem(KEYS.CLINICS, JSON.stringify(clinics));
  },

  // Components
  getComponents(): DentalComponent[] {
    try {
      const data = localStorage.getItem(KEYS.COMPONENTS);
      return data ? JSON.parse(data) : initialComponents;
    } catch {
      return initialComponents;
    }
  },
  saveComponents(components: DentalComponent[]): void {
    localStorage.setItem(KEYS.COMPONENTS, JSON.stringify(components));
  },

  // Blog Posts (Headless WordPress)
  getBlogPosts(): WordPressBlogPost[] {
    try {
      const data = localStorage.getItem(KEYS.BLOG_POSTS);
      const posts: WordPressBlogPost[] = data ? JSON.parse(data) : initialBlogPosts;
      // Filter out any legacy hardcoded mock posts
      const legacyMockSlugs = new Set([
        'iso-14801-fatigue-test-earthquake-analogy',
        'morse-taper-vs-flat-hex-microgap',
        'implant-passport-guide'
      ]);
      return posts.filter((p) => !legacyMockSlugs.has(p.slug));
    } catch {
      return initialBlogPosts;
    }
  },
  saveBlogPosts(posts: WordPressBlogPost[]): void {
    localStorage.setItem(KEYS.BLOG_POSTS, JSON.stringify(posts));
  },

  // WordPress Pages (برگه‌ها / صفحات ایستا)
  getPages(): WordPressPage[] {
    try {
      const data = localStorage.getItem(KEYS.PAGES);
      if (!data) return initialPages;
      const parsed: WordPressPage[] = JSON.parse(data);
      const missingDefaults = initialPages.filter((ip) => !parsed.some((p) => p.slug === ip.slug));
      if (missingDefaults.length > 0) {
        const merged = [...parsed, ...missingDefaults];
        localStorage.setItem(KEYS.PAGES, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      return initialPages;
    }
  },
  savePages(pages: WordPressPage[]): void {
    localStorage.setItem(KEYS.PAGES, JSON.stringify(pages));
  },

  // Packages
  getPackages(): ClinicalPackage[] {
    try {
      const data = localStorage.getItem(KEYS.PACKAGES);
      return data ? JSON.parse(data) : initialClinicalPackages;
    } catch {
      return initialClinicalPackages;
    }
  },
  savePackages(packages: ClinicalPackage[]): void {
    localStorage.setItem(KEYS.PACKAGES, JSON.stringify(packages));
  },

  // Brands
  getBrands(): ImplantBrand[] {
    try {
      const data = localStorage.getItem(KEYS.BRANDS);
      return data ? JSON.parse(data) : initialBrands;
    } catch {
      return initialBrands;
    }
  },
  saveBrands(brands: ImplantBrand[]): void {
    localStorage.setItem(KEYS.BRANDS, JSON.stringify(brands));
  },

  // Site Settings
  getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : defaultSiteSettings;
    } catch {
      return defaultSiteSettings;
    }
  },
  saveSettings(settings: SiteSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Doctor & Clinic Onboarding Applications
  getDoctorApplications(): DoctorApplication[] {
    try {
      const data = localStorage.getItem(KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : initialDoctorApplications;
    } catch {
      return initialDoctorApplications;
    }
  },
  saveDoctorApplications(apps: DoctorApplication[]): void {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
  },

  // Digital FDI Implant Passports
  getIssuedPassports(): IssuedPassport[] {
    try {
      const data = localStorage.getItem(KEYS.PASSPORTS);
      return data ? JSON.parse(data) : initialIssuedPassports;
    } catch {
      return initialIssuedPassports;
    }
  },
  saveIssuedPassports(passports: IssuedPassport[]): void {
    localStorage.setItem(KEYS.PASSPORTS, JSON.stringify(passports));
  },
  issuePassport(passport: IssuedPassport): IssuedPassport[] {
    const current = this.getIssuedPassports();
    const updated = [passport, ...current.filter((p) => p.id !== passport.id)];
    this.saveIssuedPassports(updated);
    return updated;
  },
  findPassport(query: string): IssuedPassport | null {
    if (!query) return null;
    const cleanQuery = query.trim().toLowerCase();
    const all = this.getIssuedPassports();
    return (
      all.find(
        (p) =>
          p.id.toLowerCase() === cleanQuery ||
          p.tracking_code.toLowerCase() === cleanQuery ||
          p.patient_national_id === cleanQuery ||
          p.patient_mobile.replace(/\s+/g, '') === cleanQuery.replace(/\s+/g, '')
      ) || null
    );
  },

  // Reset to Factory Defaults
  resetToDefaults(): void {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  }
};
