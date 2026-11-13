import { Doctor, Specialty, Gender, PatientAgeGroup } from '../types';
import { initialSpecialties } from '../initialData';
import { CmsStorageService } from './cmsStorage';
import { SupabaseSyncService, isSupabaseConfigured, supabase } from './supabaseClient';

export interface DoctorImportRow {
  first_name: string;
  last_name: string;
  medical_council_code: string;
  gender?: Gender;
  specialty_id?: number;
  specialty_name?: string;
  patient_age_group?: PatientAgeGroup;
  passport_committed?: boolean;
  bio?: string;
  rating?: number;
  reviews_count?: number;
  experience_years?: number;
  avatar?: string;
  verified?: boolean;
}

export interface ValidationIssue {
  row: number;
  data: Record<string, string>;
  errors: string[];
}

export interface ParseResult {
  validDoctors: Doctor[];
  invalidRows: ValidationIssue[];
  duplicateCodesInFile: string[];
  duplicateCodesWithExisting: string[];
  totalRows: number;
  validCount: number;
  invalidCount: number;
}

// Medical avatar fallback pools
const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=256'
];

const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1594824813589-9133ca0f074d?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1594824813686-2144d4715570?auto=format&fit=crop&q=80&w=256',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=256'
];

/**
 * Convert Persian and Arabic digits to standard ASCII English digits
 */
export const normalizeDigits = (str: string | number): string => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .trim();
};

/**
 * Generate a clean SEO slug from doctor name and medical council code
 */
export const generateDoctorSlug = (firstName: string, lastName: string, code: string): string => {
  const cleanFirst = firstName.trim().replace(/^دکتر\s*/i, '').replace(/\s+/g, '-');
  const cleanLast = lastName.trim().replace(/\s+/g, '-');
  const base = `${cleanFirst}-${cleanLast}`.toLowerCase();
  const safeBase = encodeURIComponent(base).replace(/%/g, '');
  return `dr-${safeBase || 'specialist'}-${code}`;
};

/**
 * Match specialty title or keyword to specialty ID
 */
export const resolveSpecialtyId = (
  raw: string | number | undefined,
  specialties: Specialty[] = initialSpecialties
): number => {
  if (!raw) return 1; // default: دندانپزشک عمومی

  const num = Number(raw);
  if (!isNaN(num) && specialties.some((s) => s.id === num)) {
    return num;
  }

  const str = String(raw).trim().toLowerCase();

  // Common Persian matching keywords
  if (str.includes('فک') || str.includes('صورت') || str.includes('جراح دهان') || str.includes('maxillo')) {
    return 2; // متخصص جراحی دهان، فک و صورت
  }
  if (str.includes('ریشه') || str.includes('اندو') || str.includes('عصب') || str.includes('endo')) {
    return 3; // متخصص درمان ریشه
  }
  if (str.includes('پروتز') || str.includes('ایمپلنت') || str.includes('prostho')) {
    return 4; // متخصص پروتزهای دندانی
  }
  if (str.includes('لثه') || str.includes('پریو') || str.includes('perio')) {
    return 5; // متخصص جراحی لثه
  }
  if (str.includes('کودک') || str.includes('اطفال') || str.includes('pediatric')) {
    return 6; // دندانپزشک کودکان
  }

  // Exact title match
  const matched = specialties.find((s) => s.title.toLowerCase().includes(str) || str.includes(s.title.toLowerCase()));
  if (matched) return matched.id;

  return 1;
};

/**
 * Parse CSV line handling quoted fields with commas and escaped quotes
 */
