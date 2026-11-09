import {
  Country,
  Province,
  City,
  District,
  Manufacturer,
  ImplantBrand,
  ImplantType,
  Specialty,
  Doctor,
  Clinic,
  Insurance,
  ClinicInsurance,
  ClinicDoctor,
  DoctorImplantType,
  DentalComponent,
  ClinicalPackage,
  ToothPassportRecord,
  LeadValuationRecord,
  WordPressBlogPost,
  WordPressPage,
  DoctorApplication
} from './types';

// ==============================================================================
// 1. DOMAIN 1: GEOGRAPHY & LOCATION (WITH SEO SLUGS)
// ==============================================================================
export const initialCountries: Country[] = [
  { id: 1, name: 'ایران', slug: 'iran', iso_code: 'IR' },
  { id: 2, name: 'سوئیس (Switzerland)', slug: 'switzerland', iso_code: 'CH' },
  { id: 3, name: 'آلمان (Germany)', slug: 'germany', iso_code: 'DE' },
  { id: 4, name: 'کره جنوبی (South Korea)', slug: 'south-korea', iso_code: 'KR' },
  { id: 5, name: 'ایالات متحده آمریکا (USA)', slug: 'usa', iso_code: 'US' },
  { id: 6, name: 'سوئد (Sweden)', slug: 'sweden', iso_code: 'SE' }
];

export const initialProvinces: Province[] = [
  { id: 1, name: 'تهران', slug: 'tehran-province' },
  { id: 2, name: 'فارس', slug: 'fars-province' },
  { id: 3, name: 'خراسان رضوی', slug: 'razavi-khorasan-province' },
  { id: 4, name: 'اصفهان', slug: 'isfahan-province' },
  { id: 5, name: 'البرز', slug: 'alborz-province' }
];

export const initialCities: City[] = [
  { id: 1, province_id: 1, name: 'تهران', slug: 'tehran' },
  { id: 2, province_id: 2, name: 'شیراز', slug: 'shiraz' },
  { id: 3, province_id: 3, name: 'مشهد', slug: 'mashhad' },
  { id: 4, province_id: 4, name: 'اصفهان', slug: 'isfahan' },
  { id: 5, province_id: 5, name: 'کرج', slug: 'karaj' }
];

export const initialDistricts: District[] = [
  { id: 1, city_id: 1, name: 'سعادت‌آباد', slug: 'saadat-abad', region_zone: 'غرب' },
  { id: 2, city_id: 1, name: 'شهرک غرب', slug: 'shahrak-gharb', region_zone: 'غرب' },
  { id: 3, city_id: 1, name: 'ونک و ملاصدرا', slug: 'vanak', region_zone: 'شمال' },
  { id: 4, city_id: 1, name: 'زعفرانیه و نیاوران', slug: 'zaferanieh', region_zone: 'شمال' },
  { id: 5, city_id: 1, name: 'ولیعصر و توانیر', slug: 'valiasr', region_zone: 'مرکز' },
  { id: 6, city_id: 1, name: 'تهرانپارس', slug: 'tehranpars', region_zone: 'شرق' },
  { id: 7, city_id: 1, name: 'صادقیه و مرزداران', slug: 'sadeghiyeh', region_zone: 'غرب' },
  { id: 8, city_id: 1, name: 'نازی‌آباد و بازار', slug: 'nazi-abad', region_zone: 'جنوب' },
  { id: 9, city_id: 2, name: 'قصرالدشت', slug: 'ghasr-dasht', region_zone: 'غرب' },
  { id: 10, city_id: 3, name: 'احمدآباد', slug: 'ahmad-abad', region_zone: 'مرکز' }
];

// ==============================================================================
// 2. DOMAIN 2: IMPLANT PRODUCTS & BRANDS (WITH SEO SLUGS)
// ==============================================================================
export const initialManufacturers: Manufacturer[] = [
  { id: 1, name: 'Straumann Group AG', slug: 'straumann-group', hq_country_id: 2, website: 'https://www.straumann.com' },
  { id: 2, name: 'Naxis Dental Systems GmbH', slug: 'naxis-dental', hq_country_id: 3, website: 'https://www.naxis-implant.de' },
  { id: 3, name: 'Osstem Implant Co., Ltd.', slug: 'osstem-implant', hq_country_id: 4, website: 'https://www.osstem.com' },
  { id: 4, name: 'Dentium Co., Ltd.', slug: 'dentium-implant', hq_country_id: 4, website: 'https://www.dentium.com' },
  { id: 5, name: 'Zimmer Biomet Dental Inc.', slug: 'zimmer-biomet-corp', hq_country_id: 5, website: 'https://www.zimmerbiometdental.com' },
  { id: 6, name: 'MegaGen Implant Co., Ltd.', slug: 'megagen-implant', hq_country_id: 4, website: 'https://www.imegagen.com' }
];

export const initialBrands: ImplantBrand[] = [
  {
    id: 1,
    manufacturer_id: 1,
    origin_country_id: 2,
    name: 'Straumann (سوئیس)',
    slug: 'straumann',
    warranty_description: 'وارانتی بین‌المللی مادام‌العمر (Lifetime International Warranty) با گذرنامه اصالت',
    logo: '🇨🇭',
    is_featured: true
  },
  {
    id: 2,
    manufacturer_id: 2,
    origin_country_id: 3,
    name: 'Naxis (آلمان)',
    slug: 'naxis',
    warranty_description: 'ضمانت تعویض مادام‌العمر تحت لایسنس DIN آلمان با سازگاری Astra Aqua',
    logo: '🇩🇪',
    is_featured: true
  },
  {
    id: 3,
    manufacturer_id: 3,
    origin_country_id: 4,
    name: 'Osstem (کره جنوبی)',
    slug: 'osstem',
    warranty_description: 'وارانتی طلایی ۱۰ ساله شرکتی با شبکه نمایندگی در سراسر ایران',
    logo: '🇰🇷',
    is_featured: true
  },
  {
    id: 4,
    manufacturer_id: 4,
    origin_country_id: 4,
    name: 'Dentium (کره جنوبی)',
    slug: 'dentium',
    warranty_description: 'وارانتی ۱۵ ساله ساختار و پلتفرم یکپارچه SLA',
    logo: '🇰🇷',
    is_featured: false
  },
  {
    id: 5,
    manufacturer_id: 5,
    origin_country_id: 5,
    name: 'Zimmer Biomet (آمریکا)',
    slug: 'zimmer-biomet',
    warranty_description: 'گارانتی مادام‌العمر متال با استئواینتگریشن فوق سریع ترابکولار',
    logo: '🇺🇸',
    is_featured: true
  },
  {
    id: 6,
    manufacturer_id: 6,
    origin_country_id: 4,
    name: 'Megagen (کره جنوبی)',
    slug: 'megagen',
    warranty_description: 'ضمانتنامه ۱۰ ساله Knife Thread و بارگذاری پروتزی فوری با سطح XPEED',
    logo: '🇰🇷',
    is_featured: false
  }
];

