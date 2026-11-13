/**
 * CLI Tool for Bulk Importing Doctors into DentalMap
 * Usage:
 *   npx tsx scripts/import-doctors.ts <path-to-csv-or-json> [--mode=upsert|skip|replace] [--sync-supabase]
 */

import * as fs from 'fs';
import * as path from 'path';
import { DoctorImportService } from '../src/utils/doctorImportService';
import { initialSpecialties, initialDoctors } from '../src/initialData';
import { Doctor } from '../src/types';

async function main() {
  const args = process.argv.slice(2);
  const filePath = args.find((a) => !a.startsWith('--'));
  const modeArg = args.find((a) => a.startsWith('--mode='))?.split('=')[1] as 'upsert' | 'skip' | 'replace' || 'upsert';
  const syncSupabase = args.includes('--sync-supabase');

  if (!filePath) {
    console.log(`
======================================================
  دنتال مپ (DentalMap) - ابزار ایمپورت گروهی دندانپزشکان
======================================================
راهنمای استفاده:
  npx tsx scripts/import-doctors.ts <مسیر فایل CSV یا JSON> [گزینه‌ها]

گزینه‌ها:
  --mode=upsert    (پیش‌فرض) به‌روزرسانی موارد تکراری و افزودن موارد جدید
  --mode=skip      فقط افزودن موارد جدید و رد کردن کدهای تکراری
  --mode=replace   جایگزینی کامل پایگاه‌داده با فایل ورودی
  --sync-supabase  ارسال و همگام‌سازی مستقیم با سرور Supabase PostgreSQL

مثال:
  npx tsx scripts/import-doctors.ts public/sample-1500-doctors.csv --mode=upsert
======================================================
    `);
    process.exit(1);
  }

  const resolvedPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`خطا: فایل در مسیر مشخص شده یافت نشد: ${resolvedPath}`);
    process.exit(1);
  }

  console.log(`در حال خواندن فایل: ${resolvedPath}...`);
  const rawContent = fs.readFileSync(resolvedPath, 'utf-8');

  console.log('در حال اعتبارسنجی و آنالیز ساختار داده‌ها...');
  const result = DoctorImportService.parseDoctors(rawContent, initialDoctors, initialSpecialties);

  console.log('------------------------------------------------------');
  console.log(`تعداد کل سطرهای شناسایی‌شده: ${result.totalRows}`);
  console.log(`تعداد رکوردهای معتبر: ${result.validCount}`);
  console.log(`تعداد سطرهای دارای خطا: ${result.invalidCount}`);
  console.log(`تکراری در فایل: ${result.duplicateCodesInFile.length}`);
  console.log(`تکراری با دیتابیس فعلی: ${result.duplicateCodesWithExisting.length}`);
  console.log('------------------------------------------------------');

  if (result.invalidRows.length > 0) {
    console.warn(`نمونه خطاهای یافت شده:`);
    result.invalidRows.slice(0, 5).forEach((inv) => {
      console.warn(`  سطر ${inv.row}: ${inv.errors.join(', ')}`);
    });
    if (result.invalidRows.length > 5) {
      console.warn(`  ... و ${result.invalidRows.length - 5} خطای دیگر.`);
    }
  }

  if (result.validDoctors.length === 0) {
    console.error('هیچ پزشک معتبری برای ذخیره یافت نشد.');
    process.exit(1);
  }

  // Output JSON for direct use
  const outputPath = path.resolve(process.cwd(), 'public/imported-doctors.json');
  fs.writeFileSync(outputPath, JSON.stringify(result.validDoctors, null, 2), 'utf-8');
  console.log(`فایل خروجی با فرمت استاندارد تولید شد: public/imported-doctors.json`);

  console.log(`عملیات با موفقیت انجام شد: ${result.validDoctors.length} پزشک آماده استفاده هستند.`);
}

main().catch((err) => {
  console.error('خطای غیرمنتظره:', err);
  process.exit(1);
});