const parseCsvLine = (line: string, delimiter: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

/**
 * Detect delimiter: comma, semicolon, or tab
 */
const detectDelimiter = (headerLine: string): string => {
  const tabs = (headerLine.match(/\t/g) || []).length;
  const semicolons = (headerLine.match(/;/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;

  if (tabs > semicolons && tabs > commas) return '\t';
  if (semicolons > commas) return ';';
  return ',';
};

/**
 * Standardize header keys across Persian and English variants
 */
const normalizeHeaderKey = (rawHeader: string): string => {
  const clean = rawHeader.trim().replace(/^["']|["']$/g, '').toLowerCase();

  // First name
  if (['نام', 'نام کوچک', 'نام پزشک', 'first_name', 'firstname', 'fname'].includes(clean)) {
    return 'first_name';
  }
  // Last name
  if (['نام خانوادگی', 'فامیلی', 'شهرت', 'last_name', 'lastname', 'lname'].includes(clean)) {
    return 'last_name';
  }
  // Medical council code
  if (
    [
      'کد نظام پزشکی',
      'شماره نظام پزشکی',
      'نظام پزشکی',
      'کد نظام',
      'شماره نظام',
      'medical_council_code',
      'council_code',
      'code',
      'nezam_code'
    ].includes(clean)
  ) {
    return 'medical_council_code';
  }
  // Gender
  if (['جنسیت', 'gender', 'sex'].includes(clean)) {
    return 'gender';
  }
  // Specialty
  if (['تخصص', 'رشته تخصصی', 'عنوان تخصص', 'specialty', 'specialty_id', 'specialty_name'].includes(clean)) {
    return 'specialty';
  }
  // Experience
  if (['سابقه', 'سال سابقه', 'سابقه کار', 'تجربه', 'experience_years', 'experience', 'years'].includes(clean)) {
    return 'experience_years';
  }
  // Rating
  if (['امتیاز', 'رتبه', 'ستاره', 'rating', 'score'].includes(clean)) {
    return 'rating';
  }
  // Reviews count
  if (['نظرات', 'تعداد نظرات', 'reviews_count', 'reviews'].includes(clean)) {
    return 'reviews_count';
  }
  // Age group
  if (['رده سنی', 'گروه سنی', 'پذیرش', 'patient_age_group', 'age_group'].includes(clean)) {
    return 'patient_age_group';
  }
  // Passport commitment
  if (
    [
      'تعهد پاسپورت',
      'پاسپورت اصالت',
      'تعهد شناسنامه',
      'شناسنامه اصالت',
      'passport_committed',
      'passport'
    ].includes(clean)
  ) {
    return 'passport_committed';
  }
  // Verified
  if (['تایید شده', 'وضعیت تایید', 'احراز هویت', 'verified', 'is_verified'].includes(clean)) {
    return 'verified';
  }
  // Bio
  if (['بیوگرافی', 'درباره پزشک', 'توضیحات', 'معرفی', 'bio', 'description', 'about'].includes(clean)) {
    return 'bio';
  }
  // Avatar
  if (['عکس', 'تصویر', 'آواتار', 'avatar', 'image', 'photo'].includes(clean)) {
    return 'avatar';
  }

  return clean;
};

/**
 * Main parser for Doctors Bulk Import (CSV, TSV, or JSON)
 */
export const DoctorImportService = {
  /**
   * Parse raw text (CSV, TSV, JSON) into validated Doctor entities
   */
  parseDoctors(
    rawText: string,
    existingDoctors: Doctor[] = [],
    specialties: Specialty[] = initialSpecialties
  ): ParseResult {
    const trimmed = rawText.trim();
    if (!trimmed) {
      return {
        validDoctors: [],
        invalidRows: [],
        duplicateCodesInFile: [],
        duplicateCodesWithExisting: [],
        totalRows: 0,
        validCount: 0,
        invalidCount: 0
      };
    }

    const existingCodeSet = new Set(existingDoctors.map((d) => normalizeDigits(d.medical_council_code)));
    let nextId = Math.max(...existingDoctors.map((d) => d.id || 0), 0) + 1;

    // Check if format is JSON
    if (trimmed.startsWith('[') || (trimmed.startsWith('{') && trimmed.includes('"doctors"'))) {
      try {
        const parsed = JSON.parse(trimmed);
        const list: any[] = Array.isArray(parsed) ? parsed : parsed.doctors || [];
        return this.processParsedRows(list, existingCodeSet, nextId, specialties);
      } catch (err: any) {
        return {
          validDoctors: [],
          invalidRows: [
            {
              row: 1,
              data: { raw: trimmed.slice(0, 100) },
              errors: [`خطا در پارس فرمت JSON: ${err?.message || 'فرمت نامعتبر است'}`]
            }
          ],
          duplicateCodesInFile: [],
          duplicateCodesWithExisting: [],
          totalRows: 1,
          validCount: 0,
          invalidCount: 1
        };
      }
    }

    // CSV / TSV Parsing
    // Remove UTF-8 BOM if present
    const cleanText = trimmed.replace(/^\uFEFF/, '');
    const lines = cleanText.split(/\r?\n/).filter((l) => l.trim().length > 0);

    if (lines.length < 2) {
      return {
        validDoctors: [],
        invalidRows: [
          {
            row: 1,
            data: { line: lines[0] || '' },
            errors: ['فایل فاقد ردیف‌های داده است. حداقل یک سطر سرستون و یک سطر داده الزامی است.']
          }
        ],
        duplicateCodesInFile: [],
        duplicateCodesWithExisting: [],
        totalRows: lines.length,
        validCount: 0,
        invalidCount: 1
      };
    }

    const delimiter = detectDelimiter(lines[0]);
    const rawHeaders = parseCsvLine(lines[0], delimiter);
    const headers = rawHeaders.map(normalizeHeaderKey);

    const rawRows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i], delimiter);
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] !== undefined ? values[idx].trim() : '';
      });
      rawRows.push(rowObj);
    }

    return this.processParsedRows(rawRows, existingCodeSet, nextId, specialties);
  },

  /**
   * Internal processor for row objects
   */
  processParsedRows(
    rows: any[],
    existingCodeSet: Set<string>,
    startId: number,
    specialties: Specialty[]
  ): ParseResult {
    const validDoctors: Doctor[] = [];
    const invalidRows: ValidationIssue[] = [];
    const seenCodesInFile = new Set<string>();
    const duplicateCodesInFile: string[] = [];
    const duplicateCodesWithExisting: string[] = [];

    let currentId = startId;

    rows.forEach((row, idx) => {
      const rowNum = idx + 2; // +1 for 1-based, +1 for header
      const errors: string[] = [];

      // Extract and clean values
      let firstName = (row.first_name || row['نام'] || '').trim();
      let lastName = (row.last_name || row['نام خانوادگی'] || '').trim();

      // If full_name provided in single field
      if (!firstName && !lastName && (row.name || row['نام و نام خانوادگی'] || row.full_name)) {
        const full = (row.name || row['نام و نام خانوادگی'] || row.full_name).trim().replace(/^دکتر\s*/i, '');
        const parts = full.split(/\s+/);
        firstName = 'دکتر ' + (parts[0] || '');
        lastName = parts.slice(1).join(' ') || 'پزشک';
      }

      if (!firstName) {
        errors.push('نام پزشک الزامی است.');
      }
      if (!lastName) {
        errors.push('نام خانوادگی الزامی است.');
      }

      // Add "دکتر" prefix if not already present
      if (firstName && !firstName.startsWith('دکتر')) {
        firstName = `دکتر ${firstName}`;
      }

      // Medical council code
      const rawCode =
        row.medical_council_code ||
        row['کد نظام پزشکی'] ||
        row['شماره نظام پزشکی'] ||
        row.code ||
        '';
      const cleanCode = normalizeDigits(rawCode).replace(/\D/g, '');

      if (!cleanCode) {
        errors.push('کد نظام پزشکی الزامی است و باید شامل عدد باشد.');
      } else {
        if (seenCodesInFile.has(cleanCode)) {
          duplicateCodesInFile.push(cleanCode);
          errors.push(`کد نظام پزشکی ${cleanCode} در سطرهای قبلی همین فایل تکرار شده است.`);
        } else {
          seenCodesInFile.add(cleanCode);
        }

        if (existingCodeSet.has(cleanCode)) {
          duplicateCodesWithExisting.push(cleanCode);
        }
      }

      // Gender
      const rawGender = String(row.gender || row['جنسیت'] || '').toLowerCase();
      let gender: Gender = 'male';
      if (rawGender.includes('خانم') || rawGender.includes('زن') || rawGender === 'female' || rawGender === 'f') {
        gender = 'female';
      }

      // Specialty
      const rawSpecialty = row.specialty || row.specialty_id || row['تخصص'] || row.specialty_name;
      const specialtyId = resolveSpecialtyId(rawSpecialty, specialties);

      // Experience
      const rawExp = normalizeDigits(row.experience_years || row.experience || row['سابقه'] || 10);
      const expYears = Math.max(1, Math.min(50, parseInt(rawExp, 10) || 10));

      // Rating (1.0 to 5.0)
      const rawRating = normalizeDigits(row.rating || row['امتیاز'] || 4.9);
      const rating = Math.max(3.0, Math.min(5.0, parseFloat(rawRating) || 4.9));

      // Reviews
      const rawReviews = normalizeDigits(row.reviews_count || row['نظرات'] || 18);
      const reviewsCount = Math.max(0, parseInt(rawReviews, 10) || 18);

      // Patient age group
      const rawAge = String(row.patient_age_group || row['رده سنی'] || '').toLowerCase();
      let patientAgeGroup: PatientAgeGroup = 'adults';
      if (rawAge.includes('کودک') || rawAge.includes('اطفال') || rawAge === 'children') {
        patientAgeGroup = 'children';
      } else if (rawAge.includes('همه') || rawAge.includes('هر دو') || rawAge === 'both' || rawAge === 'all') {
        patientAgeGroup = 'both';
      }

      // Passport committed
      const rawPassport = String(row.passport_committed ?? row['تعهد پاسپورت'] ?? 'true').toLowerCase();
      const passportCommitted =
        rawPassport === 'true' ||
        rawPassport === '1' ||
        rawPassport === 'بله' ||
        rawPassport === 'دارد' ||
        rawPassport === 'yes';

      // Verified
      const rawVerified = String(row.verified ?? row['وضعیت تایید'] ?? 'true').toLowerCase();
      const verified =
        rawVerified === 'true' ||
        rawVerified === '1' ||
        rawVerified === 'بله' ||
        rawVerified === 'تایید' ||
        rawVerified === 'yes';

      // Bio
      const specTitle = specialties.find((s) => s.id === specialtyId)?.title || 'دندانپزشک متخصص';
      const defaultBio = `${specTitle} دارای تعهد ارائه پاسپورت اصالت قطعات و استعلام کد نظام پزشکی معتبر. بیش از ${expYears} سال تجربه در حوزه درمانی و ایمپلنتولوژی.`;
      const bio = (row.bio || row['بیوگرافی'] || defaultBio).trim();

      // Avatar
      const avatarList = gender === 'female' ? FEMALE_AVATARS : MALE_AVATARS;
      const defaultAvatar = avatarList[(currentId + idx) % avatarList.length];
      const avatar = (row.avatar || row['عکس'] || defaultAvatar).trim();

      // If invalid
      if (errors.length > 0) {
        invalidRows.push({
          row: rowNum,
          data: row,
          errors
        });
        return;
      }

      // Valid Doctor entity
      const doctor: Doctor = {
        id: currentId++,
        first_name: firstName,
        last_name: lastName,
        slug: generateDoctorSlug(firstName, lastName, cleanCode),
        medical_council_code: cleanCode,
        gender,
        specialty_id: specialtyId,
        patient_age_group: patientAgeGroup,
        passport_committed: passportCommitted,
        bio,
        rating,
        reviews_count: reviewsCount,
        experience_years: expYears,
        avatar,
        verified,
        created_at: new Date().toISOString()
      };

      validDoctors.push(doctor);
    });

    return {
      validDoctors,
      invalidRows,
      duplicateCodesInFile,
      duplicateCodesWithExisting,
      totalRows: rows.length,
      validCount: validDoctors.length,
      invalidCount: invalidRows.length
    };
  },

  /**
   * Save imported doctors with chosen conflict resolution mode
   */
  async executeImport(
    importedDoctors: Doctor[],
    mode: 'upsert' | 'skip' | 'replace',
    existingDoctors: Doctor[],
    syncToSupabase: boolean = false,
    onProgress?: (progressPercent: number, statusText: string) => void
  ): Promise<{ finalDoctors: Doctor[]; addedCount: number; updatedCount: number }> {
    onProgress?.(10, 'آماده‌سازی پایگاه داده...');

    let finalDoctors: Doctor[] = [];
    let addedCount = 0;
    let updatedCount = 0;

    if (mode === 'replace') {
      finalDoctors = importedDoctors.map((doc, idx) => ({ ...doc, id: idx + 1 }));
      addedCount = finalDoctors.length;
    } else {
      const doctorMap = new Map<string, Doctor>();
      existingDoctors.forEach((doc) => {
        doctorMap.set(normalizeDigits(doc.medical_council_code), doc);
      });

      let maxId = Math.max(...existingDoctors.map((d) => d.id || 0), 0);

      importedDoctors.forEach((imp) => {
        const code = normalizeDigits(imp.medical_council_code);
        if (doctorMap.has(code)) {
          if (mode === 'upsert') {
            const existing = doctorMap.get(code)!;
            doctorMap.set(code, {
              ...imp,
              id: existing.id // preserve existing internal ID
            });
            updatedCount++;
          }
          // if skip, do nothing
        } else {
          maxId++;
          doctorMap.set(code, {
            ...imp,
            id: maxId
          });
          addedCount++;
        }
      });

      finalDoctors = Array.from(doctorMap.values());
    }

    onProgress?.(50, 'ذخیره‌سازی در حافظه محلی دنتال مپ...');
    CmsStorageService.saveDoctors(finalDoctors);

    // Sync to Supabase if requested and configured
    if (syncToSupabase && isSupabaseConfigured() && supabase) {
      onProgress?.(60, 'همگام‌سازی با پایگاه داده ابری Supabase...');
      try {
        // Upsert in batches of 100 to avoid payload size limit
        const batchSize = 100;
        const totalBatches = Math.ceil(finalDoctors.length / batchSize);

        for (let b = 0; b < totalBatches; b++) {
          const start = b * batchSize;
          const batch = finalDoctors.slice(start, start + batchSize);
          await supabase.from('doctors').upsert(batch, { onConflict: 'medical_council_code' });

          const percent = 60 + Math.round(((b + 1) / totalBatches) * 35);
          onProgress?.(percent, `ارسال به سرور (${Math.min(start + batchSize, finalDoctors.length)} از ${finalDoctors.length})...`);
        }
      } catch (err) {
        console.error('Supabase bulk sync failed:', err);
      }
    }

    onProgress?.(100, 'عملیات با موفقیت پایان یافت.');
    return { finalDoctors, addedCount, updatedCount };
  },

  /**
   * Generate downloadable standard sample CSV template with UTF-8 BOM
   */
  generateSampleCsvTemplate(): string {
    const header = [
      'نام',
      'نام خانوادگی',
      'کد نظام پزشکی',
      'جنسیت',
      'تخصص',
      'سابقه',
      'امتیاز',
      'تعهد پاسپورت',
      'وضعیت تایید',
      'رده سنی',
      'بیوگرافی'
    ].join(',');

    const samples = [
      'دکتر رضا,محمدی,125430,آقا,متخصص جراحی دهان، فک و صورت,14,4.95,بله,بله,بزرگسالان,"فلوشیپ ایمپلنت پیشرفته از سوئیس و عضو هیئت علمی دانشگاه"',
      'دکتر سارا,امینی,138904,خانم,متخصص پروتزهای دندانی و ایمپلنت,11,4.90,بله,بله,بزرگسالان,"متخصص پروتزهای دندانی ثابت و متحرک، جراحی کاشت ایمپلنت و روکش‌های زیرکونیا"',
      'دکتر کامران,نجفی,112450,آقا,متخصص جراحی لثه (پریو),16,4.88,بله,بله,بزرگسالان,"جراحی بافت نرم و پیوند استخوان، ایمپلنت‌های مورس تیپر و درمان پریودنتیت"',
      'دکتر نیلوفر,کاظمی,145890,خانم,دندانپزشک کودکان,8,4.92,بله,بله,کودکان,"دندانپزشکی تخصصی اطفال و نوجوانان با روش‌های آرام‌بخشی و بدون درد"',
      'دکتر آرش,صادقی,109320,آقا,دندانپزشک عمومی,12,4.85,بله,بله,همه,"ارائه کلیه خدمات ترمیمی، عصب‌کشی، پروتز و استعلام کد رفرنس قطعات"'
    ];

    // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel opens Persian fonts correctly
    return '\uFEFF' + [header, ...samples].join('\r\n');
  },

  /**
   * Generate downloadable sample JSON template
   */
  generateSampleJsonTemplate(): string {
    const sampleDoctors: Partial<Doctor>[] = [
      {
        first_name: 'دکتر رضا',
        last_name: 'محمدی',
        medical_council_code: '125430',
        gender: 'male',
        specialty_id: 2,
        experience_years: 14,
        rating: 4.95,
        passport_committed: true,
        verified: true,
        patient_age_group: 'adults',
        bio: 'فلوشیپ ایمپلنت پیشرفته از سوئیس و عضو هیئت علمی دانشگاه.'
      },
      {
        first_name: 'دکتر سارا',
        last_name: 'امینی',
        medical_council_code: '138904',
        gender: 'female',
        specialty_id: 4,
        experience_years: 11,
        rating: 4.9,
        passport_committed: true,
        verified: true,
        patient_age_group: 'adults',
        bio: 'متخصص پروتزهای دندانی ثابت و متحرک، جراحی کاشت ایمپلنت و روکش‌های زیرکونیا.'
      }
    ];

    return JSON.stringify(sampleDoctors, null, 2);
  },

  /**
   * Export all existing doctors to CSV format with UTF-8 BOM
   */
  exportDoctorsToCsv(doctors: Doctor[], specialties: Specialty[] = initialSpecialties): string {
    const specMap = new Map(specialties.map((s) => [s.id, s.title]));

    const header = [
      'نام',
      'نام خانوادگی',
      'کد نظام پزشکی',
      'جنسیت',
      'تخصص',
      'سابقه',
      'امتیاز',
      'تعداد نظرات',
      'تعهد پاسپورت',
      'وضعیت تایید',
      'رده سنی',
      'بیوگرافی',
      'لینک آواتار'
    ].join(',');

    const rows = doctors.map((doc) => {
      const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      return [
        escape(doc.first_name),
        escape(doc.last_name),
        escape(doc.medical_council_code),
        escape(doc.gender === 'male' ? 'آقا' : 'خانم'),
        escape(specMap.get(doc.specialty_id) || 'عمومی'),
        doc.experience_years,
        doc.rating,
        doc.reviews_count,
        escape(doc.passport_committed ? 'بله' : 'خیر'),
        escape(doc.verified ? 'بله' : 'خیر'),
        escape(doc.patient_age_group),
        escape(doc.bio),
        escape(doc.avatar)
      ].join(',');
    });

    return '\uFEFF' + [header, ...rows].join('\r\n');
  }
};