export const initialImplantTypes: ImplantType[] = [
  {
    id: 1,
    brand_id: 1,
    model_name: 'BLX (Bone Level Tapered Roxolid SLActive)',
    slug: 'blx',
    implant_category: 'Bone Level',
    material: 'Roxolid (آلیاژ تیتانیوم ۱۵٪ زیرکونیوم با مقاومت کششی فوق‌العاده)',
    surface_technology: 'SLActive (هیدروفیلیک نسل پنجم برای جوش خوردن در ۳ الی ۴ هفته)',
    avg_lifespan_years: 30,
    extra_specs: {
      diameter_mm: [3.5, 3.75, 4.0, 4.5, 5.0, 5.5],
      length_mm: [6, 8, 10, 12, 14, 16],
      connection_type: 'CrossFit TorcFit Connection 15°',
      certifications: ['FDA 510(k)', 'CE 0123 MDR', 'ISO 13485'],
      fda_approved: true,
      ce_approved: true,
      compatibility: 'Straumann VeloDrill & BLX Prosthetics',
      isq_stability: 'ISQ > 78 (پایداری اولیه بسیار بالا در تمام تیپ‌های استخوانی)',
      microgap_risk: 'خیلی پایین',
      recommended_torque_ncm: 35
    }
  },
  {
    id: 2,
    brand_id: 2,
    model_name: 'Naxis Prime Hex (Dual Connection)',
    slug: 'prime-hex',
    implant_category: 'Bone Level',
    material: 'Pure Titanium Grade 4 Cold-Worked / Ti Grade 5 ELI',
    surface_technology: 'MPS (Micro-Pore Sandblasted + Dual Acid Etched + CaP Treatment)',
    avg_lifespan_years: 25,
    extra_specs: {
      diameter_mm: [3.5, 4.0, 4.5, 5.0],
      length_mm: [8, 10, 11.5, 13, 15],
      connection_type: 'Dual Connection (Hex 2.1mm + 11° Morse Taper Conical)',
      certifications: ['CE MDR 2017/745', 'DIN EN ISO 14801', 'Iranian IMED Approved'],
      fda_approved: true,
      ce_approved: true,
      compatibility: 'Astra Aqua & Universal Conical 11° Systems',
      isq_stability: 'ISQ > 75 (رزوه برنده خودتراش Self-tapping)',
      microgap_risk: 'خیلی پایین',
      recommended_torque_ncm: 32
    }
  },
  {
    id: 3,
    brand_id: 3,
    model_name: 'TSIII SA (Internal Hex)',
    slug: 'tsiii-sa',
    implant_category: 'Bone Level',
    material: 'Titanium Grade 4',
    surface_technology: 'SA (Alumina Blasting + Acid Etching)',
    avg_lifespan_years: 20,
    extra_specs: {
      diameter_mm: [3.5, 4.0, 4.5, 5.0],
      length_mm: [7, 8.5, 10, 11.5, 13],
      connection_type: '1.25mm Internal Hex / 11° Morse Taper (Mini & Regular)',
      certifications: ['FDA', 'CE', 'KFDA'],
      fda_approved: true,
      ce_approved: true,
      compatibility: 'Osstem TS System, Hiossen ETIII',
      isq_stability: 'ISQ > 70',
      microgap_risk: 'پایین',
      recommended_torque_ncm: 30
    }
  },
  {
    id: 4,
    brand_id: 4,
    model_name: 'SuperLine SLA',
    slug: 'superline',
    implant_category: 'Bone Level',
    material: 'Titanium Grade 4',
    surface_technology: 'SLA (Large Grit Sandblasted and Acid Etched)',
    avg_lifespan_years: 18,
    extra_specs: {
      diameter_mm: [3.6, 4.0, 4.5, 5.0],
      length_mm: [7, 8, 10, 12, 14],
      connection_type: 'Internal Hex 2.5mm + Morse Taper',
      certifications: ['FDA', 'CE', 'ISO 13485'],
      fda_approved: true,
      ce_approved: true,
      compatibility: 'Dentium SuperLine & NR Line',
      isq_stability: 'ISQ > 68',
      microgap_risk: 'پایین',
      recommended_torque_ncm: 30
    }
  },
  {
    id: 5,
    brand_id: 5,
    model_name: 'Trabecular Metal (TM Dental Implant)',
    slug: 'trabecular-metal',
    implant_category: 'Bone Level',
    material: 'Tantalum Trabecular Metal + Titanium Ti-6Al-4V',
    surface_technology: '80% Porosity Bio-cellular Trabecular Ingrowth Matrix',
    avg_lifespan_years: 30,
    extra_specs: {
      diameter_mm: [4.1, 4.7, 6.0],
      length_mm: [8, 10, 11.5, 13],
      connection_type: 'Friction-Fit Internal Hex',
      certifications: ['FDA 510(k)', 'CE'],
      fda_approved: true,
      ce_approved: true,
      compatibility: 'Zimmer Tapered Screw-Vent (TSV)',
      isq_stability: 'ISQ > 80 (رشد استخوان به درون ساختار متخلخل تانتالیوم)',
      microgap_risk: 'خیلی پایین',
      recommended_torque_ncm: 35
    }
  },
  {
    id: 6,
    brand_id: 6,
    model_name: 'AnyRidge Knife Thread',
    slug: 'anyridge',
    implant_category: 'Bone Level',
    material: 'Titanium Grade 4',
    surface_technology: 'XPEED (Nano-structured Calcium Titanate surface)',
    avg_lifespan_years: 22,
    extra_specs: {
      diameter_mm: [3.5, 4.0, 4.5, 5.0, 5.5],
      length_mm: [7, 8.5, 10, 11.5, 13, 15],
      connection_type: '5° Morse Taper with Cross-Fit Hex',
      certifications: ['FDA', 'CE', 'KFDA'],
      fda_approved: true,
      ce_approved: true,
      compatibility: 'MegaGen AnyRidge Surgical Kits',
      isq_stability: 'ISQ > 75 (طراحی ویژه برای بارگذاری فوری در استخوان پوک D4)',
      microgap_risk: 'خیلی پایین',
      recommended_torque_ncm: 35
    }
  }
];

// ==============================================================================
// 3. DOMAIN 3: DOCTORS & SPECIALTIES (WITH SEO SLUGS)
// ==========================================================
export const initialSpecialties: Specialty[] = [
  { id: 1, title: 'دندانپزشک عمومی', slug: 'general-dentist' },
  { id: 2, title: 'متخصص جراحی دهان، فک و صورت', slug: 'maxillofacial-surgeon' },
  { id: 3, title: 'متخصص درمان ریشه (اندو)', slug: 'endodontist' },
  { id: 4, title: 'متخصص پروتزهای دندانی و ایمپلنت', slug: 'prosthodontist' },
  { id: 5, title: 'متخصص جراحی لثه (پریو)', slug: 'periodontist' },
  { id: 6, title: 'دندانپزشک کودکان', slug: 'pediatric-dentist' }
];

