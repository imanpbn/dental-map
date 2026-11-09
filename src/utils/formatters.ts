/**
 * Centralized formatting and internationalization helpers for Dental Map.
 * Adheres strictly to DRY by providing a single source of truth for Persian numbers,
 * currency/toman amounts, dates, and phone number normalization.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Converts English/Arabic digits in any string or number to Persian digits.
 * @param input string or number
 * @returns string with Persian digits
 */
export const toPersianDigits = (input: number | string | null | undefined): string => {
  if (input === null || input === undefined) return '';
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
};

/**
 * Short alias for toPersianDigits for concise inline templates.
 */
export const faNum = toPersianDigits;

/**
 * Formats a number with standard thousand-separators in Persian.
 * Example: 2500000 -> "۲,۵۰۰,۰۰۰"
 */
export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || isNaN(Number(num))) return '۰';
  return Number(num).toLocaleString('fa-IR');
};

/**
 * Formats monetary amounts (default: Toman).
 * Example: formatPrice(25000000) -> "۲۵,۰۰۰,۰۰۰ تومان"
 * Example: formatPrice(25000000, 'ت') -> "۲۵,۰۰۰,۰۰۰ ت"
 */
export const formatPrice = (
  amount: number | string | null | undefined,
  unit: string = 'تومان'
): string => {
  const formatted = formatNumber(amount);
  return unit ? `${formatted} ${unit}` : formatted;
};

/**
 * Normalizes any Iranian mobile number representation to standard 11-digit 09xxxxxxxxx.
 * Handles +98, 0098, 98, Persian digits, spaces, and dashes.
 */
export const normalizeIranMobile = (input: string): string => {
  if (!input) return '';
  let cleaned = input
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[\s\-\+\(\)]/g, '')
    .trim();

  if (cleaned.startsWith('0098')) cleaned = '0' + cleaned.slice(4);
  if (cleaned.startsWith('98') && cleaned.length === 12) cleaned = '0' + cleaned.slice(2);
  if (cleaned.startsWith('+98')) cleaned = '0' + cleaned.slice(3);
  if (!cleaned.startsWith('0') && cleaned.startsWith('9') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
};

/**
 * Validates whether the given string is a valid 11-digit Iranian mobile number starting with 09.
 */
export const isValidIranMobile = (mobile: string): boolean => {
  const norm = normalizeIranMobile(mobile);
  return /^09\d{9}$/.test(norm);
};
