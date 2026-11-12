import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { HeroSection } from '../components/HeroSection';
import { PlatformServicesSection } from '../components/PlatformServicesSection';
import { TrustGuaranteesBanner } from '../components/TrustGuaranteesBanner';
import { ImplantTestHeroBanner } from '../components/ImplantTestHeroBanner';
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
  components
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
    if (sectionId === 'parts-catalog') {
      navigate('/parts');
      return;
    }
    if (sectionId === 'biomechanics-section') {
      navigate('/quiz');
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

      {/* 2. Implant Test & Diagnostic Game Banner */}
      <ImplantTestHeroBanner />

      {/* 3. Platform Services (4 Cards) */}
      <PlatformServicesSection onNavigate={handleNavigate} />

      {/* 4. Trust Guarantees Ribbon */}
      <TrustGuaranteesBanner />

      {/* 5. Blog Section */}
      <BlogSection onOpenNaxisGuide={() => navigate('/blog')} />

      {/* 6. Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};
