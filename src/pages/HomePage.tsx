import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { PlatformServicesSection } from '../components/PlatformServicesSection';
import { TopSpecialistsBanner } from '../components/TopSpecialistsBanner';
import { TrustGuaranteesBanner } from '../components/TrustGuaranteesBanner';
import { FeaturedComponentsShowcase } from '../components/FeaturedComponentsShowcase';
import { PartsExplorer } from '../components/PartsExplorer';
import { ClinicalPackages } from '../components/ClinicalPackages';
import { ComparisonMatrix } from '../components/ComparisonMatrix';
import { BiomechanicsTranslator } from '../components/BiomechanicsTranslator';
import { ImplantKnowledgeQuiz } from '../components/ImplantKnowledgeQuiz';
import { PassportSimulator } from '../components/PassportSimulator';
import { DoctorDirectory } from '../components/DoctorDirectory';
import { BlogSection } from '../components/BlogSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { DentalMapRoutes } from '../utils/urlBuilder';

import {
  Doctor,
  Clinic,
  Specialty,
  City,
  District,
  Insurance,
  ImplantBrand,
  ImplantType,
  ClinicDoctor,
  ClinicInsurance,
  DoctorImplantType,
  DentalComponent,
  ClinicalPackage,
  ToothPassportRecord,
  LeadValuationRecord
} from '../types';

interface HomePageProps {
  components: DentalComponent[];
  doctors: Doctor[];
  clinics: Clinic[];
  specialties: Specialty[];
  cities: City[];
  districts: District[];
  insurances: Insurance[];
  brands: ImplantBrand[];
  implantTypes: ImplantType[];
  clinicDoctors: ClinicDoctor[];
  clinicInsurances: ClinicInsurance[];
  doctorImplantTypes: DoctorImplantType[];
  packages: ClinicalPackage[];
  teethPassport: ToothPassportRecord[];
  leadValuations: Record<number, LeadValuationRecord>;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onUpdateTooth: (updated: ToothPassportRecord) => void;
  onRecordLead: (clinicId: number, doctorId?: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  components,
  doctors,
  clinics,
  specialties,
  cities,
  districts,
  insurances,
  brands,
  implantTypes,
  clinicDoctors,
  clinicInsurances,
  doctorImplantTypes,
  packages,
  teethPassport,
  leadValuations,
  selectedCategory,
  onSelectCategory,
  onUpdateTooth,
  onRecordLead
}) => {
  const navigate = useNavigate();

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'passport-section') {
      navigate('/passport');
      return;
    }
    if (sectionId === 'directory-section') {
      navigate('/directory');
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection
        onSearchClick={() => handleNavigate('parts-catalog')}
        onOpenPassport={() => navigate('/passport')}
        onSelectComponent={(comp) => navigate(DentalMapRoutes.partByRef(comp.ref_code))}
        featuredComponent={components[0]}
      />

      {/* 2. Platform Services (4 Cards) */}
      <PlatformServicesSection onNavigate={handleNavigate} />

      {/* 3. Top Specialists Banner */}
      <TopSpecialistsBanner
        doctors={doctors}
        onSelectDoctor={(doc) => navigate(DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug))}
        onBookClick={(doc) => navigate(DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug))}
      />

      {/* 4. Trust Guarantees Ribbon */}
      <TrustGuaranteesBanner />

      {/* 5. Featured Components Showcase (Top 5) */}
      <FeaturedComponentsShowcase
        components={components}
        onSelectComponent={(comp) => navigate(DentalMapRoutes.partByRef(comp.ref_code))}
      />

      {/* 6. Parts Explorer (8 Categories Catalog) */}
      <PartsExplorer
        components={components}
        brands={brands}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onSelectComponent={(comp) => navigate(DentalMapRoutes.partByRef(comp.ref_code))}
      />

      {/* 7. Clinical Packages (Bundled 4-in-1 Suites) */}
      <ClinicalPackages
        packages={packages}
        onOrderPackage={() => {
          window.location.href = 'tel:02188001144';
        }}
      />

      {/* 8. Comparison Matrix (Brands & Micro-gap) */}
      <ComparisonMatrix
        brands={brands}
        implantTypes={implantTypes}
        onOpenNaxisGuide={() => navigate('/naxis-guide')}
      />

      {/* 9. Biomechanics Translator (D1-D4 Bone density & Everyday Analogies) */}
      <BiomechanicsTranslator />

      {/* 10. Implant Knowledge Quiz */}
      <ImplantKnowledgeQuiz />

      {/* 11. Passport Simulator (FDI 32 Teeth & PDF Modal) */}
      <PassportSimulator
        teeth={teethPassport}
        onUpdateTooth={onUpdateTooth}
      />

      {/* 12. Doctor & Clinic Directory */}
      <DoctorDirectory
        doctors={doctors}
        clinics={clinics}
        specialties={specialties}
        cities={cities}
        districts={districts}
        insurances={insurances}
        brands={brands}
        implantTypes={implantTypes}
        clinicDoctors={clinicDoctors}
        clinicInsurances={clinicInsurances}
        doctorImplantTypes={doctorImplantTypes}
        leadValuations={leadValuations}
        onRecordLead={onRecordLead}
        onSelectDoctor={(doc) => navigate(DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug))}
      />

      {/* 13. Blog Section */}
      <BlogSection onOpenNaxisGuide={() => navigate('/blog')} />

      {/* 14. Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};
