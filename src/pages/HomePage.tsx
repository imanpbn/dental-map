import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { HeroSection } from '../components/HeroSection';
import { PlatformServicesSection } from '../components/PlatformServicesSection';
import { TopSpecialistsBanner } from '../components/TopSpecialistsBanner';
import { TrustGuaranteesBanner } from '../components/TrustGuaranteesBanner';
import { ClinicalPackages } from '../components/ClinicalPackages';
import { ComparisonMatrix } from '../components/ComparisonMatrix';
import { BiomechanicsTranslator } from '../components/BiomechanicsTranslator';
import { ImplantTestHeroBanner } from '../components/ImplantTestHeroBanner';
import { PassportSimulator } from '../components/PassportSimulator';
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
    <div className="w-full px-[5%]">
      <SEO
        title="دنتال مپ (Dental Map) | پلتفرم شفافیت، اصالت قطعات و دایرکتوری ایمپلنت دندان ایران"
        description="سامانه جامع شفافیت و اصالت قطعات ایمپلنت دندان، دایرکتوری تخصصی جراحان فک و صورت و دندانپزشکان ایران، استعلام کد REF فیکسچر و شناسنامه دیجیتال ۳۲ دندان (FDI)."
        canonical="/"
      />
      {/* 1. Hero Section */}
      <HeroSection
        onSearchClick={() => handleNavigate('parts-catalog')}
        onOpenPassport={() => navigate('/passport')}
        onSelectComponent={(comp) => navigate(DentalMapRoutes.partByRef(comp.ref_code))}
        featuredComponent={components[0]}
      />

      {/* 2. Implant Test & Diagnostic Game Banner (دقیقاً زیر هیرو سکشن) */}
      <ImplantTestHeroBanner />

      {/* 3. Top Specialists Banner (پزشکان تایید صلاحیت شده با استعلام نظام پزشکی) */}
      <TopSpecialistsBanner
        doctors={doctors}
        onSelectDoctor={(doc) => navigate(DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug))}
        onBookClick={(doc) => navigate(DentalMapRoutes.doctorProfile(doc.medical_council_code, doc.slug))}
      />

      {/* 3. Passport Simulator (استاندارد جهانی فدراسیون بین‌المللی دندانپزشکی FDI و شناسنامه دیجیتال فک ۳۲ دندان) */}
      <PassportSimulator
        teeth={teethPassport}
        onUpdateTooth={onUpdateTooth}
      />

      {/* 4. Platform Services (4 Cards) */}
      <PlatformServicesSection onNavigate={handleNavigate} />

      {/* 5. Trust Guarantees Ribbon */}
      <TrustGuaranteesBanner />

      {/* 6. Clinical Packages (Bundled 4-in-1 Suites) */}
      <ClinicalPackages
        packages={packages}
        onOrderPackage={() => {
          window.location.href = 'tel:02188001144';
        }}
      />

      {/* 9. Comparison Matrix (Brands & Micro-gap) */}
      <ComparisonMatrix
        brands={brands}
        implantTypes={implantTypes}
        onOpenNaxisGuide={() => navigate('/naxis-guide')}
      />

      {/* 10. Biomechanics Translator (D1-D4 Bone density & Everyday Analogies) */}
      <BiomechanicsTranslator />

      {/* 11. Blog Section */}
      <BlogSection onOpenNaxisGuide={() => navigate('/blog')} />

      {/* 14. Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};
