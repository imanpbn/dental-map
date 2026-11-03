import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RefChatbot } from './components/RefChatbot';

// Pages
import { HomePage } from './pages/HomePage';
import { NaxisGuidePage } from './pages/NaxisGuidePage';
import { AdminPage } from './pages/AdminPage';
import { ComponentDetailPage } from './pages/ComponentDetailPage';
import { DoctorDetailPage } from './pages/DoctorDetailPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';
import { DentistsByLocationPage } from './pages/DentistsByLocationPage';
import { SpecialtyByLocationPage } from './pages/SpecialtyByLocationPage';
import { ClinicsByLocationPage } from './pages/ClinicsByLocationPage';
import { ClinicProfilePage } from './pages/ClinicProfilePage';
import { BrandHubPage } from './pages/BrandHubPage';
import { PartCategoryPage } from './pages/PartCategoryPage';
import { BrandComparisonPage } from './pages/BrandComparisonPage';
import { PassportPage } from './pages/PassportPage';
import { BlogPage } from './pages/BlogPage';
import { ImplantTestPage } from './pages/ImplantTestPage';
import { CustomPageView } from './pages/CustomPageView';

import { DentalMapRoutes } from './utils/urlBuilder';

// Initial Seed Data
import {
  initialCountries,
  initialProvinces,
  initialManufacturers,
  initialBrands,
  initialImplantTypes,
  initialSpecialties,
  initialDoctors,
  initialClinics,
  initialCities,
  initialDistricts,
  initialInsurances,
  initialClinicInsurances,
  initialClinicDoctors,
  initialDoctorImplantTypes,
  initialComponents,
  initialClinicalPackages,
  initial32TeethPassport,
  initialLeadValuations,
  initialBlogPosts,
  initialPages
} from './initialData';

import {
  Doctor,
  Clinic,
  DentalComponent,
  ToothPassportRecord,
  LeadValuationRecord,
  ClinicInsurance,
  WordPressBlogPost,
  WordPressPage,
  ClinicalPackage,
  ImplantBrand,
  SiteSettings
} from './types';
import { CmsStorageService, defaultSiteSettings } from './utils/cmsStorage';
import { SupabaseSyncService } from './utils/supabaseClient';

