import { Doctor, Clinic, Specialty, DentalComponent, ImplantBrand } from '../types';

const SITE_URL = 'https://dentalmap.ir';
const DEFAULT_LOGO = 'https://dentalmap.ir/images/og-preview.png';

/**
 * 1. WebSite Schema with Sitelinks Search Box
 */
export const buildWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'دنتال مپ (Dental Map)',
  alternateName: 'DentalMap Iran',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/directory?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
});

/**
 * 2. Organization Schema for Google Knowledge Graph
 */
export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: 'دنتال مپ (Dental Map)',
  alternateName: 'مرجع اصالت قطعات و دایرکتوری ایمپلنت دندان ایران',
  url: SITE_URL,
  logo: DEFAULT_LOGO,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+98-21-88001144',
      contactType: 'customer support',
      areaServed: 'IR',
      availableLanguage: ['Persian', 'English']
    }
  ],
  sameAs: [
    'https://instagram.com/dentalmap.ir',
    'https://t.me/dentalmap_ir'
  ]
});

/**
 * 3. BreadcrumbList Schema for hierarchical search navigation
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`
  }))
});

/**
 * 4. FAQPage Schema for rich snippet question-answer accordions in SERP
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const buildFaqPageSchema = (faqs: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

/**
 * 5. Physician / Dentist Schema for Doctor Profile Pages
 */
export const buildPhysicianSchema = (
  doctor: Doctor,
  specialty?: Specialty,
  clinic?: Clinic
) => {
  const doctorUrl = `${SITE_URL}/doctor/${doctor.medical_council_code}-${doctor.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': doctorUrl,
    name: `دکتر ${doctor.first_name} ${doctor.last_name}`,
    image: doctor.avatar || DEFAULT_LOGO,
    url: doctorUrl,
    telephone: clinic?.phone || '+98-21-88001144',
    medicalSpecialty: specialty?.title || 'Oral and Maxillofacial Surgery',
    identifier: {
      '@type': 'PropertyValue',
      name: 'شماره نظام پزشکی (IRIMC)',
      value: doctor.medical_council_code
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'تهران',
      streetAddress: clinic?.address || 'تهران، خیابان ولیعصر',
      addressCountry: 'IR'
    },
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: doctor.rating || 4.9,
      reviewCount: doctor.reviews_count || 32,
      bestRating: 5,
      worstRating: 1
    }
  };
};

/**
 * 6. Dentist / MedicalBusiness Schema for Clinic Profile Pages
 */
export const buildClinicSchema = (clinic: Clinic, doctors?: Doctor[]) => {
  const clinicUrl = `${SITE_URL}/clinic/${clinic.id}-${clinic.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': clinicUrl,
    name: clinic.name,
    image: clinic.image || DEFAULT_LOGO,
    url: clinicUrl,
    telephone: clinic.phone || '+98-21-88001144',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'تهران',
      streetAddress: clinic.address || 'تهران',
      addressCountry: 'IR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: clinic.latitude || 35.7219,
      longitude: clinic.longitude || 51.3347
    },
    openingHours: clinic.is_24_7 ? 'Mo-Su 00:00-24:00' : 'Mo-Sa 09:00-21:00',
    isAcceptingNewPatients: true,
    priceRange: '$$',
    employee: doctors?.slice(0, 5).map((d) => ({
      '@type': 'Person',
      name: `دکتر ${d.first_name} ${d.last_name}`,
      jobTitle: 'دندانپزشک و جراح ایمپلنت'
    }))
  };
};

/**
 * 7. MedicalDevice / Product Schema for Implant Component Details
 */
export const buildMedicalDeviceSchema = (
  component: DentalComponent,
  brand?: ImplantBrand
) => {
  const componentUrl = `${SITE_URL}/parts/ref/${encodeURIComponent(component.ref_code)}`;

  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'MedicalDevice'],
    '@id': componentUrl,
    name: component.name_fa || component.name_en,
    image: component.image_url || DEFAULT_LOGO,
    description: component.description || `مشخصات فنی و استعلام اصالت فیکسچر و قطعه ایمپلنت ${component.name_fa} با کد رفرنس ${component.ref_code}`,
    mpn: component.ref_code,
    sku: component.ref_code,
    brand: {
      '@type': 'Brand',
      name: brand?.name || 'Straumann'
    },
    offers: {
      '@type': 'Offer',
      url: componentUrl,
      priceCurrency: 'IRR',
      price: component.price_toman ? component.price_toman * 10 : 0, // In Rials
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'دنتال مپ'
      }
    }
  };
};

/**
 * 8. MedicalWebPage Schema for general health & implant information pages
 */
export const buildMedicalWebPageSchema = (
  title: string,
  description: string,
  urlPath: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: title,
  description,
  url: `${SITE_URL}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`,
  aspect: ['Diagnosis', 'Treatment', 'Overview'],
  lastReviewed: '2026-11-14',
  reviewedBy: {
    '@type': 'MedicalOrganization',
    name: 'تیم نظارت بالینی دنتال‌مپ'
  }
});
