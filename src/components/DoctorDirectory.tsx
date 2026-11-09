import React, { useState, useMemo } from 'react';
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
  ChevronDown,
  ChevronLeft,
  Bookmark,
  ThumbsUp,
  Map,
  Video,
  MessageSquare,
  Sparkles,
  Info,
  Check
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
  LeadValuationRecord,
  Gender,
  CenterType
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

export type SortMode = 'default' | 'popular' | 'earliest' | 'success';
export type AppointmentMode = 'office' | 'phone' | 'chat' | 'video';

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
  // Main Filter State
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | 'all'>('all');
  const [selectedCityId, setSelectedCityId] = useState<number | 'all'>(1); // Default Tehran
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | 'all'>('all');
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<number | 'all'>('all');
  const [appointmentMode, setAppointmentMode] = useState<AppointmentMode>('office');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced filters
  const [is24_7Only, setIs24_7Only] = useState(false);
  const [passportCommittedOnly, setPassportCommittedOnly] = useState(false);
  const [genderFilter, setGenderFilter] = useState<Gender | 'all'>('all');
  const [centerTypeFilter, setCenterTypeFilter] = useState<CenterType | 'all'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // View toggles
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [viewEntity, setViewEntity] = useState<'doctors' | 'clinics'>('doctors');
  const [savedDoctorIds, setSavedDoctorIds] = useState<Set<number>>(new Set());
  const [contactedClinicId, setContactedClinicId] = useState<number | null>(null);

  // Available districts for selected city
  const availableDistricts = useMemo(() => {
    if (selectedCityId === 'all') return districts;
    return districts.filter((d) => d.city_id === selectedCityId);
  }, [districts, selectedCityId]);

  // Toggle bookmark
  const toggleSaveDoctor = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedDoctorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedSpecialtyId('all');
    setSelectedCityId('all');
    setSelectedDistrictId('all');
    setSelectedInsuranceId('all');
    setAppointmentMode('office');
    setSortMode('default');
    setSearchQuery('');
    setIs24_7Only(false);
    setPassportCommittedOnly(false);
    setGenderFilter('all');
    setCenterTypeFilter('all');
  };

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // 1. Specialty
      if (selectedSpecialtyId !== 'all' && doc.specialty_id !== selectedSpecialtyId) {
        return false;
      }

      // 2. Gender
      if (genderFilter !== 'all' && doc.gender !== genderFilter) {
        return false;
      }

      // 3. Passport commitment
      if (passportCommittedOnly && !doc.passport_committed) {
        return false;
      }

      // 4. City & District & Insurance & 24/7 (checked through clinics the doctor practices in)
      const docClinicIds = clinicDoctors
        .filter((cd) => cd.doctor_id === doc.id && cd.is_active)
        .map((cd) => cd.clinic_id);

      const docClinics = clinics.filter((c) => docClinicIds.includes(c.id));

      if (selectedCityId !== 'all') {
        const matchesCity = docClinics.some((c) => c.city_id === selectedCityId);
        if (!matchesCity && docClinics.length > 0) return false;
      }

      if (selectedDistrictId !== 'all') {
        const matchesDistrict = docClinics.some((c) => c.district_id === selectedDistrictId);
        if (!matchesDistrict && docClinics.length > 0) return false;
      }

      if (selectedInsuranceId !== 'all') {
        const clinicHasIns = docClinics.some((c) =>
          clinicInsurances.some(
            (ci) => ci.clinic_id === c.id && ci.insurance_id === selectedInsuranceId
          )
        );
        if (!clinicHasIns && docClinics.length > 0) return false;
      }

      if (is24_7Only) {
        const has24_7 = docClinics.some((c) => c.is_24_7);
        if (!has24_7 && docClinics.length > 0) return false;
      }

      if (centerTypeFilter !== 'all') {
        const matchesType = docClinics.some((c) => c.center_type === centerTypeFilter);
        if (!matchesType && docClinics.length > 0) return false;
      }

      // 5. Search Query (name, bio, medical council code)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase();
        const matchesCode = doc.medical_council_code.toLowerCase().includes(q);
        const matchesBio = doc.bio.toLowerCase().includes(q);
        if (!fullName.includes(q) && !matchesCode && !matchesBio) {
          return false;
        }
      }

      return true;
    });
  }, [
    doctors,
    clinics,
    clinicDoctors,
    clinicInsurances,
    selectedSpecialtyId,
    selectedCityId,
    selectedDistrictId,
    selectedInsuranceId,
    genderFilter,
    passportCommittedOnly,
    is24_7Only,
    centerTypeFilter,
    searchQuery
  ]);

  // Sorted Doctors
  const sortedDoctors = useMemo(() => {
    const list = [...filteredDoctors];
    if (sortMode === 'popular') {
      return list.sort((a, b) => b.rating * b.reviews_count - a.rating * a.reviews_count);
    }
    if (sortMode === 'success') {
      return list.sort((a, b) => b.reviews_count - a.reviews_count);
    }
    if (sortMode === 'earliest') {
      return list.sort((a, b) => (a.id % 3) - (b.id % 3));
    }
    return list; // default
  }, [filteredDoctors, sortMode]);

  // Filtered Clinics
  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      if (selectedCityId !== 'all' && clinic.city_id !== selectedCityId) return false;
      if (selectedDistrictId !== 'all' && clinic.district_id !== selectedDistrictId) return false;
      if (is24_7Only && !clinic.is_24_7) return false;
      if (centerTypeFilter !== 'all' && clinic.center_type !== centerTypeFilter) return false;

      if (selectedInsuranceId !== 'all') {
        const hasIns = clinicInsurances.some(
          (ci) => ci.clinic_id === clinic.id && ci.insurance_id === selectedInsuranceId
        );
        if (!hasIns) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!clinic.name.toLowerCase().includes(q) && !clinic.address.toLowerCase().includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [
    clinics,
    clinicInsurances,
    selectedCityId,
    selectedDistrictId,
    is24_7Only,
    centerTypeFilter,
    selectedInsuranceId,
    searchQuery
  ]);

  const handleContactClick = (clinic: Clinic, doctor?: Doctor) => {
    onRecordLead(clinic.id, doctor?.id);
    setContactedClinicId(clinic.id);
    setTimeout(() => setContactedClinicId(null), 3000);
  };

  const selectedCityObj = cities.find((c) => c.id === selectedCityId);
  const selectedDistrictObj = districts.find((d) => d.id === selectedDistrictId);
  const selectedSpecialtyObj = specialties.find((s) => s.id === selectedSpecialtyId);
  const selectedInsuranceObj = insurances.find((i) => i.id === selectedInsuranceId);

  // Active filter count
  const activeFiltersCount =
    (selectedSpecialtyId !== 'all' ? 1 : 0) +
    (selectedCityId !== 'all' ? 1 : 0) +
    (selectedDistrictId !== 'all' ? 1 : 0) +
    (selectedInsuranceId !== 'all' ? 1 : 0) +
    (is24_7Only ? 1 : 0) +
    (passportCommittedOnly ? 1 : 0) +
    (genderFilter !== 'all' ? 1 : 0) +
    (centerTypeFilter !== 'all' ? 1 : 0);

  return (
    <section id="directory-section" className="py-8 sm:py-10 bg-slate-50">
      <div className="w-full px-[5%]">
        
        {/* Main 2-Column Responsive Layout: Sidebar on Right (RTL), Results Feed on Left */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* ============================================================== */}
          {/* 1. RIGHT SIDEBAR: "فیلترها" (Matching User Screenshot Exactly) */}
          {/* ============================================================== */}
          <aside className="w-full lg:w-80 xl:w-92 shrink-0 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 lg:sticky lg:top-24">
              
              {/* Header: Title + Reset Button */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-700" />
                  <h3 className="text-base font-black text-slate-900">فیلترها</h3>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer border border-rose-100"
                  >
                    <span>حذف همه‌ی فیلترها</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Consultation Mode 4 Tabs (نوبت مطب | تلفنی | متنی | ویدیویی) */}
              <div className="mb-5 pb-4 border-b border-slate-100">
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-2xl">
                  <button
                    onClick={() => setAppointmentMode('office')}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      appointmentMode === 'office'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>نوبت مطب</span>
                  </button>

                  <button
                    onClick={() => setAppointmentMode('phone')}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      appointmentMode === 'phone'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>تلفنی</span>
                  </button>

                  <button
                    onClick={() => setAppointmentMode('chat')}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      appointmentMode === 'chat'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>متنی</span>
                  </button>

                  <button
                    onClick={() => setAppointmentMode('video')}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      appointmentMode === 'video'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>ویدیویی</span>
                  </button>
                </div>
              </div>

              {/* Active Filter Chips (تگ‌های فیلتر فعال) */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                  <span>دندانپزشکی</span>
                  <X className="w-3 h-3 text-slate-400" />
                </span>

                {selectedCityObj && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                    <span>{selectedCityObj.name}</span>
                    <button
                      onClick={() => setSelectedCityId('all')}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedDistrictObj && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                    <span>{selectedDistrictObj.name}</span>
                    <button
                      onClick={() => setSelectedDistrictId('all')}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedSpecialtyObj && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                    <span>{selectedSpecialtyObj.title}</span>
                    <button
                      onClick={() => setSelectedSpecialtyId('all')}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedInsuranceObj && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold">
                    <span>{selectedInsuranceObj.name}</span>
                    <button
                      onClick={() => setSelectedInsuranceId('all')}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                
                {/* 1. تخصص، خدمت یا علائم بیماری */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    تخصص، خدمت یا علائم بیماری
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSpecialtyId}
                      onChange={(e) =>
                        setSelectedSpecialtyId(
                          e.target.value === 'all' ? 'all' : Number(e.target.value)
                        )
                      }
                      className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="all">دندانپزشکی (همه تخصص‌ها)</option>
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 2. شهر و محله (Two Columns Side-by-Side as in Screenshot) */}
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* شهر */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">شهر</label>
                      <div className="relative">
                        <select
                          value={selectedCityId}
                          onChange={(e) => {
                            setSelectedCityId(
                              e.target.value === 'all' ? 'all' : Number(e.target.value)
                            );
                            setSelectedDistrictId('all');
                          }}
                          className="w-full py-2.5 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">همه شهرها</option>
                          {cities.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* محله */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">محله</label>
                      <div className="relative">
                        <select
                          value={selectedDistrictId}
                          onChange={(e) =>
                            setSelectedDistrictId(
                              e.target.value === 'all' ? 'all' : Number(e.target.value)
                            )
                          }
                          className="w-full py-2.5 px-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">همه محله‌ها</option>
                          {availableDistricts.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. بیمه */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">بیمه</label>
                  <div className="relative">
                    <select
                      value={selectedInsuranceId}
                      onChange={(e) =>
                        setSelectedInsuranceId(
                          e.target.value === 'all' ? 'all' : Number(e.target.value)
                        )
                      }
                      className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="all">بیمه مورد نظر را انتخاب کنید</option>
                      {insurances.map((ins) => (
                        <option key={ins.id} value={ins.id}>
                          {ins.name} ({ins.insurance_type === 'basic' ? 'پایه' : 'تکمیلی'})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 4. جستجوی متنی نام پزشک یا کلینیک */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    نام پزشک یا مرکز درمانی
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="نام دکتر یا کلینیک..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 px-3 pr-8 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                  </div>
                </div>

                {/* Collapsible Advanced Filters (شبانه‌روزی، پاسپورت، جنسیت) */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 py-1 cursor-pointer"
                  >
                    <span>سایر فیلترهای تخصصی</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        showAdvanced ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showAdvanced && (
                    <div className="space-y-3 pt-3 animate-fadeIn">
                      {/* ۲۴/۷ شبانه‌روزی */}
                      <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-slate-50 border border-slate-100">
                        <span className="font-medium">فقط مراکز شبانه‌روزی (۲۴/۷)</span>
                        <input
                          type="checkbox"
                          checked={is24_7Only}
                          onChange={(e) => setIs24_7Only(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                      </label>

                      {/* متعهدین به پاسپورت اصالت */}
                      <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-slate-50 border border-slate-100">
                        <span className="font-medium">دارای پاسپورت اصالت ۳۲ دندان (FDI)</span>
                        <input
                          type="checkbox"
                          checked={passportCommittedOnly}
                          onChange={(e) => setPassportCommittedOnly(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                      </label>

                      {/* جنسیت پزشک */}
                      <div>
                        <span className="block text-[11px] font-bold text-slate-600 mb-1">
                          جنسیت پزشک:
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          {(['all', 'female', 'male'] as const).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setGenderFilter(g)}
                              className={`py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                                genderFilter === g
                                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {g === 'all' && 'همه'}
                              {g === 'female' && 'خانم'}
                              {g === 'male' && 'آقا'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* ============================================================== */}
          {/* 2. LEFT MAIN CONTENT: Sort Bar, Results Feed, Doctor Cards */}
          {/* ============================================================== */}
          <main className="flex-1 w-full min-w-0 space-y-4">
            
            {/* Top Sort & Map Controls Bar (Exact Match to Top Bar in Screenshot) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              
              {/* Right Side: مرتب‌سازی بر اساس */}
              <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
                <span className="font-bold text-slate-500 shrink-0">مرتب‌سازی بر اساس:</span>
                
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                  <button
                    onClick={() => setSortMode('default')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      sortMode === 'default'
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    پیش‌فرض
                  </button>

                  <button
                    onClick={() => setSortMode('popular')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      sortMode === 'popular'
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    محبوب‌ترین
                  </button>

                  <button
                    onClick={() => setSortMode('earliest')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      sortMode === 'earliest'
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    نزدیک‌ترین نوبت آزاد
                  </button>

                  <button
                    onClick={() => setSortMode('success')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      sortMode === 'success'
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    بیش‌ترین نوبت موفق
                  </button>
                </div>
              </div>

              {/* Left Side: دکمه نمایش روی نقشه */}
              <button
                onClick={() => setIsMapOpen(!isMapOpen)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isMapOpen
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Map className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isMapOpen ? 'بستن نقشه' : 'نمایش روی نقشه'}</span>
              </button>
            </div>

            {/* Interactive Map View (Collapsible) */}
            {isMapOpen && (
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs animate-fadeIn overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>نقشه مراکز درمانی و مطب‌ها در {selectedCityObj?.name || 'تهران'}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {filteredClinics.length} موقعیت مکانی
                  </span>
                </div>

                {/* Map Representation Container */}
                <div className="w-full h-56 sm:h-64 bg-slate-900 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 text-white">
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-bold bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700">
                      پراکندگی کلینیک‌ها بر روی نقشه هوشمند شهری
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      GPS Active
                    </span>
                  </div>

                  {/* Simulated Map Markers */}
                  <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 my-auto">
                    {filteredClinics.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="bg-slate-800/90 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-right text-[11px]"
                      >
                        <div className="flex items-center gap-1 font-bold text-white mb-0.5 truncate">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">{c.address}</span>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 text-[11px] text-slate-400 text-center">
                    برای مسیریابی مستقیم، روی کارت هر کلینیک کلیک نمایید.
                  </div>
                </div>
              </div>
            )}

            {/* Results Count & Tabs */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                نمایش{' '}
                <strong className="text-slate-900 font-black font-mono">
                  {viewEntity === 'doctors' ? sortedDoctors.length : filteredClinics.length}
                </strong>{' '}
                {viewEntity === 'doctors' ? 'پزشک و جراح متخصص' : 'مرکز و کلینیک درمانی'}
              </span>

              {/* View Switcher: پزشکان / مراکز */}
              <div className="inline-flex p-0.5 bg-slate-200/70 rounded-xl text-[11px] font-bold">
                <button
                  onClick={() => setViewEntity('doctors')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    viewEntity === 'doctors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  جراحان و پزشکان ({sortedDoctors.length})
                </button>
                <button
                  onClick={() => setViewEntity('clinics')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    viewEntity === 'clinics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  مراکز درمانی ({filteredClinics.length})
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* DOCTORS CARDS (Styled Matching User Screenshot Exactly) */}
            {/* ============================================================== */}
            {viewEntity === 'doctors' && (
              <div className="space-y-3.5">
                {sortedDoctors.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                    <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm">
                      هیچ پزشکی با فیلترهای انتخابی شما یافت نشد
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      پیشنهاد می‌شود یک یا چند فیلتر نظیر نوع بیمه یا محله را حذف کنید.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      حذف همه‌ی فیلترها
                    </button>
                  </div>
                ) : (
                  sortedDoctors.map((doc) => {
                    const specialty = specialties.find((s) => s.id === doc.specialty_id);
                    const isSaved = savedDoctorIds.has(doc.id);
                    
                    // Doctor clinics
                    const docClinicIds = clinicDoctors
                      .filter((cd) => cd.doctor_id === doc.id && cd.is_active)
                      .map((cd) => cd.clinic_id);
                    const docClinics = clinics.filter((c) => docClinicIds.includes(c.id));
                    const primaryClinic = docClinics[0];
                    const district = primaryClinic
                      ? districts.find((d) => d.id === primaryClinic.district_id)
                      : null;

                    // Insurances
                    const insIds = clinicInsurances
                      .filter((ci) => docClinicIds.includes(ci.clinic_id))
                      .map((ci) => ci.insurance_id);
                    const acceptedInsurances = insurances.filter((i) => insIds.includes(i.id));

                    // Success booking calculation
                    const successfulVisits = doc.reviews_count * 2 + 35;
                    const recommendationRate = Math.min(99, Math.round(doc.rating * 20));

                    return (
                      <div
                        key={doc.id}
                        className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          
                          {/* Right Column: Avatar + Doctor Info */}
                          <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                            {/* Doctor Circular Avatar */}
                            <div className="relative shrink-0">
                              <img
                                src={doc.avatar}
                                alt={`${doc.first_name} ${doc.last_name}`}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-100 shadow-xs group-hover:scale-105 transition-transform"
                              />
                              {doc.verified && (
                                <span
                                  className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] border-2 border-white shadow-xs"
                                  title="تایید صلاحیت نظام پزشکی"
                                >
                                  ✓
                                </span>
                              )}
                            </div>

                            {/* Doctor Details */}
                            <div className="space-y-1.5 flex-1 min-w-0">
                              {/* Name */}
                              <div className="flex items-center gap-2">
                                <h3
                                  onClick={() => onSelectDoctor(doc)}
                                  className="text-base sm:text-lg font-black text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                                >
                                  {doc.first_name} {doc.last_name}
                                </h3>
                                {doc.passport_committed && (
                                  <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                                    پاسپورت ۳۲ دندان
                                  </span>
                                )}
                              </div>

                              {/* Specialty Subtitle */}
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                {specialty?.title || 'پزشک دندانپزشکی'}
                              </p>

                              {/* Ratings & Recommendations Badges (Matching Screenshot) */}
                              <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs">
                                {/* Rating & Reviews */}
                                <div className="flex items-center gap-1 font-bold text-slate-800">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span className="font-mono text-[13px]">{doc.rating}</span>
                                  <span className="text-slate-400 font-normal">
                                    ({doc.reviews_count} نظر)
                                  </span>
                                </div>

                                {/* User Recommendation Rate */}
                                <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>{recommendationRate}٪ پیشنهاد کاربران</span>
                                </div>

                                {/* Successful Appointments Badge */}
                                <div className="flex items-center gap-1 text-teal-700 font-medium text-xs bg-teal-50 px-2 py-0.5 rounded-md">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                                  <span>
                                    <strong className="font-mono font-bold text-teal-800">
                                      {successfulVisits}
                                    </strong>{' '}
                                    نوبت موفق در دنتال‌مپ
                                  </span>
                                </div>
                              </div>

                              {/* Clinic & Location Snippet */}
                              {primaryClinic && (
                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    <span>
                                      {district ? district.name : primaryClinic.address}
                                      {primaryClinic.name && ` - ${primaryClinic.name}`}
                                    </span>
                                  </span>

                                  {/* Insurance tags */}
                                  {acceptedInsurances.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-slate-300">|</span>
                                      <span className="text-[11px] text-slate-500">
                                        بیمه‌های طرف قرارداد:{' '}
                                        {acceptedInsurances.slice(0, 2).map((i) => i.name).join('، ')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Left Column: Bookmark Icon + Action Buttons (Matching Screenshot) */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {/* Save / Bookmark Button */}
                            <button
                              onClick={(e) => toggleSaveDoctor(doc.id, e)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isSaved
                                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                              }`}
                              title={isSaved ? 'حذف از نشان‌شده‌ها' : 'نشان کردن پزشک'}
                            >
                              <Bookmark
                                className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`}
                              />
                            </button>

                            {/* Next Available Slot Snippet */}
                            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              نزدیک‌ترین نوبت آزاد: فردا ساعت ۱۶:۳۰
                            </span>

                            {/* View Profile Button (مشاهده پروفایل ‹) */}
                            <button
                              onClick={() => onSelectDoctor(doc)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                            >
                              <span>مشاهده پروفایل</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* CLINICS CARDS VIEW */}
            {/* ============================================================== */}
            {viewEntity === 'clinics' && (
              <div className="space-y-4">
                {filteredClinics.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                    <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm">
                      هیچ کلینیکی با این شروط یافت نشد
                    </h4>
                  </div>
                ) : (
                  filteredClinics.map((clinic) => {
                    const city = cities.find((c) => c.id === clinic.city_id);
                    const district = districts.find((d) => d.id === clinic.district_id);
                    const clinicInsIds = clinicInsurances
                      .filter((ci) => ci.clinic_id === clinic.id)
                      .map((ci) => ci.insurance_id);
                    const matchedInsurances = insurances.filter((ins) => clinicInsIds.includes(ins.id));

                    return (
                      <div
                        key={clinic.id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                                {clinic.center_type === 'private_office' && 'مطب تخصصی'}
                                {clinic.center_type === 'clinic' && 'کلینیک و درمانگاه شبانه‌روزی'}
                                {clinic.center_type === 'hospital' && 'بیمارستان'}
                              </span>
                              {clinic.is_24_7 && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  ۲۴/۷ شبانه‌روزی
                                </span>
                              )}
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                                <span>{city?.name}، {district?.name}</span>
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                              {clinic.name}
                            </h3>
                            <p className="text-xs text-slate-600">{clinic.address}</p>

                            {matchedInsurances.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 pt-1">
                                <span className="text-[11px] text-slate-500">پوشش بیمه:</span>
                                {matchedInsurances.map((ins) => (
                                  <span
                                    key={ins.id}
                                    className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200"
                                  >
                                    {ins.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <a
                              href={`tel:${clinic.phone}`}
                              onClick={() => handleContactClick(clinic)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>تماس و نوبت‌دهی</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};