export const initialDoctors: Doctor[] = [
  {
    id: 1,
    first_name: 'دکتر علیرضا',
    last_name: 'صالحی‌راد',
    slug: 'dr-alireza-salehirad',
    medical_council_code: '104928',
    gender: 'male',
    specialty_id: 2, // جراحی دهان و فک و صورت
    patient_age_group: 'adults',
    passport_committed: true,
    bio: 'فلوشیپ بین‌المللی ایمپلنت‌های پیشرفته زیگوماتیک و بازسازی‌های پیچیده استخوان فک از سوئیس. سابقه بیش از ۴۵۰۰ جراحی موفق با برندهای اشتراومن و ناکسیس آلمان.',
    rating: 4.95,
    reviews_count: 248,
    experience_years: 17,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
    verified: true
  },
  {
    id: 2,
    first_name: 'دکتر مریم',
    last_name: 'کریمی‌تبار',
    slug: 'dr-maryam-karimitabar',
    medical_council_code: '118430',
    gender: 'female',
    specialty_id: 2, // جراحی دهان و فک و صورت
    patient_age_group: 'adults',
    passport_committed: true,
    bio: 'فوق تخصص جراحی فک و دهان، استاد دانشگاه علوم پزشکی شهید بهشتی و جراح برگزیده ایمپلنتولوژی دیجیتال و جراحی‌های سرپایی بدون درد.',
    rating: 4.92,
    reviews_count: 189,
    experience_years: 14,
    avatar: 'https://images.unsplash.com/photo-1594824813589-9133ca0f074d?auto=format&fit=crop&q=80&w=256',
    verified: true
  },
  {
    id: 3,
    first_name: 'دکتر نیما',
    last_name: 'فرهمند',
    slug: 'dr-nima-farahmand',
    medical_council_code: '093412',
    gender: 'male',
    specialty_id: 5, // پریودنتیست (جراحی لثه)
    patient_age_group: 'adults',
    passport_committed: true,
    bio: 'بورد تخصصی پریودنتولوژی و جراحی میکروسکوپی لثه، پیشرو در پیوند استخوان با پودرهای استخوانی سوئیسی Bio-Oss و ایمپلنت فوری یک‌روزه.',
    rating: 4.88,
    reviews_count: 312,
    experience_years: 19,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256',
    verified: true
  },
  {
    id: 4,
    first_name: 'دکتر بهاره',
    last_name: 'افشار',
    slug: 'dr-bahareh-afshar',
    medical_council_code: '139824',
    gender: 'female',
    specialty_id: 4, // پروستودنتیست (پروتز)
    patient_age_group: 'both',
    passport_committed: true,
    bio: 'متخصص پروتزهای دندانی و ایمپلنت، استاد طراحی لبخند دیجیتال و پروتزهای متکی بر ایمپلنت تمام‌فک آل-آن-فور (All-on-4).',
    rating: 4.97,
    reviews_count: 164,
    experience_years: 12,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
    verified: true
  },
  {
    id: 5,
    first_name: 'دکتر احسان',
    last_name: 'نادری',
    slug: 'dr-ehsan-naderi',
    medical_council_code: '120519',
    gender: 'male',
    specialty_id: 1, // دندانپزشک عمومی
    patient_age_group: 'both',
    passport_committed: false,
    bio: 'دندانپزشک باسابقه و متبحر در جراحی‌های ایمپلنتولوژی دیجیتال و پروتزهای ثابت با پوشش بیمه‌های تکمیلی.',
    rating: 4.75,
    reviews_count: 98,
    experience_years: 9,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256',
    verified: true
  },
  {
    id: 6,
    first_name: 'دکتر سوگل',
    last_name: 'یزدانی',
    slug: 'dr-sogol-yazdani',
    medical_council_code: '142109',
    gender: 'female',
    specialty_id: 6, // دندانپزشک کودکان
    patient_age_group: 'children',
    passport_committed: true,
    bio: 'متخصص دندانپزشکی اطفال و نوجوانان، پیشگیری از ناهنجاری‌های فکی، حفظ فضای دندان‌های از دست رفته و فضا نگهدارهای دیجیتال.',
    rating: 4.98,
    reviews_count: 142,
    experience_years: 11,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
    verified: true
  }
];

// ==============================================================================
// 4. DOMAIN 4: CLINICS & INSURANCES (WITH SEO SLUGS)
// ==============================================================================
export const initialInsurances: Insurance[] = [
  { id: 1, name: 'بیمه دانا', slug: 'dana', insurance_type: 'supplementary' },
  { id: 2, name: 'بیمه ایران', slug: 'iran', insurance_type: 'supplementary' },
  { id: 3, name: 'بیمه البرز', slug: 'alborz', insurance_type: 'supplementary' },
  { id: 4, name: 'بیمه سامان', slug: 'saman', insurance_type: 'supplementary' },
  { id: 5, name: 'تأمین اجتماعی', slug: 'tamin', insurance_type: 'basic' }
];

export const initialClinics: Clinic[] = [
  {
    id: 1,
    name: 'مرکز جراحی و کلینیک شبانه‌روزی ایمپلنت آتیه غرب',
    slug: 'atiyeh-gharb-dental-clinic',
    center_type: 'clinic',
    city_id: 1, // تهران
    district_id: 1, // سعادت آباد
    address: 'تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، نبش خیابان مروارید، ساختمان پزشکان آتیه، طبقه سوم',
    latitude: 35.7824,
    longitude: 51.3789,
    phone: '021-22091100',
    is_24_7: true,
    working_hours: {
      all: '۲۴ ساعته حتی در ایام تعطیل رسمی'
    },
    is_free_tariff_only: false,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    name: 'مطب تخصصی جراحی فک و صورت دکتر مریم کریمی‌تبار',
    slug: 'dr-karimi-office-shahrak-gharb',
    center_type: 'private_office',
    city_id: 1, // تهران
    district_id: 2, // شهرک غرب
    address: 'تهران، شهرک غرب، بلوار دادمان، بعد از پل یادگار امام، پلاک ۸۴، واحد ۴',
    latitude: 35.7681,
    longitude: 51.3654,
    phone: '021-88374520',
    is_24_7: true, // شبانه‌روزی
    working_hours: {
      شنبه_تا_چهارشنبه: '۱۴:۰۰ الی ۲۲:۰۰',
      پنجشنبه: '۰۹:۰۰ الی ۱۵:۰۰',
      آنکال: 'پاسخگویی شبانه‌روزی اورژانس جراحی'
    },
    is_free_tariff_only: false,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    name: 'انستیتو ایمپلنتولوژی و طراحی لبخند دکتر صالحی‌راد (مطب شخصی)',
    slug: 'dr-salehi-vanak-institute',
    center_type: 'private_office',
    city_id: 1, // تهران
    district_id: 3, // ونک
    address: 'تهران، میدان ونک، ابتدای خیابان ملاصدرا، برج ونک، طبقه ششم، واحد ۶۰۲',
    latitude: 35.7578,
    longitude: 51.4112,
    phone: '021-88880250',
    is_24_7: false,
    working_hours: {
      شنبه_تا_چهارشنبه: '۱۰:۰۰ الی ۱۹:۰۰'
    },
    is_free_tariff_only: true, // صرفا تعرفه آزاد
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    name: 'بیمارستان و مرکز فوق تخصصی جراحی دهان و دندانپزشکی نیلوفر',
    slug: 'niloufar-dental-hospital-niavaran',
    center_type: 'hospital',
    city_id: 1, // تهران
    district_id: 4, // زعفرانیه و نیاوران
    address: 'تهران، نیاوران، سه راه یاسر، جنب بوستان باهنر، پلاک ۱۲',
    latitude: 35.8190,
    longitude: 51.4623,
    phone: '021-26123450',
    is_24_7: true,
    working_hours: {
      all: '۲۴ ساعته شبانه‌روزی با بخش اورژانس و بیهوشی دندانپزشکی'
    },
    is_free_tariff_only: false,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 5,
    name: 'کلینیک دندانپزشکی دیجیتال مهرگان شیراز',
    slug: 'mehregan-dental-clinic-shiraz',
    center_type: 'clinic',
    city_id: 2, // شیراز
    district_id: 9, // قصرالدشت
    address: 'شیراز، خیابان قصرالدشت، روبروی کوچه ۵۲، مجتمع پزشکی مهرگان',
    latitude: 29.6293,
    longitude: 52.5186,
    phone: '071-36289900',
    is_24_7: false,
    working_hours: {
      شنبه_تا_پنجشنبه: '۰۹:۰۰ الی ۲۱:۰۰'
    },
    is_free_tariff_only: false,
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=400'
  }
];

