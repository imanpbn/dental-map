import * as fs from 'fs';
import * as path from 'path';

// Pools of realistic Iranian names and data
const FIRST_NAMES_MALE = [
  'علیرضا', 'محمد', 'علی', 'امیرحسین', 'حسین', 'رضا', 'مهدی', 'حمید', 'فرزاد', 'آرش',
  'کاوه', 'بهرام', 'سهراب', 'پیمان', 'شایان', 'نیما', 'سامان', 'بابک', 'کامران', 'پوریا',
  'احسان', 'میلاد', 'سینا', 'پویان', 'فرهاد', 'سعید', 'امید', 'مجید', 'داریوش', 'امیررضا'
];

const FIRST_NAMES_FEMALE = [
  'مریم', 'سارا', 'شیرین', 'نیلوفر', 'زهرا', 'نگار', 'فرناز', 'پریسا', 'رکسانا', 'الهام',
  'مینا', 'بهاره', 'آناهیتا', 'لیلا', 'سمیرا', 'سحر', 'یاسمن', 'غزاله', 'مهسا', 'نسترن',
  'مهشید', 'سودابه', 'شیدا', 'پریناز', 'ترانه', 'مونا', 'افسانه', 'هدیه', 'سیمین', 'عاطفه'
];

const LAST_NAMES = [
  'صالحی‌راد', 'کریمی‌تبار', 'افشار', 'نیک‌پور', 'امیری', 'یزدانی', 'موسوی', 'نجفی', 'کاظمی', 'حسینی',
  'محمدی', 'رضایی', 'ابراهیمی', 'طاهری', 'جعفری', 'صادقی', 'قاسمی', 'سلیمانی', 'اکبری', 'باقری',
  'فرهادی', 'جمشیدی', 'شریفی', 'امانی', 'محمودی', 'انصاری', 'دهقان', 'نوروزی', 'صالحی', 'حیدری',
  'خسروی', 'سهرابی', 'افتخاری', 'دانشور', 'معتمدی', 'پارسا', 'شاملو', 'سروری', 'بهمنی', 'مرادی'
];

const SPECIALTIES = [
  { id: 1, title: 'دندانپزشک عمومی' },
  { id: 2, title: 'متخصص جراحی دهان، فک و صورت' },
  { id: 3, title: 'متخصص درمان ریشه (اندو)' },
  { id: 4, title: 'متخصص پروتزهای دندانی و ایمپلنت' },
  { id: 5, title: 'متخصص جراحی لثه (پریو)' },
  { id: 6, title: 'دندانپزشک کودکان' }
];

const AGE_GROUPS = ['adults', 'both', 'adults', 'adults', 'children'];

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

function generate1500Doctors() {
  const doctors: any[] = [];
  const csvRows: string[] = [];

  const csvHeader = [
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
    'بیوگرافی'
  ].join(',');

  csvRows.push(csvHeader);

  // Generate 1500 unique medical council codes starting from 110000
  let baseCode = 110000;

  for (let i = 0; i < 1500; i++) {
    const isFemale = i % 3 === 0;
    const gender = isFemale ? 'female' : 'male';
    const firstPool = isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE;
    const firstName = 'دکتر ' + firstPool[i % firstPool.length];
    const lastName = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const code = String(baseCode + i);

    const specialty = SPECIALTIES[i % SPECIALTIES.length];
    const experience = 5 + (i % 25);
    const rating = (4.7 + (i % 30) * 0.01).toFixed(2);
    const reviews = 12 + (i % 80);
    const ageGroup = specialty.id === 6 ? 'children' : AGE_GROUPS[i % AGE_GROUPS.length];
    const passportCommitted = i % 15 !== 0; // 93% committed
    const verified = i % 20 !== 0; // 95% verified
    const avatarList = isFemale ? FEMALE_AVATARS : MALE_AVATARS;
    const avatar = avatarList[i % avatarList.length];

    const bio = `${specialty.title} با بیش از ${experience} سال تجربه در حوزه جراحی و ایمپلنتولوژی دندان. متعهد به ارائه شناسنامه اصالت قطعات و استعلام رفرنس کد فیکسچر.`;

    const docObj = {
      id: i + 1,
      first_name: firstName,
      last_name: lastName,
      slug: `dr-${encodeURIComponent(firstName.replace('دکتر ', '') + '-' + lastName).replace(/%/g, '')}-${code}`,
      medical_council_code: code,
      gender,
      specialty_id: specialty.id,
      patient_age_group: ageGroup,
      passport_committed: passportCommitted,
      bio,
      rating: parseFloat(rating),
      reviews_count: reviews,
      experience_years: experience,
      avatar,
      verified,
      created_at: new Date().toISOString()
    };

    doctors.push(docObj);

    // CSV format escaping
    const escape = (str: any) => `"${String(str).replace(/"/g, '""')}"`;
    const csvLine = [
      escape(firstName),
      escape(lastName),
      escape(code),
      escape(gender === 'male' ? 'آقا' : 'خانم'),
      escape(specialty.title),
      experience,
      rating,
      reviews,
      escape(passportCommitted ? 'بله' : 'خیر'),
      escape(verified ? 'بله' : 'خیر'),
      escape(ageGroup),
      escape(bio)
    ].join(',');

    csvRows.push(csvLine);
  }

  // Ensure public directory exists
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write CSV with UTF-8 BOM
  const csvFileContent = '\uFEFF' + csvRows.join('\r\n');
  fs.writeFileSync(path.join(publicDir, 'sample-1500-doctors.csv'), csvFileContent, 'utf-8');

  // Write JSON
  fs.writeFileSync(path.join(publicDir, 'sample-1500-doctors.json'), JSON.stringify(doctors, null, 2), 'utf-8');

  console.log(`Successfully generated 1500 doctors!`);
  console.log(`Saved to: public/sample-1500-doctors.csv (${(csvFileContent.length / 1024).toFixed(1)} KB)`);
  console.log(`Saved to: public/sample-1500-doctors.json`);
}

generate1500Doctors();
