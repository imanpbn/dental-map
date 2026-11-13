import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ClinicInsurance,
  ToothPassportRecord,
  LeadValuationRecord
} from '../types';
import {
  initialBrands,
  initialClinicInsurances,
  initial32TeethPassport,
  initialLeadValuations
} from '../initialData';
import { CmsStorageService, defaultSiteSettings } from '../utils/cmsStorage';
import { WordPressService } from '../utils/wordPressClient';
import { SupabaseSyncService } from '../utils/supabaseClient';

export interface DataContextType {
  // Main Entities
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  clinics: Clinic[];
  setClinics: React.Dispatch<React.SetStateAction<Clinic[]>>;
  components: DentalComponent[];
  setComponents: React.Dispatch<React.SetStateAction<DentalComponent[]>>;
  blogPosts: WordPressBlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<WordPressBlogPost[]>>;
  pages: WordPressPage[];
  setPages: React.Dispatch<React.SetStateAction<WordPressPage[]>>;
  packages: ClinicalPackage[];
  setPackages: React.Dispatch<React.SetStateAction<ClinicalPackage[]>>;
  brands: ImplantBrand[];
  setBrands: React.Dispatch<React.SetStateAction<ImplantBrand[]>>;
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  doctorApplications: DoctorApplication[];
  setDoctorApplications: React.Dispatch<React.SetStateAction<DoctorApplication[]>>;
  clinicInsurances: ClinicInsurance[];
  setClinicInsurances: React.Dispatch<React.SetStateAction<ClinicInsurance[]>>;
  teethPassport: ToothPassportRecord[];
  setTeethPassport: React.Dispatch<React.SetStateAction<ToothPassportRecord[]>>;
  leadValuations: Record<number, LeadValuationRecord>;
  setLeadValuations: React.Dispatch<React.SetStateAction<Record<number, LeadValuationRecord>>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;