// Junctions: Clinic <-> Insurance
export const initialClinicInsurances: ClinicInsurance[] = [
  { clinic_id: 1, insurance_id: 1 }, // آتیه غرب با دانا
  { clinic_id: 1, insurance_id: 2 }, // آتیه غرب با ایران
  { clinic_id: 1, insurance_id: 3 }, // آتیه غرب با البرز
  { clinic_id: 2, insurance_id: 1 }, // مطب دکتر کریمی‌تبار با دانا
  { clinic_id: 2, insurance_id: 3 }, // مطب دکتر کریمی‌تبار با البرز
  { clinic_id: 4, insurance_id: 1 }, // بیمارستان نیلوفر با دانا
  { clinic_id: 4, insurance_id: 2 }, // بیمارستان نیلوفر با ایران
  { clinic_id: 4, insurance_id: 4 }, // بیمارستان نیلوفر با سامان
  { clinic_id: 4, insurance_id: 5 }, // بیمارستان نیلوفر با تامین اجتماعی
  { clinic_id: 5, insurance_id: 2 }  // مهرگان شیراز با ایران
];

// Junctions: Clinic <-> Doctor
export const initialClinicDoctors: ClinicDoctor[] = [
  {
    id: 1,
    clinic_id: 1, // آتیه غرب
    doctor_id: 1, // دکتر صالحی‌راد
    shift_schedule: { شنبه: 'عصر', دوشنبه: 'عصر' },
    is_active: true
  },
  {
    id: 2,
    clinic_id: 1, // آتیه غرب
    doctor_id: 2, // دکتر کریمی‌تبار
    shift_schedule: { یکشنبه: 'صبح و عصر', چهارشنبه: 'صبح' },
    is_active: true
  },
  {
    id: 3,
    clinic_id: 2, // مطب دکتر کریمی‌تبار در شهرک غرب
    doctor_id: 2,
    shift_schedule: { شنبه_تا_چهارشنبه: '۱۶:۰۰ الی ۲۰:۰۰' },
    is_active: true
  },
  {
    id: 4,
    clinic_id: 3, // مطب شخصی دکتر صالحی‌راد در ونک
    doctor_id: 1,
    shift_schedule: { یکشنبه_سه‌شنبه: '۱۰:۰۰ الی ۱۸:۰۰' },
    is_active: true
  },
  {
    id: 5,
    clinic_id: 4, // بیمارستان نیلوفر
    doctor_id: 3, // دکتر فرهمند
    shift_schedule: { تمام_روزها: 'شیفت جراحی صبح' },
    is_active: true
  },
  {
    id: 6,
    clinic_id: 4, // بیمارستان نیلوفر
    doctor_id: 4, // دکتر بهاره افشار
    shift_schedule: { شنبه_دوشنبه_چهارشنبه: 'عصر' },
    is_active: true
  },
  {
    id: 7,
    clinic_id: 1, // آتیه غرب
    doctor_id: 5, // دکتر احسان نادری
    shift_schedule: { شیفت_شب: '۲۲:۰۰ الی ۰۸:۰۰ صبح' },
    is_active: true
  },
  {
    id: 8,
    clinic_id: 1, // آتیه غرب
    doctor_id: 6, // دکتر سوگل یزدانی (اطفال)
    shift_schedule: { پنجشنبه: 'صبح و عصر' },
    is_active: true
  }
];

// Junctions: Doctor <-> Implant Types
export const initialDoctorImplantTypes: DoctorImplantType[] = [
  { doctor_id: 1, implant_type_id: 1 }, // دکتر صالحی با Straumann BLX
  { doctor_id: 1, implant_type_id: 2 }, // دکتر صالحی با Naxis Germany
  { doctor_id: 1, implant_type_id: 5 }, // دکتر صالحی با Zimmer Biomet
  { doctor_id: 2, implant_type_id: 1 }, // دکتر کریمی‌تبار با Straumann BLX
  { doctor_id: 2, implant_type_id: 2 }, // دکتر کریمی‌تبار با Naxis Prime Hex
  { doctor_id: 2, implant_type_id: 3 }, // دکتر کریمی‌تبار با Osstem TSIII
  { doctor_id: 3, implant_type_id: 1 }, // دکتر فرهمند با Straumann
  { doctor_id: 3, implant_type_id: 6 }, // دکتر فرهمند با Megagen
  { doctor_id: 4, implant_type_id: 2 }, // دکتر بهاره افشار با Naxis Germany
  { doctor_id: 4, implant_type_id: 4 }, // دکتر بهاره افشار با Dentium SuperLine
  { doctor_id: 5, implant_type_id: 3 }, // دکتر احسان نادری با Osstem TSIII
  { doctor_id: 5, implant_type_id: 4 }  // دکتر احسان نادری با Dentium
];

