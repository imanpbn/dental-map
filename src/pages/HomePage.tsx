import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { BlogSection } from '../components/BlogSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
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
  components?: DentalComponent[];
  blogPosts?: WordPressBlogPost[];
  doctors?: Doctor[];
  clinics?: Clinic[];
  specialties?: Specialty[];
  cities?: City[];
  districts?: District[];
  insurances?: Insurance[];
  brands?: ImplantBrand[];
  implantTypes?: ImplantType[];
  clinicDoctors?: ClinicDoctor[];
  clinicInsurances?: ClinicInsurance[];
  doctorImplantTypes?: DoctorImplantType[];
  packages?: ClinicalPackage[];
  teethPassport?: ToothPassportRecord[];
  leadValuations?: Record<number, LeadValuationRecord>;
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
  onUpdateTooth?: (updated: ToothPassportRecord) => void;
  onRecordLead?: (clinicId: number, doctorId?: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  blogPosts = []
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-[5%] py-4">
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

      {/* Blog Section (Dynamic Headless WordPress) */}
      <BlogSection posts={blogPosts} onOpenNaxisGuide={() => navigate('/blog')} />

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};
