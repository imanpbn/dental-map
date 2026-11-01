export interface DirectoryFilterParams {
  gender?: 'male' | 'female';
  age?: 'adults' | 'children' | 'both';
  type?: 'private_office' | 'clinic' | 'hospital';
  tariff?: 'free';
  passport?: 'verified';
  minLifespan?: number;
}

const appendQueryParams = (basePath: string, params?: DirectoryFilterParams): string => {
  if (!params) return basePath;
  const searchParams = new URLSearchParams();
  if (params.gender) searchParams.set('gender', params.gender);
  if (params.age) searchParams.set('age', params.age);
  if (params.type) searchParams.set('type', params.type);
  if (params.tariff) searchParams.set('tariff', params.tariff);
  if (params.passport) searchParams.set('passport', params.passport);
  if (params.minLifespan) searchParams.set('min_lifespan', String(params.minLifespan));

  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
};

export const DentalMapRoutes = {
  dentistsHub: () => '/dentists',

  dentistsByLocation: (citySlug?: string, districtSlug?: string, filters?: DirectoryFilterParams) => {
    if (!citySlug) return '/dentists';
    return appendQueryParams(
      districtSlug ? `/dentists/${citySlug}/${districtSlug}` : `/dentists/${citySlug}`,
      filters
    );
  },

  specialtiesHub: () => '/specialties',

  specialtyHub: (specialtySlug: string) => `/specialties/${specialtySlug}`,

  specialtyByLocation: (
    specialtySlug: string,
    citySlug?: string,
    districtSlug?: string,
    filters?: DirectoryFilterParams
  ) => {
    if (!citySlug) return `/specialties/${specialtySlug}`;
    return appendQueryParams(
      districtSlug
        ? `/specialties/${specialtySlug}/${citySlug}/${districtSlug}`
        : `/specialties/${specialtySlug}/${citySlug}`,
      filters
    );
  },

  doctorProfile: (medicalCouncilCode: string, doctorSlug: string) =>
    `/doctor/${medicalCouncilCode}-${doctorSlug}`,

  clinicsHub: () => '/clinics',

  clinicsByLocation: (citySlug?: string, districtSlug?: string, filters?: DirectoryFilterParams) => {
    if (!citySlug) return '/clinics';
    return appendQueryParams(
      districtSlug ? `/clinics/${citySlug}/${districtSlug}` : `/clinics/${citySlug}`,
      filters
    );
  },

  clinics24Hour: (citySlug: string, districtSlug?: string) =>
    districtSlug ? `/clinics/24-hour/${citySlug}/${districtSlug}` : `/clinics/24-hour/${citySlug}`,

  clinicsByInsurance: (insuranceSlug: string, citySlug: string) =>
    `/clinics/insurance/${insuranceSlug}/${citySlug}`,

  clinicProfile: (clinicId: number | string, clinicSlug: string) =>
    `/clinic/${clinicId}-${clinicSlug}`,

  implantsByCountry: (countrySlug: string) => `/implants/country/${countrySlug}`,

  brandsHub: () => '/brands',

  brandHub: (brandSlug: string) => `/brands/${brandSlug}`,

  implantModel: (brandSlug: string, modelSlug: string) => `/brands/${brandSlug}/${modelSlug}`,

  brandDentistsInCity: (brandSlug: string, citySlug: string) =>
    `/brands/${brandSlug}/dentists/${citySlug}`,

  partsHub: () => '/parts',

  partCategory: (categorySlug: string) => `/parts/${categorySlug}`,

  partByRef: (refCode: string) => `/parts/ref/${encodeURIComponent(refCode)}`,

  compareBrands: (brandASlug: string, brandBSlug: string) => {
    const [first, second] = [brandASlug, brandBSlug].sort();
    return `/compare/${first}-vs-${second}`;
  },

  passport: () => '/passport',

  blog: () => '/blog',

  blogPost: (postSlug: string) => `/blog/${postSlug}`,

  admin: () => '/admin',
};