// ==============================================================================
// 5. 8 COMPONENT CATEGORIES & DENTAL COMPONENTS CATALOG
// ==============================================================================
export const initialComponents: DentalComponent[] = [
  // 1. Fixture (حیاتی / داخل استخوان)
  {
    id: 1,
    ref_code: '021.4312',
    lot_number: 'LOT-CH2026-8891',
    brand_id: 1, // Straumann
    category: 'fixture',
    name_fa: 'فیکسچر استخوانی اشترومن بی‌ال‌ایکس Roxolid SLActive',
    name_en: 'Straumann BLX RB Ø4.0mm L10mm Roxolid SLActive Fixture',
    description: 'فیکسچر تیتانیوم-زیرکونیوم فوق هایپرترد برای حداکثر پایداری اولیه در استخوان‌های نرم و سخت با استئواینتگریشن ۴ هفته‌ای.',
    platform_size: 'RB (Regular Base 4.0)',
    hex_size: 'TorcFit 15°',
    morse_taper_angle: '15° Conical',
    material: 'Roxolid (15% Zirconia + 85% Titanium)',
    surface: 'SLActive Hydrophilic',
    torque_ncm: 35,
    compatibility: 'کیت جراحی VeloDrill اشترومن و اباتمنت‌های BLX TorcFit',
    price_toman: 18500000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=400',
    is_critical: true
  },
  {
    id: 2,
    ref_code: 'NX-FX-4010',
    lot_number: 'LOT-DE2026-4412',
    brand_id: 2, // Naxis
    category: 'fixture',
    name_fa: 'فیکسچر نکسیس آلمان کانکشن دوگانه هگز و مورس تیپر',
    name_en: 'Naxis Prime Hex Fixture Ø4.0mm L10mm Dual Connection',
    description: 'فیکسچر آلمانی با آلیاژ تیتانیوم گرید ۴ پیشرفته سردکاری‌شده و پوشش نانو MPS، اتصال دوگانه کانیکال ۱۱ درجه برای حذف کامل ریزحرکت (Micro-gap).',
    platform_size: 'NP / RP Conical',
    hex_size: 'Hex 2.1mm',
    morse_taper_angle: '11° Morse Taper',
    material: 'Pure Titanium Grade 4 (DIN ISO 5832-2)',
    surface: 'MPS Micro-Pore Bio-active',
    torque_ncm: 32,
    compatibility: 'سازگار کامل با سیستم Astra Aqua و آچارهای استاندارد ۱۱ درجه',
    price_toman: 11800000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400',
    is_critical: true
  },
  {
    id: 3,
    ref_code: 'TS3S4010S',
    lot_number: 'LOT-KR2026-9021',
    brand_id: 3, // Osstem
    category: 'fixture',
    name_fa: 'فیکسچر اوستم مدل TSIII با سطح سندبلاست اسید اچ SA',
    name_en: 'Osstem TSIII SA Regular Fixture Ø4.0mm L10mm',
    description: 'فیکسچر پرفروش کره‌ای با طراحی رزوه‌های برنده، پایداری استخوانی عالی و مقاومت خستگی بالا.',
    platform_size: 'Regular (Ø4.0-5.0)',
    hex_size: '1.25mm Hex',
    morse_taper_angle: '11° Conical',
    material: 'Titanium Grade 4',
    surface: 'SA (Sandblasted & Acid-etched)',
    torque_ncm: 30,
    compatibility: 'کیت جراحی Osstem 120 و اباتمنت‌های استاندارد TS',
    price_toman: 7900000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400',
    is_critical: true
  },

  // 2. Abutment (پروتزی / بافت نرم)
  {
    id: 4,
    ref_code: '022.4111',
    lot_number: 'LOT-CH2026-5510',
    brand_id: 1, // Straumann
    category: 'abutment',
    name_fa: 'اباتمنت تیتانیومی زاویه‌دار اشترومن بی‌ال‌ایکس TorcFit 15°',
    name_en: 'Straumann BLX RB Anatomic Abutment 15° Angled AH 5.5mm',
    description: 'اباتمنت ارگونومیک برای تغییر زاویه پروتز و سازگاری حداکثری با لثه کراتینیزه، پیشگیری از پری‌ایمپلنتیت.',
    platform_size: 'Regular Base (RB)',
    hex_size: 'TorcFit 15°',
    material: 'Titanium Grade 5 ELI',
    torque_ncm: 35,
    compatibility: 'فقط برای فیکسچرهای Straumann BLX و پیچ‌های اصلی اشترومن',
    price_toman: 6400000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=400',
    is_critical: true
  },
  {
    id: 5,
    ref_code: 'NX-AB-001',
    lot_number: 'LOT-DE2026-1123',
    brand_id: 2, // Naxis
    category: 'abutment',
    name_fa: 'اباتمنت مستقیم پیش‌ساخته نکسیس آلمان',
    name_en: 'Naxis Germany Straight Abutment GH 2.0mm',
    description: 'اباتمنت پروتزی صاف با تطابق میکرومتری دقیق جهت ساخت روکش‌های پیچی و سمان‌شونده.',
    platform_size: 'Universal Conical',
    hex_size: '2.1mm Hex Lock',
    morse_taper_angle: '11° Morse Taper',
    material: 'Titanium Grade 5 ELI',
    torque_ncm: 30,
    compatibility: 'فیکسچرهای ناکسیس و سیستم‌های کانیکال مورس تیپر',
    price_toman: 3600000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400'
  },

  // 3. Healing Abutment (شکل‌دهنده لثه)
  {
    id: 6,
    ref_code: '024.4221',
    lot_number: 'LOT-CH2026-3392',
    brand_id: 1, // Straumann
    category: 'healing',
    name_fa: 'هیلینگ کپ اشترومن کانتور بافت نرم GH 4.0mm',
    name_en: 'Straumann BLX RB Healing Abutment Ø5.0mm H4.0mm',
    description: 'کلاهک شکل‌دهی لثه برای فرم‌دهی طبیعی بافت نرم تا زمان تحویل روکش نهایی پروتز.',
    platform_size: 'RB',
    material: 'Titanium Grade 4',
    torque_ncm: 15,
    compatibility: 'فیکسچرهای Straumann BLX',
    price_toman: 2400000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 7,
    ref_code: 'NX-HL-4530',
    lot_number: 'LOT-DE2026-7811',
    brand_id: 2, // Naxis
    category: 'healing',
    name_fa: 'هیلینگ اباتمنت ناکسیس آلمان با پروفایل امرجنس آناتومیک',
    name_en: 'Naxis Germany Healing Cap Ø4.5mm H3.0mm',
    description: 'شکل‌دهنده لثه کانتور شده با پیچ ارگونومیک هگز برای بستن ایمن در کلینیک.',
    platform_size: 'Conical Regular',
    material: 'Ti Grade 5',
    torque_ncm: 15,
    compatibility: 'ناکسیس و استرا آکوا',
    price_toman: 1650000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400'
  },

  // 4. Impression Coping (انتقال موقعیت به لابراتوار)
  {
    id: 8,
    ref_code: 'NX-IC-OPEN40',
    lot_number: 'LOT-DE2026-9901',
    brand_id: 2, // Naxis
    category: 'impression_coping',
    name_fa: 'ایمپرشن کوپینگ تری باز (Open Tray) ناکسیس',
    name_en: 'Naxis Open Tray Impression Coping Ø4.0mm',
    description: 'قطعه انتقال زاویه و عمق فیکسچر به کست گچی در قالب‌گیری تری باز با پین بلند راهنما.',
    platform_size: 'Conical 11°',
    material: 'Surgical Stainless Steel & Titanium Pin',
    torque_ncm: 10,
    compatibility: 'سیستم ناکسیس آلمان و آسترا',
    price_toman: 1450000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400'
  },

  // 5. Analog (شبیه‌ساز فیکسچر در کست)
  {
    id: 9,
    ref_code: 'NX-AN-4000',
    lot_number: 'LOT-DE2026-0044',
    brand_id: 2, // Naxis
    category: 'analog',
    name_fa: 'آنالوگ گچی فیکسچر ناکسیس آلمان',
    name_en: 'Naxis Traditional Plaster Cast Implant Analog',
    description: 'شبیه‌ساز فلزی فیکسچر برای ریختن قالب گچی سنتی در لابراتوار پروتز با حداکثر دقت گیر.',
    platform_size: 'Standard Conical 4.0',
    material: 'Stainless Steel Grade 316L',
    compatibility: 'کست‌های سنتی و تمام مدل‌های سری پرایم هگز ناکسیس',
    price_toman: 850000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400'
  },

  // 6. Surgical Kit (کیت دریل و درایور)
  {
    id: 10,
    ref_code: '046.049',
    lot_number: 'LOT-CH2026-SKIT01',
    brand_id: 1, // Straumann
    category: 'surgical_kit',
    name_fa: 'کیت جراحی کامل اشتراومن VeloDrill و درایورهای گاید تورک',
    name_en: 'Straumann Surgical Cassette with BLX VeloDrills & Ratchet',
    description: 'جعبه اتوکلاو استیل حاوی دریل‌های سرعت بالا با کاهش تولید حرارت استخوان، ترکمتر دیجیتال و درایورها.',
    platform_size: 'Universal Multi-System',
    material: 'Medical PEEK & Surgical Stainless Steel',
    torque_ncm: 80,
    compatibility: 'تمام فیکسچرهای BLX و BLT اشترومن',
    price_toman: 75000000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    is_critical: true
  },

  // 7. Digital Analog (آنالوگ پرینت ۳ بعدی)
  {
    id: 12,
    ref_code: 'NX-DA-3DPRN',
    lot_number: 'LOT-DE2026-3DAN',
    brand_id: 2, // Naxis
    category: 'digital_analog',
    name_fa: 'آنالوگ دیجیتال مخصوص مدل‌های پرینت سه بعدی ناکسیس',
    name_en: 'Naxis 3D-Printed Model Digital Analog with Locking Screw',
    description: 'آنالوگ فلزی با پیچ تثبیت‌کننده تحتانی برای جایگذاری با دقت ۱۰ میکرون در مدل‌های رزینی چاپ سه‌بعدی.',
    platform_size: 'Conical Dual Connection',
    material: 'Grade 5 Titanium Alloy',
    torque_ncm: 15,
    compatibility: 'کتابخانه‌های Exocad و 3Shape دنتال کد',
    price_toman: 1850000,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400'
  }
];