// App Wrapper to use Router hooks
const AppContent: React.FC = () => {
  const navigate = useNavigate();

  // CMS-Managed Data States with localStorage persistence
  const [components, setComponents] = useState<DentalComponent[]>(() => CmsStorageService.getComponents());
  const [doctors, setDoctors] = useState<Doctor[]>(() => CmsStorageService.getDoctors());
  const [clinics, setClinics] = useState<Clinic[]>(() => CmsStorageService.getClinics());
  const [blogPosts, setBlogPosts] = useState<WordPressBlogPost[]>(() => CmsStorageService.getBlogPosts());
  const [pages, setPages] = useState<WordPressPage[]>(() => CmsStorageService.getPages());
  const [packages, setPackages] = useState<ClinicalPackage[]>(() => CmsStorageService.getPackages());
  const [brands, setBrands] = useState<ImplantBrand[]>(() => CmsStorageService.getBrands());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => CmsStorageService.getSettings());

  const [clinicInsurances, setClinicInsurances] = useState<ClinicInsurance[]>(initialClinicInsurances);
  const [teethPassport, setTeethPassport] = useState<ToothPassportRecord[]>(initial32TeethPassport);
  const [leadValuations, setLeadValuations] = useState<Record<number, LeadValuationRecord>>(initialLeadValuations);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Supabase Remote Sync on Mount
  useEffect(() => {
    let isMounted = true;
    const loadRemoteData = async () => {
      try {
        const remote = await SupabaseSyncService.fetchRemoteData();
        if (!isMounted || !remote) return;

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
        if (remote.blogPosts && remote.blogPosts.length > 0) {
          setBlogPosts(remote.blogPosts);
          CmsStorageService.saveBlogPosts(remote.blogPosts);
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
        console.warn('Initial remote sync skipped:', err);
      }
    };

    loadRemoteData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lead Valuation Engine: newValuation = leads * 350,000 Toman
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

  // Admin Actions
  const handleToggleDoctorVerification = (doctorId: number) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, verified: !d.verified } : d))
    );
  };

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

  // Update Tooth in FDI 32 Passport
  const handleUpdateTooth = (updated: ToothPassportRecord) => {
    setTeethPassport((prev) =>
      prev.map((t) => (t.tooth_number === updated.tooth_number ? updated : t))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white overflow-x-hidden w-full max-w-full">
      {/* 1. Global Navbar with live URL routing */}
      <Navbar
        isAdminOpen={false}
        onToggleAdmin={() => navigate('/admin')}
        onOpenNaxisGuide={() => navigate('/naxis-guide')}
        components={components}
        doctors={doctors}
        brands={initialBrands}
        onSelectComponent={(comp) => navigate(DentalMapRoutes.partByRef(comp.ref_code))}
        onSelectDoctor={(doc) => navigate(DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug))}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          navigate(DentalMapRoutes.partCategory(cat));
        }}
      />

      {/* 2. Routes (Zero-Collision SEO URL Architecture) */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <Routes>
          {/* Main Landing */}
          <Route
            path="/"
            element={
              <HomePage
                components={components}
                doctors={doctors}
                clinics={clinics}
                specialties={initialSpecialties}
                cities={initialCities}
                districts={initialDistricts}
                insurances={initialInsurances}
                brands={brands}
                implantTypes={initialImplantTypes}
                clinicDoctors={initialClinicDoctors}
                clinicInsurances={clinicInsurances}
                doctorImplantTypes={initialDoctorImplantTypes}
                packages={packages}
                teethPassport={teethPassport}
                leadValuations={leadValuations}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onUpdateTooth={handleUpdateTooth}
                onRecordLead={handleRecordLead}
              />
            }
          />

          {/* Dentists Directory Hub & Location Routes */}
          <Route
            path="/dentists"
            element={
              <DentistsByLocationPage
                doctors={doctors}
                cities={initialCities}
                districts={initialDistricts}
                specialties={initialSpecialties}
                clinics={clinics}
                clinicDoctors={initialClinicDoctors}
                onRecordLead={handleRecordLead}
              />
            }
          />
          <Route
            path="/dentists/:citySlug"
            element={
              <DentistsByLocationPage
                doctors={doctors}
                cities={initialCities}
                districts={initialDistricts}
                specialties={initialSpecialties}
                clinics={clinics}
                clinicDoctors={initialClinicDoctors}
                onRecordLead={handleRecordLead}
              />
            }
          />
          <Route
            path="/dentists/:citySlug/:districtSlug"
            element={
              <DentistsByLocationPage
                doctors={doctors}
                cities={initialCities}
                districts={initialDistricts}
                specialties={initialSpecialties}
                clinics={clinics}
                clinicDoctors={initialClinicDoctors}
                onRecordLead={handleRecordLead}
              />
            }
          />

          {/* Specialty Directory Hub & Hierarchical Location Routes */}
          <Route
            path="/specialties"
            element={
              <SpecialtyByLocationPage
                doctors={doctors}
                specialties={initialSpecialties}
                cities={initialCities}
                districts={initialDistricts}
                clinics={clinics}
                clinicDoctors={initialClinicDoctors}
              />
            }
          />
          <Route
            path="/specialties/:specialtySlug"
            element={
              <SpecialtyByLocationPage
                doctors={doctors}
                specialties={initialSpecialties}
                cities={initialCities}
                districts={initialDistricts}
                clinics={clinics}
                clinicDoctors={initialClinicDoctors}
              />
            }
          />
          <Route
            path="/specialties/:specialtySlug/:citySlug"
            element={
              <SpecialtyByLocationPage
                doctors={doctors}
                specialties={initialSpecialties}
                cities={initialCities}
                districts={initialDistricts}
                clinics={clinics}
                clinicDoctors={initialClinicDoctors}
              />
            }
          />
          <Route
            path="/specialties/:specialtySlug/:citySlug/:districtSlug"
            element={
              <SpecialtyByLocationPage
                doctors={doctors}
                specialties={initialSpecialties}
                cities={initialCities}
                districts={initialDistricts}
                clinics={clinics}
                clinicDoctors={initialClinicDoctors}
              />
            }
          />

          {/* Single Doctor Profile */}
          <Route
            path="/doctor/:slug"
            element={
              <DoctorProfilePage
                doctors={doctors}
                specialties={initialSpecialties}
                clinics={clinics}
                brands={brands}
                clinicDoctors={initialClinicDoctors}
                onRecordLead={handleRecordLead}
              />
            }
          />

          {/* Clinics in City / District */}
          <Route
            path="/clinics"
            element={
              <ClinicsByLocationPage
                clinics={clinics}
                cities={initialCities}
                districts={initialDistricts}
                insurances={initialInsurances}
                clinicInsurances={clinicInsurances}
                onRecordLead={handleRecordLead}
              />
            }
          />
          <Route
            path="/clinics/:citySlug"
            element={
              <ClinicsByLocationPage
                clinics={clinics}
                cities={initialCities}
                districts={initialDistricts}
                insurances={initialInsurances}
                clinicInsurances={clinicInsurances}
                onRecordLead={handleRecordLead}
              />
            }
          />
          <Route
            path="/clinics/:citySlug/:districtSlug"
            element={
              <ClinicsByLocationPage
                clinics={clinics}
                cities={initialCities}
                districts={initialDistricts}
                insurances={initialInsurances}
                clinicInsurances={clinicInsurances}
                onRecordLead={handleRecordLead}
              />
            }
          />

          {/* 24/7 Clinics */}
          <Route
            path="/clinics/24-hour/:citySlug"
            element={
              <ClinicsByLocationPage
                clinics={clinics}
                cities={initialCities}
                districts={initialDistricts}
                insurances={initialInsurances}
                clinicInsurances={clinicInsurances}
                is24HourOnly={true}
                onRecordLead={handleRecordLead}
              />
            }
          />
          <Route
            path="/clinics/24-hour/:citySlug/:districtSlug"
            element={
              <ClinicsByLocationPage
                clinics={clinics}
                cities={initialCities}
                districts={initialDistricts}
                insurances={initialInsurances}
                clinicInsurances={clinicInsurances}
                is24HourOnly={true}
                onRecordLead={handleRecordLead}
              />
            }
          />

          {/* Clinics by Insurance */}
          <Route
            path="/clinics/insurance/:insuranceSlug/:citySlug"
            element={
              <ClinicsByLocationPage
                clinics={clinics}
                cities={initialCities}
                districts={initialDistricts}
                insurances={initialInsurances}
                clinicInsurances={clinicInsurances}
                onRecordLead={handleRecordLead}
              />
            }
          />

          {/* Single Clinic Profile */}
          <Route
            path="/clinic/:slug"
            element={
              <ClinicProfilePage
                clinics={clinics}
                doctors={doctors}
                specialties={initialSpecialties}
                insurances={initialInsurances}
                clinicInsurances={clinicInsurances}
                clinicDoctors={initialClinicDoctors}
                onRecordLead={handleRecordLead}
              />
            }
          />

          {/* Implants by Country */}
          <Route
            path="/implants/country/:countrySlug"
            element={
              <BrandHubPage
                brands={initialBrands}
                implantTypes={initialImplantTypes}
                manufacturers={initialManufacturers}
                countries={initialCountries}
                components={components}
                doctors={doctors}
                cities={initialCities}
              />
            }
          />

          {/* Brand Hub */}
          <Route
            path="/brands"
            element={
              <BrandHubPage
                brands={initialBrands}
                implantTypes={initialImplantTypes}
                manufacturers={initialManufacturers}
                countries={initialCountries}
                components={components}
                doctors={doctors}
                cities={initialCities}
              />
            }
          />
          <Route
            path="/brands/:brandSlug"
            element={
              <BrandHubPage
                brands={initialBrands}
                implantTypes={initialImplantTypes}
                manufacturers={initialManufacturers}
                countries={initialCountries}
                components={components}
                doctors={doctors}
                cities={initialCities}
              />
            }
          />
          <Route
            path="/brands/:brandSlug/:modelSlug"
            element={
              <BrandHubPage
                brands={initialBrands}
                implantTypes={initialImplantTypes}
                manufacturers={initialManufacturers}
                countries={initialCountries}
                components={components}
                doctors={doctors}
                cities={initialCities}
              />
            }
          />
          <Route
            path="/brands/:brandSlug/dentists/:citySlug"
            element={
              <BrandHubPage
                brands={initialBrands}
                implantTypes={initialImplantTypes}
                manufacturers={initialManufacturers}
                countries={initialCountries}
                components={components}
                doctors={doctors}
                cities={initialCities}
              />
            }
          />

          {/* 8-Part Category and Single Part REF */}
          <Route
            path="/parts"
            element={
              <PartCategoryPage
                components={components}
                brands={initialBrands}
              />
            }
          />
          <Route
            path="/parts/:categorySlug"
            element={
              <PartCategoryPage
                components={components}
                brands={initialBrands}
              />
            }
          />
          <Route
            path="/parts/ref/:refCode"
            element={
              <ComponentDetailPage
                components={components}
                brands={brands}
              />
            }
          />

          {/* Compare Brands */}
          <Route
            path="/compare/:compareSlug"
            element={
              <BrandComparisonPage
                brands={initialBrands}
                implantTypes={initialImplantTypes}
              />
            }
          />

          {/* Standalone Naxis Guide */}
          <Route
            path="/naxis-guide"
            element={<NaxisGuidePage components={components} />}
          />

          {/* Interactive Implant Diagnosis Quiz / Test */}
          <Route path="/quiz" element={<ImplantTestPage />} />
          <Route path="/test" element={<ImplantTestPage />} />
          <Route path="/test-2" element={<ImplantTestPage />} />
          <Route path="/implant-test" element={<ImplantTestPage />} />

          {/* FDI 32-Tooth Passport Simulator */}
          <Route
            path="/passport"
            element={
              <PassportPage
                teeth={teethPassport}
                onUpdateTooth={handleUpdateTooth}
              />
            }
          />

          {/* Headless WordPress Blog on /blog Subfolder */}
          <Route
            path="/blog"
            element={<BlogPage posts={blogPosts} />}
          />
          <Route
            path="/blog/:postSlug"
            element={<BlogPage posts={blogPosts} />}
          />

          {/* Headless WordPress Custom Pages (برگه‌ها / صفحات ایستا) */}
          <Route path="/page/:pageSlug" element={<CustomPageView pages={pages} />} />
          <Route path="/about-us" element={<CustomPageView pages={pages} />} />
          <Route path="/terms" element={<CustomPageView pages={pages} />} />
          <Route path="/contact" element={<CustomPageView pages={pages} />} />

          {/* WordPress-style CMS Admin Panel */}
          <Route
            path="/admin"
            element={
              <AdminPage
                doctors={doctors}
                setDoctors={setDoctors}
                clinics={clinics}
                setClinics={setClinics}
                components={components}
                setComponents={setComponents}
                blogPosts={blogPosts}
                setBlogPosts={setBlogPosts}
                pages={pages}
                setPages={setPages}
                packages={packages}
                setPackages={setPackages}
                brands={brands}
                setBrands={setBrands}
                insurances={initialInsurances}
                clinicInsurances={clinicInsurances}
                leadValuations={leadValuations}
                onToggleDoctorVerification={handleToggleDoctorVerification}
                onToggleClinicInsurance={handleToggleClinicInsurance}
                siteSettings={siteSettings}
                setSiteSettings={setSiteSettings}
              />
            }
          />

          {/* Legacy single component / doctor redirects for fallback compatibility */}
          <Route
            path="/component/:refCode"
            element={
              <ComponentDetailPage
                components={components}
                brands={brands}
              />
            }
          />
          <Route
            path="/doctor-detail/:id"
            element={
              <DoctorDetailPage
                doctors={doctors}
                specialties={initialSpecialties}
                clinics={clinics}
                brands={initialBrands}
                clinicDoctors={initialClinicDoctors}
                onRecordLead={handleRecordLead}
              />
            }
          />
        </Routes>
      </main>

      {/* 3. Global Footer */}
      <Footer
        onOpenAdmin={() => navigate('/admin')}
        onOpenNaxisGuide={() => navigate('/naxis-guide')}
      />

      {/* 4. RefChatbot Floating AI widget */}
      <RefChatbot
        components={components}
        brands={initialBrands}
        onSelectComponent={(comp) => navigate(DentalMapRoutes.partByRef(comp.ref_code))}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};
