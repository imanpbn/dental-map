import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages - HomePage is loaded immediately for optimal first-paint speed
import { HomePage } from './pages/HomePage';

// Lazy-loaded pages for optimized initial bundle & performance
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const DoctorProfilePage = lazy(() => import('./pages/DoctorProfilePage').then(m => ({ default: m.DoctorProfilePage })));
const ImplantTestPage = lazy(() => import('./pages/ImplantTestPage').then(m => ({ default: m.ImplantTestPage })));
const ClinicProfilePage = lazy(() => import('./pages/ClinicProfilePage').then(m => ({ default: m.ClinicProfilePage })));
const ComponentDetailPage = lazy(() => import('./pages/ComponentDetailPage').then(m => ({ default: m.ComponentDetailPage })));
const DoctorJoinPage = lazy(() => import('./pages/DoctorJoinPage').then(m => ({ default: m.DoctorJoinPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const DirectoryPage = lazy(() => import('./pages/DirectoryPage').then(m => ({ default: m.DirectoryPage })));
const PartCategoryPage = lazy(() => import('./pages/PartCategoryPage').then(m => ({ default: m.PartCategoryPage })));
const DentistsByLocationPage = lazy(() => import('./pages/DentistsByLocationPage').then(m => ({ default: m.DentistsByLocationPage })));
const SpecialtyByLocationPage = lazy(() => import('./pages/SpecialtyByLocationPage').then(m => ({ default: m.SpecialtyByLocationPage })));
const ClinicsByLocationPage = lazy(() => import('./pages/ClinicsByLocationPage').then(m => ({ default: m.ClinicsByLocationPage })));
const BrandHubPage = lazy(() => import('./pages/BrandHubPage').then(m => ({ default: m.BrandHubPage })));
const BrandComparisonPage = lazy(() => import('./pages/BrandComparisonPage').then(m => ({ default: m.BrandComparisonPage })));
const PassportPage = lazy(() => import('./pages/PassportPage').then(m => ({ default: m.PassportPage })));
const NaxisGuidePage = lazy(() => import('./pages/NaxisGuidePage').then(m => ({ default: m.NaxisGuidePage })));
const CustomPageView = lazy(() => import('./pages/CustomPageView').then(m => ({ default: m.CustomPageView })));

const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-slate-500 font-medium">در حال بارگذاری صفحه...</span>
    </div>
  </div>
);

import { DentalMapRoutes } from './utils/urlBuilder';
import { DataProvider, useData } from './context/DataContext';

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
  SiteSettings,
  DoctorApplication
} from './types';
import { CmsStorageService, defaultSiteSettings } from './utils/cmsStorage';
import { SupabaseSyncService } from './utils/supabaseClient';
import { WordPressService } from './utils/wordPressClient';

// App Wrapper to use Router hooks
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const {
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
    teethPassport,
    leadValuations,
    selectedCategory,
    setSelectedCategory,
    handleAddDoctorApplication,
    handleRecordLead,
    handleToggleDoctorVerification,
    handleToggleClinicInsurance,
    handleUpdateTooth
  } = useData();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white overflow-x-hidden w-full max-w-full">
      {/* 1. Global Navbar with live URL routing */}
      <Navbar
        isAdminOpen={isAdminPath}
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
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
          {/* Main Landing */}
          <Route
            path="/"
            element={
              <HomePage
                components={components}
                blogPosts={blogPosts}
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

          {/* Dentists Directory Hub */}
          <Route
            path="/directory"
            element={
              <DirectoryPage
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
                leadValuations={leadValuations}
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

          {/* Interactive Implant Diagnosis Quiz */}
          <Route path="/quiz" element={<ImplantTestPage />} />

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

          {/* Doctor/Clinic Registration Onboarding (ثبت‌نام پزشکان و مراکز درمانی) */}
          <Route
            path="/doctor-join"
            element={
              <DoctorJoinPage
                cities={initialCities}
                districts={initialDistricts}
                specialties={initialSpecialties}
                brands={brands}
                insurances={initialInsurances}
                onAddApplication={handleAddDoctorApplication}
              />
            }
          />

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
                doctorApplications={doctorApplications}
                setDoctorApplications={setDoctorApplications}
              />
            }
          />
        </Routes>
        </Suspense>
      </main>

      {/* 3. Global Footer (hidden on admin panel) */}
      {!isAdminPath && (
        <Footer
          onOpenAdmin={() => navigate('/admin')}
          onOpenNaxisGuide={() => navigate('/naxis-guide')}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </BrowserRouter>
  );
};