// ==============================================================================
// 6. CLINICAL PACKAGES (BUNDLED SURGICAL KITS)
// ==============================================================================
export const initialClinicalPackages: ClinicalPackage[] = [
  {
    id: 1,
    title: 'پکیج جامع ایمپلنت اشترومن سوئیس (BLX Premium Suite)',
    brand_name: 'Straumann Switzerland',
    fixture_ref: '021.4312 (BLX Roxolid SLActive Ø4.0)',
    abutment_ref: '022.4111 (TorcFit 15° Titanium)',
    healing_ref: '024.4221 (Contour Healing Cap 4mm)',
    impression_ref: '025.2210 (Open Tray Multi-transfer)',
    price_toman: 26500000,
    badge: 'بالاترین درجه رضایت بالینی',
    description: 'کیت کامل کاشت دندان برای دندان‌های خلفی و قدامی با وارانتی مادام‌العمر رسمی اشترومن سوئیس و پاسپورت دیجیتال.',
    items_included: [
      'فیکسچر اصیل Roxolid SLActive ۴ میلی‌متر',
      'اباتمنت زاویه‌دار آناتومیک ۱۵ درجه',
      'هیلینگ کلاهک فرم‌دهی کانتور لثه',
      'ایمپرشن کوپینگ انتقال تری باز',
      'ثبت شناسه LOT در سامانه بین‌المللی با بارکد QR'
    ]
  },
  {
    id: 2,
    title: 'پکیج مهندسی پیشرفته ناکسیس آلمان (Naxis Prime German Suite)',
    brand_name: 'Naxis Germany',
    fixture_ref: 'NX-FX-4010 (Prime Hex Dual Connection)',
    abutment_ref: 'NX-AB-001 (Straight Abutment Ti Grade 5)',
    healing_ref: 'NX-HL-4530 (Anatomic Emergence Healing)',
    impression_ref: 'NX-IC-OPEN40 (Open Tray Coping)',
    price_toman: 17200000,
    badge: 'پرفروش‌ترین پکیج تضمینی آلمان',
    description: 'پکیج اقتصادی-کیفی تحت لایسنس DIN آلمان، بدون ریزحرکت مورس تیپر، سازگار با استرا سوئد و گواهی تعویض مادام‌العمر.',
    items_included: [
      'فیکسچر ناکسیس آلمان با تیتانیوم گرید ۴ و سطح MPS',
      'اباتمنت تیتانیومی فابریک با اتصال مورس تیپر ۱۱ درجه',
      'هیلینگ اباتمنت فرم‌دهنده لثه آناتومیک',
      'ترنسفر کوپینگ قالب‌گیری دقیق لابراتواری',
      'پاسپورت رسمی اصالت با هولوگرام لیزری'
    ]
  },
  {
    id: 3,
    title: 'پکیج کارآمد اوستم کره جنوبی (Osstem TSIII Classic Kit)',
    brand_name: 'Osstem South Korea',
    fixture_ref: 'TS3S4010S (TSIII SA Regular Ø4.0)',
    abutment_ref: 'TS-AB-125 (1.25 Hex Angled)',
    healing_ref: 'TS-HL-0404 (Healing Abutment 4mm)',
    impression_ref: 'TS-IC-PICKUP (Pick-up Impression Coping)',
    price_toman: 12500000,
    badge: 'اقتصادی و محبوب در ایران',
    description: 'پکیج استاندارد کره‌ای، سازگار با پوشش‌های بیمه تکمیلی، با ۱۰ سال وارانتی شرکتی و دسترسی آسان به قطعات یدکی.',
    items_included: [
      'فیکسچر TSIII با سطح بیواکتیو SA',
      'اباتمنت هگز داخلی با درایور استاندارد ۱.۲۵',
      'هیلینگ کپ سیلیکونی-تیتانیومی',
      'کوپینگ انتقال ایمپرشن پیک‌آپ',
      'کارت ضمانت شرکتی اوستم ایران'
    ]
  }
];

// ==============================================================================
// 7. FDI 32-TOOTH DIGITAL JAW CHART INITIAL STATE
// ==============================================================================
const toothFdiMap: Record<number, { fa: string; quad: 1 | 2 | 3 | 4 }> = {
  18: { fa: 'عقل بالا راست', quad: 1 },
  17: { fa: 'آسیاب دوم بالا راست', quad: 1 },
  16: { fa: 'آسیاب اول بالا راست', quad: 1 },
  15: { fa: 'پری‌مولر دوم بالا راست', quad: 1 },
  14: { fa: 'پری‌مولر اول بالا راست', quad: 1 },
  13: { fa: 'نیش بالا راست', quad: 1 },
  12: { fa: 'پیشین کناری بالا راست', quad: 1 },
  11: { fa: 'پیشین میانی بالا راست (سانترال)', quad: 1 },

  21: { fa: 'پیشین میانی بالا چپ (سانترال)', quad: 2 },
  22: { fa: 'پیشین کناری بالا چپ', quad: 2 },
  23: { fa: 'نیش بالا چپ', quad: 2 },
  24: { fa: 'پری‌مولر اول بالا چپ', quad: 2 },
  25: { fa: 'پری‌مولر دوم بالا چپ', quad: 2 },
  26: { fa: 'آسیاب اول بالا چپ', quad: 2 },
  27: { fa: 'آسیاب دوم بالا چپ', quad: 2 },
  28: { fa: 'عقل بالا چپ', quad: 2 },

  31: { fa: 'پیشین میانی پایین چپ (سانترال)', quad: 3 },
  32: { fa: 'پیشین کناری پایین چپ', quad: 3 },
  33: { fa: 'نیش پایین چپ', quad: 3 },
  34: { fa: 'پری‌مولر اول پایین چپ', quad: 3 },
  35: { fa: 'پری‌مولر دوم پایین چپ', quad: 3 },
  36: { fa: 'آسیاب اول پایین چپ', quad: 3 },
  37: { fa: 'آسیاب دوم پایین چپ', quad: 3 },
  38: { fa: 'عقل پایین چپ', quad: 3 },

  41: { fa: 'پیشین میانی پایین راست (سانترال)', quad: 4 },
  42: { fa: 'پیشین کناری پایین راست', quad: 4 },
  43: { fa: 'نیش پایین راست', quad: 4 },
  44: { fa: 'پری‌مولر اول پایین راست', quad: 4 },
  45: { fa: 'پری‌مولر دوم پایین راست', quad: 4 },
  46: { fa: 'آسیاب اول پایین راست', quad: 4 },
  47: { fa: 'آسیاب دوم پایین راست', quad: 4 },
  48: { fa: 'عقل پایین راست', quad: 4 }
};

