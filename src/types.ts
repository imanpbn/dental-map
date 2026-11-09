// ==============================================================================
// DENTAL MAP (دنتال مپ) - TypeScript Interface Definitions & Data Models
// ==============================================================================

export type Gender = 'male' | 'female';
export type PatientAgeGroup = 'adults' | 'children' | 'both';
export type CenterType = 'private_office' | 'clinic' | 'hospital';
export type InsuranceType = 'basic' | 'supplementary';
export type RegionZone = 'شمال' | 'غرب' | 'شرق' | 'مرکز' | 'جنوب';

// --- Domain 1: Geography & Location ---
export interface Country {
  id: number;
  name: string;
  slug: string;
  iso_code: string;
}

export interface Province {
  id: number;
  name: string;
  slug: string;
}

export interface City {
  id: number;
  province_id: number;
  name: string;
  slug: string;
}

export interface District {
  id: number;
  city_id: number;
  name: string;
  slug: string;
  region_zone: RegionZone;
}

// --- Domain 2: Implant Product Hierarchy ---
export interface Manufacturer {
  id: number;
  name: string;
  slug: string;
  hq_country_id: number;
  website: string;
}

export interface ImplantBrand {
  id: number;
  manufacturer_id: number;
  origin_country_id: number;
  name: string;
  slug: string;
  warranty_description: string;
  logo?: string;
  is_featured?: boolean;
}

export interface ImplantType {
  id: number;
  brand_id: number;
  model_name: string;
  slug: string;
  implant_category: 'Bone Level' | 'Tissue Level' | 'Basal';
  material: string;
  surface_technology: string;
  avg_lifespan_years: number;
  extra_specs: {
    diameter_mm?: number[];
    length_mm?: number[];
    connection_type?: string;
    certifications?: string[];
    fda_approved?: boolean;
    ce_approved?: boolean;
    compatibility?: string;
    isq_stability?: string;
    microgap_risk?: 'خیلی پایین' | 'پایین' | 'متوسط';
    recommended_torque_ncm?: number;
  };
}

// --- Domain 3: Doctors & Specialties ---
export interface Specialty {
  id: number;
  title: string;
  slug: string;
}

export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  slug: string;
  medical_council_code: string;
  gender: Gender;
  specialty_id: number;
  patient_age_group: PatientAgeGroup;
  passport_committed: boolean;
  bio: string;
  rating: number;
  reviews_count: number;
  experience_years: number;
  avatar: string;
  verified: boolean;
  created_at?: string;
}

// --- Domain 4: Clinics & Insurances ---
export interface Insurance {
  id: number;
  name: string;
  slug: string;
  insurance_type: InsuranceType;
}

export interface Clinic {
  id: number;
  name: string;
  slug: string;
  center_type: CenterType;
  city_id: number;
  district_id: number;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  is_24_7: boolean;
  working_hours?: Record<string, string>;
  is_free_tariff_only: boolean;
  image?: string;
  created_at?: string;
}

// Junctions
export interface ClinicInsurance {
  clinic_id: number;
  insurance_id: number;
}

export interface ClinicDoctor {
  id: number;
  clinic_id: number;
  doctor_id: number;
  shift_schedule?: Record<string, string>;
  is_active: boolean;
}

export interface DoctorImplantType {
  doctor_id: number;
  implant_type_id: number;
}

// --- 7 Component Categories ---
export type ComponentCategory =
  | 'fixture'           // حیاتی / داخل استخوان
  | 'abutment'          // پروتزی / بافت نرم
  | 'healing'           // شکل‌دهنده لثه
  | 'impression_coping' // انتقال موقعیت به لابراتوار
  | 'analog'            // شبیه‌ساز فیکسچر در کست
  | 'surgical_kit'      // کیت دریل و درایور
  | 'digital_analog';   // آنالوگ پرینت ۳ بعدی

export interface DentalComponent {
  id: number;
  ref_code: string;
  lot_number: string;
  brand_id: number;
  category: ComponentCategory;
  name_fa: string;
  name_en: string;
  description: string;
  platform_size: string;
  hex_size?: string;
  morse_taper_angle?: string;
  material: string;
  surface?: string;
  torque_ncm?: number;
  compatibility: string;
  price_toman: number;
  in_stock: boolean;
  image_url: string;
  is_critical?: boolean;
}