  // Actions
  handleAddDoctorApplication: (newApp: DoctorApplication) => void;
  handleRecordLead: (clinicId: number, doctorId?: number) => void;
  handleToggleDoctorVerification: (doctorId: number) => void;
  handleToggleClinicInsurance: (clinicId: number, insuranceId: number) => void;
  handleUpdateTooth: (updated: ToothPassportRecord) => void;
  refreshWordPressData: (force?: boolean) => Promise<void>;
  refreshSupabaseData: () => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>(() => CmsStorageService.getDoctors());
  const [clinics, setClinics] = useState<Clinic[]>(() => CmsStorageService.getClinics());
  const [components, setComponents] = useState<DentalComponent[]>(() => CmsStorageService.getComponents());
  const [blogPosts, setBlogPosts] = useState<WordPressBlogPost[]>(() => CmsStorageService.getBlogPosts());
  const [pages, setPages] = useState<WordPressPage[]>(() => CmsStorageService.getPages());
  const [packages, setPackages] = useState<ClinicalPackage[]>(() => CmsStorageService.getPackages());
  const [brands, setBrands] = useState<ImplantBrand[]>(() => CmsStorageService.getBrands());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => CmsStorageService.getSettings());
  const [doctorApplications, setDoctorApplications] = useState<DoctorApplication[]>(() =>
    CmsStorageService.getDoctorApplications()
  );
  const [clinicInsurances, setClinicInsurances] = useState<ClinicInsurance[]>(initialClinicInsurances);
  const [teethPassport, setTeethPassport] = useState<ToothPassportRecord[]>(initial32TeethPassport);
  const [leadValuations, setLeadValuations] = useState<Record<number, LeadValuationRecord>>(initialLeadValuations);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Application Registration Action
  const handleAddDoctorApplication = (newApp: DoctorApplication) => {
    setDoctorApplications((prev) => {
      const next = [newApp, ...prev.filter((a) => a.id !== newApp.id)];
      CmsStorageService.saveDoctorApplications(next);
      return next;
    });
  };

  // Lead Valuation Record Action (350,000 Toman per verified lead)
  const handleRecordLead = (clinicId: number, doctorId?: number) => {
    setLeadValuations((prev) => {
      const existing = prev[clinicId] || {
        clinic_id: clinicId,
        doctor_id: doctorId,
        lead_count: 0,
        total_valuation_toman: 0,
        last_lead_at: ''
      };

      const newCount = existing.lead_count + 1;
      const newValuation = newCount * 350000;
      const dateStr = new Date().toLocaleDateString('fa-IR', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return {
        ...prev,
        [clinicId]: {
          ...existing,
          lead_count: newCount,
          total_valuation_toman: newValuation,
          last_lead_at: dateStr
        }
      };
    });
  };

  // Admin Toggle Verification
  const handleToggleDoctorVerification = (doctorId: number) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, verified: !d.verified } : d))
    );
  };

  // Clinic Insurance Toggle
  const handleToggleClinicInsurance = (clinicId: number, insuranceId: number) => {
    setClinicInsurances((prev) => {
      const exists = prev.some(
        (ci) => ci.clinic_id === clinicId && ci.insurance_id === insuranceId
      );
      if (exists) {
        return prev.filter(
          (ci) => !(ci.clinic_id === clinicId && ci.insurance_id === insuranceId)
        );
      } else {
        return [...prev, { clinic_id: clinicId, insurance_id: insuranceId }];
      }
    });
  };

  // Tooth Passport Update
  const handleUpdateTooth = (updated: ToothPassportRecord) => {
    setTeethPassport((prev) =>
      prev.map((t) => (t.tooth_number === updated.tooth_number ? updated : t))
    );
  };

  // Refresh WordPress Data (with TTL caching support)
  const refreshWordPressData = async (force: boolean = false) => {
    try {
      const [wpPostsResult, wpPagesResult] = await Promise.allSettled([
        WordPressService.fetchPosts({ perPage: 50, forceRefresh: force }),
        WordPressService.fetchPages()
      ]);

      if (wpPostsResult.status === 'fulfilled' && wpPostsResult.value.length > 0) {
        const liveWpPosts = wpPostsResult.value;
        setBlogPosts(liveWpPosts);
        CmsStorageService.saveBlogPosts(liveWpPosts);
      }

      if (wpPagesResult.status === 'fulfilled' && wpPagesResult.value.length > 0) {
        const liveWpPages = wpPagesResult.value;
        setPages((prevPages) => {
          const wpSlugs = new Set(liveWpPages.map((p) => p.slug));
          const nonColliding = prevPages.filter((p) => !wpSlugs.has(p.slug));
          const merged = [...liveWpPages, ...nonColliding];
          CmsStorageService.savePages(merged);
          return merged;
        });
      }
    } catch (err) {
      console.warn('WordPress data sync warning:', err);
    }
  };

  // Refresh Supabase Cloud Data
  const refreshSupabaseData = async () => {
    try {
      const remote = await SupabaseSyncService.fetchRemoteData();
      if (!remote) return;

      if (remote.doctors && remote.doctors.length > 0) {
        setDoctors(remote.doctors);
        CmsStorageService.saveDoctors(remote.doctors);
      }
      if (remote.clinics && remote.clinics.length > 0) {
        setClinics(remote.clinics);
        CmsStorageService.saveClinics(remote.clinics);
      }
      if (remote.components && remote.components.length > 0) {
        setComponents(remote.components);
        CmsStorageService.saveComponents(remote.components);
      }
      if (remote.packages && remote.packages.length > 0) {
        setPackages(remote.packages);
        CmsStorageService.savePackages(remote.packages);
      }
      if (remote.settings) {
        setSiteSettings(remote.settings);
        CmsStorageService.saveSettings(remote.settings);
      }
    } catch (err) {
      console.warn('Supabase remote sync warning:', err);
    }
  };

  // Initial Sync on Mount
  useEffect(() => {
    let isMounted = true;
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.allSettled([
        refreshWordPressData(false),
        refreshSupabaseData()
      ]);
      if (isMounted) {
        setIsLoading(false);
      }
    };

    initializeData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        doctors,
        setDoctors,
        clinics,
        setClinics,
        components,
        setComponents,
        blogPosts,
        setBlogPosts,
        pages,
        setPages,
        packages,
        setPackages,
        brands,
        setBrands,
        siteSettings,
        setSiteSettings,
        doctorApplications,
        setDoctorApplications,
        clinicInsurances,
        setClinicInsurances,
        teethPassport,
        setTeethPassport,
        leadValuations,
        setLeadValuations,
        selectedCategory,
        setSelectedCategory,
        handleAddDoctorApplication,
        handleRecordLead,
        handleToggleDoctorVerification,
        handleToggleClinicInsurance,
        handleUpdateTooth,
        refreshWordPressData,
        refreshSupabaseData,
        isLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
