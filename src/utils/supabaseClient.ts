import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Doctor,
  Clinic,
  DentalComponent,
  WordPressBlogPost,
  WordPressPage,
  ClinicalPackage,
  SiteSettings
} from '../types';

// Detect Supabase credentials from various environment prefixes
// Supports Vercel-Supabase Integration (NEXT_PUBLIC_*, SUPABASE_*), Vite (VITE_*)
const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''
).trim();

const supabaseKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseKey);
};

export const getSupabaseConfig = () => {
  return {
    isConfigured: isSupabaseConfigured(),
    url: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '').split('.')[0] + '...' : 'تنظیم نشده',
    hasKey: Boolean(supabaseKey)
  };
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// ==========================================
// SUPABASE SYNC & FETCH SERVICES
// ==========================================

export const SupabaseSyncService = {
  /**
   * Quick connection & health check test
   */
  async testConnection(): Promise<{ success: boolean; message: string; tablesFound?: string[] }> {
    if (!supabase) {
      return {
        success: false,
        message: 'کلیدها یا آدرس Supabase در متغیرهای محیطی Vercel/Vite شناسایی نشدند.'
      };
    }

    try {
      // Test querying doctors or blog_posts table
      const { data, error } = await supabase.from('site_settings').select('*').limit(1);

      if (error) {
        // Table might not be created yet, test if we can reach the DB endpoint
        if (error.code === '42P01') {
          return {
            success: false,
            message: 'اتصال به پروژه Supabase برقرار است اما جداول پایگاه‌داده هنوز ایجاد نشده‌اند. لطفاً فایل database/schema.sql را در تب SQL Editor سوپابیس اجرا کنید.'
          };
        }
        return {
          success: false,
          message: `خطای اتصال به سوپابیس: ${error.message} (${error.code || 'نامشخص'})`
        };
      }

      return {
        success: true,
        message: 'اتصال به پایگاه‌داده PostgreSQL سوپابیس با موفقیت برقرار شد و جداول در دسترس هستند!'
      };
    } catch (err: any) {
      return {
        success: false,
        message: `خطای ناشناخته در برقراری ارتباط: ${err?.message || 'خطای شبکه'}`
      };
    }
  },

  /**
   * Fetch all remote tables from Supabase PostgreSQL
   */
  async fetchRemoteData(): Promise<{
    doctors?: Doctor[];
    clinics?: Clinic[];
    components?: DentalComponent[];
    blogPosts?: WordPressBlogPost[];
    pages?: WordPressPage[];
    packages?: ClinicalPackage[];
    settings?: SiteSettings;
  } | null> {
    if (!supabase) return null;

    try {
      const results: any = {};

      const [
        doctorsRes,
        clinicsRes,
        componentsRes,
        blogPostsRes,
        pagesRes,
        packagesRes,
        settingsRes
      ] = await Promise.allSettled([
        supabase.from('doctors').select('*'),
        supabase.from('clinics').select('*'),
        supabase.from('components').select('*'),
        supabase.from('blog_posts').select('*'),
        supabase.from('pages').select('*'),
        supabase.from('clinical_packages').select('*'),
        supabase.from('site_settings').select('*').limit(1).maybeSingle()
      ]);

      if (doctorsRes.status === 'fulfilled' && doctorsRes.value.data && doctorsRes.value.data.length > 0) {
        results.doctors = doctorsRes.value.data;
      }

      if (clinicsRes.status === 'fulfilled' && clinicsRes.value.data && clinicsRes.value.data.length > 0) {
        results.clinics = clinicsRes.value.data;
      }

      if (componentsRes.status === 'fulfilled' && componentsRes.value.data && componentsRes.value.data.length > 0) {
        results.components = componentsRes.value.data;
      }

      if (blogPostsRes.status === 'fulfilled' && blogPostsRes.value.data && blogPostsRes.value.data.length > 0) {
        results.blogPosts = blogPostsRes.value.data;
      }

      if (pagesRes.status === 'fulfilled' && pagesRes.value.data && pagesRes.value.data.length > 0) {
        results.pages = pagesRes.value.data;
      }

      if (packagesRes.status === 'fulfilled' && packagesRes.value.data && packagesRes.value.data.length > 0) {
        results.packages = packagesRes.value.data;
      }

      if (settingsRes.status === 'fulfilled' && settingsRes.value.data) {
        results.settings = settingsRes.value.data;
      }

      return Object.keys(results).length > 0 ? results : null;
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage cache', err);
      return null;
    }
  },

  // --- Doctor Sync ---
  async syncDoctor(doctor: Doctor): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('doctors').upsert([doctor]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase syncDoctor failed:', err);
      return false;
    }
  },

  async deleteDoctor(id: number): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('doctors').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteDoctor failed:', err);
      return false;
    }
  },

  // --- Clinic Sync ---
  async syncClinic(clinic: Clinic): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('clinics').upsert([clinic]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase syncClinic failed:', err);
      return false;
    }
  },

  async deleteClinic(id: number): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('clinics').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteClinic failed:', err);
      return false;
    }
  },

  // --- Component Sync ---
  async syncComponent(component: DentalComponent): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('components').upsert([component]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase syncComponent failed:', err);
      return false;
    }
  },

  async deleteComponent(id: number): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('components').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteComponent failed:', err);
      return false;
    }
  },

  // --- Blog Post Sync ---
  async syncBlogPost(post: WordPressBlogPost): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('blog_posts').upsert([post]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase syncBlogPost failed:', err);
      return false;
    }
  },

  async deleteBlogPost(id: number): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteBlogPost failed:', err);
      return false;
    }
  },

  // --- Clinical Package Sync ---
  async syncPackage(pkg: ClinicalPackage): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('clinical_packages').upsert([pkg]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase syncPackage failed:', err);
      return false;
    }
  },

  async deletePackage(id: number): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('clinical_packages').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deletePackage failed:', err);
      return false;
    }
  },

  // --- WordPress / CMS Pages Sync ---
  async syncPage(page: WordPressPage): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('pages').upsert([page]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase syncPage failed:', err);
      return false;
    }
  },

  async deletePage(id: number): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('pages').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deletePage failed:', err);
      return false;
    }
  },

  // --- Paginated Fetching for Scalability (1000+ Doctors / Components) ---
  async fetchDoctorsPaginated(page: number = 1, pageSize: number = 12): Promise<{ data: Doctor[]; count: number }> {
    if (!supabase) return { data: [], count: 0 };
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, count, error } = await supabase
        .from('doctors')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('id', { ascending: true });

      if (error) throw error;
      return { data: data || [], count: count || 0 };
    } catch (err) {
      console.warn('Supabase fetchDoctorsPaginated failed:', err);
      return { data: [], count: 0 };
    }
  },

  async fetchComponentsPaginated(page: number = 1, pageSize: number = 20): Promise<{ data: DentalComponent[]; count: number }> {
    if (!supabase) return { data: [], count: 0 };
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, count, error } = await supabase
        .from('components')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('id', { ascending: true });

      if (error) throw error;
      return { data: data || [], count: count || 0 };
    } catch (err) {
      console.warn('Supabase fetchComponentsPaginated failed:', err);
      return { data: [], count: 0 };
    }
  },

  // --- Site Settings Sync ---
  async syncSettings(settings: SiteSettings): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('site_settings').upsert([{ id: 1, ...settings }]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase syncSettings failed:', err);
      return false;
    }
  },

  /**
   * Migrate/Sync all local memory data into Supabase
   */
  async syncAllLocalToSupabase(data: {
    doctors: Doctor[];
    clinics: Clinic[];
    components: DentalComponent[];
    blogPosts: WordPressBlogPost[];
    pages?: WordPressPage[];
    packages: ClinicalPackage[];
    settings: SiteSettings;
  }): Promise<{ success: boolean; counts: Record<string, number>; message: string }> {
    if (!supabase) {
      return {
        success: false,
        counts: {},
        message: 'اتصال به Supabase فعال نیست.'
      };
    }

    const counts: Record<string, number> = {
      doctors: 0,
      clinics: 0,
      components: 0,
      blogPosts: 0,
      pages: 0,
      packages: 0,
      settings: 0
    };

    try {
      // 1. Settings
      await supabase.from('site_settings').upsert([{ id: 1, ...data.settings }]);
      counts.settings = 1;

      // 2. Doctors
      if (data.doctors.length > 0) {
        const { error } = await supabase.from('doctors').upsert(data.doctors);
        if (!error) counts.doctors = data.doctors.length;
      }

      // 3. Clinics
      if (data.clinics.length > 0) {
        const { error } = await supabase.from('clinics').upsert(data.clinics);
        if (!error) counts.clinics = data.clinics.length;
      }

      // 4. Components
      if (data.components.length > 0) {
        const { error } = await supabase.from('components').upsert(data.components);
        if (!error) counts.components = data.components.length;
      }

      // 5. Blog Posts
      if (data.blogPosts.length > 0) {
        const { error } = await supabase.from('blog_posts').upsert(data.blogPosts);
        if (!error) counts.blogPosts = data.blogPosts.length;
      }

      // 6. Pages
      if (data.pages && data.pages.length > 0) {
        const { error } = await supabase.from('pages').upsert(data.pages);
        if (!error) counts.pages = data.pages.length;
      }

      // 7. Packages
      if (data.packages.length > 0) {
        const { error } = await supabase.from('clinical_packages').upsert(data.packages);
        if (!error) counts.packages = data.packages.length;
      }

      return {
        success: true,
        counts,
        message: 'تمام داده‌های محلی با موفقیت به پایگاه‌داده ابری سوپابیس منتقل شدند!'
      };
    } catch (err: any) {
      return {
        success: false,
        counts,
        message: `خطا در انتقال داده‌ها: ${err?.message || 'خطای شبکه'}`
      };
    }
  }
};