// Bundled Clinical Packages
export interface ClinicalPackage {
  id: number;
  title: string;
  brand_name: string;
  fixture_ref: string;
  abutment_ref: string;
  healing_ref: string;
  impression_ref: string;
  price_toman: number;
  description: string;
  badge: string;
  items_included: string[];
}

// FDI 32-Tooth Digital Passport
export interface ToothPassportRecord {
  tooth_number: number; // 11-18, 21-28, 31-38, 41-48
  tooth_name_fa: string;
  quadrant: 1 | 2 | 3 | 4;
  is_implanted: boolean;
  fixture_ref?: string;
  lot_number?: string;
  brand_name?: string;
  implant_model?: string;
  implant_date?: string;
  surgeon_name?: string;
  clinic_name?: string;
  abutment_torque_ncm?: number;
  crown_type?: string;
  qr_code_hash?: string;
  notes?: string;
}

// Lead Valuation
export interface LeadValuationRecord {
  clinic_id: number;
  doctor_id?: number;
  lead_count: number;
  total_valuation_toman: number;
  last_lead_at: string;
}

// Headless WordPress Blog Post Model (Mounted on /blog)
export interface WordPressBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time_minutes: number;
  published_at: string;
  featured_image: string;
  meta_robots: 'index, follow';
}

// Headless WordPress Page Model (برگه‌ها / صفحات ایستا)
export interface WordPressPage {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: string;
  status: 'publish' | 'draft';
  template?: 'default' | 'narrow' | 'fullwidth' | 'landing';
  published_at: string;
  featured_image?: string;
  meta_robots?: 'index, follow' | 'noindex, nofollow';
}

// Filter State for Doctor/Clinic Directory
export interface DirectoryFilterState {
  searchQuery: string;
  provinceId: number | 'all';
  cityId: number | 'all';
  districtId: number | 'all';
  regionZone: RegionZone | 'all';
  specialtyId: number | 'all';
  gender: Gender | 'all';
  patientAgeGroup: PatientAgeGroup | 'all';
  centerType: CenterType | 'all';
  is24_7Only: boolean;
  insuranceId: number | 'all';
  isFreeTariffOnly: boolean;
  brandId: number | 'all';
  implantTypeId: number | 'all';
  passportCommittedOnly: boolean;
  minLifespanYears: number;
}

// Admin Authentication & User Management
export type AdminRole = 'super_admin' | 'moderator' | 'analyst';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
  avatar?: string;
}

// SMS Gateway & MeliPayamak Configuration
export interface SmsSettings {
  apiKey: string;
  senderNumber: string;
  patternAppointment: string;
  patternPassport: string;
  patternQuiz: string;
  isSmsActive: boolean;
}

export interface SmsLogRecord {
  id: string;
  to: string;
  text: string;
  type: 'appointment' | 'passport' | 'quiz' | 'test' | 'lead';
  status: 'sent' | 'failed' | 'pending';
  recId?: string;
  created_at: string;
}

// Global Site Settings for WordPress-style CMS
export interface SiteSettings {
  hotline: string;
  site_title: string;
  announcement: string;
  meta_description: string;
  canonical_domain: string;
  is_lead_engine_active: boolean;
  sms_settings?: SmsSettings;
}

// Doctor & Clinic Self-Serve Onboarding Application Model
export interface DoctorApplication {
  id: number;
  center_type: CenterType;
  full_name: string;
  medical_council_code: string;
  specialty_id: number;
  city_id: number;
  district_id?: number;
  address: string;
  mobile: string;
  phone: string;
  brands: string[];
  insurances: string[];
  is_24_7: boolean;
  bio?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  reviewed_at?: string;
}

// Digital FDI Implant Passport Model
export interface IssuedPassportTooth {
  tooth_number: number;
  brand_name: string;
  implant_model?: string;
  fixture_ref: string;
  lot_number: string;
  abutment_type?: string;
  abutment_torque_ncm?: number;
  crown_type?: string;
  implant_date: string;
  surgeon_name: string;
  clinic_name: string;
  notes?: string;
}

export interface IssuedPassport {
  id: string; // e.g. "DMP-2026-98104"
  tracking_code: string;
  patient_name: string;
  patient_national_id: string;
  patient_mobile: string;
  teeth: IssuedPassportTooth[];
  clinic_name?: string;
  surgeon_name?: string;
  issue_date_shamsi: string;
  issue_date_iso: string;
  qr_code_data_url?: string;
  verification_url: string;
  notes?: string;
  status: 'active' | 'revoked';
}
