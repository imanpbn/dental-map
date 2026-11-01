import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Star,
  Calendar,
  Building,
  User,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
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
  DirectoryFilterState,
  LeadValuationRecord,
  Gender,
  PatientAgeGroup,
  CenterType,
  RegionZone
} from '../types';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  clinics: Clinic[];
  specialties: Specialty[];
  cities: City[];
  districts: District[];
  insurances: Insurance[];
  brands: ImplantBrand[];
  implantTypes: ImplantType[];
  clinicDoctors: ClinicDoctor[];
  clinicInsurances: ClinicInsurance[];
  doctorImplantTypes: DoctorImplantType[];
  leadValuations: Record<number, LeadValuationRecord>;
  onRecordLead: (clinicId: number, doctorId?: number) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  doctors,
  clinics,
  specialties,
  cities,
  districts,
  insurances,
  brands,
  implantTypes,
  clinicDoctors,
  clinicInsurances,
  doctorImplantTypes,
  leadValuations,
  onRecordLead,
  onSelectDoctor
}) => {
  // Comprehensive Relational Filter State
  const [filters, setFilters] = useState<DirectoryFilterState>({
    searchQuery: '',
    provinceId: 'all',
    cityId: 1, // Default Tehran
    districtId: 'all',
    regionZone: 'all',
    specialtyId: 'all',
    gender: 'all',
    patientAgeGroup: 'all',
    centerType: 'all',
    is24_7Only: false,
    insuranceId: 'all',
    isFreeTariffOnly: false,
    brandId: 'all',
    implantTypeId: 'all',
    passportCommittedOnly: false,
    minLifespanYears: 0
  });

  const [activeTab, setActiveTab] = useState<'clinics' | 'doctors'>('clinics');
  const [contactedClinicId, setContactedClinicId] = useState<number | null>(null);

  // Available districts for selected city
  const filteredDistricts =
    filters.cityId === 'all'
      ? districts
      : districts.filter((d) => d.city_id === filters.cityId);

  // Multi-Variable Relational Filtering for Clinics & Centers
  const filteredClinics = clinics.filter((clinic) => {
    // City filter
    if (filters.cityId !== 'all' && clinic.city_id !== filters.cityId) return false;

    // District filter
    if (filters.districtId !== 'all' && clinic.district_id !== filters.districtId) return false;

    // Region Zone filter (شمال، غرب، شرق، مرکز، جنوب)
    if (filters.regionZone !== 'all') {
      const dist = districts.find((d) => d.id === clinic.district_id);
      if (!dist || dist.region_zone !== filters.regionZone) return false;
    }

    // Center type
    if (filters.centerType !== 'all' && clinic.center_type !== filters.centerType) return false;

    // 24/7 status
    if (filters.is24_7Only && !clinic.is_24_7) return false;

    // Free tariff only
    if (filters.isFreeTariffOnly && !clinic.is_free_tariff_only) return false;

    // Insurance filter (Junction: Clinic <-> Insurance)
    if (filters.insuranceId !== 'all') {
      const hasInsurance = clinicInsurances.some(
        (ci) => ci.clinic_id === clinic.id && ci.insurance_id === filters.insuranceId
      );
      if (!hasInsurance) return false;
    }

    // Doctor attributes within this clinic (Junction: Clinic <-> Doctor)
    const doctorsInClinic = clinicDoctors
      .filter((cd) => cd.clinic_id === clinic.id && cd.is_active)
      .map((cd) => doctors.find((d) => d.id === cd.doctor_id))
      .filter(Boolean) as Doctor[];

    // Specialty filter
    if (filters.specialtyId !== 'all') {
      const hasSpecialty = doctorsInClinic.some((d) => d.specialty_id === filters.specialtyId);
      if (!hasSpecialty) return false;
    }

    // Doctor Gender filter
    if (filters.gender !== 'all') {
      const hasGender = doctorsInClinic.some((d) => d.gender === filters.gender);
      if (!hasGender) return false;
    }

    // Patient Age Group filter
    if (filters.patientAgeGroup !== 'all') {
      const hasAgeGroup = doctorsInClinic.some(
        (d) => d.patient_age_group === filters.patientAgeGroup || d.patient_age_group === 'both'
      );
      if (!hasAgeGroup) return false;
    }

    // Passport commitment filter
    if (filters.passportCommittedOnly) {
      const hasPassport = doctorsInClinic.some((d) => d.passport_committed);
      if (!hasPassport) return false;
    }

    // Brand / Implant Type / Lifespan (Junction: Doctor <-> Implant Type)
    if (filters.brandId !== 'all' || filters.implantTypeId !== 'all' || filters.minLifespanYears > 0) {
      const docIds = doctorsInClinic.map((d) => d.id);
      const docImplantIds = doctorImplantTypes
        .filter((dit) => docIds.includes(dit.doctor_id))
        .map((dit) => dit.implant_type_id);

      const supportedTypes = implantTypes.filter((t) => docImplantIds.includes(t.id));

      if (filters.brandId !== 'all') {
        const hasBrand = supportedTypes.some((t) => t.brand_id === filters.brandId);
        if (!hasBrand) return false;
      }

      if (filters.implantTypeId !== 'all') {
        const hasType = supportedTypes.some((t) => t.id === filters.implantTypeId);
        if (!hasType) return false;
      }

      if (filters.minLifespanYears > 0) {
        const hasLifespan = supportedTypes.some(
          (t) => t.avg_lifespan_years >= filters.minLifespanYears
        );
        if (!hasLifespan) return false;
      }
    }

    // Free search text
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchClinic = clinic.name.toLowerCase().includes(q) || clinic.address.toLowerCase().includes(q);
      const matchDoc = doctorsInClinic.some(
        (d) =>
          `${d.first_name} ${d.last_name}`.toLowerCase().includes(q) ||
          d.medical_council_code.toLowerCase().includes(q)
      );
      if (!matchClinic && !matchDoc) return false;
    }

    return true;
  });

  // Calculate total leads valuation
  const totalValuation = Object.values(leadValuations).reduce(
    (acc, curr) => acc + curr.total_valuation_toman,
    0
  );
  const totalLeadsCount = Object.values(leadValuations).reduce(
    (acc, curr) => acc + curr.lead_count,
    0
  );

  const handleContactClick = (clinic: Clinic, doctor?: Doctor) => {
    onRecordLead(clinic.id, doctor?.id);
    setContactedClinicId(clinic.id);
    setTimeout(() => setContactedClinicId(null), 3000);
  };

  return (
    <section id="directory-section" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Lead Valuation Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Building className="w-3.5 h-3.5" />
              <span>موتور دایرکتوری و جستجوی چندمتغیره رابطه‌ای</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              دایرکتوری جراحان فک و صورت، کلینیک‌ها و مراکز شبانه‌روزی
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              جستجو با سناریوهای ترکیبی (مثال: جراح خانم فک و صورت در غرب تهران، کلینیک ۲۴/۷، طرف قرارداد بیمه دانا و برند سوئیسی/کره‌ای)
            </p>
          </div>

          {/* Lead Valuation Engine Badge */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">
                موتور ارزش‌گذاری لید بالینی (Lead Valuation Engine):
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-lg font-black text-emerald-400">
                  {totalValuation.toLocaleString('fa-IR')}
                </span>
                <span className="text-xs text-slate-300">تومان ارزش خلق‌شده</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                تعداد لیدها: <strong className="font-mono text-white">{totalLeadsCount}</strong> تماس (هر لید معادل ۳۵۰,۰۰۰ تومان ارزش پلتفرم)
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Faceted Relational Filter Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs mb-8">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              فیلترهای ترکیبی پایگاه داده رابطه‌ای (Multi-variable Filtering)
            </span>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  provinceId: 'all',
                  cityId: 1,
                  districtId: 'all',
                  regionZone: 'all',
                  specialtyId: 'all',
                  gender: 'all',
                  patientAgeGroup: 'all',
                  centerType: 'all',
                  is24_7Only: false,
                  insuranceId: 'all',
                  isFreeTariffOnly: false,
                  brandId: 'all',
                  implantTypeId: 'all',
                  passportCommittedOnly: false,
                  minLifespanYears: 0
                })
              }
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>پاکسازی همه فیلترها</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. City */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">شهر:</label>
              <select
                value={filters.cityId}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    cityId: e.target.value === 'all' ? 'all' : Number(e.target.value),
                    districtId: 'all'
                  })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">همه شهرها</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. District & Zone */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">منطقه و محله:</label>
              <select
                value={filters.districtId}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    districtId: e.target.value === 'all' ? 'all' : Number(e.target.value)
                  })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">همه مناطق</option>
                {filteredDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.region_zone})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Zone Area */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">پهنه‌بندی جغرافیایی:</label>
              <select
                value={filters.regionZone}
                onChange={(e) =>
                  setFilters({ ...filters, regionZone: e.target.value as RegionZone | 'all' })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">همه پهنه‌ها</option>
                <option value="شمال">شمال تهران / شهر</option>
                <option value="غرب">غرب تهران (سعادت‌آباد، شهرک غرب و...)</option>
                <option value="شرق">شرق تهران</option>
                <option value="مرکز">مرکز تهران (ولیعصر، ونک و...)</option>
                <option value="جنوب">جنوب تهران</option>
              </select>
            </div>

            {/* 4. Specialty */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">تخصص پزشک:</label>
              <select
                value={filters.specialtyId}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    specialtyId: e.target.value === 'all' ? 'all' : Number(e.target.value)
                  })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">همه تخصص‌ها</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Doctor Gender */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">جنسیت پزشک:</label>
              <select
                value={filters.gender}
                onChange={(e) =>
                  setFilters({ ...filters, gender: e.target.value as Gender | 'all' })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">همه</option>
                <option value="female">پزشک خانم</option>
                <option value="male">پزشک آقا</option>
              </select>
            </div>

            {/* 6. Patient Age Group */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">رده سنی بیمار:</label>
              <select
                value={filters.patientAgeGroup}
                onChange={(e) =>
                  setFilters({ ...filters, patientAgeGroup: e.target.value as PatientAgeGroup | 'all' })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">همه رده‌های سنی</option>
                <option value="adults">فقط بزرگسالان</option>
                <option value="children">کودکان و نوجوانان</option>
                <option value="both">کودکان و بزرگسالان</option>
              </select>
            </div>

            {/* 7. Center Type */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">نوع مرکز درمانی:</label>
              <select
                value={filters.centerType}
                onChange={(e) =>
                  setFilters({ ...filters, centerType: e.target.value as CenterType | 'all' })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">همه انواع (مطب، کلینیک، بیمارستان)</option>
                <option value="private_office">مطب شخصی</option>
                <option value="clinic">کلینیک / درمانگاه</option>
                <option value="hospital">بیمارستان / مرکز جراحی محدود</option>
              </select>
            </div>

            {/* 8. Insurance */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">طرف قرارداد با بیمه:</label>
              <select
                value={filters.insuranceId}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    insuranceId: e.target.value === 'all' ? 'all' : Number(e.target.value)
                  })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">همه بیمه‌ها</option>
                {insurances.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 9. Brand */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">برند ایمپلنت مورد استفاده:</label>
              <select
                value={filters.brandId}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    brandId: e.target.value === 'all' ? 'all' : Number(e.target.value)
                  })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="all">همه برندها</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 10. Min Lifespan */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">حداقل طول عمر تضمینی:</label>
              <select
                value={filters.minLifespanYears}
                onChange={(e) =>
                  setFilters({ ...filters, minLifespanYears: Number(e.target.value) })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value={0}>بدون محدودیت</option>
                <option value={15}>حداقل ۱۵ سال</option>
                <option value={20}>حداقل ۲۰ سال</option>
                <option value={25}>حداقل ۲۵ سال (مادام‌العمر)</option>
              </select>
            </div>

            {/* 11 & 12. Checkboxes */}
            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-800 font-bold select-none">
                <input
                  type="checkbox"
                  checked={filters.is24_7Only}
                  onChange={(e) => setFilters({ ...filters, is24_7Only: e.target.checked })}
                  className="rounded text-emerald-600 accent-emerald-600 w-4 h-4"
                />
                <span>فقط شبانه‌روزی (۲۴/۷)</span>
              </label>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-800 font-bold select-none">
                <input
                  type="checkbox"
                  checked={filters.passportCommittedOnly}
                  onChange={(e) =>
                    setFilters({ ...filters, passportCommittedOnly: e.target.checked })
                  }
                  className="rounded text-emerald-600 accent-emerald-600 w-4 h-4"
                />
                <span>فقط متعهدین به پاسپورت اصالت</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              نمایش <strong className="text-slate-800 font-bold font-mono">{filteredClinics.length}</strong> مرکز و مطب درمانی مطابق با فیلترها
            </span>
          </div>

          {filteredClinics.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">هیچ مرکزی با تمام شروط انتخابی شما یافت نشد</h4>
              <p className="text-xs text-slate-500 mt-1">
                پیشنهاد می‌شود یک یا چند فیلتر نظیر نوع بیمه یا منطقه را به وضعیت «همه» بازگردانید.
              </p>
            </div>
          ) : (
            filteredClinics.map((clinic) => {
              const clinicLead = leadValuations[clinic.id] || {
                lead_count: 0,
                total_valuation_toman: 0
              };
              const district = districts.find((d) => d.id === clinic.district_id);
              const city = cities.find((c) => c.id === clinic.city_id);

              // Insurances for this clinic
              const clinicInsIds = clinicInsurances
                .filter((ci) => ci.clinic_id === clinic.id)
                .map((ci) => ci.insurance_id);
              const matchedInsurances = insurances.filter((ins) => clinicInsIds.includes(ins.id));

              // Doctors in this clinic
              const docs = clinicDoctors
                .filter((cd) => cd.clinic_id === clinic.id && cd.is_active)
                .map((cd) => {
                  const doc = doctors.find((d) => d.id === cd.doctor_id);
                  return doc ? { doc, shift: cd.shift_schedule } : null;
                })
                .filter(Boolean) as { doc: Doctor; shift?: Record<string, string> }[];

              return (
                <div
                  key={clinic.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Clinic Info */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {clinic.center_type === 'private_office' && 'مطب شخصی'}
                          {clinic.center_type === 'clinic' && 'کلینیک و درمانگاه تخصصی'}
                          {clinic.center_type === 'hospital' && 'بیمارستان و مرکز جراحی'}
                        </span>

                        {clinic.is_24_7 && (
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>شبانه‌روزی ۲۴/۷</span>
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          <span>
                            {city?.name}، {district?.name} ({district?.region_zone})
                          </span>
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {clinic.name}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {clinic.address}
                      </p>

                      {/* Insurances chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400">بیمه‌های طرف قرارداد:</span>
                        {matchedInsurances.length > 0 ? (
                          matchedInsurances.map((ins) => (
                            <span
                              key={ins.id}
                              className="px-2 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-bold rounded-md border border-teal-200"
                            >
                              ✓ {ins.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            صرفاً تعرفه آزاد (بدون بیمه تکمیلی)
                          </span>
                        )}
                      </div>

                      {/* Doctors working here */}
                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-800 block mb-2">
                          پزشکان و جراحان مستقر در این مرکز:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {docs.map(({ doc, shift }) => {
                            const spec = specialties.find((s) => s.id === doc.specialty_id);
                            return (
                              <div
                                key={doc.id}
                                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={doc.avatar}
                                    alt={doc.last_name}
                                    className="w-10 h-10 rounded-full object-cover border"
                                  />
                                  <div>
                                    <span className="text-xs font-bold text-slate-900 block">
                                      {doc.first_name} {doc.last_name}
                                    </span>
                                    <span className="text-[10px] text-teal-700 block truncate max-w-[150px]">
                                      {spec?.title}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => onSelectDoctor(doc)}
                                  className="text-[10px] font-bold text-slate-600 hover:text-emerald-700 underline"
                                >
                                  پروفایل
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action & Leads Valuation Column */}
                    <div className="lg:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="text-slate-500">شماره پذیرش / اورژانس:</span>
                          <span className="font-mono font-bold text-slate-800 dir-ltr text-xs">
                            {clinic.phone}
                          </span>
                        </div>

                        {/* Clinic lead valuation status */}
                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs mb-3">
                          <div className="flex justify-between items-center text-[11px] mb-1">
                            <span className="text-slate-400">لیدهای ارجاع‌شده:</span>
                            <span className="font-mono font-bold text-slate-900">
                              {clinicLead.lead_count} بیمار
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-400">ارزش ریالی ارجاع:</span>
                            <span className="font-mono font-bold text-emerald-700">
                              {clinicLead.total_valuation_toman.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleContactClick(clinic, docs[0]?.doc)}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                          contactedClinicId === clinic.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        <span>
                          {contactedClinicId === clinic.id
                            ? 'اطلاعات تماس ثبت شد (+۳۵۰ هزار تومان لید)'
                            : 'ثبت تماس و دریافت نوبت مشاوره'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