export const initial32TeethPassport: ToothPassportRecord[] = Object.entries(toothFdiMap).map(
  ([numStr, info]) => {
    const toothNum = parseInt(numStr, 10);
    if (toothNum === 16) {
      return {
        tooth_number: 16,
        tooth_name_fa: info.fa,
        quadrant: info.quad,
        is_implanted: true,
        fixture_ref: '021.4312',
        lot_number: 'LOT-CH2026-8891',
        brand_name: 'Straumann (سوئیس)',
        implant_model: 'BLX Roxolid SLActive Ø4.5 L10mm',
        implant_date: '۱۴۰۳/۰۴/۱۵',
        surgeon_name: 'دکتر علیرضا صالحی‌راد (کد نظام: ۱۰۴۹۲۸)',
        clinic_name: 'کلینیک جراحی شبانه‌روزی آتیه غرب',
        abutment_torque_ncm: 35,
        crown_type: 'زیرکونیا تمام سرامیک کادکم (Zirconia CAD/CAM Screw-Retained)',
        qr_code_hash: 'DM-IR-CH-BLX-0214312-LOT8891',
        notes: 'بارگذاری تاخیری پس از پیوند پودر استخوان و ممبرین کلاژن. ثبات اولیه ISQ 82.'
      };
    }
    if (toothNum === 36) {
      return {
        tooth_number: 36,
        tooth_name_fa: info.fa,
        quadrant: info.quad,
        is_implanted: true,
        fixture_ref: 'NX-FX-4010',
        lot_number: 'LOT-DE2026-4412',
        brand_name: 'Naxis (آلمان)',
        implant_model: 'Naxis Prime Hex Dual Connection Ø4.0 L11.5mm',
        implant_date: '۱۴۰۳/۰۷/۲۰',
        surgeon_name: 'دکتر مریم کریمی‌تبار (کد نظام: ۱۱۸۴۳۰)',
        clinic_name: 'مطب تخصصی دکتر مریم کریمی‌تبار',
        abutment_torque_ncm: 32,
        crown_type: 'متال سرامیک سمان‌شونده (PFM Custom Abutment)',
        qr_code_hash: 'DM-IR-DE-NX-4010-LOT4412',
        notes: 'کاشت با حفظ تیغه آلوئولار و هیلینگ آناتومیک ۳ میلی‌متر. بافت نرم سالم.'
      };
    }

    return {
      tooth_number: toothNum,
      tooth_name_fa: info.fa,
      quadrant: info.quad,
      is_implanted: false
    };
  }
);

// Initial Lead Valuation records
export const initialLeadValuations: Record<number, LeadValuationRecord> = {
  1: {
    clinic_id: 1,
    doctor_id: 1,
    lead_count: 142,
    total_valuation_toman: 142 * 350000,
    last_lead_at: '۱۴۰۳/۰۸/۱۰ ساعت ۱۰:۲۴'
  },
  2: {
    clinic_id: 2,
    doctor_id: 2,
    lead_count: 86,
    total_valuation_toman: 86 * 350000,
    last_lead_at: '۱۴۰۳/۰۸/۱۰ ساعت ۰۹:۱۵'
  },
  3: {
    clinic_id: 3,
    doctor_id: 1,
    lead_count: 54,
    total_valuation_toman: 54 * 350000,
    last_lead_at: '۱۴۰۳/۰۸/۰۹ ساعت ۱۷:۴۰'
  }
};

// ==============================================================================
// 8. HEADLESS WORDPRESS BLOG POSTS (MOUNTED ON /blog SUBFOLDER)
// ==============================================================================
export const initialBlogPosts: WordPressBlogPost[] = [
  {
    id: 1,
    title: 'راهنمای جامع پاسپورت اصالت ایمپلنت: چگونه شماره رفرنس و لات را بررسی کنیم؟',
    slug: 'implant-passport-guide',
    excerpt: 'شناسنامه دیجیتال ایمپلنت چیست و چگونه کد REF و شماره ساخت کارخانه مانع از کلاهبرداری و عوارض پس‌زدن فیکسچر می‌شود؟',
    category: 'آموزش بیمار و حقوق سلامت',
    author: 'دکتر علیرضا صالحی‌راد',
    read_time_minutes: 6,
    published_at: '۱۰ آبان ۱۴۰۳',
    featured_image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
    meta_robots: 'index, follow',
    content: `
      پاسپورت دندانپزشکی سندی معتبر و بین‌المللی است که پس از جراحی کاشت ایمپلنت توسط جراح تکمیل می‌شود.
      این سند شامل اطلاعات زیر است:
      ۱. کد رفرنس کارخانه (REF) که نشان‌دهنده ابعاد دقیق، نوع هگز، آلیاژ و پلتفرم اتصال است.
      ۲. شماره بهر ساخت یا لات (LOT Number) جهت ردیابی تاریخ استریل و آزمایشگاه متالورژی.
      ۳. گشتاور بستن پیچ اباتمنت بر حسب نیوتن-سانتی‌متر (Ncm).
      با داشتن این شناسنامه، در صورت مهاجرت، سفر یا تعویض روکش در سال‌های آینده، هر دندانپزشکی در جهان می‌تواند با اسکن QR کد بدون آسیب به استخوان، قطعه یدکی فابریک را جایگذاری نماید.
    `
  },
  {
    id: 2,
    title: 'تفاوت اتصال مورس تیپر (Morse Taper) با هگز تخت: تشبیه لگو و رفع معضل میکروگپ',
    slug: 'morse-taper-vs-flat-hex-microgap',
    excerpt: 'چرا زاویه‌های مخروطی ۱۱ تا ۱۵ درجه مانع از تجمع باکتری و تحلیل استخوان فک در اطراف ایمپلنت می‌شوند؟',
    category: 'بیومکانیک و مهندسی دندانپزشکی',
    author: 'دکتر مریم کریمی‌تبار',
    read_time_minutes: 8,
    published_at: '۰۴ آبان ۱۴۰۳',
    featured_image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=600',
    meta_robots: 'index, follow',
    content: `
      در اتصالات قدیمی اکسترنال و اینترنال هگز تخت، لبه‌های اتصال روی هم می‌نشینند اما فضای میکرومتری به نام میکروگپ (Micro-gap) باقی می‌ماند. با جویدن غذا و ایجاد نیروهای برشی، اثر پمپاژ باکتریایی رخ می‌دهد و میکروب‌های بزاق به داخل بدنه فیکسچر مکش می‌شوند.
      در مقابل، اتصال مورس تیپر با شیب ۱۱ تا ۱۵ درجه مانند فشردن دو لیوان مخروطی در هم یا قفل قطعات لگو عمل می‌کند. این فشار اصطکاکی، اتصال فیزیکی نفوذناپذیری ایجاد می‌کند که باکتری‌ها قادر به عبور از آن نیستند و تحلیل استخوان کرستال را به صفر نزدیک می‌کند.
    `
  },
  {
    id: 3,
    title: 'آزمون زلزله خستگی استخوان طبق استاندارد DIN EN ISO 14801 چیست؟',
    slug: 'iso-14801-fatigue-test-earthquake-analogy',
    excerpt: 'بررسی تست ۵ میلیون دور بارگذاری دینامیک در زاویه ۳۰ درجه برای اطمینان از عدم شکستگی فیکسچر در درازمدت.',
    category: 'متالورژی و استانداردها',
    author: 'مهندس متالورژی پزشکی دنتال مپ',
    read_time_minutes: 5,
    published_at: '۲۸ مهر ۱۴۰۳',
    featured_image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    meta_robots: 'index, follow',
    content: `
      یک فرد معمولی روزانه صدها بار دندان‌های خود را روی هم فشار می‌دهد. استاندارد بین‌المللی ISO 14801 ایمپلنت را در بدترین زاویه اکلوزال (۳۰ درجه انحراف) با بدترین شرایط تحلیل استخوان قرار داده و ۵ میلیون چرخه نوسانی با فرکانس بالا (معادل ۲۰ سال جویدن مداوم) به آن وارد می‌کند.
      تنها برندهایی که دارای آلیاژهای پیشرفته تیتانیوم گرید ۴ سردکاری‌شده یا راکسولید هستند از این تست شبیه‌ساز زلزله جویدن سربلند بیرون می‌آیند.
    `
  }
];

