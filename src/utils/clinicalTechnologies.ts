import React from 'react';
import {
  Compass,
  Zap,
  Moon,
  Layers,
  ShieldCheck,
  CreditCard,
  LucideIcon
} from 'lucide-react';
import { ClinicalTechnology } from '../types';

export interface ClinicalTechnologyDef {
  id: ClinicalTechnology;
  title: string;
  shortTitle: string;
  badgeLabel: string;
  description: string;
  icon: LucideIcon;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  pillColor: string;
}

export const CLINICAL_TECHNOLOGIES: Record<ClinicalTechnology, ClinicalTechnologyDef> = {
  digital_guided: {
    id: 'digital_guided',
    title: 'ایمپلنت دیجیتال و هدایت‌شده (پانچ / Guided Surgery)',
    shortTitle: 'ایمپلنت دیجیتال',
    badgeLabel: 'گاید سه‌بعدی',
    description: 'کاشت دقیق فیکسچر با شابلون جراحی سه‌بعدی، بدون برش لثه و بخیه (جراحی پانچ)',
    icon: Compass,
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
    badgeBorder: 'border-teal-200',
    pillColor: 'text-teal-700 bg-teal-50/80 border-teal-300 hover:bg-teal-100'
  },
  immediate_loading: {
    id: 'immediate_loading',
    title: 'ایمپلنت فوری یک‌روزه (Same-Day Teeth / بارگذاری فوری)',
    shortTitle: 'ایمپلنت فوری یک‌روزه',
    badgeLabel: 'روکش فوری',
    description: 'کاشت فیکسچر و تحویل پروتز موقت زیبایی در همان روز کشیدن دندان',
    icon: Zap,
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    pillColor: 'text-amber-800 bg-amber-50/80 border-amber-300 hover:bg-amber-100'
  },
  sleep_dentistry: {
    id: 'sleep_dentistry',
    title: 'سدیشن و جراحی در خواب (Sleep Dentistry / بدون درد)',
    shortTitle: 'جراحی در خواب (سدیشن)',
    badgeLabel: 'سدیشن و بدون درد',
    description: 'انجام جراحی در آرامش عمیق تحت نظر متخصص بیهوشی برای افراد دارای استرس یا فوبیا',
    icon: Moon,
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
    pillColor: 'text-indigo-700 bg-indigo-50/80 border-indigo-300 hover:bg-indigo-100'
  },
  all_on_4: {
    id: 'all_on_4',
    title: 'بازسازی کامل فک بی‌دندان (All-on-4 / All-on-6)',
    shortTitle: 'بازسازی کامل (All-on-4)',
    badgeLabel: 'فک کامل All-on-4',
    description: 'جایگزینی کل دندان‌های فک با ۴ یا ۶ پایه ایمپلنت زاویه‌دار و پروتز هیبریدی ثابت',
    icon: Layers,
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-200',
    pillColor: 'text-blue-700 bg-blue-50/80 border-blue-300 hover:bg-blue-100'
  },
  bone_graft: {
    id: 'bone_graft',
    title: 'پیوند استخوان پیشرفته و سینوس‌لیفت باز/بسته',
    shortTitle: 'پیوند استخوان و سینوس',
    badgeLabel: 'سینوس‌لیفت و پیوند',
    description: 'افزایش حجم و ارتفاع استخوان با پودرهای بیولوژیک در فک‌های دارای تحلیل شدید',
    icon: ShieldCheck,
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
    pillColor: 'text-rose-700 bg-rose-50/80 border-rose-300 hover:bg-rose-100'
  },
  installment_plan: {
    id: 'installment_plan',
    title: 'پرداخت اقساطی و شرایط چکی صیادی',
    shortTitle: 'شرایط اقساطی',
    badgeLabel: 'اقساط و چک',
    description: 'امکان پرداخت مرحله‌ای هزینه جراحی و پروتز با چک صیادی بدون بهره',
    icon: CreditCard,
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    pillColor: 'text-emerald-700 bg-emerald-50/80 border-emerald-300 hover:bg-emerald-100'
  }
};

export const CLINICAL_TECHNOLOGY_LIST: ClinicalTechnologyDef[] = Object.values(CLINICAL_TECHNOLOGIES);
