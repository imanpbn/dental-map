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
  buildWebSiteSchema,
  buildOrganizationSchema,
  buildFaqPageSchema
} from '../utils/schemaBuilder';

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
  LeadValuationRecord,
  WordPressBlogPost
} from '../types';

interface HomePageProps {
  components: DentalComponent[];
  blogPosts?: WordPressBlogPost[];
  doctors?: Doctor[];
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
  blogPosts = []
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
        jsonLd={[
          buildWebSiteSchema(),
          buildOrganizationSchema(),
          buildFaqPageSchema([
            {
              question: 'چگونه از اصالت برند و قطعات ایمپلنت دندان خود مطمئن شویم؟',
              answer: 'با وارد کردن کد رفرنس (REF) یا اسکن برچسب استریل فیکسچر در سامانه دنتال‌مپ، مشخصات کارخانه، مجوز اداره کل تجهیزات پزشکی (IMED) و نمایندگی رسمی استعلام می‌گردد.'
            },
            {
              question: 'شناسنامه دیجیتال ۳۲ دندان (FDI Implant Passport) چیست؟',
              answer: 'سندی استاندارد و بین‌المللی است که موقعیت دقیق فک، برند، سایز پلتفرم، شماره لات و گشتاور بستن قطعات را به صورت آنلاین و ضدجعل ثبت و نگهداری می‌کند.'
            },
            {
              question: 'آیا امکان مقایسه علمی برندهای ایمپلنت در دنتال‌مپ وجود دارد؟',
              answer: 'بله، ماتریس تخصصی دنتال‌مپ بیش از ۵۰ برند مطرح (اشترومن، مگاژن، نئوبیوتک، اوستم، ناکسیس و غیره) را از نظر پایداری ISQ، اتصال مورس تیپر و تست خستگی مقایسه می‌کند.'
            }
          ])
        ]}
      />
      {/* 1. Implant Test & Diagnostic Game Hero (جایگزین هیرو سکشن در بالای صفحه) */}
      <ImplantTestHeroBanner />

      {/* 2. Platform Services (4 Cards) */}
      <PlatformServicesSection onNavigate={handleNavigate} />

      {/* 3. Trust Guarantees Ribbon */}
      <TrustGuaranteesBanner />

      {/* 4. Platform Core Showcase & REF Verification (انتقال‌یافته به بالای مقالات) */}
      <HeroSection
        onSearchClick={() => handleNavigate('parts-catalog')}
        onOpenPassport={() => navigate('/passport')}
        onSelectComponent={(comp) => navigate(DentalMapRoutes.partByRef(comp.ref_code))}
        featuredComponent={components[0]}
      />

      {/* 5. Blog Section (Dynamic Headless WordPress) */}
      <BlogSection posts={blogPosts} onOpenNaxisGuide={() => navigate('/blog')} />

      {/* 6. Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};