// ==============================================================================
// 12. WORDPRESS PAGES (برگه‌ها / صفحات ایستا)
// ==============================================================================
export const initialPages: WordPressPage[] = [
  {
    id: 1,
    title: 'درباره ما | پلتفرم مرجع شفافیت و اصالت ایمپلنتولوژی دنتال‌مپ',
    slug: 'about-us',
    excerpt: 'دنتال‌مپ اولین سامانه مستقل استعلام قطعات، ردیابی لات نامبر و تطبیق استانداردهای بین‌المللی ایمپلنت در ایران است.',
    content: `
      <h2>رسالت و هدف پلتفرم دنتال‌مپ</h2>
      <p>دنتال‌مپ با هدف ارتقای آگاهی بیماران، دندانپزشکان و کلینیک‌های تخصصی تأسیس گردیده است. در بازار کنونی، تنوع برندها، آلیاژها و قطعات یدکی به قدری گسترده است که تشخیص قطعات اصل از فیک و انتخاب ترکیب بالینی بهینه نیازمند مرجعی مستقل و داده‌محور است.</p>
      
      <h3>ارکان چهارگانه سامانه دنتال‌مپ:</h3>
      <ul>
        <li><b>استعلام اصالت قطعات (REF Code):</b> بررسی ابعاد دقیق، زاویه کونیکال و گشتاور بستن پیچ اباتمنت.</li>
        <li><b>پاسپورت سلامت ۳۲ دندان (FDI):</b> ثبت شماره لات (LOT) و کد رفرنس جهت ردیابی قطعات در هر کجای دنیا.</li>
        <li><b>دایرکتوری جامع پزشکان و کلینیک‌ها:</b> دسترسی به سوابق تحصیلی، برندهای مورد استفاده و تجهیزات مدرن.</li>
        <li><b>آزمون هوشمند بیمار:</b> ارزیابی شرایط استخوان و بودجه جهت تصمیم‌گیری آگاهانه پیش از جلسه مشاوره.</li>
      </ul>
    `,
    author: 'تیم تحریریه دنتال‌مپ',
    status: 'publish',
    template: 'default',
    published_at: '۰۱ آبان ۱۴۰۳',
    featured_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    meta_robots: 'index, follow'
  },
  {
    id: 2,
    title: 'قوانین و تعهدات پاسپورت ایمپلنت دنتال‌مپ',
    slug: 'terms',
    excerpt: 'شرایط بهره‌مندی از خدمات اصالت‌سنجی قطعات، تضمین گارانتی برندها و ضوابط صدور پاسپورت ۳۲ دندان.',
    content: `
      <h2>شرایط و ضوابط رسمی</h2>
      <p>استفاده از خدمات دنتال‌مپ مشروط به رعایت ضوابط شفافیت پزشکی است. اطلاعات درج‌شده در پاسپورت سلامت پس از تایید پوکه استریل و لیبل رسمی برند قطعه دارای اعتبار است.</p>
      <p>کلینیک‌ها و دندانپزشکان موظفند شماره بهر ساخت (LOT Number) را به‌صورت مکتوب و خوانا در پرونده بالینی و سامانه ثبت نمایند.</p>
    `,
    author: 'واحد حقوقی و تنظیم‌گری دنتال‌مپ',
    status: 'publish',
    template: 'default',
    published_at: '۱۵ مهر ۱۴۰۳',
    featured_image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    meta_robots: 'index, follow'
  },
  {
    id: 3,
    title: 'تماس با ما | دفتر مرکزی و پشتیبانی امور پزشکی',
    slug: 'contact',
    excerpt: 'راه‌های ارتباط با کارشناسان فنی، واحد پذیرش کلینیک‌ها و پشتیبانی پاسپورت ایمپلنتولوژی دنتال‌مپ.',
    content: `
      <h2>راه‌های ارتباطی دنتال‌مپ</h2>
      <p>تیم پشتیبانی دنتال‌مپ آماده پاسخگویی به سوالات شما در خصوص استعلام قطعات، رزرو نوبت و ثبت کلینیک‌ها است.</p>
      <ul>
        <li><b>تلفن تماس مستقیم:</b> 021-88001144</li>
        <li><b>پشتیبانی پیامکی:</b> ارسال پیام به خط اختصاصی سامانه</li>
        <li><b>نشانی دفتر مرکزی:</b> تهران، خیابان ملاصدرا، برج ونک، طبقه ششم، واحد ۶۰۲</li>
        <li><b>ساعات پاسخگویی:</b> شنبه تا چهارشنبه از ساعت ۹ الی ۱۸ | پنجشنبه‌ها از ۹ الی ۱۴</li>
      </ul>
    `,
    author: 'پشتیبانی مراجعین',
    status: 'publish',
    template: 'default',
    published_at: '۰۵ آبان ۱۴۰۳',
    featured_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    meta_robots: 'index, follow'
  },
  {
    id: 4,
    title: 'کلینیک تخصصی کاشت ایمپلنت و بازسازی فک | دنتال‌مپ',
    slug: 'treatment',
    excerpt: 'لندینگ پیج جامع خدمات کاشت ایمپلنت، ارزیابی هوشمند آنلاین درمان، گارانتی قطعات رسمی و رزرو ویزیت با جراحان فک و صورت شبکه دنتال‌مپ.',
    content: `
      <h2>مرکز جامع خدمات تخصصی ایمپلنتولوژی دنتال‌مپ</h2>
      <p>ارائه دهنده خدمات کاشت ایمپلنت‌های دارای شناسنامه دیجیتال ۳۲ دندان (FDI)، با بهره‌گیری از جراحان فک و صورت مورد تایید نظام پزشکی، قطعات اصیل سوئیسی و کره‌ای و نظارت مستقیم بر کد رهگیری LOT.</p>
    `,
    author: 'شورای بالینی دنتال‌مپ',
    status: 'publish',
    template: 'landing',
    published_at: '۱۹ آبان ۱۴۰۳',
    featured_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    meta_robots: 'index, follow'
  }
];

// Initial Doctor & Clinic Registration Applications
export const initialDoctorApplications: DoctorApplication[] = [
  {
    id: 101,
    center_type: 'private_office',
    full_name: 'دکتر احسان یزدانی',
    medical_council_code: '142890',
    specialty_id: 2, // جراحی دهان و فک و صورت
    city_id: 1, // تهران
    district_id: 1, // سعادت‌آباد
    address: 'تهران، سعادت‌آباد، میدان کاج، مجتمع سروستان، طبقه ۳',
    mobile: '09121112233',
    phone: '021-22003344',
    brands: ['اشترومن (Straumann)', 'ناکسیس (Naxis)'],
    insurances: ['بیمه دانا', 'بیمه ایران'],
    is_24_7: false,
    bio: 'جراح فک و صورت، فلوشیپ جراحی پیشرفته ایمپلنتولوژی و پیوند استخوان با بیش از ۱۲ سال سابقه بالینی.',
    status: 'pending',
    created_at: '2026-11-09T08:30:00Z'
  },
  {
    id: 102,
    center_type: 'clinic',
    full_name: 'کلینیک دندانپزشکی دیجیتال رازی (دکتر بهاره صادقی)',
    medical_council_code: '098712',
    specialty_id: 4, // متخصص پروتزهای دندانی
    city_id: 1,
    district_id: 3, // شهرک غرب
    address: 'تهران، شهرک غرب، بلوار فرحزادی، تقاطع دریا، ساختمان پزشکان رازی',
    mobile: '09354445566',
    phone: '021-88665544',
    brands: ['اوستم (Osstem)', 'مگاژن (MegaGen)'],
    insurances: ['تأمین اجتماعی', 'بیمه البرز'],
    is_24_7: true,
    bio: 'کلینیک مجهز به اسکنر داخل دهانی تری‌شیپ، کدکم و اتاق جراحی اختصاصی استریل با نوبت‌دهی شبانه‌روزی.',
    status: 'pending',
    created_at: '2026-11-09T10:15:00Z'
  }
];
